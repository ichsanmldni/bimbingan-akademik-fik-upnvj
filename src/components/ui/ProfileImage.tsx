import Image from "next/image";
import profilePlaceholder from "../../assets/images/profile.png";

interface ProfileImageProps {
  onClick: () => void;
  className: string;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ onClick, className }) => {
  return (
    <Image
      src={profilePlaceholder}
      alt="Profile Image"
      className={className}
      onClick={onClick}
    />
  );
};

export default ProfileImage;
