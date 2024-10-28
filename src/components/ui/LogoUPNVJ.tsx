import Image from "next/image";
import upnvjLogo from "../../assets/images/LOGO-UPNVJ.png";

interface LogoProps {
  className: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return <Image className={`${className}`} src={upnvjLogo} alt="UPNVJ Logo" />;
};

export default Logo;
