/*
  Warnings:

  - Added the required column `reference` to the `book_transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "book_transactions" ADD COLUMN     "reference" TEXT NOT NULL;
