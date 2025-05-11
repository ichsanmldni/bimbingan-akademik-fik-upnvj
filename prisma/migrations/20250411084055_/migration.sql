-- DropForeignKey
ALTER TABLE `bimbingan` DROP FOREIGN KEY `Bimbingan_laporan_bimbingan_id_fkey`;

-- DropForeignKey
ALTER TABLE `bimbingan` DROP FOREIGN KEY `Bimbingan_pengajuan_bimbingan_id_fkey`;

-- DropForeignKey
ALTER TABLE `chatpribadi` DROP FOREIGN KEY `ChatPribadi_dosen_pa_id_fkey`;

-- DropForeignKey
ALTER TABLE `chatpribadi` DROP FOREIGN KEY `ChatPribadi_mahasiswa_id_fkey`;

-- DropForeignKey
ALTER TABLE `datastatusmahasiswa` DROP FOREIGN KEY `DataStatusMahasiswa_laporan_bimbingan_id_fkey`;

-- DropForeignKey
ALTER TABLE `jadwaldosenpa` DROP FOREIGN KEY `JadwalDosenPA_dosen_pa_id_fkey`;

-- DropForeignKey
ALTER TABLE `laporanbimbingan` DROP FOREIGN KEY `LaporanBimbingan_dosen_pa_id_fkey`;

-- DropForeignKey
ALTER TABLE `laporanbimbingan` DROP FOREIGN KEY `LaporanBimbingan_kaprodi_id_fkey`;

-- DropForeignKey
ALTER TABLE `mahasiswa` DROP FOREIGN KEY `Mahasiswa_dosen_pa_id_fkey`;

-- DropForeignKey
ALTER TABLE `mastersubbabinformasiakademik` DROP FOREIGN KEY `mastersubbabinformasiakademik_bab_informasi_akademik_id_fkey`;

-- DropForeignKey
ALTER TABLE `notifikasidosenpa` DROP FOREIGN KEY `NotifikasiDosenPA_dosen_pa_id_fkey`;

-- DropForeignKey
ALTER TABLE `notifikasikaprodi` DROP FOREIGN KEY `NotifikasiKaprodi_kaprodi_id_fkey`;

-- DropForeignKey
ALTER TABLE `notifikasimahasiswa` DROP FOREIGN KEY `NotifikasiMahasiswa_mahasiswa_id_fkey`;

-- DropForeignKey
ALTER TABLE `pengajuanbimbingan` DROP FOREIGN KEY `PengajuanBimbingan_dosen_pa_id_fkey`;

-- DropForeignKey
ALTER TABLE `pengajuanbimbingan` DROP FOREIGN KEY `PengajuanBimbingan_mahasiswa_id_fkey`;

-- DropForeignKey
ALTER TABLE `pesanbot` DROP FOREIGN KEY `PesanBot_sesi_chatbot_mahasiswa_id_fkey`;

-- DropForeignKey
ALTER TABLE `pesanchatbotmahasiswa` DROP FOREIGN KEY `PesanChatbotMahasiswa_sesi_chatbot_mahasiswa_id_fkey`;

-- DropForeignKey
ALTER TABLE `pesanchatdosenpa` DROP FOREIGN KEY `PesanChatDosenPA_chat_pribadi_id_fkey`;

-- DropForeignKey
ALTER TABLE `pesanchatmahasiswa` DROP FOREIGN KEY `PesanChatMahasiswa_chat_pribadi_id_fkey`;

-- DropForeignKey
ALTER TABLE `pesanchatsiaran` DROP FOREIGN KEY `PesanChatSiaran_pesan_siaran_id_fkey`;

-- DropForeignKey
ALTER TABLE `pesansiaran` DROP FOREIGN KEY `PesanSiaran_dosen_pa_id_fkey`;

-- DropForeignKey
ALTER TABLE `prestasiilmiahmahasiswa` DROP FOREIGN KEY `PrestasiIlmiahMahasiswa_laporan_bimbingan_id_fkey`;

-- DropForeignKey
ALTER TABLE `prestasiporsenimahasiswa` DROP FOREIGN KEY `PrestasiPorseniMahasiswa_laporan_bimbingan_id_fkey`;

-- DropForeignKey
ALTER TABLE `riwayatpesanchatbot` DROP FOREIGN KEY `riwayatpesanchatbot_sesi_chatbot_mahasiswa_id_fkey`;

-- DropForeignKey
ALTER TABLE `sesichatbotmahasiswa` DROP FOREIGN KEY `SesiChatbotMahasiswa_mahasiswa_id_fkey`;

-- DropForeignKey
ALTER TABLE `statuspembacaanpesansiaran` DROP FOREIGN KEY `statuspembacaanpesansiaran_mahasiswa_id_fkey`;

-- DropForeignKey
ALTER TABLE `statuspembacaanpesansiaran` DROP FOREIGN KEY `statuspembacaanpesansiaran_pesan_siaran_id_fkey`;

-- AlterTable
ALTER TABLE `chatpribadi` ADD COLUMN `isDeleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `dosenpa` ADD COLUMN `isDeleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `kaprodi` ADD COLUMN `isDeleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `laporanbimbingan` ADD COLUMN `isDeleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `mahasiswa` ADD COLUMN `isDeleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `pengajuanbimbingan` ADD COLUMN `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `dosen_pa_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `pesansiaran` ADD COLUMN `isDeleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `sesichatbotmahasiswa` ADD COLUMN `isDeleted` BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE `bimbingan` ADD CONSTRAINT `bimbingan_laporan_bimbingan_id_fkey` FOREIGN KEY (`laporan_bimbingan_id`) REFERENCES `laporanbimbingan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bimbingan` ADD CONSTRAINT `bimbingan_pengajuan_bimbingan_id_fkey` FOREIGN KEY (`pengajuan_bimbingan_id`) REFERENCES `pengajuanbimbingan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chatpribadi` ADD CONSTRAINT `chatpribadi_dosen_pa_id_fkey` FOREIGN KEY (`dosen_pa_id`) REFERENCES `dosenpa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chatpribadi` ADD CONSTRAINT `chatpribadi_mahasiswa_id_fkey` FOREIGN KEY (`mahasiswa_id`) REFERENCES `mahasiswa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pesansiaran` ADD CONSTRAINT `pesansiaran_dosen_pa_id_fkey` FOREIGN KEY (`dosen_pa_id`) REFERENCES `dosenpa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `statuspembacaanpesansiaran` ADD CONSTRAINT `statuspembacaanpesansiaran_pesan_siaran_id_fkey` FOREIGN KEY (`pesan_siaran_id`) REFERENCES `pesansiaran`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `statuspembacaanpesansiaran` ADD CONSTRAINT `statuspembacaanpesansiaran_mahasiswa_id_fkey` FOREIGN KEY (`mahasiswa_id`) REFERENCES `mahasiswa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pesanchatsiaran` ADD CONSTRAINT `pesanchatsiaran_pesan_siaran_id_fkey` FOREIGN KEY (`pesan_siaran_id`) REFERENCES `pesansiaran`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `jadwaldosenpa` ADD CONSTRAINT `jadwaldosenpa_dosen_pa_id_fkey` FOREIGN KEY (`dosen_pa_id`) REFERENCES `dosenpa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `laporanbimbingan` ADD CONSTRAINT `laporanbimbingan_kaprodi_id_fkey` FOREIGN KEY (`kaprodi_id`) REFERENCES `kaprodi`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `laporanbimbingan` ADD CONSTRAINT `laporanbimbingan_dosen_pa_id_fkey` FOREIGN KEY (`dosen_pa_id`) REFERENCES `dosenpa`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `datastatusmahasiswa` ADD CONSTRAINT `datastatusmahasiswa_laporan_bimbingan_id_fkey` FOREIGN KEY (`laporan_bimbingan_id`) REFERENCES `laporanbimbingan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `prestasiilmiahmahasiswa` ADD CONSTRAINT `prestasiilmiahmahasiswa_laporan_bimbingan_id_fkey` FOREIGN KEY (`laporan_bimbingan_id`) REFERENCES `laporanbimbingan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `prestasiporsenimahasiswa` ADD CONSTRAINT `prestasiporsenimahasiswa_laporan_bimbingan_id_fkey` FOREIGN KEY (`laporan_bimbingan_id`) REFERENCES `laporanbimbingan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mahasiswa` ADD CONSTRAINT `mahasiswa_dosen_pa_id_fkey` FOREIGN KEY (`dosen_pa_id`) REFERENCES `dosenpa`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifikasidosenpa` ADD CONSTRAINT `notifikasidosenpa_dosen_pa_id_fkey` FOREIGN KEY (`dosen_pa_id`) REFERENCES `dosenpa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifikasikaprodi` ADD CONSTRAINT `notifikasikaprodi_kaprodi_id_fkey` FOREIGN KEY (`kaprodi_id`) REFERENCES `kaprodi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifikasimahasiswa` ADD CONSTRAINT `notifikasimahasiswa_mahasiswa_id_fkey` FOREIGN KEY (`mahasiswa_id`) REFERENCES `mahasiswa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pengajuanbimbingan` ADD CONSTRAINT `pengajuanbimbingan_dosen_pa_id_fkey` FOREIGN KEY (`dosen_pa_id`) REFERENCES `dosenpa`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pengajuanbimbingan` ADD CONSTRAINT `pengajuanbimbingan_mahasiswa_id_fkey` FOREIGN KEY (`mahasiswa_id`) REFERENCES `mahasiswa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pesanbot` ADD CONSTRAINT `pesanbot_sesi_chatbot_mahasiswa_id_fkey` FOREIGN KEY (`sesi_chatbot_mahasiswa_id`) REFERENCES `sesichatbotmahasiswa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pesanchatbotmahasiswa` ADD CONSTRAINT `pesanchatbotmahasiswa_sesi_chatbot_mahasiswa_id_fkey` FOREIGN KEY (`sesi_chatbot_mahasiswa_id`) REFERENCES `sesichatbotmahasiswa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pesanchatdosenpa` ADD CONSTRAINT `pesanchatdosenpa_chat_pribadi_id_fkey` FOREIGN KEY (`chat_pribadi_id`) REFERENCES `chatpribadi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pesanchatmahasiswa` ADD CONSTRAINT `pesanchatmahasiswa_chat_pribadi_id_fkey` FOREIGN KEY (`chat_pribadi_id`) REFERENCES `chatpribadi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sesichatbotmahasiswa` ADD CONSTRAINT `sesichatbotmahasiswa_mahasiswa_id_fkey` FOREIGN KEY (`mahasiswa_id`) REFERENCES `mahasiswa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `riwayatpesanchatbot` ADD CONSTRAINT `riwayatpesanchatbot_sesi_chatbot_mahasiswa_id_fkey` FOREIGN KEY (`sesi_chatbot_mahasiswa_id`) REFERENCES `sesichatbotmahasiswa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mastersubbabinformasiakademik` ADD CONSTRAINT `mastersubbabinformasiakademik_bab_informasi_akademik_id_fkey` FOREIGN KEY (`bab_informasi_akademik_id`) REFERENCES `masterbabinformasiakademik`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
