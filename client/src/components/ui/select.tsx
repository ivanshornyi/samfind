/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import Select, { SingleValue } from "react-select";

const customStyles: any = {
  control: (provided: Record<string, unknown>, state: any) => ({
    ...provided,
    border: state.isFocused
      ? "1px solid #28282C"
      : state.selectProps.hasError
        ? "1px solid #28282C"
        : "1px solid #28282C",
    boxShadow: "none",
    "&:hover": {
      border: state.selectProps.hasError
        ? "1px solid #D02B20"
        : "1px solid #28282C",
      boxShadow: "none",
    },
    paddingLeft: "24px",
    borderRadius: "30px",
    height: "48px",
    minHeight: "48px",
    backgroundColor: "#28282C",
    cursor: state.isDisabled ? "not-allowed" : "pointer",
    fontSize: "16px",
    font: "sans-serif",
    fontFamily: "sans-serif",
  }),
  input: (provided: any) => ({
    ...provided,
    color: "#FFFFFF",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: "#8B929C",
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#28282C"
      : state.isFocused
        ? "#2A2C2F"
        : "#28282C",
    color: "#E6E6E6",
    padding: "8px 16px",
    cursor: "pointer",
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: "#E6E6E6",
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: "#28282C",
    borderColor: "#28282C",
  }),
};

interface SelectComponentProps {
  value: {
    value: string;
    label: string;
  } | null;
  options: {
    value: string;
    label: string;
  }[];
  onChange: (value: SingleValue<{ value: string; label: string }>) => void;
  placeholder: string;
  isDisabled?: boolean;
}

export const SelectComponent = ({
  value,
  options,
  onChange,
  placeholder,
  isDisabled,
}: SelectComponentProps) => {
  return (
    <Select
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      styles={customStyles}
      isDisabled={isDisabled}
    />
  );
};
