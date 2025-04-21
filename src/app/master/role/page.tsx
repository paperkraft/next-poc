import { fetchRoles } from '@/app/action/role.action';
import AccessDenied from '@/components/custom/access-denied';
import NoRecordPage from '@/components/custom/no-record';
import TitlePage from '@/components/custom/page-heading';
import SomethingWentWrong from '@/components/custom/somthing-wrong';
import { can } from '@/lib/abac/checkPermissions';
import { getSessionModules } from '@/lib/abac/sessionModules';
import { findModuleId } from '@/utils/helper';

import RoleList from './RoleMasterList';

export const dynamic = 'force-dynamic'; // Force dynamic rendering for this route
export const revalidate = 10; // Disable revalidation for this route

export default async function RoleMasterPage() {
  try {
    const { session, modules } = await getSessionModules();

    if (!session) return <AccessDenied />;

    const hasPermission = can({
      name: "Role",
      action: "READ",
      modules,
    });

    if (!hasPermission) return <AccessDenied />;

    const moduleId = findModuleId(modules, "Role");
    const response = await fetchRoles()

    return (
      <>
        <TitlePage
          title="Role"
          description="List of all roles"
          listPage
        />

        {response.success
          ? response?.data?.length === 0
            ? <NoRecordPage text="role" />
            : response.data && <RoleList data={response.data} moduleId={moduleId} />
          : <SomethingWentWrong message={response.message} />
        }
      </>
    );
  } catch (error) {
    return (
      <>
        <TitlePage
          title="Role"
          description="List of all roles"
          listPage
        />
        <SomethingWentWrong message="An unexpected error occurred." />
      </>
    )
  }
}