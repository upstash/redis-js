module.exports = {
  env: {
    node: true,
  },
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
  },
  plugins: ["@typescript-eslint", "prettier"],
  extends: [
    /*
     * Always a good idea to start with sane defaults
     */
    "eslint:recommended",

    /*
     * Required to integrate prettier into eslint
     */
    "plugin:prettier/recommended",
  ],
  rules: {
    semi: "off",

    /*
     * This reads all definitions from a local prettier config file and applies the correct
     * eslint rules automatically.
     */
    "prettier/prettier": ["error"],

    /*
     * Named exports are almost always better because they break when the imported module changes
     */
    "import/prefer-default-export": "off",

    "object-curly-newline": "off",
    "max-len": [
      2,
      {
        code: 100,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      },
    ],
  },
}
