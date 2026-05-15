/*
  Warnings:

  - The values [locked,unlocked,completed] on the enum `ProgressStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProgressStatus_new" AS ENUM ('LOCKED', 'IN_PROGRESS', 'COMPLETED', 'FAILED');
ALTER TABLE "UserProgress" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "UserProgress" ALTER COLUMN "status" TYPE "ProgressStatus_new" USING ("status"::text::"ProgressStatus_new");
ALTER TYPE "ProgressStatus" RENAME TO "ProgressStatus_old";
ALTER TYPE "ProgressStatus_new" RENAME TO "ProgressStatus";
DROP TYPE "ProgressStatus_old";
ALTER TABLE "UserProgress" ALTER COLUMN "status" SET DEFAULT 'LOCKED';
COMMIT;

-- AlterTable
ALTER TABLE "UserProgress" ADD COLUMN     "answers" JSONB,
ALTER COLUMN "status" SET DEFAULT 'LOCKED';
