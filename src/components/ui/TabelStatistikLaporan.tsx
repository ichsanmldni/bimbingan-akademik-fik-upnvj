import axios from "axios";
import { useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
// components/MentoringTable.js
const TabelStatistikLaporan = ({ dataBimbingan, dataLaporanBimbingan }) => {
  console.log(dataBimbingan, dataLaporanBimbingan);
  const [dataDosenPA, setDataDosenPA] = useState([]);
  const [dataMahasiswa, setDataMahasiswa] = useState([]);
  const [dataDosenPaBimbingan, setdataDosenPaBimbingan] = useState([]);

  const getDataDosenPA = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/datadosenpa`);

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      setDataDosenPA(response.data);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };
  const getDataMahasiswa = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/datamahasiswa`);

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      setDataMahasiswa(response.data);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };
  console.log(dataLaporanBimbingan);

  const jumlahMahasiswaPerDosen = dataMahasiswa.reduce((acc, mahasiswa) => {
    acc[mahasiswa.dosen_pa_id] = (acc[mahasiswa.dosen_pa_id] || 0) + 1;
    return acc;
  }, {});
  const jumlahLaporanBimbinganPerDosen = dataLaporanBimbingan.reduce(
    (acc, mahasiswa) => {
      acc[mahasiswa.dosen_pa_id] = (acc[mahasiswa.dosen_pa_id] || 0) + 1;
      return acc;
    },
    {}
  );

  const getDataJumlahMahasiswa = (dosen_pa_id) => {
    return jumlahMahasiswaPerDosen[dosen_pa_id] || 0;
  };
  const getDataJumlahLaporanBimbingan = (dosen_pa_id) => {
    return jumlahLaporanBimbinganPerDosen[dosen_pa_id] || 0;
  };

  const getDataDosenPaBimbingan = async () => {
    try {
      const dataNamaDosenPA = [
        ...new Set(
          dataDosenPA.filter((data) =>
            dataBimbingan.some(
              (bimbingan) =>
                bimbingan.pengajuan_bimbingan.dosen_pa_id === data.id
            )
          )
        ),
      ];

      setdataDosenPaBimbingan(dataNamaDosenPA);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (
      dataBimbingan &&
      dataDosenPA &&
      dataDosenPA.length > 0 &&
      dataBimbingan.length > 0
    ) {
      getDataDosenPaBimbingan();
    }
  }, [dataBimbingan, dataDosenPA]);

  useEffect(() => {
    getDataDosenPA();
    getDataMahasiswa();
  }, []);

  return (
    <div className="border  md:w-full rounded-lg">
      <h1 className="p-6 font-semibold text-[18px]">
        Total Laporan Bimbingan Dosen PA
      </h1>
      <table className="mb-8 mx-6">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-1 md:px-4 py-2 text-center md:w-[46%] font-medium rounded-bl-xl rounded-tl-xl">
              Nama Dosen
            </th>
            <th className="px-1 md:px-4 py-2 md:w-[28%] text-center font-medium">
              Jumlah Mahasiswa Bimbingan
            </th>
            <th className="px-1 md:px-4 py-2 md:w-[28%] font-medium text-center rounded-br-xl rounded-tr-xl">
              Total Laporan Bimbingan
            </th>
          </tr>
        </thead>
        <tbody>
          {dataDosenPaBimbingan.map((data, index) => (
            <tr key={index} className="md:h-[80px]">
              <td className="px-1 md:px-4 py-2 text-center align-middle">
                {data.nama}
              </td>
              <td className="px-1 md:px-4 py-2 text-center align-middle">
                {getDataJumlahMahasiswa(data.id)}
              </td>
              <td className="px-1 md:px-4 py-2 text-center align-middle">
                {getDataJumlahLaporanBimbingan(data.id)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TabelStatistikLaporan;
