-- CreateTable
CREATE TABLE "likes" (
    "id" SERIAL NOT NULL,
    "liked_by_id" INTEGER NOT NULL,
    "post_id" INTEGER NOT NULL,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_liked_by_id_fkey" FOREIGN KEY ("liked_by_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "pint_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
