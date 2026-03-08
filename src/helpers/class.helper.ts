
export function isClassExist(content: string, className: string) {
  const regex = new RegExp(`class\\s+${className}\\b`);
  return regex.test(content);
}
