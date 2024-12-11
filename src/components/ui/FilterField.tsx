import React from "react";

interface FilterFieldProps {
  options: { value: string; label: string }[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value: string;
  placeholder: string;
  className: string;
  disabled?: boolean;
}

const FilterField: React.FC<FilterFieldProps> = ({
  options,
  onChange,
  value,
  placeholder,
  disabled,
  className,
}) => (
  <div className="relative">
    <select
      className={`${className} "text-black"`}
      value={value}
      onChange={onChange}
      disabled={disabled}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option className="text-black" key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <div
      className={`${className.includes("hidden") ? "hidden" : "block"} ${className.match(/mt-\d+/)?.[0] || ""} absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none`}
    >
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

export default FilterField;
