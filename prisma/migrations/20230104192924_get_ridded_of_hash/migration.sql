/*
  Warnings:

  - You are about to drop the column `hash` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `hashedRt` on the `User` table. All the data in the column will be lost.
  - Made the column `fullName` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "hash",
DROP COLUMN "hashedRt",
ALTER COLUMN "fullName" SET NOT NULL,
ALTER COLUMN "password" SET NOT NULL;
