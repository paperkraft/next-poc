import { headers } from 'next/headers';

import { getAllGroups } from '@/app/action/group.action';
import AccessDenied from '@/components/custom/access-denied';
import NoRecordPage from '@/components/custom/no-record';
import TitlePage from '@/components/custom/page-heading';
import SomethingWentWrong from '@/components/custom/somthing-wrong';
import { can } from '@/lib/abac/checkPermissions';
import { getSessionModules } from '@/lib/abac/sessionModules';
import { Group } from '@/types/group';

import ModuleForm from '../ModuleForm';

export const metadata = {
  title: "Create Module",
  description: "Define a new module",
};

export default async function AddModulePage() {
  const headersList = headers();
  const currentPath = headersList.get('x-current-path') || '';

  try {
    const { session, modules } = await getSessionModules();
    if (!session) return <AccessDenied />;

    const hasPermission = can({
      path: currentPath,
      action: "WRITE",
      modules,
    });

    if (!hasPermission) return <AccessDenied />;

    const response = await getAllGroups();
    const groupOptions = response?.data && response?.data.map((item: Group) => ({ label: item.name, value: item.id }));

    return (
      (!response.success ? (
        <SomethingWentWrong message={response.message} />
      ) : groupOptions && groupOptions?.length ? (
        <ModuleForm groupOptions={groupOptions} />
      ) : (
        <NoRecordPage text="group" />
      ))
    )
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('ModuleMasterPage Error:', error);
    }
    return (
      <>
        <TitlePage {...metadata} createPage />
        <SomethingWentWrong message="An unexpected error occurred." />
      </>
    )
  }
}