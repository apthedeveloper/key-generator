import * as vscode from "vscode";

export async function findFile(fileName: string) {
  const files = await vscode.workspace.findFiles(fileName);

  if (files.length > 0) {
    return files[0];
  }

  return null;
}

export async function readFile(fileName: string) {
  const file = await findFile(fileName);
  if (file) {
    const doc = await vscode.workspace.openTextDocument(file);
    const content = doc.getText();
    return content??'';
  }
  return null;
}

export async function writeToFile(fileName: string, content: string) {
  const file = await findFile(fileName);
  if (file) {
    await vscode.workspace.fs.writeFile(file, Buffer.from(content));
  }
}

export async function writeAndCreateFile(fileName: string, content: string) {
  await vscode.workspace.fs.writeFile(
    vscode.Uri.file(fileName),
    Buffer.from(content),
  );
}

