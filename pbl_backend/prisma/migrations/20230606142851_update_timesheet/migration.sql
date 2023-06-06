/*
  Warnings:

  - Added the required column `timeIn` to the `TimeSheet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TimeSheet" ADD COLUMN     "timeIn" TIMESTAMP(3) NOT NULL;
