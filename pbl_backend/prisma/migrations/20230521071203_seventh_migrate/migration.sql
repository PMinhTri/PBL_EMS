/*
  Warnings:

  - You are about to drop the column `department` on the `JobInformation` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `JobInformation` table. All the data in the column will be lost.
  - You are about to drop the column `jobTitle` on the `JobInformation` table. All the data in the column will be lost.
  - You are about to drop the column `project` on the `JobInformation` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `JobInformation` table. All the data in the column will be lost.
  - You are about to drop the column `workingSkills` on the `JobInformation` table. All the data in the column will be lost.
  - You are about to drop the column `degree` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `education` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `major` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `HealthCare` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "HealthCare" DROP CONSTRAINT "HealthCare_userId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_projectId_fkey";

-- AlterTable
ALTER TABLE "JobInformation" DROP COLUMN "department",
DROP COLUMN "description",
DROP COLUMN "jobTitle",
DROP COLUMN "project",
DROP COLUMN "status",
DROP COLUMN "workingSkills";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "degree",
DROP COLUMN "education",
DROP COLUMN "major",
DROP COLUMN "projectId",
ADD COLUMN     "citizenId" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "educationId" INTEGER;

-- DropTable
DROP TABLE "HealthCare";

-- CreateTable
CREATE TABLE "JobTitle" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "JobInformationId" INTEGER NOT NULL,

    CONSTRAINT "JobTitle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workingSkill" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "JobInformationId" INTEGER NOT NULL,

    CONSTRAINT "workingSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "JobInformationId" INTEGER NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Insurance" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "insuranceId" INTEGER NOT NULL,
    "provideDate" TIMESTAMP(3) NOT NULL,
    "expiredDate" TIMESTAMP(3) NOT NULL,
    "provideLocation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Insurance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Education" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "grade" TEXT,
    "university" TEXT,
    "major" TEXT,
    "certificate" TEXT,
    "degree" TEXT,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_JobInformationToProject" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "JobTitle_JobInformationId_key" ON "JobTitle"("JobInformationId");

-- CreateIndex
CREATE UNIQUE INDEX "Department_JobInformationId_key" ON "Department"("JobInformationId");

-- CreateIndex
CREATE UNIQUE INDEX "Insurance_userId_key" ON "Insurance"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Education_userId_key" ON "Education"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_JobInformationToProject_AB_unique" ON "_JobInformationToProject"("A", "B");

-- CreateIndex
CREATE INDEX "_JobInformationToProject_B_index" ON "_JobInformationToProject"("B");

-- AddForeignKey
ALTER TABLE "JobTitle" ADD CONSTRAINT "JobTitle_JobInformationId_fkey" FOREIGN KEY ("JobInformationId") REFERENCES "JobInformation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workingSkill" ADD CONSTRAINT "workingSkill_JobInformationId_fkey" FOREIGN KEY ("JobInformationId") REFERENCES "JobInformation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_JobInformationId_fkey" FOREIGN KEY ("JobInformationId") REFERENCES "JobInformation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Insurance" ADD CONSTRAINT "Insurance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Education" ADD CONSTRAINT "Education_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobInformationToProject" ADD CONSTRAINT "_JobInformationToProject_A_fkey" FOREIGN KEY ("A") REFERENCES "JobInformation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobInformationToProject" ADD CONSTRAINT "_JobInformationToProject_B_fkey" FOREIGN KEY ("B") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
