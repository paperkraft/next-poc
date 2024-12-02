import TitlePage from "@/components/custom/page-heading";
import AddModule from "./AddModule";
import { fetchModules } from "@/app/action/module.action";
import { fetchGroups } from "@/app/action/group.action";
import NoRecordPage from "@/components/custom/no-record";
import SomethingWentWrong from "@/components/custom/somthing-wrong";

export default async function Page() {
  const modules = await fetchModules().then((d) => d.json());
  const isModules = modules && modules.success;
  const hasModules = isModules && modules.data.length > 0

  const groups = await fetchGroups().then((d) => d.json());
  const isGroups = groups && groups.success;
  const hasGroups = isGroups && groups.data.length > 0

  return (
    <div className="space-y-4 p-2">
      <TitlePage title="Create Module" description="Define a new module" createPage />
      {
        isModules && isGroups
          ? hasModules && hasGroups
            ? <AddModule modules={modules.data} groups={groups.data} />
            : <NoRecordPage text={modules.data.length > 0 ? "group" : "module"} />
          : <SomethingWentWrong message={modules.success ? groups.message : modules.message} />
      }
    </div>
  );
}