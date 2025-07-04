import { headers } from 'next/headers';

import { fetchRoles } from '@/app/action/role.action';
import AccessDenied from '@/components/custom/access-denied';
import NoRecordPage from '@/components/custom/no-record';
import TitlePage from '@/components/custom/page-heading';
import SomethingWentWrong from '@/components/custom/somthing-wrong';
import { getSessionModules } from '@/lib/abac/sessionModules';
import { findModuleIdByPath } from '@/utils/helper';

import RoleList from './RoleMasterList';

export const dynamic = 'force-dynamic';
export const revalidate = 10;

export const metadata = {
  title: "Role",
  description: "Define role",
};

export default async function RoleMasterPage() {
  const headersList = headers();
  const currentPath = headersList.get('x-current-path') || '';

  try {
    const { session, modules } = await getSessionModules();
    if (!session) return <AccessDenied />;

    const moduleId = findModuleIdByPath(modules, currentPath);
    const response = await fetchRoles();

    return (
      <>
        <TitlePage {...metadata} listPage />

        {!response.success ? (
          <SomethingWentWrong message={response.message} />
        ) : response.data?.length && moduleId ? (
          <RoleList data={response.data} moduleId={moduleId} />
        ) : (
          <NoRecordPage text="role" />
        )}
      </>
    );
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('RoleMasterPage Error:', error);
    }
    return (
      <>
        <TitlePage {...metadata} listPage />
        <SomethingWentWrong message="An unexpected error occurred." />
      </>
    )
  }
}