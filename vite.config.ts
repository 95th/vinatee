import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(async () => ({
    // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
    //
    // 1. prevent vite from obscuring rust errors
    clearScreen: false,
    // 2. tauri expects a fixed port, fail if that port is not available
    server: {
        port: 1420,
        strictPort: true,
        watch: {
            // 3. tell vite to ignore watching `src-tauri`
            ignored: ["**/src-tauri/**"],
        },
    },
    build: {
        chunkSizeWarningLimit: 600,
        rollupOptions: {
            output: {
                manualChunks: (id: string) => {
                    if (id.includes("@vaadin")) {
                        return "vendor-vaadin";
                    }

                    if (id.includes("lit") || id.includes("mobx")) {
                        return "vendor-lit-mobx";
                    }

                    if (id.includes("codemirror")) {
                        return "vendor-editor";
                    }
                },
            },
        },
    },
}));
