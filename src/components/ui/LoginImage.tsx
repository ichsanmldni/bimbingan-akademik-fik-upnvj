import Image from "next/image";
import loginImage from "../../assets/images/pana.svg";

const LoginImage: React.FC = () => {
  return (
    <Image
      src={loginImage}
      className="w-[300px] mx-auto md:w-[450px] p-4"
      alt="Login Image"
    />
  );
};

export default LoginImage;
