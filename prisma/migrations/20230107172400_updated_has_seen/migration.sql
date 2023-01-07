/*
  Warnings:

  - You are about to drop the `_hasSeen` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_hasSeen" DROP CONSTRAINT "_hasSeen_A_fkey";

-- DropForeignKey
ALTER TABLE "_hasSeen" DROP CONSTRAINT "_hasSeen_B_fkey";

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "delivered" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "markedSeen" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "_hasSeen";
