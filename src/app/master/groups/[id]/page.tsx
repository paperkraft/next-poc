import { Metadata } from 'next';

import { getGroupById } from '@/app/action/group.action';
import AccessDenied from '@/components/custom/access-denied';
import NoRecordPage from '@/components/custom/no-record';
import SomethingWentWrong from '@/components/custom/somthing-wrong';
import { can } from '@/lib/abac/checkPermissions';
import { getSessionModules } from '@/lib/abac/sessionModules';

import GroupForm from '../GroupForm';

export const metadata: Metadata = {
  title: "View Group",
  description: "View or update group",
};

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
          ? <GroupForm data={response.data} />
          : <NoRecordPage text="group" />
        : <SomethingWentWrong message={response.message} />
    )

  } catch (error) {
    console.error("Error fetching session:", error);
    return <SomethingWentWrong message="An unexpected error occurred." />;
  }
}