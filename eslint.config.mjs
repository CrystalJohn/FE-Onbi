import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Rule mới quá nghiêm: đánh lỗi cả pattern chuẩn useEffect(() => { fetchData() }, []).
      // Hạ xuống warning — khi nào chuyển data-fetching sang react-query thì bật lại error.
      "react-hooks/set-state-in-effect": "warn",
      // any: giữ ở mức warning để sửa dần, không chặn build/CI
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
