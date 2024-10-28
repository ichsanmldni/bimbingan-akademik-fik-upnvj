import React from "react";

interface InputFieldProps {
  type: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
}

const InputField: React.FC<InputFieldProps> = ({
  type,
  placeholder,
  onChange,
  value,
}) => (
  <input
    type={type}
    className="px-3 py-2 text-[15px] border rounded-lg"
    placeholder={placeholder}
    onChange={onChange}
    value={value}
  />
);

export default InputField;
