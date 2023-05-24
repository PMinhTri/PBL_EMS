/*
  Warnings:

  - You are about to drop the column `checkIn` on the `TimeSheet` table. All the data in the column will be lost.
  - You are about to drop the column `checkOut` on the `TimeSheet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TimeSheet" DROP COLUMN "checkIn",
DROP COLUMN "checkOut",
ADD COLUMN     "checkInDate" INTEGER,
ADD COLUMN     "checkOutDate" INTEGER;
