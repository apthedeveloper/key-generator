import * as vscode from "vscode";
import { VariableNameCase } from "../core/types/variable_name.type";
import { getVariableNameFromValue } from "../helpers/variable_name.helper";
import { readFile, writeToFile } from "../helpers/file.helper";
import {
  isValueExist,
  replaceTemplateWithActualValue,
} from "../helpers/template.helper";
import { isClassExist } from "../helpers/class.helper";

export async function writeEngine(
  fileName: string,
  keys: string[],
  variableCase: VariableNameCase,
  template: string,
  className: string,
) {
  const contentInsideFile = await readFile(fileName);
  if (contentInsideFile == null) {
    throw new Error(fileName + " File not found");
  }

  const content = keys
    .map((key) => {
      if (!isValueExist(contentInsideFile, key, template)) {
        const name = getVariableNameFromValue(
          key,
          variableCase ?? VariableNameCase.CamelCase,
        );

        return replaceTemplateWithActualValue(template, [name, key]);
      }
    })
    .filter(Boolean)
    .join("\n");

  if (!content) {
    return;
  }

  let updatedContent = contentInsideFile;

  if (!isClassExist(contentInsideFile, className)) {
    updatedContent += `class ${className} {\n${content}\n}`;
  } else {
    const lastBraceIndex = updatedContent.lastIndexOf("}");

    if (lastBraceIndex === -1) {
      throw new Error(
        `Class ${className} is  (missing closing bracmalformede)`,
      );
    }

    updatedContent =
      updatedContent.slice(0, lastBraceIndex) +
      content +
      "\n" +
      updatedContent.slice(lastBraceIndex);
  }

  await writeToFile(fileName, updatedContent);
  return updatedContent;
}
