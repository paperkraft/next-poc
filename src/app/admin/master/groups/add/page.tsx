import { headers } from 'next/headers';

import AccessDenied from '@/components/custom/access-denied';
import { PermissionGuard } from '@/components/PermissionGuard';

import GroupForm from '../GroupForm';

export const metadata = {
  title: "Create Group",
  description: "Define a new group",
};

export default async function CreateGroup() {
  const headersList = headers();
  const currentPath = headersList.get('x-current-path') || '';

  return (
    <PermissionGuard path={currentPath} action="WRITE" fallback={<AccessDenied />}>
      <GroupForm />
    </PermissionGuard>
  );
}