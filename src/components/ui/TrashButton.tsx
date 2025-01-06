import Image from "next/image";
import trashIcon from "../../assets/images/trash-icon.png";

const TrashButton: React.FC<any> = ({ onClick, className }) => {
  return (
    <button className={className} onClick={onClick}>
      <Image src={trashIcon} className="size-4" alt="Edit Icon" />
    </button>
  );
};

export default TrashButton;
