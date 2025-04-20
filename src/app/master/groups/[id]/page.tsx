import { getGroupById } from '@/app/action/group.action';
import { auth } from '@/auth';
import AccessDenied from '@/components/custom/access-denied';
import SomethingWentWrong from '@/components/custom/somthing-wrong';
import { can } from '@/lib/abac/checkPermissions';

import EditGroup from './EditGroup';
import NoRecordPage from '@/components/custom/no-record';
import { getSessionModules } from '@/lib/abac/sessionModules';

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const { session, modules } = await getSessionModules();

    if (!session) {
      return <AccessDenied />;
    }

    const hasPermission = can({
      name: "Groups",
      action: "READ",
      modules,
    });

    if (!hasPermission) {
      return <AccessDenied />;
    }

    const response = await getGroupById(id);

    return (
      response.success
        ? response.data && Object.entries(response.data).length > 0
          ? <EditGroup data={response.data} />
          : <NoRecordPage text="group" />
        : <SomethingWentWrong message={response.message} />
    )

  } catch (error) {
    console.error("Error fetching session:", error);
    return <SomethingWentWrong message="An unexpected error occurred." />;
  }
}