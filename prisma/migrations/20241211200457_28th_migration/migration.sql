/*
  Warnings:

  - You are about to drop the column `jam_kirim` on the `pesanchatdosenpa` table. All the data in the column will be lost.
  - You are about to drop the column `jam_kirim` on the `pesanchatmahasiswa` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `pesanchatdosenpa` DROP COLUMN `jam_kirim`;

-- AlterTable
ALTER TABLE `pesanchatmahasiswa` DROP COLUMN `jam_kirim`;
