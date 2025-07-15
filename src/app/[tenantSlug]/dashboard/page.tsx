import { auth } from '@/auth';

import FacultyDashboard from './faculty';
import Student from './student';
import TenantAdminDashboard from './tenant-admin';

export default async function DashboardPage() {

  const session = await auth();
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