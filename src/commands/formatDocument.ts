import * as E from "fp-ts/Either";
import * as O from "fp-ts/Option";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { match } from "ts-pattern";

/*
 * Types
 */

interface InvokeFormatterError {
  readonly _tag: "invokeFormatterError";
  readonly reason: string;
}

/*
 * Main
 */

const safeFormat = (editor: TextEditor): TE.TaskEither<InvokeFormatterError, void> => {
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

export const formatDocument = (editor: TextEditor): void => {
  safeFormat(editor)().then(
    E.fold(
      (err) => {
        return match(err)
          .with({ _tag: "invokeFormatterError" }, ({ reason }) => console.error(reason))
          .exhaustive();
      },
      () => console.log(`${nova.localize("Formatted")} ${editor.document.path}`),
    ),
  );
};
