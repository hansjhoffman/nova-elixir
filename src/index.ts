import * as E from "fp-ts/Either";
import * as O from "fp-ts/Option";
import * as TE from "fp-ts/TaskEither";
import { constVoid, pipe } from "fp-ts/function";
import * as Str from "fp-ts/string";
import * as D from "io-ts/Decoder";
import { Lens } from "monocle-ts";
import { match } from "ts-pattern";

import { findReferences } from "./commands/findReferences";
import { formatDocument } from "./commands/formatDocument";
import { isFalse } from "./typeGuards";

/*
 * Types
 */

enum ExtensionConfigKeys {
  FindReferences = "hansjhoffman.elixir.commands.findReferences",
  FormatOnSave = "hansjhoffman.elixir.config.formatOnSave",
  FormatDocument = "hansjhoffman.elixir.commands.formatDocument",
  MixPath = "hansjhoffman.elixir.config.mixPath",
  Restart = "hansjhoffman.elixir.commands.restart",
  Sidebar = "hansjhoffman.elixir.sidebar",
  SidebarResults = "hansjhoffman.elixir.sidebar.results",
}

interface Preferences {
  readonly mixPath: O.Option<string>;
  readonly formatOnSave: O.Option<boolean>;
}

interface UserPreferences {
  readonly workspace: Readonly<Preferences>;
  readonly global: Readonly<Preferences>;
}

interface MakeExecutableError {
  readonly _tag: "makeExecutableError";
  readonly reason: string;
}

interface StartError {
  readonly _tag: "startError";
  readonly reason: string;
}

interface ShutdownError {
  readonly _tag: "shutdownError";
  readonly reason: string;
}

interface ServerOptions {
  readonly type: "stdio" | "socket" | "pipe";
  readonly path: string;
  readonly args?: Array<string>;
  readonly env?: Record<string, string>;
}

interface ClientSettings {
  readonly elixirLS: Readonly<{
    dialyzerEnabled?: boolean; // defaults to true
    dialyzerFormat?: "dialyzer" | "dialyxir_short" | "dialyxir_long"; // default "dialyxir_long"
    dialyzerWarnOpts?: Array<
      | "error_handling"
      | "no_behaviours"
      | "no_contracts"
      | "no_fail_call"
      | "no_fun_app"
      | "no_improper_lists"
      | "no_match"
      | "no_missing_calls"
      | "no_opaque"
      | "no_return"
      | "no_undefined_callbacks"
      | "no_unused"
      | "underspecs"
      | "unknown"
      | "unmatched_returns"
      | "overspecs"
      | "specdiffs"
    >; // defaults to []
    enableTestLenses?: boolean; // defaults to false
    fetchDeps?: boolean;
    mixEnv?: "dev" | "test"; // defaults to "test"
    mixTarget?: string;
    projectDir?: string;
    signatureAfterComplete?: boolean; // defaults to true
    suggestSpecs?: boolean; // defaults to true
    trace?: Readonly<{
      server: "off" | "messages" | "verbose"; // defaults to "off"
    }>;
  }>;
}

interface ClientOptions {
  readonly initializationOptions?: ClientSettings;
  readonly syntaxes: Array<string>;
}

/*
 * Helpers
 */

const showNotification = (body: string): void => {
  if (nova.inDevMode()) {
    const notification = new NotificationRequest("elixir-nova-notification");
    notification.title = nova.extension.name;
    notification.body = body;
    nova.notifications.add(notification);
  }
};

/*
 * Main
 */

const extensionDisposable: CompositeDisposable = new CompositeDisposable();
let languageClient: O.Option<LanguageClient> = O.none;

let preferences: UserPreferences = {
  workspace: {
    mixPath: pipe(
      O.fromNullable(nova.workspace.config.get(ExtensionConfigKeys.MixPath)),
      O.chain((path) => O.fromEither(D.string.decode(path))),
      O.chain(O.fromPredicate((path) => isFalse(Str.isEmpty(path)))),
    ),
    formatOnSave: pipe(
      O.fromNullable(nova.workspace.config.get(ExtensionConfigKeys.FormatOnSave)),
      O.chain((value) => O.fromEither(D.boolean.decode(value))),
    ),
  },
  global: {
    mixPath: pipe(
      O.fromNullable(nova.config.get(ExtensionConfigKeys.MixPath)),
      O.chain((path) => O.fromEither(D.string.decode(path))),
      O.chain(O.fromPredicate((path) => isFalse(Str.isEmpty(path)))),
    ),
    formatOnSave: pipe(
      O.fromNullable(nova.config.get(ExtensionConfigKeys.FormatOnSave)),
      O.chain((value) => O.fromEither(D.boolean.decode(value))),
    ),
  },
};

const workspaceConfigsLens = Lens.fromPath<UserPreferences>()(["workspace"]);
const globalConfigsLens = Lens.fromPath<UserPreferences>()(["global"]);

/**
 * Gets a value giving precedence to workspace over global extension values.
 * @param {UserPreferences} preferences - extension settings
 */
const selectFormatOnSave = (preferences: UserPreferences): boolean => {
  const workspace = workspaceConfigsLens.get(preferences);
  const global = globalConfigsLens.get(preferences);

  return O.isSome(workspace.formatOnSave) || O.isSome(global.formatOnSave);
};

/**
 * Gets a value giving precedence to workspace over global extension values.
 * @param {UserPreferences} preferences - extension settings
 */
const selectMixPath = (preferences: UserPreferences): O.Option<string> => {
  const workspace = workspaceConfigsLens.get(preferences);
  const global = globalConfigsLens.get(preferences);

  return pipe(
    workspace.mixPath,
    O.alt(() => global.mixPath),
  );
};

const safeStart = () => {
  return TE.sequenceSeqArray<void, MakeExecutableError | StartError>([
    TE.tryCatch<MakeExecutableError, void>(
      () => {
        return new Promise<void>((resolve, reject) => {
          const process = new Process("/usr/bin/env", {
            args: ["chmod", "a+x", "debugger.sh", "language_server.sh", "launch.sh"],
            cwd: nova.path.join(nova.extension.path, "elixir-ls"),
          });

          process.onDidExit((status) => (status === 0 ? resolve() : reject()));

          process.start();
        });
      },
      (_) => ({
        _tag: "makeExecutableError",
        reason: `${nova.localize("Failed to make files executable")}.`,
      }),
    ),
    TE.tryCatch<StartError, void>(
      () => {
        return new Promise<void>((resolve, _reject) => {
          const serverOptions: ServerOptions = {
            path: nova.path.join(nova.extension.path, "elixir-ls", "language_server.sh"),
            type: "stdio",
          };

          const clientOptions: ClientOptions = {
            initializationOptions: {
              elixirLS: {
                dialyzerEnabled: true,
                fetchDeps: true,
                mixEnv: "test",
              },
            },
            syntaxes: ["elixir"],
          };

          const client: LanguageClient = new LanguageClient(
            "elixirLS",
            nova.extension.name,
            serverOptions,
            clientOptions,
          );

          extensionDisposable.add(
            client.onDidStop((err) => {
              let message = nova.localize("Elixir Language Server stopped unexpectedly");
              if (err) {
                message += `:\n\n${err.toString()}`;
              } else {
                message += ".";
              }
              message += `\n\n${nova.localize(
                "Please report this, along with any output in the Extension Console.",
              )}`;

              nova.workspace.showActionPanel(
                message,
                { buttons: [nova.localize("Restart"), nova.localize("Ignore")] },
                (idx) => {
                  if (idx == 0) {
                    nova.commands.invoke(ExtensionConfigKeys.Restart);
                  }
                },
              );
            }),
          );

          client.start();

          languageClient = O.some(client);

          resolve();
        });
      },
      (_) => ({
        _tag: "startError",
        reason: `${nova.localize("Failed to start language server")}.`,
      }),
    ),
  ]);
};

const safeShutdown = (): TE.TaskEither<ShutdownError, void> => {
  return TE.tryCatch<ShutdownError, void>(
    () => {
      return new Promise<void>((resolve, _reject) => {
        pipe(
          languageClient,
          O.fold(constVoid, (client) => {
            client.stop();
            languageClient = O.none;
          }),
        );

        resolve();
      });
    },
    (_) => ({ _tag: "shutdownError", reason: "Uh oh... Failed to deactivate plugin." }),
  );
};

const handleAddTextEditor = (editor: TextEditor): void => {
  pipe(
    O.fromNullable(editor.document.syntax),
    O.chain(O.fromPredicate((syntax) => Str.Eq.equals(syntax, "elixir"))),
    O.fold(constVoid, (_) => {
      const editorDisposable = new CompositeDisposable();
      extensionDisposable.add(editor.onDidDestroy(() => editorDisposable.dispose()));

      const shouldFormatOnSave = selectFormatOnSave(preferences);

      if (shouldFormatOnSave) {
        editorDisposable.add(
          editor.onWillSave((editor: TextEditor) => {
            const mixPath = selectMixPath(preferences);

            return formatDocument(editor, mixPath);
          }),
        );
      }
    }),
  );
};

export const activate = (): void => {
  console.log(`${nova.localize("Activating")}...`);
  showNotification(`${nova.localize("Starting extension")}...`);

  extensionDisposable.add(nova.workspace.onDidAddTextEditor(handleAddTextEditor));

  extensionDisposable.add(
    nova.commands.register(ExtensionConfigKeys.FormatDocument, (editor: TextEditor) => {
      const mixPath = selectMixPath(preferences);

      return formatDocument(editor, mixPath);
    }),
  );

  //   safeStart()().then(
  //     E.fold(
  //       (err) => {
  //         return match(err)
  //           .with({ _tag: "makeExecutableError" }, ({ reason }) => console.error(reason))
  //           .with({ _tag: "startError" }, ({ reason }) => console.error(reason))
  //           .exhaustive();
  //       },
  //       (_) => {
  //         extensionDisposable.add(
  //           nova.commands.register(
  //             ExtensionConfigKeys.FindReferences,
  //             findReferences(languageClient),
  //           ),
  //         );
  //
  //         console.log(`${nova.localize("Activated")} 🎉`);
  //       },
  //     ),
  //   );

  console.log(`${nova.localize("Activated")} 🎉`);
};

export const deactivate = (): void => {
  console.log(`${nova.localize("Deactivating")}...`);

  safeShutdown()().then(
    E.fold(
      (err) => {
        return match(err)
          .with({ _tag: "shutdownError" }, ({ reason }) => console.error(reason))
          .exhaustive();
      },
      (_) => console.log(`${nova.localize("Deactivated. Come back soon")} :)`),
    ),
  );

  extensionDisposable.dispose();
};
