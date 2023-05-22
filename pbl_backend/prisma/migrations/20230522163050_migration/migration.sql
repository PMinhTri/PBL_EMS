/*
  Warnings:

  - You are about to drop the column `employmentStatus` on the `JobInformation` table. All the data in the column will be lost.
  - You are about to drop the `workingSkill` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "workingSkill" DROP CONSTRAINT "workingSkill_JobInformationId_fkey";

-- AlterTable
ALTER TABLE "JobInformation" DROP COLUMN "employmentStatus",
ADD COLUMN     "employeeStatus" TEXT;

-- DropTable
DROP TABLE "workingSkill";

-- CreateTable
CREATE TABLE "WorkingSkill" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "JobInformationId" INTEGER NOT NULL,

    CONSTRAINT "WorkingSkill_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WorkingSkill" ADD CONSTRAINT "WorkingSkill_JobInformationId_fkey" FOREIGN KEY ("JobInformationId") REFERENCES "JobInformation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
