import Image from "next/image";
import upnvjLogo from "../../assets/images/LOGO-UPNVJ.png";
import Link from "next/link";

interface LogoProps {
  className: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <a href="/">
      <Image className={className} src={upnvjLogo} alt="UPNVJ Logo" />
    </a>
  );
};

export default Logo;
