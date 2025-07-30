// resources/js/Pages/Projects/FeatureModal.jsx
import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import axios from "axios";

export default function FeatureModal({ project, pricingPlans }) {
    const { props } = usePage();
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleCheckout = () => {
        if (!selectedPlan) return;

        setIsProcessing(true);

        axios
            .post(route("featured.checkout"), {
                project_id: project.id,
                plan_type: selectedPlan,
            })
            .then((response) => {
                const stripe = Stripe(props.stripeKey);
                return stripe.redirectToCheckout({
                    sessionId: response.data.sessionId,
                });
            })
            .catch((error) => {
                console.error("Error:", error);
                setIsProcessing(false);
            });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">Feature This Project</h2>
                <p className="mb-4">
                    Make your project stand out by featuring it on our platform.
                </p>

                <div className="space-y-4 mb-6">
                    {Object.entries(pricingPlans).map(([key, plan]) => (
                        <div
                            key={key}
                            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                                selectedPlan === key
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-gray-200 hover:bg-gray-50"
                            }`}
                            onClick={() => setSelectedPlan(key)}
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-medium">
                                        {plan.label}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {plan.duration_days / 30} month
                                        {plan.duration_days / 30 > 1
                                            ? "s"
                                            : ""}{" "}
                                        featured
                                    </p>
                                </div>
                                <div className="text-lg font-bold">
                                    ${plan.price.toFixed(2)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        className="px-4 py-2 text-gray-700 rounded-md border border-gray-300 hover:bg-gray-50"
                        onClick={() => window.history.back()}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCheckout}
                        disabled={!selectedPlan || isProcessing}
                        className={`px-4 py-2 text-white rounded-md ${
                            !selectedPlan
                                ? "bg-blue-300 cursor-not-allowed"
                                : isProcessing
                                ? "bg-blue-400"
                                : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {isProcessing ? "Processing..." : "Continue to Payment"}
                    </button>
                </div>
            </div>
        </div>
    );
}
