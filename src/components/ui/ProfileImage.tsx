import Image from "next/image";
import profilePlaceholder from "../../assets/images/profile.png";

const ProfileImage = () => {
  return (
    <Image
      src={profilePlaceholder}
      alt="Profile Image"
      className="w-8 h-8 rounded-full cursor-pointer"
    />
  );
};

export default ProfileImage;
