export function getIconName(key: string): string {
  // Remove "Gi" prefix
  let name = key.replace(/^Gi/, "");
  // Insert space before sequences of uppercase followed by lowercase
  name = name.replace(/([A-Z][a-z])/g, " $1");
  // Insert space before standalone uppercase letters
  name = name.replace(/([a-z])([A-Z])/g, "$1 $2");
  // Insert space before digit sequences and remove leading zeros
  name = name.replace(/(\D)(\d+)/g, (_, nonDigit, digits) => {
    return `${nonDigit} ${parseInt(digits, 10)}`;
  });
  return name.trim();
}
