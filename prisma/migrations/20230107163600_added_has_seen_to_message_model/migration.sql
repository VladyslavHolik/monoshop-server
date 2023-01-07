/*
  Warnings:

  - You are about to drop the column `hasReadByForwarded` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `hasReadByOwner` on the `Room` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "hasSeen" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "hasReadByForwarded",
DROP COLUMN "hasReadByOwner";
