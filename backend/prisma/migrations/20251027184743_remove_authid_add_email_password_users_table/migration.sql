/*
  Warnings:

  - You are about to drop the column `auth_id` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."users_auth_id_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "auth_id",
ADD COLUMN     "email" VARCHAR(255),
ADD COLUMN     "password_hash" VARCHAR(255);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
