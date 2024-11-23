import { auth } from '@/auth';
import AccessDenied from '@/components/custom/access-denied';
import React from 'react'
import { hasPermission } from '@/lib/rbac';

export default async function Page() {
  const session = await auth();
  const rolePermissions = +session?.user?.permissions;
  const permission = hasPermission(rolePermissions, 8);

  if (!permission) {
    return <AccessDenied/>;
  }

  return (
    <div>
      <p> Introduction </p>
    </div>
  )
}