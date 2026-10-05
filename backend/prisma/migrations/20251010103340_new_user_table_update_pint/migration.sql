/*
  Warnings:

  - Added the required column `creator_id` to the `pint_posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pint_posts" ADD COLUMN     "creator_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "display_name" VARCHAR(100) NOT NULL,
    "bio" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "avatar_path" TEXT NOT NULL,
    "banner_path" TEXT NOT NULL,
    "pints_consumed" INTEGER NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AddForeignKey
ALTER TABLE "pint_posts" ADD CONSTRAINT "pint_posts_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
