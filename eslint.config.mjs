import nextConfig from "eslint-config-next";

const eslintConfig = [
  ...nextConfig,
  {
    rules: {
      // This repository is a visual/UX prototype that intentionally hydrates
      // mock localStorage state after mount and generates throwaway mock IDs
      // from UI handlers. Keep lint focused on prototype regressions instead
      // of production React Compiler migration constraints.
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/purity": "off",
      "react-hooks/preserve-manual-memoization": "off",
      "@next/next/no-img-element": "off",
    },
  },
];

export default eslintConfig;
