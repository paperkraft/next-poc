/*
  Warnings:

  - A unique constraint covering the columns `[userId,roleWidgetId]` on the table `UserWidget` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `RoleWidget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleWidgetId` to the `UserWidget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `UserWidget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Widget` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "UserWidget_userId_widgetId_key";

-- AlterTable
ALTER TABLE "RoleWidget" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "UserWidget" ADD COLUMN     "roleWidgetId" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Widget" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserWidget_userId_roleWidgetId_key" ON "UserWidget"("userId", "roleWidgetId");

-- AddForeignKey
ALTER TABLE "UserWidget" ADD CONSTRAINT "UserWidget_roleWidgetId_fkey" FOREIGN KEY ("roleWidgetId") REFERENCES "RoleWidget"("id") ON DELETE CASCADE ON UPDATE CASCADE;
