import base from "@intks/ihoku-eslint-config"

export default [
  ...base,
  {
    files: ["**/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-definitions": "none"
    },
  },
]
