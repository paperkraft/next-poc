/*
  Warnings:

  - A unique constraint covering the columns `[roleId,menuId,tenantId]` on the table `RolePermission` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[roleId,menuId]` on the table `RolePermission` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "RolePermission_tenantId_roleId_menuId_key";

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_roleId_menuId_tenantId_key" ON "RolePermission"("roleId", "menuId", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_roleId_menuId_key" ON "RolePermission"("roleId", "menuId");
