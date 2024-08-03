-- AlterTable
ALTER TABLE "user" ADD COLUMN     "boughtBooks" TEXT[];

-- CreateTable
CREATE TABLE "bookTransactions" (
    "id" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "buyer" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookTransactions_pkey" PRIMARY KEY ("id")
);
