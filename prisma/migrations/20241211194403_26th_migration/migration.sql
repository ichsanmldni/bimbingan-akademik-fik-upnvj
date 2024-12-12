/*
  Warnings:

  - Added the required column `jam_kirim` to the `PesanChatDosenPA` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jam_kirim` to the `PesanChatMahasiswa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `pesanchatdosenpa` ADD COLUMN `jam_kirim` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `pesanchatmahasiswa` ADD COLUMN `jam_kirim` VARCHAR(191) NOT NULL;
