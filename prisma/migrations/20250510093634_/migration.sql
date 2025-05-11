-- AlterTable
ALTER TABLE `admin` MODIFY `profile_image` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `bimbingan` MODIFY `ttd_kehadiran` LONGTEXT NULL,
    MODIFY `dokumentasi_kehadiran` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `dosenpa` MODIFY `profile_image` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `kaprodi` MODIFY `profile_image` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `laporanbimbingan` MODIFY `tanda_tangan_dosen_pa` LONGTEXT NULL,
    MODIFY `dokumentasi` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `mahasiswa` MODIFY `profile_image` LONGTEXT NULL;
