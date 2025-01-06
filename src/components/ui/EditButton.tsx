import Image from "next/image";
import editIcon from "../../assets/images/edit-icon.png";

const EditButton: React.FC<any> = ({ onClick, className }) => {
  return (
    <button className={className} onClick={onClick}>
      <Image src={editIcon} className="size-4" alt="Edit Icon" />
    </button>
  );
};

export default EditButton;
