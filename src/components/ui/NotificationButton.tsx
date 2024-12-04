import Image from "next/image";
import notificationIcon from "../../assets/images/bell.png";

interface NotificationButtonProps {
  onClick: () => void;
  className: string;
}

const NotificationButton: React.FC<NotificationButtonProps> = ({
  onClick,
  className,
}) => {
  return (
    <Image
      src={notificationIcon}
      alt="Notification Icon"
      className={className}
      onClick={onClick}
    />
  );
};

export default NotificationButton;
