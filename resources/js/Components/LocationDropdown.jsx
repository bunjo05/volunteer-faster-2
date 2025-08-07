import React, { useState, useEffect } from "react";
import { Country, State, City } from "country-state-city";

export default function LocationDropdown({
    selectedCountry = "",
    selectedState = "",
    selectedCity = "",
    onCountryChange = () => {},
    onStateChange = () => {},
    onCityChange = () => {},
    isEditing = false,
    errors = {},
}) {
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCountryObj, setSelectedCountryObj] = useState(null);
    const [selectedStateObj, setSelectedStateObj] = useState(null);

    // Load countries on mount
    useEffect(() => {
        const countryList = Country.getAllCountries();
        setCountries(countryList);

        // Find the initially selected country object if it exists
        if (selectedCountry) {
            const countryObj = countryList.find(
                (c) => c.name === selectedCountry
            );
            setSelectedCountryObj(countryObj);
        }
    }, []);

    // Load states when selectedCountry changes
    useEffect(() => {
        if (selectedCountryObj) {
            const statesList = State.getStatesOfCountry(
                selectedCountryObj.isoCode
            );
            setStates(statesList);
            setCities([]);

            // Find the initially selected state object if it exists
            if (selectedState) {
                const stateObj = statesList.find(
                    (s) => s.name === selectedState
                );
                setSelectedStateObj(stateObj);
            }
        } else {
            setStates([]);
            setCities([]);
            setSelectedStateObj(null);
        }
    }, [selectedCountryObj]);

    // Load cities when selectedState changes
    useEffect(() => {
        if (selectedCountryObj && selectedStateObj) {
            const citiesList = City.getCitiesOfState(
                selectedCountryObj.isoCode,
                selectedStateObj.isoCode
            );
            setCities(citiesList);
        } else {
            setCities([]);
        }
    }, [selectedStateObj]);

    const handleCountryChange = (countryName) => {
        const countryObj = countries.find((c) => c.name === countryName);
        setSelectedCountryObj(countryObj);
        onCountryChange(countryName); // Pass the full country name
        onStateChange(""); // Reset state
        onCityChange(""); // Reset city
    };

    const handleStateChange = (stateName) => {
        const stateObj = states.find((s) => s.name === stateName);
        setSelectedStateObj(stateObj);
        onStateChange(stateName); // Pass the full state name
        onCityChange(""); // Reset city
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="font-semibold">Country:</label>
                {isEditing ? (
                    <select
                        value={selectedCountry}
                        onChange={(e) => handleCountryChange(e.target.value)}
                        className={`w-full p-2 mt-1 bg-gray-100 border ${
                            errors.country
                                ? "border-red-300"
                                : "border-gray-300"
                        } rounded`}
                    >
                        <option value="">Select Country</option>
                        {countries.map((country) => (
                            <option key={country.isoCode} value={country.name}>
                                {country.name}
                            </option>
                        ))}
                    </select>
                ) : (
                    <p>{selectedCountry || "Not specified"}</p>
                )}
                {errors.country && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.country}
                    </p>
                )}
            </div>

            {(states.length > 0 || selectedState) && (
                <div>
                    <label className="font-semibold">State/Province:</label>
                    {isEditing ? (
                        <select
                            value={selectedState}
                            onChange={(e) => handleStateChange(e.target.value)}
                            className={`w-full p-2 mt-1 bg-gray-100 border ${
                                errors.state
                                    ? "border-red-300"
                                    : "border-gray-300"
                            } rounded`}
                        >
                            <option value="">Select State</option>
                            {states.map((state) => (
                                <option key={state.isoCode} value={state.name}>
                                    {state.name}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <p>{selectedState || "Not specified"}</p>
                    )}
                    {errors.state && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.state}
                        </p>
                    )}
                </div>
            )}

            {(cities.length > 0 || selectedCity) && (
                <div>
                    <label className="font-semibold">
                        City: <span className="text-red-500">*</span>
                    </label>
                    {isEditing ? (
                        <select
                            required
                            value={selectedCity}
                            onChange={(e) => onCityChange(e.target.value)}
                            className={`w-full p-2 mt-1 bg-gray-100 border ${
                                errors.city
                                    ? "border-red-300"
                                    : "border-gray-300"
                            } rounded`}
                        >
                            <option value="">Select City</option>
                            {cities.map((city) => (
                                <option key={city.name} value={city.name}>
                                    {city.name}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <p>{selectedCity || "Not specified"}</p>
                    )}
                    {errors.city && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.city}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
