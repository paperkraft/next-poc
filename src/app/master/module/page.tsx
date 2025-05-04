import { Metadata } from 'next';
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

export const metadata: Metadata = {
  title: "Module",
  description: "List of all module and submodule",
};

export default async function ModuleMasterPage() {
  const headersList = headers();
  const currentPath = headersList.get('x-current-path') || '';

  try {
    const { session, modules } = await getSessionModules();
    if (!session) return <AccessDenied />;

    const moduleId = findModuleIdByPath(modules, currentPath);
    const response = await fetchModules().then((res) => res.json());

    return (
      <div className="space-y-2">
        <TitlePage title="Module List" description="List of all module and submodule" listPage />
        {response.success
          ? response.data.length > 0
            ? <ModuleMasterList data={response.data} moduleId={moduleId} />
            : <NoRecordPage text="module" />
          : <SomethingWentWrong message={response.message} />
        }
      </div>
    );

  } catch (error) {
    return (
      <>
        <TitlePage title="Module List" description="List of all module and submodule" listPage />
        <SomethingWentWrong message="An unexpected error occurred." />
      </>
    )
  }
}