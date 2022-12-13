-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('WOMEN', 'MEN');

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "Gender" "Gender";

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "Gender" "Gender";
