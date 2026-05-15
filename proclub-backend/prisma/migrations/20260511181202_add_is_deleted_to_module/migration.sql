-- AlterTable
ALTER TABLE "Module" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;
