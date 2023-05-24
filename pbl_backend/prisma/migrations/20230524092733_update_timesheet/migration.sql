/*
  Warnings:

  - The `checkIn` column on the `TimeSheet` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `checkOut` column on the `TimeSheet` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "TimeSheet" DROP COLUMN "checkIn",
ADD COLUMN     "checkIn" INTEGER,
DROP COLUMN "checkOut",
ADD COLUMN     "checkOut" INTEGER;
