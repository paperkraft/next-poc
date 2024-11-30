import TitlePage from "@/components/custom/page-heading";
import GroupForm from "./GroupForm";

export default function Page() {
    return (
        <div className="space-y-4 p-2">
          <TitlePage title="Create Group" description="Define a new group" createPage/>
          <GroupForm/>
        </div>
      );
}