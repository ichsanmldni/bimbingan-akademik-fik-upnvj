import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface PasswordInputProps {
  placeholder?: string;
  disabled?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isConfirmPassword?: boolean;
  className: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  placeholder,
  disabled,
  onChange,
  className,
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        className={className}
        placeholder={placeholder || "Kata Sandi"}
        disabled={disabled}
        onChange={(e) => {
          if (onChange) {
            onChange(e);
          }
        }}
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute right-3 top-3"
      >
        {showPassword ? (
          <FaEyeSlash className="mt-4 text-gray-500" />
        ) : (
          <FaEye className="mt-4 text-gray-500" />
        )}
      </button>
    </div>
  );
};

export default PasswordInput;
