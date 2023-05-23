/*
  Warnings:

  - You are about to drop the `_JobInformationToWorkingSkill` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[jobInformationId]` on the table `WorkingSkill` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "_JobInformationToWorkingSkill" DROP CONSTRAINT "_JobInformationToWorkingSkill_A_fkey";

-- DropForeignKey
ALTER TABLE "_JobInformationToWorkingSkill" DROP CONSTRAINT "_JobInformationToWorkingSkill_B_fkey";

-- AlterTable
ALTER TABLE "WorkingSkill" ADD COLUMN     "description" TEXT,
ADD COLUMN     "jobInformationId" INTEGER;

-- DropTable
DROP TABLE "_JobInformationToWorkingSkill";

-- CreateIndex
CREATE UNIQUE INDEX "WorkingSkill_jobInformationId_key" ON "WorkingSkill"("jobInformationId");

-- AddForeignKey
ALTER TABLE "WorkingSkill" ADD CONSTRAINT "WorkingSkill_jobInformationId_fkey" FOREIGN KEY ("jobInformationId") REFERENCES "JobInformation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
