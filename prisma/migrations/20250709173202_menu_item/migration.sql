-- DropIndex
DROP INDEX "MenuItem_tenantId_groupId_parentId_key";

-- CreateIndex
CREATE INDEX "UserWidget_userId_idx" ON "UserWidget"("userId");
