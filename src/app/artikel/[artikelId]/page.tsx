"use client";

import Logo from "@/components/ui/LogoUPNVJ";
import ProfileImage from "@/components/ui/ProfileImage";
import articleImage from "../../../assets/images/article-image.png";
import backIcon from "../../../assets/images/back-icon-black.png";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import NotificationModal from "@/components/ui/NotificationModal";
import { useRouter } from "next/navigation";
import NotificationButton from "@/components/ui/NotificationButton";
import NavbarUser from "@/components/ui/NavbarUser";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { env } from "process";

interface User {
  id: number;
  role: string;
  // Add other user properties as needed
}

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [roleUser, setRoleUser] = useState<string>("");
  const [dataUser, setDataUser] = useState<User | null>(null);
  const [dataDosenPA, setDataDosenPA] = useState<any[]>([]);
  const [dataKaprodi, setDataKaprodi] = useState<any[]>([]);
  const [dataDosen, setDataDosen] = useState<any[]>([]);
  const [dataMahasiswa, setDataMahasiswa] = useState<any[]>([]);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

  const router = useRouter();

  const handleBack = () => {
    router.push("/artikel");
  };

  const handleNotificationClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const getDataDosenPA = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/datadosenpa`);

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const data = await response.data;
      setDataDosenPA(data);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataKaprodi = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/datakaprodi`);

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const data = await response.data;
      setDataKaprodi(data);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataDosen = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/datadosen`);

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const data = await response.data;
      setDataDosen(data);
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

      const data = await response.data;
      setDataMahasiswa(data);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  useEffect(() => {
    getDataDosenPA();
    getDataKaprodi();
    getDataDosen();
    getDataMahasiswa();
    const cookies = document.cookie.split("; ");
    const authTokenCookie = cookies.find((row) => row.startsWith("authToken="));

    if (authTokenCookie) {
      const token = authTokenCookie.split("=")[1];
      try {
        const decodedToken = jwtDecode<User>(token);
        setDataUser(decodedToken);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (dataUser) {
      if (dataUser.role === "Mahasiswa") {
        setRoleUser("Mahasiswa");
      } else if (dataUser.role === "Dosen") {
        const isDosenPA = dataDosenPA.find(
          (data) => data.dosen_id === dataUser.id
        );
        const isKaprodi = dataKaprodi.find(
          (data) => data.dosen_id === dataUser.id
        );
        if (isDosenPA) {
          setRoleUser("Dosen PA");
        } else if (isKaprodi) {
          setRoleUser("Kaprodi");
        }
      }
    }
  }, [dataUser, dataDosenPA, dataKaprodi]);

  console.log(dataUser);

  return (
    <div>
      <NavbarUser
        roleUser={roleUser}
        dataUser={
          roleUser === "Mahasiswa"
            ? dataMahasiswa.find((data) => data.id === dataUser?.id)
            : roleUser === "Dosen PA" || roleUser === "Kaprodi"
              ? dataDosen.find((data) => data.id === dataUser?.id)
              : ""
        }
      />

      <div className="pt-[100px] mx-32">
        <div className="flex items-center text-[28px] font-semibold gap-2">
          <Image src={backIcon} alt="backIcon" onClick={handleBack} />
          <h1>Penerapan Machine Learning dalam Pengolahan Data Besar</h1>
        </div>
        <Image className="mt-4" src={articleImage} alt="articleImage" />
        <p className="mt-4">15 Agustus 2024</p>
        <p className="mt-4 mb-8">
          Machine learning (ML) dapat digunakan untuk menganalisis dan
          mengekstraksi informasi dari big data melalui algoritma yang
          memungkinkan mesin mempelajari pola, tren, atau wawasan dari data
          dalam skala besar secara otomatis. Penggunaan ini sangat penting
          karena big data seringkali terlalu besar, kompleks, dan bervariasi
          untuk dianalisis secara manual. Berikut adalah cara kerja machine
          learning dalam konteks big data serta contoh penerapannya dalam
          berbagai industri: 1. Proses Machine Learning dalam Big Data a. Data
          Collection and Storage Big data dapat dikumpulkan dari berbagai
          sumber, seperti transaksi online, sensor IoT, media sosial, atau log
          server. Untuk menganalisis big data, penyimpanan yang scalable
          diperlukan, seperti Hadoop atau database berbasis cloud seperti Google
          BigQuery, Amazon S3, atau Snowflake. b. Data Preprocessing Sebelum
          diterapkan ke model machine learning, data perlu diproses untuk
          membersihkan noise atau data yang tidak relevan. Langkah-langkah
          preprocessing meliputi: Data cleaning: Menghapus data yang salah,
          duplikat, atau kosong. Normalization/Scaling: Mengubah skala data
          sehingga nilai dari berbagai fitur seimbang. Feature
          selection/engineering: Memilih dan membuat fitur yang relevan yang
          paling berkontribusi pada hasil analisis. c. Model Training Setelah
          data diproses, model machine learning dapat dilatih untuk mengenali
          pola dalam data. Beberapa jenis algoritma yang umum digunakan dalam
          analisis big data: Supervised Learning: Algoritma seperti regresi
          linear, random forest, dan neural networks digunakan untuk memprediksi
          variabel target dengan menggunakan data berlabel. Unsupervised
          Learning: Algoritma seperti k-means clustering atau PCA digunakan
          untuk menemukan pola tersembunyi atau grup dalam data tanpa label yang
          telah ditentukan sebelumnya. Deep Learning: Algoritma yang menggunakan
          jaringan neural dalam untuk menganalisis data kompleks, seperti
          pengenalan gambar atau pemrosesan bahasa alami (NLP). d. Model
          Evaluation and Tuning Setelah dilatih, model dievaluasi menggunakan
          metrik performa seperti accuracy, precision, recall, atau F1 score.
          Hyperparameter tuning dapat dilakukan untuk mengoptimalkan kinerja
          model. e. Prediction and Insight Extraction Model yang dilatih
          digunakan untuk menganalisis data baru atau mengotomatisasi
          pengambilan keputusan. Wawasan yang diekstrak dapat berupa prediksi
          perilaku konsumen, deteksi anomali, atau klasifikasi item berdasarkan
          karakteristik tertentu. 2. Penerapan Machine Learning dalam Big Data
          di Berbagai Industri a. E-Commerce: Rekomendasi Produk Algoritma yang
          digunakan: Collaborative Filtering, Matrix Factorization, atau Deep
          Learning. Deskripsi: Dalam platform e-commerce seperti Amazon atau
          Tokopedia, big data dari riwayat pembelian, penelusuran, dan
          preferensi pelanggan dianalisis untuk memberikan rekomendasi produk
          yang relevan. Algoritma pembelajaran mendeteksi pola dari interaksi
          pengguna dan mengidentifikasi produk yang berpotensi disukai pengguna.
          Manfaat: Meningkatkan konversi penjualan dan kepuasan pelanggan dengan
          memberikan rekomendasi yang dipersonalisasi. b. Kesehatan: Prediksi
          Penyakit dan Perawatan Personal Algoritma yang digunakan: Decision
          Trees, Random Forest, Deep Learning (CNNs, RNNs). Deskripsi: Rumah
          sakit dan perusahaan teknologi kesehatan seperti IBM Watson
          menganalisis data medis pasien dalam jumlah besar untuk memprediksi
          kemungkinan penyakit, seperti kanker, berdasarkan riwayat medis,
          genetik, dan gaya hidup. Ini juga membantu dalam memilih perawatan
          yang paling efektif. Manfaat: Membantu diagnosis dini, meningkatkan
          hasil perawatan, dan memberikan perawatan yang disesuaikan dengan
          pasien. c. Keuangan: Deteksi Penipuan (Fraud Detection) Algoritma yang
          digunakan: Logistic Regression, Random Forest, Gradient Boosting
          Machines, Neural Networks. Deskripsi: Perusahaan finansial dan
          perbankan, seperti PayPal dan Visa, menggunakan machine learning untuk
          mendeteksi aktivitas mencurigakan dalam transaksi keuangan. Algoritma
          menganalisis pola transaksi pengguna dan mendeteksi anomali yang dapat
          menunjukkan adanya penipuan. Manfaat: Mengurangi risiko keuangan dan
          melindungi pelanggan dari transaksi tidak sah. d. Manufaktur:
          Predictive Maintenance Algoritma yang digunakan: Support Vector
          Machines (SVM), Random Forest, atau Recurrent Neural Networks (RNNs).
          Deskripsi: Dalam industri manufaktur, sensor pada mesin mengumpulkan
          data besar mengenai kinerja peralatan. Machine learning digunakan
          untuk memprediksi kegagalan mesin sebelum terjadi, memungkinkan
          pemeliharaan yang proaktif. Manfaat: Mengurangi downtime dan biaya
          perbaikan, serta meningkatkan efisiensi operasional. e. Transportasi:
          Optimalisasi Rute dan Kendaraan Otonom Algoritma yang digunakan:
          Reinforcement Learning, Deep Learning, dan Algoritma Optimasi.
          Deskripsi: Perusahaan seperti Uber dan Tesla menggunakan data besar
          dari GPS, lalu lintas, dan perilaku pengemudi untuk mengoptimalkan
          rute dan mengurangi waktu tempuh. Pada mobil otonom, big data dari
          sensor dan kamera dianalisis secara real-time untuk menggerakkan
          kendaraan. Manfaat: Mengurangi biaya bahan bakar, waktu pengiriman,
          dan membuat transportasi lebih aman. f. Marketing: Segmentasi
          Pelanggan dan Iklan Algoritma yang digunakan: K-Means Clustering,
          Gaussian Mixture Models (GMM), atau Decision Trees. Deskripsi:
          Perusahaan pemasaran menggunakan machine learning untuk menganalisis
          data dari interaksi pelanggan dengan merek, baik online maupun
          offline. Algoritma ini memungkinkan pengelompokan pelanggan yang
          memiliki preferensi atau kebutuhan serupa, memungkinkan kampanye iklan
          yang lebih terarah dan personal. Manfaat: Meningkatkan efisiensi
          pemasaran dan ROI dengan menargetkan pelanggan yang tepat dengan pesan
          yang relevan. 3. Tantangan dalam Penerapan Machine Learning pada Big
          Data Volume dan Skala Data: Dengan jumlah data yang sangat besar,
          tantangan teknis seperti penyimpanan dan pemrosesan menjadi masalah
          yang perlu diatasi. Infrastruktur yang scalable dan distributed
          processing (seperti Apache Spark) diperlukan. Variety (Keanekaragaman
          Data): Data dapat datang dalam bentuk yang sangat beragam seperti
          teks, gambar, suara, atau data terstruktur dan tidak terstruktur.
          Algoritma harus mampu menangani variasi ini. Data Quality: Big data
          sering mengandung data yang hilang, tidak akurat, atau duplikat,
          sehingga preprocessing yang efektif sangat penting. Model
          Interpretability: Dalam big data, algoritma kompleks seperti deep
          learning sering digunakan, namun interpretasi hasilnya bisa menjadi
          tantangan (black box model). Ini membuat penerapan dalam industri yang
          membutuhkan penjelasan hasil, seperti keuangan dan kesehatan, menjadi
          sulit.
        </p>
      </div>

      <div className="border">
        <div className="flex justify-between mx-32 py-8 border-black border-b">
          <div className="flex gap-5 w-2/5 items-center">
            <Logo className="size-[100px]" />
            <h1 className="text-start font-semibold text-[30px]">
              Bimbingan Konseling Mahasiswa FIK
            </h1>
          </div>
          <div className="flex items-end gap-5">
            <Link href="/informasi-akademik" className="text-[14px]">
              Informasi Akademik
            </Link>
            <Link href="/artikel" className="text-[14px]">
              Artikel
            </Link>
          </div>
        </div>
        <p className="text-center my-8 text-[16px]">
          Hak cipta &copy; 2024 Bimbingan Konseling Mahasiswa FIK UPNVJ
        </p>
      </div>
    </div>
  );
}
