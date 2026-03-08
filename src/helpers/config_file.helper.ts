import { Constants } from "../core/constants";
import { readFile } from "./file.helper";
import * as vscode from "vscode";
export async function getValueFromConfig(name: string, content?: string) {
  if (!content) {
    content = (await readFile(Constants.configFileName)) ?? "";
  }
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(
    escaped + '\\s*=\\s*(["\'`])([\\s\\S]*?)\\1'
  );
  const match = content.match(regex);
  if(!match?.[2]?.trim()){
    vscode.window.showErrorMessage("Misconfigured config file! "+ name + " not found");
  }
  return match?.[2]?.trim();
}