import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // 確保沒有 console.log 或 console.info
      // 允許 console.warn 和 console.error
      "no-console": ["error", { "allow": ["warn", "error"] }],
    }
  }
];

export default eslintConfig;
