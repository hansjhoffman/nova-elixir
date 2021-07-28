import * as A from "fp-ts/Array";
import * as E from "fp-ts/Either";
import * as O from "fp-ts/Option";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { match } from "ts-pattern";

/*
 * Types
 */

interface InvokeReferencesError {
  readonly _tag: "invokeReferencesError";
  readonly reason: string;
}

/*
 * Helpers
 */

const rangeToLspRange = (
  document: TextDocument,
  range: Range,
): {
  line: string;
  character: string;
} => {
  let chars = 0;

  pipe(
    document.getTextInRange(new Range(0, document.length)),
    (content) => content.split(document.eol),
    A.mapWithIndex((idx, line) => {
      const lineLength = line.length + document.eol.length;

      chars = chars + lineLength;
    }),
  );

  return {
    line: "0",
    character: "0",
  };
};

/*
 * Main
 */

const safeFindReferences = (
  client: LanguageClient,
  editor: TextEditor,
): TE.TaskEither<InvokeReferencesError, void> => {
  return TE.tryCatch<InvokeReferencesError, void>(
    () => {
      const selectedRange = editor.selectedRange;
      const selectedText = editor.selectedText;

      return client
        .sendRequest("textDocument/references", {
          textDocument: { uri: editor.document.uri },
          position: rangeToLspRange(editor.document, selectedRange),
          context: { includeDeclaration: false },
        })
        .then(() => {});
    },
    () => ({
      _tag: "invokeReferencesError",
      reason: `${nova.localize("Failed to find references")}.`,
    }),
  );
};

export const findReferences =
  (client: O.Option<LanguageClient>) =>
  (editor: TextEditor): void => {
    pipe(
      client,
      O.fold(
        () => console.log(`${nova.localize("Skipping. No Langunage Client running.")}.`),
        (client_) => {
          safeFindReferences(client_, editor)().then(
            E.fold(
              (err) => {
                return match(err)
                  .with({ _tag: "invokeReferencesError" }, ({ reason }) => console.error(reason))
                  .exhaustive();
              },
              () => console.log(`${nova.localize("View sidebar for results")}.`),
            ),
          );
        },
      ),
    );
  };
