import { Metadata } from 'next';

import { PermissionGuard } from '@/components/PermissionGuard';

import GroupForm from '../GroupForm';

export const metadata: Metadata = {
  title: "Create Group",
  description: "Define a new group",
};

export default async function CreateGroup() {
  return (
    <PermissionGuard name="Role" action="WRITE">
      <GroupForm  />
    </PermissionGuard>
  );
}