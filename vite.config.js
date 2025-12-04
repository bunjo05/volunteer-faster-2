import { defineConfig, loadEnv } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
    // Load env variables
    const env = loadEnv(mode, process.cwd(), "");

    return {
        plugins: [
            laravel({
                input: ["resources/js/app.jsx", "resources/js/echo.js"],
                refresh: true,
            }),
            react(),
        ],
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "resources/js"),
                "@Helpers": "/resources/js/Helpers",
            },
        },
        define: {
            "process.env": {
                VITE_STRIPE_KEY: JSON.stringify(env.VITE_STRIPE_KEY),
                VITE_REVERB_APP_KEY: JSON.stringify(env.VITE_REVERB_APP_KEY),
                VITE_REVERB_HOST: JSON.stringify(env.VITE_REVERB_HOST),
                VITE_REVERB_PORT: JSON.stringify(env.VITE_REVERB_PORT),
                VITE_REVERB_SCHEME: JSON.stringify(env.VITE_REVERB_SCHEME),
            },
        },
        // ADD THESE OPTIONS:
        build: {
            rollupOptions: {
                output: {
                    manualChunks(id) {
                        // Separate large location data into its own chunk
                        if (id.includes("LocationDropdown")) {
                            return "location-data";
                        }

                        // Separate vendor dependencies
                        if (id.includes("node_modules")) {
                            if (
                                id.includes("react") ||
                                id.includes("react-dom") ||
                                id.includes("scheduler")
                            ) {
                                return "vendor-react";
                            }
                            if (id.includes("@inertiajs")) {
                                return "vendor-inertia";
                            }
                            if (id.includes("lucide-react")) {
                                return "vendor-icons";
                            }
                            return "vendor";
                        }
                    },
                },
            },
            chunkSizeWarningLimit: 1000, // Temporarily increase to see other warnings
        },
    };
});
