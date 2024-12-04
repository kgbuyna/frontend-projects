// eslint-disable-next-line no-undef
module.exports = {
  root: true,
  extends: ["next", "next/core-web-vitals"],
  plugins: ["prettier", "react", "react-hooks"],
  rules: {
    "prettier/prettier": "error",
    "react/react-in-jsx-scope": "off",
    "jsx-a11y/anchor-is-valid": "off",
    camelcase: "off", // Disable camelcase rule
    "react/jsx-filename-extension": "off",
    "import/extensions": "off",
    "import/order": "off",
    "import/prefer-default-export": "off",
    "react/require-default-props": "off",
    "no-param-reassign": "off",
    "no-shadow": "off",
    "import/no-useless-path-segments": "off",
    "import/no-cycle": "off",
    "react/jsx-curly-brace-presence": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn", // Enforce specifying dependencies
    "no-unused-vars": "error",
    "import/no-unused-modules": [1, { unusedExports: true }]
  }
};
