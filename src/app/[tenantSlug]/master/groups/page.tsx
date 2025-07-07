import { headers } from 'next/headers';

import { getAllGroups } from '@/app/actions/group.action';
import AccessDenied from '@/components/custom/access-denied';
import NoRecordPage from '@/components/custom/no-record';
import TitlePage from '@/components/custom/page-heading';
import SomethingWentWrong from '@/components/custom/somthing-wrong';
import { getSessionModules } from '@/lib/abac/sessionModules';
import { findModuleIdByPathNew } from '@/utils/helper';

import GroupMasterList from './GroupMasterList';
import { useTenant } from '@/context/TenantProvider';
import { getUserModules } from '@/lib/menus';

export const dynamic = 'force-dynamic';
export const revalidate = 10;


export const metadata = {
  title: "Groups",
  description: "Manage groups used to categorize modules in the sidebar.",
};

export default async function GroupPage() {

  const headersList = headers();
  const currentPath = headersList.get('x-current-path') || '';

  try {
    const { session, modules } = await getSessionModules();
    if (!session) return <AccessDenied />;

    const menus = await getUserModules(session.user?.tenantId, session.user?.roleId);

    const moduleId = findModuleIdByPathNew(menus, currentPath);
    const response = await getAllGroups();

    return (
      <>
        <TitlePage {...metadata} listPage />

        {!response.success ? (
          <SomethingWentWrong message={response.message} />
        ) : response.data?.length ? (
          <GroupMasterList data={response.data} moduleId={moduleId} />
        ) : (
          <NoRecordPage text="group" />
        )}
      </>
    );
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('GroupMasterPage Error:', error);
    }
    return (
      <>
        <TitlePage {...metadata} listPage />
        <SomethingWentWrong message="An unexpected error occurred." />
      </>
    )
  }
}