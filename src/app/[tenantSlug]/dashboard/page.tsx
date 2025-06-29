import { auth } from '@/auth';
import AllowNotification from '@/components/custom/allow-notification';

import Student from './student';
import TenantAdminDashboard from './tenant-admin';
import { redirect } from 'next/navigation';
import FacultyDashboard from './faculty';

export default async function Page() {

  const session = await auth();

  if (!session) {
    redirect('/signin')
  }

  const isAdmin = session.user?.roleId === 2 || !!session.user?.globalRoles?.includes('SYSTEM_ADMIN');
  const isFaculty = session.user?.roleId === 3

  return (
    <>
      <AllowNotification />

      {!isAdmin && !isFaculty && (
        <Student />
      )}

      {isAdmin && (
        <TenantAdminDashboard />
      )}

      {isFaculty && (
        <FacultyDashboard />
      )}
    </>
  );
}