import { Metadata } from 'next';

import { PermissionGuard } from '@/components/PermissionGuard';

import GroupForm from '../GroupForm';
import AccessDenied from '@/components/custom/access-denied';

export const metadata: Metadata = {
  title: "Create Group",
  description: "Define a new group",
};

export default async function CreateGroup() {
  return (
    <PermissionGuard name="Groups" action="WRITE" fallback={<AccessDenied/>}>
      <GroupForm  />
    </PermissionGuard>
  );
}