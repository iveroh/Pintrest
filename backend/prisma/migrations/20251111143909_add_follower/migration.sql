-- CreateTable
CREATE TABLE "follower" (
    "user_id" TEXT NOT NULL,
    "following_id" TEXT NOT NULL,

    CONSTRAINT "follower_pkey" PRIMARY KEY ("user_id","following_id")
);

-- AddForeignKey
ALTER TABLE "follower" ADD CONSTRAINT "follower_following_id_fkey" FOREIGN KEY ("following_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
