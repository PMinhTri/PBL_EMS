/*
  Warnings:

  - You are about to drop the `Payrol` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TimeKeeping` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Payrol" DROP CONSTRAINT "Payrol_userId_fkey";

-- DropForeignKey
ALTER TABLE "TimeKeeping" DROP CONSTRAINT "TimeKeeping_userId_fkey";

-- DropTable
DROP TABLE "Payrol";

-- DropTable
DROP TABLE "TimeKeeping";

-- CreateTable
CREATE TABLE "TimeSheet" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "checkIn" TIMESTAMP(3),
    "checkOut" TIMESTAMP(3),
    "hoursWorked" DOUBLE PRECISION,
    "otHours" DOUBLE PRECISION,
    "status" TEXT,
    "year" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TimeSheet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payroll" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "month" INTEGER,
    "year" INTEGER,
    "basicSalary" DOUBLE PRECISION,
    "totalSalary" DOUBLE PRECISION,
    "additional" DOUBLE PRECISION,
    "status" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payroll_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TimeSheet" ADD CONSTRAINT "TimeSheet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payroll" ADD CONSTRAINT "Payroll_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
