/*
  Warnings:

  - You are about to drop the column `tenantId` on the `Widget` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Widget" DROP CONSTRAINT "Widget_tenantId_fkey";

-- AlterTable
ALTER TABLE "UserWidget" ALTER COLUMN "customSize" SET DEFAULT 'small';

-- AlterTable
ALTER TABLE "Widget" DROP COLUMN "tenantId";

-- CreateTable
CREATE TABLE "TenantWidget" (
    "id" SERIAL NOT NULL,
    "tenantId" INTEGER NOT NULL,
    "widgetId" INTEGER NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TenantWidget_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TenantWidget_tenantId_widgetId_key" ON "TenantWidget"("tenantId", "widgetId");

-- AddForeignKey
ALTER TABLE "TenantWidget" ADD CONSTRAINT "TenantWidget_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantWidget" ADD CONSTRAINT "TenantWidget_widgetId_fkey" FOREIGN KEY ("widgetId") REFERENCES "Widget"("id") ON DELETE CASCADE ON UPDATE CASCADE;
