import { useState } from "react";
import NotificationButton from "./NotificationButton";
import NotificationModal from "./NotificationModal";
import ProfileImage from "./ProfileImage";
import ProfileModal from "./ProfileModal";

interface HeaderAdminProps {
  activeNavbar: string;
}

const HeaderAdmin: React.FC<HeaderAdminProps> = ({ activeNavbar }) => {
  const [isModalNotificationOpen, setIsModalNotificationOpen] = useState(false);
  const [isModalProfileOpen, setIsModalProfileOpen] = useState(false);

  const handleNotificationClick = () => {
    setIsModalProfileOpen(false);
    setIsModalNotificationOpen(true);
  };

  const closeNotificationModal = () => {
    setIsModalNotificationOpen(false);
  };

  const handleProfileClick = () => {
    setIsModalNotificationOpen(false);
    setIsModalProfileOpen(true);
  };

  const closeProfileModal = () => {
    setIsModalProfileOpen(false);
  };

  return (
    <div className="flex justify-between py-6 px-8 border">
      <p className="text-[20px] font-semibold">{activeNavbar}</p>
      <div className="flex gap-6 items-center">
        <NotificationButton
          onClick={handleNotificationClick}
          className="w-6 h-6 cursor-pointer"
        />
        <ProfileImage className="size-8" onClick={handleProfileClick} />
      </div>
      {isModalNotificationOpen && (
        <NotificationModal
          className="fixed inset-0 flex items-start mt-[76px] mr-[84px] justify-end z-50"
          onClose={closeNotificationModal}
        />
      )}
      {isModalProfileOpen && (
        <ProfileModal
          className="fixed inset-0 flex items-start mt-[76px] mr-[30px] justify-end z-50"
          onClose={closeProfileModal}
          isAdmin={true}
        />
      )}
    </div>
  );
};

export default HeaderAdmin;
