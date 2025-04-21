import { PermissionGuard } from '@/components/PermissionGuard';

import RoleForm from '../RoleForm';

export default async function CreateRole() {
  return (
    <PermissionGuard name="Role" action="WRITE">
      <RoleForm />
    </PermissionGuard>
  );
}