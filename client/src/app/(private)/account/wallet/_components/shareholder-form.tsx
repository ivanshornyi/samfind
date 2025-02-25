"use client";

import React, { useEffect, useState } from "react";
import { Country, City } from "country-state-city";
import { SelectComponent } from "@/components/ui/select";

export const ShareholderForm = () => {
  const [selectedCountry, setSelectedCountry] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [selectedCity, setSelectedCity] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [cityOptions, setCityOptions] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);

  const countryOptions = Country.getAllCountries().map((country) => ({
    value: country.isoCode,
    label: country.name,
  }));

  useEffect(() => {
    const options = selectedCountry
      ? City.getCitiesOfCountry(selectedCountry.value)?.map((city) => ({
          value: city.name,
          label: city.name,
        }))
      : [];

    setCityOptions(options || []);
  }, [selectedCountry]);

  return (
    <form>
      <SelectComponent
        options={countryOptions}
        value={selectedCountry}
        onChange={setSelectedCountry}
        placeholder="Select country"
      />

      <SelectComponent
        options={cityOptions}
        value={selectedCity}
        onChange={setSelectedCity}
        placeholder="Select city"
        isDisabled={!selectedCountry}
      />
    </form>
  );
};
