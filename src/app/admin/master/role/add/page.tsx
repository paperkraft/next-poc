import { headers } from 'next/headers';

import AccessDenied from '@/components/custom/access-denied';
import { PermissionGuard } from '@/components/PermissionGuard';

import RoleForm from '../RoleForm';

export const metadata = {
  title: "Create Role",
  description: "Create role",
};

export default async function CreateRole() {
  const headersList = headers();
  const currentPath = headersList.get('x-current-path') || '';

  return (
    <PermissionGuard path={currentPath} action="WRITE" fallback={<AccessDenied />}>
      <RoleForm />
    </PermissionGuard>
  );
}