import Image from "next/image";
import editIcon from "../../assets/images/edit-icon.png";

interface EditButtonProps {
  onClick: () => void;
  className: string;
}

const EditButton: React.FC<EditButtonProps> = ({ onClick, className }) => {
  return (
    <button className={className} onClick={onClick}>
      <Image src={editIcon} className="size-4" alt="Edit Icon" />
    </button>
  );
};

export default EditButton;
