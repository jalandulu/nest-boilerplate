-- AlterTable
ALTER TABLE `users` ADD COLUMN `pictureId` INTEGER NULL;

-- CreateTable
CREATE TABLE `stg_directories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `parentId` INTEGER NULL,
    `name` VARCHAR(100) NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `totalFiles` DECIMAL(20, 2) NOT NULL,
    `totalSize` DECIMAL(20, 2) NOT NULL,
    `starred` BOOLEAN NOT NULL DEFAULT false,
    `editable` BOOLEAN NOT NULL DEFAULT true,
    `removable` BOOLEAN NOT NULL DEFAULT true,
    `description` VARCHAR(191) NULL,
    `createdAt` TIMESTAMP(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` TIMESTAMP(6) NULL,
    `deletedAt` TIMESTAMP(6) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stg_files` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fileType` VARCHAR(20) NOT NULL,
    `originalName` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `path` VARCHAR(255) NOT NULL,
    `ext` VARCHAR(20) NOT NULL,
    `size` INTEGER NOT NULL,
    `attributes` JSON NULL,
    `uploadedAt` TIMESTAMP(6) NULL,
    `createdAt` TIMESTAMP(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` TIMESTAMP(6) NULL,
    `deletedAt` TIMESTAMP(6) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stg_file_directories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `directoryId` INTEGER NOT NULL,
    `fileId` INTEGER NOT NULL,
    `dirName` VARCHAR(100) NOT NULL,
    `dirPath` VARCHAR(191) NOT NULL,
    `fileOriginalName` VARCHAR(255) NOT NULL,
    `fileName` VARCHAR(255) NOT NULL,
    `filePath` VARCHAR(255) NOT NULL,
    `ext` VARCHAR(20) NOT NULL,
    `size` INTEGER NOT NULL,
    `attributes` JSON NULL,
    `starred` BOOLEAN NOT NULL DEFAULT false,
    `editable` BOOLEAN NOT NULL DEFAULT true,
    `removable` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` TIMESTAMP(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` TIMESTAMP(6) NULL,
    `deletedAt` TIMESTAMP(6) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `stg_directories` ADD CONSTRAINT `stg_directories_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `stg_directories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stg_file_directories` ADD CONSTRAINT `stg_file_directories_directoryId_fkey` FOREIGN KEY (`directoryId`) REFERENCES `stg_directories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stg_file_directories` ADD CONSTRAINT `stg_file_directories_fileId_fkey` FOREIGN KEY (`fileId`) REFERENCES `stg_files`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_pictureId_fkey` FOREIGN KEY (`pictureId`) REFERENCES `stg_file_directories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
