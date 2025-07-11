import { auth } from '@/auth';

import Student from './student';
import TenantAdminDashboard from './tenant-admin';
import { redirect } from 'next/navigation';
import FacultyDashboard from './faculty';

export default async function DashboardPage() {

  const session = await auth();

  if (!session) {
    redirect('/signin')
  }

  const role = session?.user?.role

  switch (role) {
    case 'Super Admin':
      return <TenantAdminDashboard />
    case 'Admin':
      return <TenantAdminDashboard />
    case 'Faculty':
      return <FacultyDashboard />
    case 'Student':
      return <Student />
    default:
      return <div>Unauthorized</div>
  }
}