/*
  Warnings:

  - A unique constraint covering the columns `[path]` on the table `stg_directories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[path]` on the table `stg_files` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `stg_directories_path_key` ON `stg_directories`(`path`);

-- CreateIndex
CREATE UNIQUE INDEX `stg_files_path_key` ON `stg_files`(`path`);
