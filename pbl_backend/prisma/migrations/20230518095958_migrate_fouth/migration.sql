/*
  Warnings:

  - You are about to drop the column `office` on the `JobInformation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "JobInformation" DROP COLUMN "office",
ADD COLUMN     "department" TEXT;
