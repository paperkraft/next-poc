import { IGroup } from '@/app/_Interface/Group';
import { getAllGroups } from '@/app/action/group.action';
import { fetchUniqueModule } from '@/app/action/module.action';
import TitlePage from '@/components/custom/page-heading';
import SomethingWentWrong from '@/components/custom/somthing-wrong';

import ModuleForm from '../ModuleForm';

export const metadata = {
  title: "Module",
  description: "Overview module and submodule",
};

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const module = await fetchUniqueModule(id).then((d) => d.json());
    const groups = await getAllGroups();

    const isModule = module && module.success
    const isGroup = groups && groups.success

    const modules = module.data || [];
    const groupOptions = isGroup && groups?.data?.map((item: IGroup) => ({ label: item.name, value: item.id }));

    return (isModule && isGroup && groupOptions ? (
      <ModuleForm groupOptions={groupOptions} id={id} modules={modules} />
    ) : (
      <SomethingWentWrong message={isModule ? groups.message : module.message} />
    ));
  } catch (error) {
    return (
      <>
        <TitlePage {...metadata} viewPage />
        <SomethingWentWrong message={error instanceof Error ? error.message : "An unexpected error occurred."} />
      </>
    )
  }
}