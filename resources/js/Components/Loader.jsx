import React from "react";

export default function Loader(props) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75">
            <div className="flex flex-col items-center">
                {/* Spinner */}
                {/* <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div> */}

                <div className="w-[50px] h-[50px] animate-spin">
                    <img
                        {...props}
                        src="/logo.svg" // Path to your logo in the storage folder
                        alt="Volunteer Faster Logo"
                    />
                </div>

                {/* Optional text */}
                <p className="mt-4 text-gray-600">Loading...</p>
            </div>
        </div>
    );
}
