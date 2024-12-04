import Image from "next/image";
import trashIcon from "../../assets/images/trash-icon.png";

interface TrashButtonProps {
  onClick: () => void;
  className: string;
}

const TrashButton: React.FC<TrashButtonProps> = ({ onClick, className }) => {
  return (
    <button className={className} onClick={onClick}>
      <Image src={trashIcon} className="size-4" alt="Edit Icon" />
    </button>
  );
};

export default TrashButton;
