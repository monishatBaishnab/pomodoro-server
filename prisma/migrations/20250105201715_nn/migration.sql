/*
  Warnings:

  - You are about to drop the column `condition` on the `Badge` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Badge` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Badge" DROP COLUMN "condition",
DROP COLUMN "image";
