-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('SEND_WAIT', 'ON_THE_WAY', 'PICKUP_WAIT', 'DELIVERED');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'SEND_WAIT';
