import React, { useState, useEffect } from "react";

// Free APIs - no key required
const API_BASE = "https://countriesnow.space/api/v0.1";
// Alternative: https://restcountries.com/v3.1

export default function LocationDropdown({
    selectedCountry = null,
    selectedState = null,
    selectedCity = null,
    onCountryChange = () => {},
    onStateChange = () => {},
    onCityChange = () => {},
    onCountryNameChange = () => {},
    isEditing = false,
    errors = {},
}) {
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState({
        countries: false,
        states: false,
        cities: false,
    });

    // Load countries from API
    useEffect(() => {
        setLoading((prev) => ({ ...prev, countries: true }));

        // Option 1: Using countriesnow.space API
        fetch(`${API_BASE}/countries`)
            .then((res) => res.json())
            .then((data) => {
                if (data.data) {
                    setCountries(
                        data.data.map((country) => ({
                            name: country.country,
                            isoCode: country.iso2 || country.iso3 || "",
                        }))
                    );
                }
                setLoading((prev) => ({ ...prev, countries: false }));
            })
            .catch((error) => {
                console.error("Error loading countries:", error);
                setLoading((prev) => ({ ...prev, countries: false }));

                // Fallback: Minimal country list
                const fallbackCountries = [
                    { name: "United States", isoCode: "US" },
                    { name: "United Kingdom", isoCode: "GB" },
                    { name: "Canada", isoCode: "CA" },
                    { name: "Australia", isoCode: "AU" },
                    { name: "India", isoCode: "IN" },
                    // Add more as needed
                ];
                setCountries(fallbackCountries);
            });
    }, []);

    // Load states when country changes
    useEffect(() => {
        if (selectedCountry) {
            setLoading((prev) => ({ ...prev, states: true }));
            setStates([]);
            setCities([]);

            fetch(`${API_BASE}/countries/states`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    country: selectedCountry,
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.data && data.data.states) {
                        setStates(
                            data.data.states.map((state) => ({
                                name: state.name,
                                isoCode: state.state_code || "",
                            }))
                        );
                    }
                    setLoading((prev) => ({ ...prev, states: false }));
                })
                .catch((error) => {
                    console.error("Error loading states:", error);
                    setLoading((prev) => ({ ...prev, states: false }));
                });
        }
    }, [selectedCountry]);

    // Load cities when state changes
    useEffect(() => {
        if (selectedCountry && selectedState) {
            setLoading((prev) => ({ ...prev, cities: true }));

            fetch(`${API_BASE}/countries/state/cities`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    country: selectedCountry,
                    state: selectedState,
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.data) {
                        setCities(
                            data.data.map((city) => ({
                                name: city,
                            }))
                        );
                    }
                    setLoading((prev) => ({ ...prev, cities: false }));
                })
                .catch((error) => {
                    console.error("Error loading cities:", error);
                    setLoading((prev) => ({ ...prev, cities: false }));
                });
        }
    }, [selectedCountry, selectedState]);

    const handleCountryChange = (countryName) => {
        onCountryChange(countryName);
        onCountryNameChange(countryName);
        onStateChange("");
        onCityChange("");
    };

    const handleStateChange = (stateName) => {
        onStateChange(stateName);
        onCityChange("");
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                </label>
                <select
                    value={selectedCountry || ""}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 ${
                        errors.country ? "border-red-300" : "border-gray-300"
                    }`}
                    disabled={loading.countries}
                >
                    <option value="">Select Country</option>
                    {loading.countries && (
                        <option value="" disabled>
                            Loading countries...
                        </option>
                    )}
                    {countries.map((country) => (
                        <option
                            key={`${country.isoCode}-${country.name}`}
                            value={country.name}
                        >
                            {country.name}
                        </option>
                    ))}
                </select>
                {errors.country && (
                    <div className="text-red-500 text-sm mt-1">
                        {errors.country}
                    </div>
                )}
            </div>

            {selectedCountry && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        State/Province
                    </label>
                    <select
                        value={selectedState || ""}
                        onChange={(e) => handleStateChange(e.target.value)}
                        className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 ${
                            errors.state ? "border-red-300" : "border-gray-300"
                        }`}
                        disabled={loading.states}
                    >
                        <option value="">Select State</option>
                        {loading.states && (
                            <option value="" disabled>
                                Loading states...
                            </option>
                        )}
                        {states.map((state) => (
                            <option
                                key={`${state.isoCode}-${state.name}`}
                                value={state.name}
                            >
                                {state.name}
                            </option>
                        ))}
                    </select>
                    {errors.state && (
                        <div className="text-red-500 text-sm mt-1">
                            {errors.state}
                        </div>
                    )}
                </div>
            )}

            {selectedState && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                    </label>
                    <select
                        value={selectedCity || ""}
                        onChange={(e) => onCityChange(e.target.value)}
                        className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 ${
                            errors.city ? "border-red-300" : "border-gray-300"
                        }`}
                        disabled={loading.cities}
                    >
                        <option value="">Select City</option>
                        {loading.cities && (
                            <option value="" disabled>
                                Loading cities...
                            </option>
                        )}
                        {cities.map((city, index) => (
                            <option
                                key={`${city.name}-${index}`}
                                value={city.name}
                            >
                                {city.name}
                            </option>
                        ))}
                    </select>
                    {errors.city && (
                        <div className="text-red-500 text-sm mt-1">
                            {errors.city}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
