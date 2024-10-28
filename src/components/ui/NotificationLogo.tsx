import Image from "next/image";
import notificationIcon from "../../assets/images/bell.png";

const NotificationLogo = () => {
  return (
    <Image
      src={notificationIcon}
      alt="Notification Icon"
      className="w-6 h-6 cursor-pointer"
    />
  );
};

export default NotificationLogo;
