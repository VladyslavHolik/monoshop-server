-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "hasReadByForwarded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasReadByOwner" BOOLEAN NOT NULL DEFAULT false;
