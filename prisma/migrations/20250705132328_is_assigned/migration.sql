/*
  Warnings:

  - You are about to drop the column `isDefault` on the `RoleWidget` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RoleWidget" DROP COLUMN "isDefault",
ADD COLUMN     "isAssigned" BOOLEAN NOT NULL DEFAULT false;
