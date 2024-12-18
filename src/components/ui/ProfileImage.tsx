import Image from "next/image";
import profilePlaceholder from "../../assets/images/profile.png";
import blankProfile from "../../assets/images/user.png";

interface ProfileImageProps {
  onClick: () => void;
  className: string;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ onClick, className }) => {
  return (
    <Image
      src={blankProfile}
      alt="Profile Image"
      className={className}
      onClick={onClick}
    />
  );
};

export default ProfileImage;
