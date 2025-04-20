import { fetchRoles } from '@/app/action/role.action';
import AccessDenied from '@/components/custom/access-denied';
import NoRecordPage from '@/components/custom/no-record';
import TitlePage from '@/components/custom/page-heading';
import SomethingWentWrong from '@/components/custom/somthing-wrong';
import { PermissionGuard } from '@/components/PermissionGuard';

import RoleList from './RoleMasterList';

export default async function RoleMasterPage() {
  try {
    const response = await fetchRoles().then((d) => d.json());

    return (
      <PermissionGuard name="Role" action="READ" fallback={<AccessDenied />}>
        <TitlePage title="Role" description="List of all roles" listPage />
        {response.success
          ? response.data.length === 0
            ? <NoRecordPage text="role" />
            : <RoleList data={response.data} />
          : <SomethingWentWrong message={response.message} />
        }
      </PermissionGuard>
    );
  } catch (error) {
    return (
      <>
        <TitlePage title="Role" description="List of all roles" listPage />
        <SomethingWentWrong message="An unexpected error occurred." />
      </>
    )
  }
}