/*
  Warnings:

  - You are about to drop the column `pints_consumed` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "pint_posts" ADD COLUMN     "image_url" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "pints_consumed" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "pints_consumed";
