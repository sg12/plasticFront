import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { loadEnv } from "vite";

// https://vitejs.dev/config/
export default ({ mode }) => {
  // Загружаем переменные окружения из .env файлов
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [react()],
  });
};
