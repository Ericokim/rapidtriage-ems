// https://docs.expo.dev/guides/using-eslint/
// Flat config exported directly (without `eslint/config`) so it loads under the
// hoisted ESLint in this monorepo.
const expoConfig = require("eslint-config-expo/flat");

module.exports = [
  ...(Array.isArray(expoConfig) ? expoConfig : [expoConfig]),
  {
    ignores: ["dist/*", ".expo/*", "node_modules/*"],
  },
  {
    // eslint-plugin-import re-parses imported modules and cannot resolve the
    // nested TypeScript parser in this monorepo. These checks are redundant
    // with `tsc --noEmit`, which already validates imports and types.
    rules: {
      "import/namespace": "off",
      "import/default": "off",
      "import/named": "off",
      "import/no-unresolved": "off",
      "import/no-named-as-default": "off",
      "import/no-named-as-default-member": "off",
      "import/no-duplicates": "off",
    },
  },
];
