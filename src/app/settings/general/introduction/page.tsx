import { auth } from '@/auth';
import AccessDenied from '@/components/custom/access-denied';
import React from 'react'
import { hasPermission } from '@/lib/rbac';
import TitlePage from '@/components/custom/page-heading';
import TestPage from './Test';

export default async function Page() {
  // const session = await auth();
  // const rolePermissions = +session?.user?.permissions;
  // const permission = hasPermission(rolePermissions, 8);

  // if (!permission) {
  //   return <AccessDenied/>;
  // }

  return (
    <>
       <TitlePage title='Introduction' description='Sample page to test access'/>
       <TestPage/>
    </>
  )
}