import OrganizationLayout from "@/Layouts/OrganizationLayout";

export default function Messages() {
    return (
        <OrganizationLayout>
            <div className="flex flex-col items-center justify-center min-h-screen py-4 sm:py-0">
                {/* <Head title="Messages" /> */}

                <div className="w-full sm:max-w-md px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                    <h1 className="text-2xl font-bold text-center">Messages</h1>
                    <p className="mt-4 text-center">
                        This is the messages page.
                    </p>
                </div>
            </div>
        </OrganizationLayout>
    );
}
