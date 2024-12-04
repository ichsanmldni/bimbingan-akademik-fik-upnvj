import React, { useState } from "react";

interface InputFieldProps {
  type: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  className: string;
  disabled: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  type,
  placeholder,
  onChange,
  value,
  className,
  disabled,
}) => {
  return (
    <input
      type={type}
      className={`${
        value === "" ? "text-neutral-400" : "text-black"
      } ${className}`}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      disabled={disabled}
    />
  );
};

export default InputField;
