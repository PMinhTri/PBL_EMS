/*
  Warnings:

  - You are about to drop the column `jobHistory` on the `JobInformation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "JobInformation" DROP COLUMN "jobHistory",
ADD COLUMN     "other" TEXT;
