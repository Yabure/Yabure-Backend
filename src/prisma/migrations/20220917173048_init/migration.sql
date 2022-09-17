/*
  Warnings:

  - A unique constraint covering the columns `[reset]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `last_read` to the `finished_books` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_read` to the `reading` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'MODERATOR');

-- DropIndex
DROP INDEX "reading.userId_unique";

-- DropIndex
DROP INDEX "finished_books.userId_unique";

-- AlterTable
ALTER TABLE "finished_books" ADD COLUMN     "last_read" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "reading" ADD COLUMN     "last_read" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "devices" TEXT[],
ADD COLUMN     "subscribed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "can_upload" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "plan_code" TEXT,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT E'USER',
ADD COLUMN     "expire" TEXT,
ADD COLUMN     "reset" TEXT;

-- CreateTable
CREATE TABLE "explanations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "explanationsId" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "replies" JSONB[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plans" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "interval" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "view_amount" TEXT NOT NULL,
    "plan_code" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "message" TEXT[],
    "recipient" TEXT NOT NULL,
    "read" TEXT NOT NULL,
    "url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "new_comments" (
    "id" TEXT NOT NULL,
    "comments" JSONB[],
    "bookId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "upload_keys" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "plans.name_unique" ON "plans"("name");

-- CreateIndex
CREATE UNIQUE INDEX "plans.amount_unique" ON "plans"("amount");

-- CreateIndex
CREATE UNIQUE INDEX "plans.view_amount_unique" ON "plans"("view_amount");

-- CreateIndex
CREATE UNIQUE INDEX "plans.plan_code_unique" ON "plans"("plan_code");

-- CreateIndex
CREATE UNIQUE INDEX "new_comments.bookId_unique" ON "new_comments"("bookId");

-- CreateIndex
CREATE UNIQUE INDEX "upload_keys.key_unique" ON "upload_keys"("key");

-- CreateIndex
CREATE UNIQUE INDEX "upload_keys.userId_unique" ON "upload_keys"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user.reset_unique" ON "user"("reset");

-- AddForeignKey
ALTER TABLE "explanations" ADD FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "explanations" ADD FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD FOREIGN KEY ("explanationsId") REFERENCES "explanations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "new_comments" ADD FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "upload_keys" ADD FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finished_books" ADD FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reading" ADD FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD FOREIGN KEY ("plan_code") REFERENCES "plans"("plan_code") ON DELETE SET NULL ON UPDATE CASCADE;
