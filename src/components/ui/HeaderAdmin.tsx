import NotificationButton from "./NotificationButton";
import ProfileImage from "./ProfileImage";

interface HeaderAdminProps {
  activeNavbar: string;
}

const HeaderAdmin: React.FC<HeaderAdminProps> = ({ activeNavbar }) => {
  return (
    <div className="flex justify-between py-6 px-8 border">
      <p className="text-[20px] font-semibold">{activeNavbar}</p>
      <div className="flex gap-6 items-center">
        <NotificationButton className="w-6 h-6 cursor-pointer" />
        <ProfileImage />
      </div>
    </div>
  );
};

export default HeaderAdmin;
