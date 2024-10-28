import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface PasswordInputProps {
  placeholder?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ placeholder }) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        className="px-3 py-2 text-[15px] border rounded-lg w-full"
        placeholder={placeholder || "Kata Sandi"}
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute right-3 top-3"
      >
        {showPassword ? (
          <FaEyeSlash className="text-gray-500" />
        ) : (
          <FaEye className="text-gray-500" />
        )}
      </button>
    </div>
  );
};

export default PasswordInput;
