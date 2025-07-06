/*
  Warnings:

  - You are about to drop the column `isDefault` on the `Widget` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,widgetId]` on the table `UserWidget` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "RoleWidget" DROP CONSTRAINT "RoleWidget_widgetId_fkey";

-- DropForeignKey
ALTER TABLE "UserWidget" DROP CONSTRAINT "UserWidget_widgetId_fkey";

-- DropIndex
DROP INDEX "UserWidget_userId_roleWidgetId_key";

-- AlterTable
ALTER TABLE "Widget" DROP COLUMN "isDefault";

-- CreateIndex
CREATE UNIQUE INDEX "UserWidget_userId_widgetId_key" ON "UserWidget"("userId", "widgetId");

-- AddForeignKey
ALTER TABLE "RoleWidget" ADD CONSTRAINT "RoleWidget_widgetId_fkey" FOREIGN KEY ("widgetId") REFERENCES "TenantWidget"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWidget" ADD CONSTRAINT "UserWidget_widgetId_fkey" FOREIGN KEY ("widgetId") REFERENCES "TenantWidget"("id") ON DELETE CASCADE ON UPDATE CASCADE;
