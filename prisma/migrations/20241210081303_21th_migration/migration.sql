/*
  Warnings:

  - You are about to drop the column `jenis_bimbingan_id` on the `laporanbimbingan` table. All the data in the column will be lost.
  - You are about to drop the column `sistem_bimbingan_id` on the `laporanbimbingan` table. All the data in the column will be lost.
  - Added the required column `jenis_bimbingan` to the `LaporanBimbingan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sistem_bimbingan` to the `LaporanBimbingan` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `laporanbimbingan` DROP FOREIGN KEY `LaporanBimbingan_jenis_bimbingan_id_fkey`;

-- DropForeignKey
ALTER TABLE `laporanbimbingan` DROP FOREIGN KEY `LaporanBimbingan_sistem_bimbingan_id_fkey`;

-- AlterTable
ALTER TABLE `laporanbimbingan` DROP COLUMN `jenis_bimbingan_id`,
    DROP COLUMN `sistem_bimbingan_id`,
    ADD COLUMN `jenis_bimbingan` VARCHAR(191) NOT NULL,
    ADD COLUMN `sistem_bimbingan` VARCHAR(191) NOT NULL,
    MODIFY `dokumentasi` VARCHAR(191) NULL;
