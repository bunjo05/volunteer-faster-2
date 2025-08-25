// In Components/SidebarLink.jsx
import { Link } from "@inertiajs/react";

export default function SidebarLink({
    href,
    icon: Icon,
    children,
    className,
    activeClassName,
    currentRoute,
    routeName,
    ...props
}) {
    const isActive = currentRoute === routeName;

    return (
        <Link
            href={href}
            className={`${className} ${isActive ? activeClassName : ""}`}
            {...props}
        >
            {Icon && <Icon className="w-5 h-5" />}
            {children}
        </Link>
    );
}
