/*
  Warnings:

  - You are about to drop the column `permasalahan` on the `laporanbimbingan` table. All the data in the column will be lost.
  - You are about to drop the column `solusi` on the `laporanbimbingan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `laporanbimbingan` DROP COLUMN `permasalahan`,
    DROP COLUMN `solusi`;
