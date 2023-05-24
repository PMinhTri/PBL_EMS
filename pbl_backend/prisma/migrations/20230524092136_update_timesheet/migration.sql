/*
  Warnings:

  - You are about to drop the column `otHours` on the `TimeSheet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TimeSheet" DROP COLUMN "otHours",
ADD COLUMN     "month" INTEGER,
ADD COLUMN     "otHoursWorked" DOUBLE PRECISION;
