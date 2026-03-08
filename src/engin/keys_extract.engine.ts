import { ParserMatchType } from "../core/types/parser_use_type";
type ParsedKey = {
  key: string;
  type: ParserMatchType;
};
export async function selectedTextParse(
  text: string,
  matchType?: ParserMatchType[],
) {
  const results: ParsedKey[] = [];
  const lines = text.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    // JSON style
    if (matchType?.includes(ParserMatchType.json) ?? true) {
      const jsonMatch = trimmed.match(/^['"]([^'"]+)['"]\s*:/);
      if (jsonMatch) {
        results.push({
          key: jsonMatch[1],
          type: ParserMatchType.json,
        });
        continue;
      }
    }

    // Single quoted text
    if (matchType?.includes(ParserMatchType.singleText) ?? true) {
      const quotedMatch = trimmed.match(/^(['"])(.*?)\1$/);
      if (quotedMatch) {
        results.push({
          key: quotedMatch[2],
          type: ParserMatchType.singleText,
        });
        continue;
      }
    }

    // Plain text
    if (matchType?.includes(ParserMatchType.plainText) ?? true) {
      const plainMatch = trimmed.match(/^[a-zA-Z0-9_.-]+$/);
      if (plainMatch) {
        results.push({
          key: trimmed,
          type: ParserMatchType.plainText,
        });
      }
    }
  }

  return results;
}