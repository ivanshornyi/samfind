/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { Country, City } from "country-state-city";
import { SelectComponent } from "@/components/ui/select";
import { Input } from "@/components";
import { ShareholderType, UserShareholderData } from "@/types";
import { SingleValue } from "react-select";

const investorTypeOptions = [
  {
    value: ShareholderType.Individual,
    label: "Myself/Individual",
  },
  {
    value: ShareholderType.Company,
    label: "Company",
  },
];

interface ShareholderFormProps {
  formData: Omit<UserShareholderData, "id" | "createdAt" | "updatedAt">;
  updateField: (key: any, value: string) => void;
}

export const ShareholderForm = ({
  formData,
  updateField,
}: ShareholderFormProps) => {
  const [selectedCountry, setSelectedCountry] = useState<{
    value: string;
    label: string;
  } | null>(
    formData.countryCode
      ? { value: formData.countryCode, label: formData.country }
      : null
  );
  const [selectedCity, setSelectedCity] = useState<{
    value: string;
    label: string;
  } | null>(
    formData.city ? { value: formData.city, label: formData.city } : null
  );
  const [selectedInvestorType, setSelectedInvestorType] = useState<{
    value: string;
    label: string;
  } | null>({
    value: formData.shareholderType,
    label: investorTypeOptions.find(
      (i) => i.value === formData.shareholderType
    )!.label,
  });
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

  const handleFormInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    updateField(name, value);
  };

  const handleFormSelectChange = (
    name: string,
    value: SingleValue<{
      value: string;
      label: string;
    }>
  ) => {
    if (name === "country") {
      updateField("country", value!.label);
      updateField("countryCode", value!.value);
      updateField("city", "");
      setSelectedCity(null);
    } else updateField(name, value!.value);
  };

  useEffect(() => {
    const options = selectedCountry
      ? City.getCitiesOfCountry(selectedCountry.value)?.map((city) => ({
          value: city.name,
          label: city.name,
        }))
      : [];

    setCityOptions(options || []);
  }, [selectedCountry]);

  useEffect(() => {
    if (formData.shareholderType)
      setSelectedInvestorType({
        value: formData.shareholderType,
        label: investorTypeOptions.find(
          (i) => i.value === formData.shareholderType
        )!.label,
      });

    if (formData.countryCode) {
      setSelectedCountry({
        value: formData.countryCode,
        label: formData.country,
      });
    }

    if (formData.city)
      setSelectedCity({
        value: formData.city,
        label: formData.city,
      });
  }, [formData]);

  return (
    <form>
      <div>
        <p className="mb-2">You are investing as</p>
        <SelectComponent
          options={investorTypeOptions}
          value={selectedInvestorType}
          onChange={(value) => handleFormSelectChange("shareholderType", value)}
          placeholder="Select investor type"
        />
      </div>
      <div className="mt-6">
        <p className="mb-2">Personal information</p>
        <div className="flex gap-2 mt-2 mb-2">
          <Input
            id="firstName"
            name="firstName"
            placeholder="First name"
            value={formData.firstName}
            onChange={handleFormInputChange}
          />
          <Input
            id="lastName"
            name="lastName"
            placeholder="Last name"
            value={formData.lastName}
            onChange={handleFormInputChange}
          />
        </div>
        <Input
          id="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleFormInputChange}
        />
      </div>

      <div className="mt-6">
        <p className="mb-2">Identification Number</p>
        <Input
          id="identificationNumber"
          name="identificationNumber"
          placeholder={
            formData.shareholderType === ShareholderType.Individual
              ? "Personal Identification Number "
              : "Company Identification Number "
          }
          value={formData.identificationNumber}
          onChange={handleFormInputChange}
        />
      </div>

      <div className="mt-6">
        <p className="mb-2">Address Information</p>
        <div className="flex gap-2 mt-2 mb-2">
          <Input
            id="address"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleFormInputChange}
          />
          <Input
            id="postcode"
            name="postcode"
            placeholder="Post code"
            value={formData.postcode}
            onChange={handleFormInputChange}
          />
        </div>
        <div className="flex gap-2 mt-2 mb-2">
          <div className="w-full">
            <SelectComponent
              options={countryOptions}
              value={selectedCountry}
              onChange={(value) => handleFormSelectChange("country", value)}
              placeholder="Select country"
            />
          </div>
          <div className="w-full">
            <SelectComponent
              options={cityOptions}
              value={selectedCity}
              onChange={(value) => handleFormSelectChange("city", value)}
              placeholder="Select city"
              isDisabled={!selectedCountry}
            />
          </div>
        </div>
      </div>
    </form>
  );
};
