/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  endOfLine: "auto",
  singleAttributePerLine: true,
  printWidth: 80, // <--- Add this! (Forces wrap at 80 chars)
  trailingComma: "all", // <--- Add this! (The secret for import lists)
  plugins: ["prettier-plugin-tailwindcss"],
};

export default config;
