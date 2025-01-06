import Image from "next/image";
import fileIcon from "../../assets/images/file-icon.png";

const FileButton: React.FC<any> = ({ data, className }) => {
  return (
    <a
      href={URL.createObjectURL(data.file)}
      target="_blank"
      rel="noopener noreferrer"
      className={`${className} inline-flex items-center justify-center`}
    >
      <div className="mx-auto">
        <Image src={fileIcon} className="size-4" alt="File Icon" />
      </div>
    </a>
  );
};

export default FileButton;
