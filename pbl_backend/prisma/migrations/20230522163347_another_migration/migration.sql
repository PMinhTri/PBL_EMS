/*
  Warnings:

  - You are about to drop the column `JobInformationId` on the `WorkingSkill` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "WorkingSkill" DROP CONSTRAINT "WorkingSkill_JobInformationId_fkey";

-- AlterTable
ALTER TABLE "WorkingSkill" DROP COLUMN "JobInformationId";

-- CreateTable
CREATE TABLE "_JobInformationToWorkingSkill" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_JobInformationToWorkingSkill_AB_unique" ON "_JobInformationToWorkingSkill"("A", "B");

-- CreateIndex
CREATE INDEX "_JobInformationToWorkingSkill_B_index" ON "_JobInformationToWorkingSkill"("B");

-- AddForeignKey
ALTER TABLE "_JobInformationToWorkingSkill" ADD CONSTRAINT "_JobInformationToWorkingSkill_A_fkey" FOREIGN KEY ("A") REFERENCES "JobInformation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobInformationToWorkingSkill" ADD CONSTRAINT "_JobInformationToWorkingSkill_B_fkey" FOREIGN KEY ("B") REFERENCES "WorkingSkill"("id") ON DELETE CASCADE ON UPDATE CASCADE;
