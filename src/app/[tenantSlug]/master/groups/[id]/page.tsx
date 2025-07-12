import { headers } from 'next/headers';

import { getGroupById } from '@/app/actions/group.action';
import AccessDenied from '@/components/custom/access-denied';
import NoRecordPage from '@/components/custom/no-record';
import TitlePage from '@/components/custom/page-heading';
import SomethingWentWrong from '@/components/custom/somthing-wrong';
import { can } from '@/lib/abac/checkPermissions';
import { getSessionModules } from '@/lib/abac/sessionModules';

import GroupForm from '../GroupForm';

export const metadata = {
  title: "View Group",
  description: "View or update group",
};

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const headersList = headers();
  const currentPath = headersList.get('x-current-path') || '';

  try {
    const { session, modules } = await getSessionModules();

    if (!session) {
      return <AccessDenied />;
    }

    const hasPermission = can({
      path: currentPath,
      action: "READ",
      modules,
    });

    if (!hasPermission) {
      return <AccessDenied />;
    }

    const response = await getGroupById(id);

    return (
      <>
        {!response.success ? (
          <SomethingWentWrong message={response.message} />
        ) : response.data && Object.entries(response.data).length ? (
          <GroupForm id={+id} data={response.data} />
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
        <TitlePage {...metadata} viewPage />
        <SomethingWentWrong message="An unexpected error occurred." />
      </>
    )
  }
}