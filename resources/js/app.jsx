import "../css/app.css";
import "./bootstrap";

import { router } from "@inertiajs/react";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

router.on("error", (error) => {
    if (error.response?.status === 403) {
        window.location.href = "/login"; // Full page reload to ensure clean state
    }
});

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: "#4B5563",
    },
});
