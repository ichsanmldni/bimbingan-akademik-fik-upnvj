/*
  Warnings:

  - You are about to alter the column `reset_token_expires` on the `dosenpa` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.
  - You are about to alter the column `reset_token_expires` on the `kaprodi` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `dosenpa` MODIFY `reset_token_expires` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `kaprodi` MODIFY `reset_token_expires` DATETIME(3) NULL;
