import { Metadata } from 'next';

import { PermissionGuard } from '@/components/PermissionGuard';

import RoleForm from '../RoleForm';

export const metadata: Metadata = {
  title: "Create Role",
  description: "Create role",
};

export default async function CreateRole() {
  return (
    <PermissionGuard name="Role" action="WRITE">
      <RoleForm />
    </PermissionGuard>
  );
}