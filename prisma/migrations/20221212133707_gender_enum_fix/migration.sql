/*
  Warnings:

  - You are about to drop the column `Gender` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `Gender` on the `Item` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Category" DROP COLUMN "Gender",
ADD COLUMN     "gender" "Gender";

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "Gender",
ADD COLUMN     "gender" "Gender";
