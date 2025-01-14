import Image from "next/image";
import bimafikLogo from "../../assets/images/logo-bimafik-icon.png";
import Link from "next/link";

interface LogoProps {
  className: string;
}

const LogoBimafik: React.FC<LogoProps> = ({ className }) => {
  return (
    <a href="/">
      <Image className={className} src={bimafikLogo} alt="BIMAFIK Logo" />
    </a>
  );
};

export default LogoBimafik;
