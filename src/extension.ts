import * as vscode from "vscode";
import {
  getSelectedText,
  replaceSelectedText,
} from "./helpers/selection.helper";
import { selectedTextParse } from "./engin/keys_extract.engine";
import { writeEngine } from "./engin/writer.engine";
import { ParserMatchType } from "./core/types/parser_use_type";
import { getValueFromConfig } from "./helpers/config_file.helper";
import { Constants } from "./core/constants";
import { configType } from "./core/types/config.type";
import { VariableNameCase } from "./core/types/variable_name.type";
import { readFile } from "./helpers/file.helper";
import { findKeyByValue } from "./helpers/template.helper";

export function activate(context: vscode.ExtensionContext) {
  const generatekey = vscode.commands.registerCommand(
    "key-generator.generateKey",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No editor is open");
        return;
      }

      const selectedTexts = await getSelectedText(editor);
      if (!selectedTexts) {
        return;
      }

      const keys = (
        await Promise.all(selectedTexts.map((t) => selectedTextParse(t.trim())))
      )
        .flat()
        .map((k) => k.key);

      if (keys.length == 0) {
        vscode.window.showErrorMessage("No keys found OR Invalid keys");
        return;
      }

      const configContent = await readFile(Constants.configFileName);
      if (!configContent) {
        vscode.window.showErrorMessage("File not found");
        return;
      }

      const fileName = await getValueFromConfig(
        configType.apiKeysFileNameWithPath,
        configContent,
      );
      const apiKeyTemplate = await getValueFromConfig(
        configType.apiKeyTemplate,
        configContent,
      );
      const prefix = await getValueFromConfig(
        configType.prefixedVariableName,
        configContent,
      );
      const variableCase = await getValueFromConfig(
        configType.variableCase,
        configContent,
      );
      const apiClassName = await getValueFromConfig(
        configType.apiClassName,
        configContent,
      );

      if (
        !fileName ||
        !apiKeyTemplate ||
        !prefix ||
        !variableCase ||
        !apiClassName
      ) {
        return;
      }

      await writeEngine(
        fileName,
        keys,
        VariableNameCase.from(variableCase) ?? VariableNameCase.CamelCase,
        apiKeyTemplate,
        apiClassName,
      );
    },
  );

  const copyKey = vscode.commands.registerCommand(
    "key-generator.copyKey",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No editor is open");
        return;
      }

      const selectedTexts = await getSelectedText(editor);
      if (!selectedTexts) {
        return;
      }

      const keys = await selectedTextParse(selectedTexts[0].trim(), [
        ParserMatchType.singleText,
      ]);

      if (keys.length == 0) {
        vscode.window.showErrorMessage("No keys found OR Invalid keys");
        return;
      }

      const fileName = await getValueFromConfig(
        configType.apiKeysFileNameWithPath,
      );
      const apiKeysTemplate = await getValueFromConfig(
        configType.apiKeyTemplate,
      );

      if (!fileName || !apiKeysTemplate) {
        return;
      }

      const content = await readFile(fileName);
      if (!content) {
        vscode.window.showErrorMessage(fileName + " File not found");
        return;
      }

      const variable = findKeyByValue(content, keys[0].key, apiKeysTemplate);

      if (variable) {
        await vscode.env.clipboard.writeText(variable);
      }
    },
  );

  const generateAndReplace = vscode.commands.registerCommand(
    "key-generator.generateAndReplace",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No editor is open");
        return;
      }

      const configContent = await readFile(Constants.configFileName);
      if (!configContent) {
        vscode.window.showErrorMessage("File not found");
        return;
      }

      const fileName = await getValueFromConfig(
        configType.apiKeysFileNameWithPath,
        configContent,
      );
      const apiKeyTemplate = await getValueFromConfig(
        configType.apiKeyTemplate,
        configContent,
      );
      const prefix = await getValueFromConfig(
        configType.prefixedVariableName,
        configContent,
      );
      const variableCase = await getValueFromConfig(
        configType.variableCase,
        configContent,
      );
      const apiClassName = await getValueFromConfig(
        configType.apiClassName,
        configContent,
      );

      if (
        !fileName ||
        !apiKeyTemplate ||
        !prefix ||
        !variableCase ||
        !apiClassName
      ) {
        return;
      }

      const selectedTexts = await getSelectedText(editor);
      if (!selectedTexts) return;

      const keys = (
        await Promise.all(
          selectedTexts.map((t) =>
            selectedTextParse(t.trim(), [ParserMatchType.singleText]),
          ),
        )
      ).flat();

      if (keys.length === 0) {
        vscode.window.showErrorMessage("No keys found OR Invalid keys");
        return;
      }

      console.log("Keys: " + keys.map((key) => key.key));

      const replacements: string[] = [];

      let content = await readFile(fileName);
      for (const key of keys) {
        if (!content) {
          vscode.window.showErrorMessage(`${fileName} File not found`);
          return;
        }

        let variable = findKeyByValue(content, key.key, apiKeyTemplate);

        if (!variable) {
          const updatedContent = await writeEngine(
            fileName,
            [key.key],
            VariableNameCase.from(variableCase) ?? VariableNameCase.CamelCase,
            apiKeyTemplate,
            apiClassName,
          );

          content = updatedContent ?? (await readFile(fileName)) ?? "";
          variable = findKeyByValue(content, key.key, apiKeyTemplate);
          console.log("Content" + content);
          console.log("Variable: " + variable);
        }

        if (!variable) {
          vscode.window.showErrorMessage("Failed to generate key");
          return;
        }

        replacements.push(prefix + variable);
      }

      console.log("Replacements: " + replacements);

      await replaceSelectedText(editor, replacements);
    },
  );

  context.subscriptions.push(copyKey);
  context.subscriptions.push(generatekey);
  context.subscriptions.push(generateAndReplace);
}

export function deactivate() {}
