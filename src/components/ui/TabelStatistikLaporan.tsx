// components/MentoringTable.js
const TabelStatistikLaporan = () => {
  const data = [
    { name: "Aff Fachri", students: 22, reports: 5 },
    { name: "Saripah", students: 22, reports: 3 },
    { name: "Ihsan", students: 22, reports: 4 },
    { name: "Nayla", students: 23, reports: 5 },
  ];

  return (
    <div className="border w-full rounded-lg">
      <h1 className="p-6 font-semibold text-[18px]">
        Total Laporan Bimbingan Dosen PA
      </h1>
      <table className="mb-8 mx-6">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 text-start w-[35%] font-medium rounded-bl-xl rounded-tl-xl">
              Nama Dosen
            </th>
            <th className="px-4 py-2 w-[35%] text-start font-medium">
              Jumlah Mahasiswa Bimbingan
            </th>
            <th className="px-4 py-2 w-[30%] font-medium text-start rounded-br-xl rounded-tr-xl">
              Total Laporan Bimbingan
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="h-[80px]">
              <td className="px-4 py-2">{item.name}</td>
              <td className="px-4 py-2">{item.students}</td>
              <td className="px-4 py-2">{item.reports}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TabelStatistikLaporan;
