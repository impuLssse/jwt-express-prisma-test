/*
  Warnings:

  - The primary key for the `tokens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[refresh_token]` on the table `tokens` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "tokens_user_id_key";

-- AlterTable
ALTER TABLE "tokens" DROP CONSTRAINT "tokens_pkey",
ADD CONSTRAINT "tokens_pkey" PRIMARY KEY ("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_refresh_token_key" ON "tokens"("refresh_token");
