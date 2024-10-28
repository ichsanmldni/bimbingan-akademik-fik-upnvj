import Image from "next/image";
import loginImage from "../../assets/images/pana.svg";

const LoginImage: React.FC = () => {
  return (
    <Image src={loginImage} className="w-1/2 w-[450px] p-4" alt="Login Image" />
  );
};

export default LoginImage;
