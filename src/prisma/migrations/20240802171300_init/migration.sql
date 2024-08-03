/*
  Warnings:

  - You are about to drop the `bookTransactions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "bookTransactions";

-- CreateTable
CREATE TABLE "book_transactions" (
    "id" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "buyer" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "book_transactions_pkey" PRIMARY KEY ("id")
);
