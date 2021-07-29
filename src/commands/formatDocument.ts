import * as E from "fp-ts/Either";
import * as O from "fp-ts/Option";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { match } from "ts-pattern";
import type * as lspTypes from "vscode-languageserver-protocol";

/*
 * Types
 */

interface InvokeFormatterError {
  readonly _tag: "invokeFormatterError";
  readonly reason: string;
}

interface LSPFormattingResult {
  newText: string;
  range: lspTypes.Range;
}

/*
 * Helpers
 */

const lspRangeToNovaRange = (document: TextDocument, range: lspTypes.Range): Range => {
  const fullContents = document.getTextInRange(new Range(0, document.length));
  let rangeStart = 0;
  let rangeEnd = 0;
  let chars = 0;
  const lines = fullContents.split(document.eol);
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const lineLength = lines[lineIndex].length + document.eol.length;
    if (range.start.line === lineIndex) {
      rangeStart = chars + range.start.character;
    }
    if (range.end.line === lineIndex) {
      rangeEnd = chars + range.end.character;
      break;
    }
    chars += lineLength;
  }

  return new Range(rangeStart, rangeEnd);
};

/*
 * Main
 */

const safeFormat = (
  client: LanguageClient,
  editor: TextEditor,
): TE.TaskEither<InvokeFormatterError, void> => {
  return TE.tryCatch<InvokeFormatterError, void>(
    () => {
      // return new Promise<void>((resolve, reject) => {
      return client
        .sendRequest("textDocument/formatting", {
          textDocument: { uri: editor.document.uri },
          options: {},
        })
        .then((result: any) => {
          editor.edit((edit) => {
            result.map((r: any) => {
              const novaRange = lspRangeToNovaRange(editor.document, r.range);
              edit.replace(novaRange, r.newText);
            });
          });

          // resolve();
        });
      //     .catch(() => reject());
      // });
    },
    () => ({
      _tag: "invokeFormatterError",
      reason: `${nova.localize("Failed to format the document")}.`,
    }),
  );
};

export const formatDocument =
  (languageClient: O.Option<LanguageClient>) =>
  (editor: TextEditor): void => {
    pipe(
      languageClient,
      O.fold(
        () => console.log(`${nova.localize("Skipping. No Langunage Client running.")}.`),
        (client) => {
          safeFormat(client, editor)().then(
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
