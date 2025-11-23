import base from "@intks/ihoku-eslint-config";

export default [
  ...base,
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "react/jsx-key": "warn",
    },
  },
];
