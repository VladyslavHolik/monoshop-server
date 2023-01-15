/*
  Warnings:

  - You are about to drop the column `itemId` on the `Room` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_itemId_fkey";

-- DropIndex
DROP INDEX "Room_itemId_key";

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "itemId";
