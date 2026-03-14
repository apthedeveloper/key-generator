import { VariableNameCase } from "../core/types/variable_name.type";
function splitWords(input: string): string[] {
  return input
    // normalize separators
    .replace(/[_\-\.]+/g, " ")

    // split camelCase
    .replace(/([a-z\d])([A-Z])/g, "$1 $2")

    // split acronyms like HTTPServer
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")

    // remove special characters
    .replace(/[^a-zA-Z0-9 ]/g, " ")

    .trim()
    .split(/\s+/);
}

function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export function getVariableNameFromValue(
  value: string,
  variableCase: VariableNameCase,
): string {
  const words = splitWords(value);

  switch (variableCase) {
    case VariableNameCase.CamelCase:
      return words
        .map((w, i) => (i === 0 ? w.toLowerCase() : capitalize(w)))
        .join("");

    case VariableNameCase.PascalCase:
      return words.map(capitalize).join("");

    case VariableNameCase.SnakeCase:
      return words.map((w) => w.toLowerCase()).join("_");

    case VariableNameCase.UpperSnakeCase:
      return words.map((w) => w.toUpperCase()).join("_");

    case VariableNameCase.KebabCase:
      return words.map((w) => w.toLowerCase()).join("-");

    case VariableNameCase.TrainCase:
      return words.map(capitalize).join("-");

    case VariableNameCase.TitleCase:
      return words.map(capitalize).join(" ");

    default:
      return value;
  }
}