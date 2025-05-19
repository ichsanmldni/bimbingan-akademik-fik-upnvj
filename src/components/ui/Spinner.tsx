export default function Spinner() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-[1000]">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-blue-600 border-b-transparent"></div>
    </div>
  );
}
