// resources/js/Components/ui/toast/use-toast.js
import * as React from "react";

const ToastContext = React.createContext();

export function useToast() {
    const context = React.useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}

export function ToastProvider({ children }) {
    const [toasts, setToasts] = React.useState([]);

    const toast = ({
        title,
        description,
        variant = "default",
        duration = 5000,
    }) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast = { id, title, description, variant };

        setToasts((prev) => [...prev, newToast]);

        if (duration) {
            setTimeout(() => {
                dismissToast(id);
            }, duration);
        }

        return { id };
    };

    const dismissToast = (id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ toasts, toast, dismissToast }}>
            {children}
            <ToastViewport />
            {toasts.map((toast) => (
                <Toast key={toast.id} variant={toast.variant}>
                    <div className="grid gap-1">
                        {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
                        {toast.description && (
                            <ToastDescription>
                                {toast.description}
                            </ToastDescription>
                        )}
                    </div>
                    <ToastClose />
                </Toast>
            ))}
        </ToastContext.Provider>
    );
}
