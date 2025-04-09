/*
  Warnings:

  - Added the required column `order` to the `dosentetapfik` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `dosentetapfik` ADD COLUMN `order` INTEGER NOT NULL;
