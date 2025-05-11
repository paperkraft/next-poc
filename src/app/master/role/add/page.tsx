import AccessDenied from '@/components/custom/access-denied';
import { PermissionGuard } from '@/components/PermissionGuard';

import RoleForm from '../RoleForm';

export const metadata = {
  title: "Create Role",
  description: "Create role",
};

export default async function CreateRole() {
  return (
    <PermissionGuard name="Role" action="WRITE" fallback={<AccessDenied />}>
      <RoleForm />
    </PermissionGuard>
  );
}