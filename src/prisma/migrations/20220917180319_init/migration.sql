-- DropForeignKey
ALTER TABLE "account" DROP CONSTRAINT "account_userId_fkey";

-- DropForeignKey
ALTER TABLE "book" DROP CONSTRAINT "book_author_fkey";

-- DropForeignKey
ALTER TABLE "book" DROP CONSTRAINT "book_category_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_explanationsId_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_userId_fkey";

-- DropForeignKey
ALTER TABLE "explanations" DROP CONSTRAINT "explanations_bookId_fkey";

-- DropForeignKey
ALTER TABLE "explanations" DROP CONSTRAINT "explanations_userId_fkey";

-- DropForeignKey
ALTER TABLE "finished_books" DROP CONSTRAINT "finished_books_bookId_fkey";

-- DropForeignKey
ALTER TABLE "finished_books" DROP CONSTRAINT "finished_books_userId_fkey";

-- DropForeignKey
ALTER TABLE "followers" DROP CONSTRAINT "followers_userId_fkey";

-- DropForeignKey
ALTER TABLE "new_comments" DROP CONSTRAINT "new_comments_bookId_fkey";

-- DropForeignKey
ALTER TABLE "profile" DROP CONSTRAINT "profile_userId_fkey";

-- DropForeignKey
ALTER TABLE "reading" DROP CONSTRAINT "reading_bookId_fkey";

-- DropForeignKey
ALTER TABLE "reading" DROP CONSTRAINT "reading_userId_fkey";

-- DropForeignKey
ALTER TABLE "upload_keys" DROP CONSTRAINT "upload_keys_userId_fkey";

-- DropForeignKey
ALTER TABLE "user_interest" DROP CONSTRAINT "user_interest_userId_fkey";

-- AddForeignKey
ALTER TABLE "profile" ADD CONSTRAINT "profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_interest" ADD CONSTRAINT "user_interest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "book" ADD CONSTRAINT "book_author_fkey" FOREIGN KEY ("author") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "book" ADD CONSTRAINT "book_category_fkey" FOREIGN KEY ("category") REFERENCES "interest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "followers" ADD CONSTRAINT "followers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reading" ADD CONSTRAINT "reading_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reading" ADD CONSTRAINT "reading_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finished_books" ADD CONSTRAINT "finished_books_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finished_books" ADD CONSTRAINT "finished_books_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "explanations" ADD CONSTRAINT "explanations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "explanations" ADD CONSTRAINT "explanations_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_explanationsId_fkey" FOREIGN KEY ("explanationsId") REFERENCES "explanations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "new_comments" ADD CONSTRAINT "new_comments_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "upload_keys" ADD CONSTRAINT "upload_keys_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "account.accountNumber_unique" RENAME TO "account_accountNumber_key";

-- RenameIndex
ALTER INDEX "account.userId_unique" RENAME TO "account_userId_key";

-- RenameIndex
ALTER INDEX "book.bookNumber_unique" RENAME TO "book_bookNumber_key";

-- RenameIndex
ALTER INDEX "followers.userId_unique" RENAME TO "followers_userId_key";

-- RenameIndex
ALTER INDEX "interest.field_unique" RENAME TO "interest_field_key";

-- RenameIndex
ALTER INDEX "new_comments.bookId_unique" RENAME TO "new_comments_bookId_key";

-- RenameIndex
ALTER INDEX "plans.amount_unique" RENAME TO "plans_amount_key";

-- RenameIndex
ALTER INDEX "plans.name_unique" RENAME TO "plans_name_key";

-- RenameIndex
ALTER INDEX "plans.plan_code_unique" RENAME TO "plans_plan_code_key";

-- RenameIndex
ALTER INDEX "plans.view_amount_unique" RENAME TO "plans_view_amount_key";

-- RenameIndex
ALTER INDEX "profile.userId_unique" RENAME TO "profile_userId_key";

-- RenameIndex
ALTER INDEX "profile.username_unique" RENAME TO "profile_username_key";

-- RenameIndex
ALTER INDEX "rule.type_unique" RENAME TO "rule_type_key";

-- RenameIndex
ALTER INDEX "token.email_unique" RENAME TO "token_email_key";

-- RenameIndex
ALTER INDEX "upload_keys.key_unique" RENAME TO "upload_keys_key_key";

-- RenameIndex
ALTER INDEX "upload_keys.userId_unique" RENAME TO "upload_keys_userId_key";

-- RenameIndex
ALTER INDEX "user.email_unique" RENAME TO "user_email_key";

-- RenameIndex
ALTER INDEX "user.reset_unique" RENAME TO "user_reset_key";

-- RenameIndex
ALTER INDEX "user_interest.userId_unique" RENAME TO "user_interest_userId_key";
