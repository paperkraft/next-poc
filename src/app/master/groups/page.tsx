import { Metadata } from 'next';

import { getAllGroups } from '@/app/action/group.action';
import AccessDenied from '@/components/custom/access-denied';
import NoRecordPage from '@/components/custom/no-record';
import TitlePage from '@/components/custom/page-heading';
import SomethingWentWrong from '@/components/custom/somthing-wrong';
import { can } from '@/lib/abac/checkPermissions';
import { getSessionModules } from '@/lib/abac/sessionModules';
import { findModuleId } from '@/utils/helper';

import GroupMasterList from './GroupMasterList';

export const dynamic = 'force-dynamic';
export const revalidate = 10;

export const metadata: Metadata = {
  title: "Group",
  description: "Manage groups",
};

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
    const response = await getAllGroups();

    return (
      <>
        <TitlePage
          title="Groups"
          description="Manage groups used to categorize modules in the sidebar."
          listPage
        />

        {response.success
          ? response?.data && response?.data?.length === 0
            ? <NoRecordPage text="role" />
            : response.data && <GroupMasterList data={response.data} moduleId={moduleId} />
          : <SomethingWentWrong message={response.message} />
        }
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
