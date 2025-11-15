import VolunteerFeedLayout from "@/Layouts/VolunteerFeedLayout";

export default function Index() {
    return (
        <VolunteerFeedLayout>
            <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                    Latest Opportunities
                </h2>
                <p className="text-gray-600">
                    Discover meaningful ways to contribute to your community
                </p>
            </div>
        </VolunteerFeedLayout>
    );
}
