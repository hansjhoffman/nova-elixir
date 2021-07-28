import * as E from "fp-ts/Either";
import * as O from "fp-ts/Option";
import * as TE from "fp-ts/TaskEither";
import { constVoid, pipe } from "fp-ts/function";
import * as D from "io-ts/Decoder";
import { match } from "ts-pattern";

/*
 * Types
 */

enum ExtensionConfigKeys {
  FindReferences = "hansjhoffman.elixir.commands.findReferences",
  FormatOnSave = "hansjhoffman.elixir.config.formatOnSave",
  FormatDocument = "hansjhoffman.elixir.commands.formatDocument",
}

interface ExtensionSettings {
  readonly workspace: Readonly<{
    formatOnSave: boolean;
  }>;
  readonly global: Readonly<{
    formatOnSave: boolean;
  }>;
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

interface InvokeFormatterError {
  readonly _tag: "invokeFormatterError";
  readonly reason: string;
}

interface InvokeReferencesError {
  readonly _tag: "invokeReferencesError";
  readonly reason: string;
}

interface ServerOptions {
  type: "stdio" | "socket" | "pipe";
  path: string;
  args?: Array<string>;
  env?: Record<string, string>;
}

interface ClientOptions {
  initializationOptions?: any;
  syntaxes: Array<string>;
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

const safeFindReferences = (): TE.TaskEither<InvokeReferencesError, void> => {
  return TE.tryCatch<InvokeReferencesError, void>(
    () => {
      return new Promise<void>((resolve, _reject) => {
        resolve();
      });
    },
    () => ({
      _tag: "invokeReferencesError",
      reason: `${nova.localize("Failed to find references")}.`,
    }),
  );
};

const findReferences = (): void => {};

const safeFormat = (
  editor: TextEditor,
  formatterPath: string,
): TE.TaskEither<InvokeFormatterError, void> => {
  return TE.tryCatch<InvokeFormatterError, void>(
    () => {
      return new Promise<void>((resolve, _reject) => {
        resolve();
      });
    },
    () => ({
      _tag: "invokeFormatterError",
      reason: `${nova.localize("Failed to format the document")}.`,
    }),
  );
};

const formatDocument = (editor: TextEditor): void => {
  pipe(
    O.some("path-to-formatter"),
    O.fold(
      () => console.log(`${nova.localize("Skipping")}... ${nova.localize("No formatter set")}.`),
      (path) => {
        safeFormat(editor, path)().then(
          E.fold(
            (err) => {
              return match(err)
                .with({ _tag: "invokeFormatterError" }, ({ reason }) => console.error(reason))
                .exhaustive();
            },
            () => console.log(`${nova.localize("Formatted")} ${editor.document.path}`),
          ),
        );
      },
    ),
  );
};

const safeStart = () => {
  return TE.sequenceSeqArray<void, MakeExecutableError | StartError>([
    TE.tryCatch<MakeExecutableError, void>(
      () => {
        return new Promise<void>((resolve, reject) => {
          const process = new Process("/usr/bin/env", {
            args: ["chmod", "755", nova.path.join(nova.extension.path, "elixir-ls", "*.sh")],
          });

          process.onDidExit((status) => (status === 0 ? resolve() : reject()));

          process.start();
        });
      },
      () => ({
        _tag: "makeExecutableError",
        reason: `${nova.localize("Failed to make file executable")}.`,
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
            syntaxes: ["elixir"],
          };

          const client: LanguageClient = new LanguageClient(
            "elixirLS",
            nova.extension.name,
            serverOptions,
            clientOptions,
          );

          compositeDisposable.add(
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
                    // nova.commands.invoke("x.x.reload");
                  }
                },
              );
            }),
          );

          // client.start();
          // languageClient = O.some(client);

          resolve();
        });
      },
      () => ({
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
          }),
        );

        resolve();
      });
    },
    () => ({ _tag: "shutdownError", reason: "Uh oh... Failed to deactivate plugin." }),
  );
};

/*
 * Main
 */

let configs: ExtensionSettings = {
  workspace: {
    formatOnSave: pipe(
      O.fromNullable(nova.workspace.config.get(ExtensionConfigKeys.FormatOnSave)),
      O.chain((value) => O.fromEither(D.boolean.decode(value))),
      O.getOrElseW(() => false),
    ),
  },
  global: {
    formatOnSave: pipe(
      O.fromNullable(nova.config.get(ExtensionConfigKeys.FormatOnSave)),
      O.chain((value) => O.fromEither(D.boolean.decode(value))),
      O.getOrElseW(() => false),
    ),
  },
};

const compositeDisposable: CompositeDisposable = new CompositeDisposable();
let languageClient: O.Option<LanguageClient> = O.none;

export const activate = (): void => {
  console.log(`${nova.localize("Activating")}...`);
  showNotification(`${nova.localize("Starting extension")}...`);

  compositeDisposable.add(
    nova.workspace.onDidAddTextEditor((editor: TextEditor): void => {
      // add saveListener
    }),
  );

  compositeDisposable.add(
    nova.commands.register(ExtensionConfigKeys.FindReferences, findReferences),
  );

  compositeDisposable.add(
    nova.commands.register(ExtensionConfigKeys.FormatDocument, formatDocument),
  );

  safeStart()().then(
    E.fold(
      (err) => {
        match(err)
          .with({ _tag: "makeExecutableError" }, ({ reason }) => console.error(reason))
          .with({ _tag: "startError" }, ({ reason }) => console.error(reason))
          .exhaustive();
      },
      () => console.log(`${nova.localize("Activated")} 🎉`),
    ),
  );
};

export const deactivate = (): void => {
  console.log(`${nova.localize("Deactivating")}...`);

  compositeDisposable.dispose();

  safeShutdown()().then(
    E.fold(
      (err) => {
        match(err)
          .with({ _tag: "shutdownError" }, ({ reason }) => console.error(reason))
          .exhaustive();
      },
      () => console.log(`${nova.localize("Deactivated. Come back soon")} :)`),
    ),
  );
};
