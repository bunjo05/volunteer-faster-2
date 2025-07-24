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

// Add this to your main application setup (e.g., app.js)
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (
            error.message.includes("Network Error") ||
            error.message.includes("ERR_NETWORK_CHANGED")
        ) {
            // Handle network errors globally
            console.log("Network error detected, retrying...");
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(axios.request(error.config));
                }, 1000);
            });
        }
        return Promise.reject(error);
    }
);

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        // Calculate points if user is authenticated
        const userPoints = props.initialPage.props.auth?.user
            ? props.initialPage.props.auth.user.points || 0
            : 0;

        root.render(
            <App
                {...props}
                initialPage={{
                    ...props.initialPage,
                    props: {
                        ...props.initialPage.props,
                        points: userPoints,
                    },
                }}
            />
        );
    },
    progress: {
        color: "#4B5563",
    },
});
