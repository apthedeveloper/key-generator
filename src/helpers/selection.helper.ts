import * as vscode from "vscode";
export async function getSelectedText(editor: vscode.TextEditor) {
  const selections = editor.selections;

  const selectedTexts = selections.map((s) => editor.document.getText(s));
  if (selectedTexts.length === 0) {
    vscode.window.showErrorMessage("No text selected");
    return;
  }
  return selectedTexts;
}
export async function replaceSelectedText(
  editor: vscode.TextEditor,
  replacements: string[],
) {
  const selections = editor.selections;

  await editor.edit((editBuilder) => {
    selections.forEach((selection, i) => {
      const replacement = replacements[i] ?? "";
      editBuilder.replace(selection, replacement);
    });
  });
}
