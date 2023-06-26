/*
  Warnings:

  - You are about to drop the `Insurance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_InsuranceToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_InsuranceToUser" DROP CONSTRAINT "_InsuranceToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_InsuranceToUser" DROP CONSTRAINT "_InsuranceToUser_B_fkey";

-- DropTable
DROP TABLE "Insurance";

-- DropTable
DROP TABLE "_InsuranceToUser";
