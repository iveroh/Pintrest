-- CreateTable
CREATE TABLE "pint_posts" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pint_posts_pkey" PRIMARY KEY ("id")
);
