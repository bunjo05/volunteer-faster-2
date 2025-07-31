import "../css/app.css";
import "./bootstrap";
import { router } from "@inertiajs/react";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import Loader from "./Components/Loader";
import { LoadingProvider, useLoading } from "./Context/LoadingContext"; // Add useLoading import
import { useEffect } from "react"; // Add useEffect import

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

router.on("start", () => {
    const { setIsLoading } = window.loadingContext || {};
    if (setIsLoading) setIsLoading(true);
});

router.on("finish", () => {
    const { setIsLoading } = window.loadingContext || {};
    if (setIsLoading) setIsLoading(false);
});

router.on("error", (error) => {
    if (error.response?.status === 403) {
        window.location.href = "/login";
    }
    const { setIsLoading } = window.loadingContext || {};
    if (setIsLoading) setIsLoading(false);
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
        const userPoints = props.initialPage.props.auth?.user
            ? props.initialPage.props.auth.user.points || 0
            : 0;

        root.render(
            <LoadingProvider>
                <AppWrapper App={App} props={props} userPoints={userPoints} />
            </LoadingProvider>
        );
    },
    progress: {
        color: "#4B5563",
    },
});

function AppWrapper({ App, props, userPoints }) {
    const { isLoading, setIsLoading } = useLoading(); // Now properly imported

    useEffect(() => {
        window.loadingContext = { setIsLoading };
        return () => {
            window.loadingContext = null;
        };
    }, [setIsLoading]);

    return (
        <>
            {isLoading && <Loader />}
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
        </>
    );
}
