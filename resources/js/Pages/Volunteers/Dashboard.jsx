import VolunteerLayout from "@/Layouts/VolunteerLayout";

export default function Dashboard() {
    return (
        <VolunteerLayout>
            <div className="flex flex-col items-center justify-center min-h-screen py-4 sm:py-0">
                {/* <Head title="Dashboard" /> */}

                <div className="w-full sm:max-w-md px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                    <h1 className="text-2xl font-bold text-center">
                        Welcome to the Volunteer's Dashboard
                    </h1>
                    <p className="mt-4 text-center">
                        This is the Volunteer's dashboard.
                    </p>
                </div>
            </div>
        </VolunteerLayout>
    );
}
