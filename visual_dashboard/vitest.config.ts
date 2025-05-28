import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Use dynamic import for vite-tsconfig-paths
export default async () => {
  const { default: tsconfigPaths } = await import("vite-tsconfig-paths");

  return defineConfig({
    plugins: [react(), tsconfigPaths()],
    test: {
      environment: "jsdom",
      globals: true,
      css: {
        modules: {
          classNameStrategy: "non-scoped",
        },
      },
      setupFiles: ["./__tests__/setup.ts"],
      exclude: ["**/node_modules/**", "**/.next/**"],
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
      },
    },
  });
};
