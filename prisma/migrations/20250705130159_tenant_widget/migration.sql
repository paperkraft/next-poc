/*
  Warnings:

  - The primary key for the `RoleWidget` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `RoleWidget` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `UserWidget` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `config` on the `UserWidget` table. All the data in the column will be lost.
  - The `id` column on the `UserWidget` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Widget` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Widget` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `UserSettings` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `widgetId` on the `RoleWidget` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `widgetId` on the `UserWidget` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "RoleWidget" DROP CONSTRAINT "RoleWidget_roleId_fkey";

-- DropForeignKey
ALTER TABLE "RoleWidget" DROP CONSTRAINT "RoleWidget_widgetId_fkey";

-- DropForeignKey
ALTER TABLE "UserSettings" DROP CONSTRAINT "UserSettings_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserWidget" DROP CONSTRAINT "UserWidget_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserWidget" DROP CONSTRAINT "UserWidget_widgetId_fkey";

-- AlterTable
ALTER TABLE "RoleWidget" DROP CONSTRAINT "RoleWidget_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "widgetId",
ADD COLUMN     "widgetId" INTEGER NOT NULL,
ADD CONSTRAINT "RoleWidget_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "UserWidget" DROP CONSTRAINT "UserWidget_pkey",
DROP COLUMN "config",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "widgetId",
ADD COLUMN     "widgetId" INTEGER NOT NULL,
ADD CONSTRAINT "UserWidget_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Widget" DROP CONSTRAINT "Widget_pkey",
ADD COLUMN     "tenantId" INTEGER,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Widget_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "UserSettings";

-- CreateIndex
CREATE UNIQUE INDEX "RoleWidget_roleId_widgetId_key" ON "RoleWidget"("roleId", "widgetId");

-- CreateIndex
CREATE UNIQUE INDEX "UserWidget_userId_widgetId_key" ON "UserWidget"("userId", "widgetId");

-- AddForeignKey
ALTER TABLE "Widget" ADD CONSTRAINT "Widget_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleWidget" ADD CONSTRAINT "RoleWidget_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleWidget" ADD CONSTRAINT "RoleWidget_widgetId_fkey" FOREIGN KEY ("widgetId") REFERENCES "Widget"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWidget" ADD CONSTRAINT "UserWidget_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWidget" ADD CONSTRAINT "UserWidget_widgetId_fkey" FOREIGN KEY ("widgetId") REFERENCES "Widget"("id") ON DELETE CASCADE ON UPDATE CASCADE;
