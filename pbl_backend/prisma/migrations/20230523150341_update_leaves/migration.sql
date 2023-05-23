/*
  Warnings:

  - You are about to drop the column `leaveTypeId` on the `Leaves` table. All the data in the column will be lost.
  - Added the required column `session` to the `Leaves` table without a default value. This is not possible if the table is not empty.
  - Made the column `leaveType` on table `Leaves` required. This step will fail if there are existing NULL values in that column.
  - Made the column `leaveDays` on table `Leaves` required. This step will fail if there are existing NULL values in that column.
  - Made the column `startDate` on table `Leaves` required. This step will fail if there are existing NULL values in that column.
  - Made the column `endDate` on table `Leaves` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `Leaves` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Leaves" DROP CONSTRAINT "Leaves_leaveTypeId_fkey";

-- DropIndex
DROP INDEX "Leaves_leaveTypeId_key";

-- AlterTable
ALTER TABLE "Leaves" DROP COLUMN "leaveTypeId",
ADD COLUMN     "session" TEXT NOT NULL,
ALTER COLUMN "leaveType" SET NOT NULL,
ALTER COLUMN "leaveDays" SET NOT NULL,
ALTER COLUMN "startDate" SET NOT NULL,
ALTER COLUMN "endDate" SET NOT NULL,
ALTER COLUMN "status" SET NOT NULL;
