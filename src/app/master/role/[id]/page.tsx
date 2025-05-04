import { Metadata } from 'next';

import { fetchUniqueRoles } from '@/app/action/role.action';
import AccessDenied from '@/components/custom/access-denied';
import NoRecordPage from '@/components/custom/no-record';
import SomethingWentWrong from '@/components/custom/somthing-wrong';
import { can } from '@/lib/abac/checkPermissions';
import { getSessionModules } from '@/lib/abac/sessionModules';

import RoleForm from '../RoleForm';

export const metadata: Metadata = {
  title: "View Role",
  description: "View or update role",
};

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const { session, modules } = await getSessionModules();

    if (!session) {
      return <AccessDenied />;
    }

    const hasPermission = can({
      name: "Role",
      action: "READ",
      modules,
    });

    if (!hasPermission) {
      return <AccessDenied />;
    }

    const response = await fetchUniqueRoles(id);

    return (
      response.success
        ? response.data && Object.entries(response.data).length > 0
          ? <RoleForm data={response.data} />
          : <NoRecordPage text="role" />
        : <SomethingWentWrong message={response.message} />
    )

  } catch (error) {
    console.error("Error fetching session:", error);
    return <SomethingWentWrong message="An unexpected error occurred." />;
  }
}