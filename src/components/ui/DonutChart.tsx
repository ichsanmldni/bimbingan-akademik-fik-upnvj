// components/DonutChart.js
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

// Mendaftarkan elemen yang diperlukan
Chart.register(ArcElement, Tooltip, Legend);

const DonutChart = () => {
  const data = {
    labels: ["Keuangan", "Magang", "KRS", "Pribadi", "Akademik"],
    datasets: [
      {
        data: [37.4, 30.7, 18.4, 13.5, 0], // Ganti 0 dengan nilai jika ada
        backgroundColor: [
          "rgba(75, 192, 192, 1)", // Keuangan
          "rgba(255, 159, 64, 1)", // Magang
          "rgba(255, 99, 132, 1)", // KRS
          "rgba(54, 162, 235, 1)", // Pribadi
          "rgba(153, 102, 255, 1)", // Akademik
        ],
        borderWidth: 1,
      },
    ],
  };

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

  return <Doughnut data={data} options={options} />;
};

export default DonutChart;
