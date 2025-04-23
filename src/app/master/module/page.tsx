import AccessDenied from '@/components/custom/access-denied';
import NoRecordPage from '@/components/custom/no-record';
import TitlePage from '@/components/custom/page-heading';
import SomethingWentWrong from '@/components/custom/somthing-wrong';
import { can } from '@/lib/abac/checkPermissions';
import { getSessionModules } from '@/lib/abac/sessionModules';
import { findModuleId } from '@/utils/helper';

import ModuleMasterList from './ModuleList';
import { fetchModules } from '@/app/action/module.action';

export default async function ModuleMasterPage() {
  try {
    const { session, modules } = await getSessionModules();
    if (!session) return <AccessDenied />;

    const hasPermission = can({
      name: "Module",
      action: "READ",
      modules,
    });
    if (!hasPermission) return <AccessDenied />;

    const moduleId = findModuleId(modules, "Module");
    const response = await fetchModules().then((res) => res.json());
  
    return (
      <div className="space-y-2">
        <TitlePage title="Module List" description="List of all module and submodule" listPage />
        {response.success
          ? response.data.length === 0
            ? <NoRecordPage text="module" />
            : <ModuleMasterList data={response.data} moduleId={moduleId as string} />
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