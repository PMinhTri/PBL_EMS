/*
  Warnings:

  - You are about to drop the column `certificate` on the `Education` table. All the data in the column will be lost.
  - You are about to drop the column `degree` on the `Education` table. All the data in the column will be lost.
  - You are about to drop the column `major` on the `Education` table. All the data in the column will be lost.
  - You are about to drop the column `university` on the `Education` table. All the data in the column will be lost.
  - Made the column `grade` on table `Education` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Education" DROP COLUMN "certificate",
DROP COLUMN "degree",
DROP COLUMN "major",
DROP COLUMN "university",
ALTER COLUMN "grade" SET NOT NULL;
