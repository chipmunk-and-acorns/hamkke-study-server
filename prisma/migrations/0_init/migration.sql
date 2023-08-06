-- CreateEnum
CREATE TYPE "progressmode" AS ENUM ('online', 'offline');

-- CreateEnum
CREATE TYPE "recruitmenttype" AS ENUM ('study', 'project');

-- CreateEnum
CREATE TYPE "role" AS ENUM ('member', 'admin');

-- CreateEnum
CREATE TYPE "status" AS ENUM ('active', 'readonly', 'blind');

-- CreateTable
CREATE TABLE "article" (
    "article_id" BIGSERIAL NOT NULL,
    "member_id" BIGINT,
    "title" VARCHAR(255),
    "content" VARCHAR(1000),
    "recruitment_type" "recruitmenttype",
    "recruitment_limit" INTEGER,
    "progress_mode" "progressmode",
    "duration" INTEGER,
    "closing_date" DATE,
    "is_closed" BOOLEAN,
    "view_count" INTEGER,
    "like_count" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL,
    "modified_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "article_pkey" PRIMARY KEY ("article_id")
);

-- CreateTable
CREATE TABLE "articleposition" (
    "article_position_id" SERIAL NOT NULL,
    "article_id" BIGINT,
    "position_id" INTEGER,

    CONSTRAINT "articleposition_pkey" PRIMARY KEY ("article_position_id")
);

-- CreateTable
CREATE TABLE "articlestack" (
    "article_stack_id" SERIAL NOT NULL,
    "article_id" BIGINT,
    "stack_id" INTEGER,

    CONSTRAINT "articlestack_pkey" PRIMARY KEY ("article_stack_id")
);

-- CreateTable
CREATE TABLE "banner" (
    "banner_id" SERIAL NOT NULL,
    "banner_image" VARCHAR(255),
    "order" INTEGER NOT NULL,
    "link_url" VARCHAR(255),
    "is_active" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "banner_pkey" PRIMARY KEY ("banner_id")
);

-- CreateTable
CREATE TABLE "comment" (
    "comment_id" BIGSERIAL NOT NULL,
    "parent_comment_id" BIGINT,
    "article_id" BIGINT,
    "member_id" BIGINT,
    "created_at" TIMESTAMP(6) NOT NULL,
    "modified_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "comment_pkey" PRIMARY KEY ("comment_id")
);

-- CreateTable
CREATE TABLE "member" (
    "member_id" BIGSERIAL NOT NULL,
    "username" VARCHAR(100),
    "password" VARCHAR(255) NOT NULL,
    "nickname" VARCHAR(100) NOT NULL,
    "role" "role" NOT NULL,
    "status" "status" NOT NULL,
    "member_image" VARCHAR(500),
    "introduction" VARCHAR(500),
    "created_at" TIMESTAMP(6) NOT NULL,
    "modified_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "member_pkey" PRIMARY KEY ("member_id")
);

-- CreateTable
CREATE TABLE "memberposition" (
    "member_position_id" SERIAL NOT NULL,
    "member_id" BIGINT,
    "position_id" INTEGER,

    CONSTRAINT "memberposition_pkey" PRIMARY KEY ("member_position_id")
);

-- CreateTable
CREATE TABLE "memberstack" (
    "member_stack_id" SERIAL NOT NULL,
    "member_id" BIGINT,
    "stack_id" INTEGER,

    CONSTRAINT "memberstack_pkey" PRIMARY KEY ("member_stack_id")
);

-- CreateTable
CREATE TABLE "notification" (
    "notification_id" BIGSERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" VARCHAR(1000) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "modified_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("notification_id")
);

-- CreateTable
CREATE TABLE "position" (
    "position_id" SERIAL NOT NULL,
    "name" VARCHAR(50),
    "created_at" TIMESTAMP(6) NOT NULL,
    "modified_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "position_pkey" PRIMARY KEY ("position_id")
);

-- CreateTable
CREATE TABLE "stack" (
    "stack_id" SERIAL NOT NULL,
    "name" VARCHAR(30),
    "stack_image" VARCHAR(255),
    "created_at" TIMESTAMP(6) NOT NULL,
    "modified_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "stack_pkey" PRIMARY KEY ("stack_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "member_username_key" ON "member"("username");

-- AddForeignKey
ALTER TABLE "article" ADD CONSTRAINT "article_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("member_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "articleposition" ADD CONSTRAINT "articleposition_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "article"("article_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "articleposition" ADD CONSTRAINT "articleposition_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "position"("position_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "articlestack" ADD CONSTRAINT "articlestack_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "article"("article_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "articlestack" ADD CONSTRAINT "articlestack_stack_id_fkey" FOREIGN KEY ("stack_id") REFERENCES "stack"("stack_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "article"("article_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("member_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_parent_comment_id_fkey" FOREIGN KEY ("parent_comment_id") REFERENCES "comment"("comment_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "memberposition" ADD CONSTRAINT "memberposition_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("member_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "memberposition" ADD CONSTRAINT "memberposition_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "position"("position_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "memberstack" ADD CONSTRAINT "memberstack_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("member_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "memberstack" ADD CONSTRAINT "memberstack_stack_id_fkey" FOREIGN KEY ("stack_id") REFERENCES "stack"("stack_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

