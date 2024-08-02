-- AlterTable
ALTER TABLE "profile" ADD COLUMN     "dislikes" TEXT[],
ADD COLUMN     "likes" TEXT[],
ADD COLUMN     "views" INTEGER DEFAULT 0;
