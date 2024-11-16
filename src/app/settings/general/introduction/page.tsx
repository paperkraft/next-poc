import { auth } from '@/auth';
import AccessDenied from '@/components/custom/access-denied';
import { hasPermission } from '@/utils/guard';
import React from 'react'
import ModuleAdd from './Form';

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
      <ModuleAdd/>
    </div>
  )
}