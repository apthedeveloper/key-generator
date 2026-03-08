export enum VariableNameCase {
  CamelCase = "camelCase",
  PascalCase = "PascalCase",
  SnakeCase = "snake_case",
  UpperSnakeCase = "UPPER_SNAKE_CASE",
  
}

export namespace VariableNameCase {
  export const values: VariableNameCase[] = [
    VariableNameCase.CamelCase,
    VariableNameCase.PascalCase,
    VariableNameCase.SnakeCase,
    VariableNameCase.UpperSnakeCase,
  ];

  export function from(value: string): VariableNameCase {
    if (values.includes(value as VariableNameCase)) {
      return value as VariableNameCase;
    }
    throw new Error(`Invalid variable name case: ${value}`);
  }
}