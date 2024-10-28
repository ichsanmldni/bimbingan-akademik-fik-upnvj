import React from "react";

interface SelectFieldProps {
  options: { value: string; label: string }[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value: string;
  placeholder: string;
  disabled?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({
  options,
  onChange,
  value,
  placeholder,
  disabled,
}) => (
  <div className="relative">
    <select
      className={`px-3 py-2 text-[15px] border rounded-lg appearance-none w-full ${
        value === "" ? "text-gray-400" : "text-black"
      }`}
      value={value}
      onChange={onChange}
      disabled={disabled}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
      <svg
        className="w-4 h-4 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M19 9l-7 7-7-7"
        ></path>
      </svg>
    </div>
  </div>
);

export default SelectField;
