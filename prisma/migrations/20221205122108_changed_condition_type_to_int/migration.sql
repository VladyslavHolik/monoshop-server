/*
  Warnings:

  - You are about to drop the `Condition` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `condition` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Condition" DROP CONSTRAINT "Condition_itemId_fkey";

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "condition" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Condition";
