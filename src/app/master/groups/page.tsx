import { getAllGroups } from '@/app/action/group.action';
import AccessDenied from '@/components/custom/access-denied';
import NoRecordPage from '@/components/custom/no-record';
import TitlePage from '@/components/custom/page-heading';
import SomethingWentWrong from '@/components/custom/somthing-wrong';
import { can } from '@/lib/abac/checkPermissions';
import { getSessionModules } from '@/lib/abac/sessionModules';
import { findModuleId } from '@/utils/helper';

import GroupMasterList from './GroupMasterList';

export const dynamic = 'force-dynamic'; // Force dynamic rendering for this route
export const revalidate = 10; // Disable revalidation for this route

export default async function GroupPage() {
  try {

    const { session, modules } = await getSessionModules();

    if (!session) return <AccessDenied />;

    const hasPermission = can({
      name: "Groups",
      action: "READ",
      modules,
    });

    if (!hasPermission) return <AccessDenied />;

    const moduleId = findModuleId(modules, "Groups");
    const res = await getAllGroups();

    return (
      <>
        <TitlePage
          title="Groups"
          description="Manage groups used to categorize modules in the sidebar."
          listPage
        />

        {!res.success && <SomethingWentWrong message={res.message} />}

        {res.success && res.data && res.data.length > 0 ? (
          <GroupMasterList data={res.data} moduleId={moduleId} />
        ) : (
          <NoRecordPage text="group" />
        )}
      </>
    );
  } catch (error) {
    console.error("GroupPage error:", error);
    return (
      <>
        <TitlePage
          title="Groups"
          description="Manage groups used to categorize modules in the sidebar."
          listPage
        />
        <SomethingWentWrong message="An unexpected error occurred." />
      </>
    );
  }
}
