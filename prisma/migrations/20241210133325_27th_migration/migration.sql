/*
  Warnings:

  - Added the required column `updated_at` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Artikel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Bimbingan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `ChatPribadi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Dosen` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `DosenPA` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `JadwalDosenPA` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Kaprodi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `LaporanBimbingan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Mahasiswa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `MasterJenisBimbingan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `MasterJurusan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `MasterPeminatan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `MasterSistemBimbingan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `MasterTahunAjaran` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `MenuInformasiAkademik` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `NotifikasiDosenPA` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `NotifikasiKaprodi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `NotifikasiMahasiswa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `PengajuanBimbingan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `PesanChatbotDosenPA` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `PesanChatbotMahasiswa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `PesanChatDosenPA` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `PesanChatMahasiswa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `ResponBot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `SesiChatbotDosenPA` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `SesiChatbotMahasiswa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `SubmenuInformasiAkademik` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `admin` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `artikel` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `bimbingan` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `chatpribadi` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `dosen` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `dosenpa` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `jadwaldosenpa` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `kaprodi` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `laporanbimbingan` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `mahasiswa` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `masterjenisbimbingan` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `masterjurusan` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `masterpeminatan` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `mastersistembimbingan` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `mastertahunajaran` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `menuinformasiakademik` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `notifikasidosenpa` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `notifikasikaprodi` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `notifikasimahasiswa` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `pengajuanbimbingan` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `pesanchatbotdosenpa` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `pesanchatbotmahasiswa` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `pesanchatdosenpa` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `pesanchatmahasiswa` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `responbot` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `sesichatbotdosenpa` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `sesichatbotmahasiswa` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `submenuinformasiakademik` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;
