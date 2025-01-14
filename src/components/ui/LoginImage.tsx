import Image from "next/image";
import loginImage from "../../assets/images/pana.svg";

const LoginImage: React.FC = () => {
  return (
    <Image
      src={loginImage}
      className="mt-12 w-[200px] mx-auto md:w-[450px] md:mt-0 p-4"
      alt="Login Image"
    />
  );
};

export default LoginImage;
