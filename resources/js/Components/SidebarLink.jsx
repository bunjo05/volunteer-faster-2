import { Link } from "@inertiajs/react";

export default function SidebarLink({ href, icon: Icon, children }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 py-2 px-4 rounded hover:bg-gray-100 text-gray-700"
        >
            {Icon && <Icon className="w-5 h-5" />}
            {children}
        </Link>
    );
}
