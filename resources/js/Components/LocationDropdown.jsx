import React, { useState, useEffect } from "react";
import { Country, State, City } from "country-state-city";

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
    const [selectedCountryObj, setSelectedCountryObj] = useState(null);
    const [selectedStateObj, setSelectedStateObj] = useState(null);

    // Load countries on mount
    useEffect(() => {
        const countryList = Country.getAllCountries();
        setCountries(countryList);

        // If no country is selected but we're not editing (create mode), show all countries
        if (!selectedCountry && !isEditing) {
            setStates(State.getAllStates());
        }
    }, []);

    // Load states when selectedCountry changes
    useEffect(() => {
        if (selectedCountry) {
            const countryObj = countries.find(
                (c) => c.name === selectedCountry
            );
            setSelectedCountryObj(countryObj);

            if (countryObj) {
                const statesList = State.getStatesOfCountry(countryObj.isoCode);
                setStates(statesList);
            }
        } else if (!isEditing) {
            // In create mode with no country selected, show all states
            setStates(State.getAllStates());
        }
    }, [selectedCountry, countries, isEditing]);

    // Load cities when selectedState changes
    useEffect(() => {
        if (selectedState && selectedCountryObj) {
            const stateObj = states.find((s) => s.name === selectedState);
            setSelectedStateObj(stateObj);

            if (stateObj) {
                const citiesList = City.getCitiesOfState(
                    selectedCountryObj.isoCode,
                    stateObj.isoCode
                );
                setCities(citiesList);
            }
        } else if (!isEditing && selectedState) {
            // In create mode, try to find cities for the selected state
            const allStates = State.getAllStates();
            const stateObj = allStates.find((s) => s.name === selectedState);
            if (stateObj) {
                const citiesList = City.getCitiesOfState(
                    stateObj.countryCode,
                    stateObj.isoCode
                );
                setCities(citiesList);
            }
        } else {
            setCities([]);
        }
    }, [selectedState, selectedCountryObj, states, isEditing]);

    const handleCountryChange = (countryName) => {
        const countryObj = countries.find((c) => c.name === countryName);
        setSelectedCountryObj(countryObj);
        onCountryChange(countryName);
        onCountryNameChange(countryName);
        onStateChange("");
        onCityChange("");
    };

    const handleStateChange = (stateName) => {
        const stateObj = states.find((s) => s.name === stateName);
        setSelectedStateObj(stateObj);
        onStateChange(stateName);
        onCityChange("");
    };

    // Create unique keys for options
    const getCountryKey = (country) => `${country.isoCode}-${country.name}`;
    const getStateKey = (state) =>
        `${state.isoCode}-${state.name}-${state.countryCode}`;
    const getCityKey = (city) =>
        `${city.name}-${city.countryCode}-${city.stateCode}`;

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
                >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                        <option
                            key={getCountryKey(country)}
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
                >
                    <option value="">Select State</option>
                    {states.map((state) => (
                        <option key={getStateKey(state)} value={state.name}>
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

            {cities.length > 0 && (
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
                    >
                        <option value="">Select City</option>
                        {cities.map((city) => (
                            <option key={getCityKey(city)} value={city.name}>
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
