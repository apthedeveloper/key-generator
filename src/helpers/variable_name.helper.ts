import { VariableNameCase } from "../core/types/variable_name.type";
export function getVariableNameFromValue(
  value: string,
  variableNameCase: VariableNameCase,
) {
  const words = value
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/);

  switch (variableNameCase) {
    case VariableNameCase.CamelCase:
      return words
        .map((w, i) =>
          i === 0
            ? w.toLowerCase()
            : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(),
        )
        .join("");

    case VariableNameCase.PascalCase:
      return words
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join("");

    case VariableNameCase.SnakeCase:
      return words.map((w) => w.toLowerCase()).join("_");

    case VariableNameCase.UpperSnakeCase:
      return words.map((w) => w.toUpperCase()).join("_");
  }
}
