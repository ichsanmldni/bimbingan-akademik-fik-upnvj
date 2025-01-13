import React, { useState } from "react";

const InputField: React.FC<any> = ({
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
