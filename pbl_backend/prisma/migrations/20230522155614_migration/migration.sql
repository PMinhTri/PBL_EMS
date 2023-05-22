/*
  Warnings:

  - You are about to drop the column `JobInformationId` on the `Department` table. All the data in the column will be lost.
  - You are about to drop the column `JobInformationId` on the `JobTitle` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[jobTitleId]` on the table `JobInformation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[departmentId]` on the table `JobInformation` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Department" DROP CONSTRAINT "Department_JobInformationId_fkey";

-- DropForeignKey
ALTER TABLE "JobTitle" DROP CONSTRAINT "JobTitle_JobInformationId_fkey";

-- DropIndex
DROP INDEX "Department_JobInformationId_key";

-- DropIndex
DROP INDEX "JobTitle_JobInformationId_key";

-- AlterTable
ALTER TABLE "Department" DROP COLUMN "JobInformationId";

-- AlterTable
ALTER TABLE "JobInformation" ADD COLUMN     "departmentId" INTEGER,
ADD COLUMN     "jobTitleId" INTEGER;

-- AlterTable
ALTER TABLE "JobTitle" DROP COLUMN "JobInformationId";

-- CreateIndex
CREATE UNIQUE INDEX "JobInformation_jobTitleId_key" ON "JobInformation"("jobTitleId");

-- CreateIndex
CREATE UNIQUE INDEX "JobInformation_departmentId_key" ON "JobInformation"("departmentId");

-- AddForeignKey
ALTER TABLE "JobInformation" ADD CONSTRAINT "JobInformation_jobTitleId_fkey" FOREIGN KEY ("jobTitleId") REFERENCES "JobTitle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobInformation" ADD CONSTRAINT "JobInformation_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;
