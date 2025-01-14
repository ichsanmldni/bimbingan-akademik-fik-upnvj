// components/DonutChart.js
import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

const DonutChart = ({ dataBimbingan }) => {
  const [chartData, setChartData] = useState(null); // State untuk menyimpan data chart

  useEffect(() => {
    if (!Array.isArray(dataBimbingan) || dataBimbingan.length === 0) {
      setChartData(null);
      return;
    }

    const labels = [
      ...new Set(
        dataBimbingan
          .filter((item) => item.laporan_bimbingan_id !== null)
          .filter(
            (item) => item.pengajuan_bimbingan.jenis_bimbingan === "Pribadi"
          )
          .map((item) => item.pengajuan_bimbingan.topik_bimbingan)
      ),
    ];
    // Hitung total bimbingan pribadi
    const totalPribadi = dataBimbingan
      .filter((data) => data.laporan_bimbingan_id !== null)
      .filter(
        (data) => data.pengajuan_bimbingan.jenis_bimbingan === "Pribadi"
      ).length;

    if (totalPribadi > 0) {
      // Hitung jumlah tiap topik
      const topicCounts = labels.map((label) => {
        return dataBimbingan
          .filter((data) => data.laporan_bimbingan_id !== null)
          .filter(
            (item) =>
              item.pengajuan_bimbingan.jenis_bimbingan === "Pribadi" &&
              item.pengajuan_bimbingan.topik_bimbingan === label
          ).length;
      });

      // Hitung persentase tiap topik
      const percentages = topicCounts.map(
        (count) => ((count / totalPribadi) * 100).toFixed(1) // Tetap 1 desimal
      );

      console.log(labels);

      // Siapkan data untuk chart
      setChartData({
        labels,
        datasets: [
          {
            data: percentages,
            backgroundColor: labels.map((_, index) => {
              const colors = [
                "rgba(75, 192, 192, 1)", // Keuangan
                "rgba(255, 159, 64, 1)", // Magang
                "rgba(255, 99, 132, 1)", // KRS
                "rgba(54, 162, 235, 1)", // Personal
                "rgba(153, 102, 255, 1)", // Akademik
              ];
              return colors[index % colors.length]; // Loop warna jika jumlah topik lebih banyak
            }),
            borderWidth: 1,
          },
        ],
      });
    } else {
      setChartData(null);
    }
  }, [dataBimbingan]);

  const options = {
    layout: {},
    plugins: {
      legend: {
        position: "bottom" as
          | "center"
          | "top"
          | "right"
          | "bottom"
          | "left"
          | "chartArea",
        labels: {
          padding: 20,
          color: "black",
        },
      },
    },
  };
  return (
    <div className="flex flex-col">
      {chartData ? (
        <div className="max-w-[320px] mx-auto mb-4">
          <Doughnut data={chartData} options={options} />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 border rounded-lg max-w-[480px] mb-12 p-4 mx-auto">
          <svg
            className="h-12 w-12 text-red-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <p className="text-center text-sm text-gray-500">
            {!dataBimbingan || dataBimbingan.length === 0
              ? "Data bimbingan tidak tersedia"
              : "Tidak ada data bimbingan pribadi"}
          </p>
          <p className="text-center text-sm text-gray-500">
            {!dataBimbingan || dataBimbingan.length === 0
              ? "Tunggu hingga data bimbingan tersedia"
              : "Tunggu hingga Mahasiswa mengajukan bimbingan pribadi dan Dosen PA melaporkan bimbingan!"}
          </p>
        </div>
      )}
    </div>
  );
};

export default DonutChart;
