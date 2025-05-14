import { headers } from 'next/headers';

import { getAllGroups } from '@/app/action/group.action';
import { fetchUniqueModule } from '@/app/action/module.action';
import AccessDenied from '@/components/custom/access-denied';
import NoRecordPage from '@/components/custom/no-record';
import TitlePage from '@/components/custom/page-heading';
import SomethingWentWrong from '@/components/custom/somthing-wrong';
import { can } from '@/lib/abac/checkPermissions';
import { getSessionModules } from '@/lib/abac/sessionModules';
import { Group } from '@/types/group';

import ModuleForm from '../ModuleForm';

export const metadata = {
  title: "Module",
  description: "Overview module and submodule",
};

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const headersList = headers();
  const currentPath = headersList.get('x-current-path') || '';

  try {
    const { session, modules } = await getSessionModules();

    if (!session) return <AccessDenied />;

    const hasPermission = can({
      path: currentPath,
      action: "READ",
      modules,
    });

    if (!hasPermission) return <AccessDenied />;

    const res = await fetchUniqueModule(id);
    const groups = await getAllGroups();

    const isModule = res.success
    const isChild = isModule && res.data?.parentId
    const module = isModule && res.data

    const isGroup = groups && groups.success
    const groupOptions = isGroup && groups?.data?.map((item: Group) => ({ label: item.name, value: item.id }));

    return (
      (!isModule || !isGroup) ? (
        <SomethingWentWrong message={isModule ? groups.message : res.message} />
      ) : module && groupOptions ? (
        <ModuleForm groupOptions={groupOptions} id={id} module={module} isChild={!!isChild} />
      ) : (
        <NoRecordPage text={isModule ? "role" : 'module'} />
      )
    )
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('ModuleMasterPage Error:', error);
    }
    return (
      <>
        <TitlePage {...metadata} viewPage />
        <SomethingWentWrong message={error instanceof Error ? error.message : "An unexpected error occurred."} />
      </>
    )
  }
}