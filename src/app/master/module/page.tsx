import { headers } from 'next/headers';

import { fetchModules } from '@/app/action/module.action';
import AccessDenied from '@/components/custom/access-denied';
import NoRecordPage from '@/components/custom/no-record';
import TitlePage from '@/components/custom/page-heading';
import SomethingWentWrong from '@/components/custom/somthing-wrong';
import { getSessionModules } from '@/lib/abac/sessionModules';
import { findModuleIdByPath } from '@/utils/helper';

import ModuleMasterList from './ModuleList';

export const dynamic = 'force-dynamic';
export const revalidate = 10;

export const metadata = {
  title: "Modules",
  description: "List of all module and submodule",
};

export default async function ModuleMasterPage() {
  const headersList = headers();
  const currentPath = headersList.get('x-current-path') || '';

  try {
    const { session, modules } = await getSessionModules();
    if (!session) return <AccessDenied />;

    const moduleId = findModuleIdByPath(modules, currentPath);
    const res = await fetchModules();
    const response = await res.json();

    return (
      <>
        <TitlePage {...metadata} listPage />

        {!response.success ? (
          <SomethingWentWrong message={response.message} />
        ) : response.data?.length ? (
          <ModuleMasterList data={response.data} moduleId={moduleId} />
        ) : (
          <NoRecordPage text="module" />
        )}
      </>
    );

  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('ModuleMasterPage Error:', error);
    }
    return (
      <>
        <TitlePage {...metadata} listPage />
        <SomethingWentWrong message="An unexpected error occurred." />
      </>
    )
  }
}