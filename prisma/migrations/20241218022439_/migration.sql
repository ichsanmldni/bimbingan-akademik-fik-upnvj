/*
  Warnings:

  - You are about to drop the column `tanggal` on the `notifikasidosenpa` table. All the data in the column will be lost.
  - You are about to drop the column `tanggal` on the `notifikasikaprodi` table. All the data in the column will be lost.
  - You are about to drop the column `tanggal` on the `notifikasimahasiswa` table. All the data in the column will be lost.
  - Added the required column `waktu` to the `notifikasidosenpa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `waktu` to the `notifikasikaprodi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `waktu` to the `notifikasimahasiswa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mahasiswa_id` to the `pengajuanbimbingan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `notifikasidosenpa` DROP COLUMN `tanggal`,
    ADD COLUMN `waktu` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `notifikasikaprodi` DROP COLUMN `tanggal`,
    ADD COLUMN `waktu` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `notifikasimahasiswa` DROP COLUMN `tanggal`,
    ADD COLUMN `waktu` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `pengajuanbimbingan` ADD COLUMN `mahasiswa_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `pengajuanbimbingan` ADD CONSTRAINT `PengajuanBimbingan_mahasiswa_id_fkey` FOREIGN KEY (`mahasiswa_id`) REFERENCES `mahasiswa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
