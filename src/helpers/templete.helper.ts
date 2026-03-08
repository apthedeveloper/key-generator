import { Constants } from "../core/constants";

export function extractTemplateVariables(template: string): string[] {
  return [...template.matchAll(Constants.TEMPLATE_VAR_REGEX)].map((m) => m[1]);
}

export function replaceTemplateWithActualValue(
  template: string,
  values: string[],
): string | null {
  ensureValuePlaceholder(template);

  const vars = extractTemplateVariables(template);

  if (vars.length !== values.length) return null;

  let result = template;

  vars.forEach((v, i) => {
    result = result.replaceAll(`<${v}>`, values[i]);
  });

  return result;
}

export function isValueExist(content: string, value: string, template: string) {
  ensureValuePlaceholder(template);

  const vars = extractTemplateVariables(template);

  const replacements: Record<string, string> = {};

  vars.forEach((v) => {
    replacements[v] = "[A-Za-z0-9_]+";
  });

  replacements["VALUE"] = escapeRegex(value);

  const regex = buildTemplateRegex(template, replacements);

  return regex.test(content);
}
export function findKeyByValue(
  content: string,
  value: string,
  template: string,
) {
  ensureValuePlaceholder(template);

  const vars = extractTemplateVariables(template);

  const replacements: Record<string, string> = {};

  let captured = false;

  vars.forEach((v) => {
    if (v === "VALUE") {
      replacements[v] = escapeRegex(value);
    } else if (!captured) {
      replacements[v] = "([A-Za-z0-9_]+)"; // capture the key
      captured = true;
    } else {
      replacements[v] = "[A-Za-z0-9_]+";
    }
  });

  const regex = buildTemplateRegex(template, replacements);

  const match = content.match(regex);

  return match?.[1];
}

//helper
function buildTemplateRegex(
  template: string,
  replacements: Record<string, string>,
): RegExp {
  let pattern = escapeRegex(template);

  for (const key in replacements) {
    pattern = pattern.replaceAll(`<${key}>`, replacements[key]);
  }

  pattern = pattern.replace(/\s+/g, "\\s+");

  return new RegExp(pattern);
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function ensureValuePlaceholder(template: string) {
  if (!template.includes("<VALUE>")) {
    throw new Error(template + "Template must contain <VALUE> placeholder");
  }
}
