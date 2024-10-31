import Image from "next/image";
import notificationIcon from "../../assets/images/bell.png";

interface NotificationLogoProps {
  onClick: () => void;
}

const NotificationLogo: React.FC<NotificationLogoProps> = ({ onClick }) => {
  return (
    <Image
      src={notificationIcon}
      alt="Notification Icon"
      className="w-6 h-6 cursor-pointer"
      onClick={onClick}
    />
  );
};

export default NotificationLogo;
