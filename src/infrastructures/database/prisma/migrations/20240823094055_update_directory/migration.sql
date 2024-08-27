/*
  Warnings:

  - You are about to drop the column `uploadedAt` on the `stg_files` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `stg_directories` MODIFY `totalFiles` DECIMAL(20, 2) NOT NULL DEFAULT 0,
    MODIFY `totalSize` DECIMAL(20, 2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `stg_files` DROP COLUMN `uploadedAt`;
