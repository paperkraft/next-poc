import TitlePage from "@/components/custom/page-heading";
import AddModule from "./AddModule";

export default function Page() {
  return (
    <div className="space-y-4 p-2">
      <TitlePage title="Create Module" description="Define a new module" createPage />
      <AddModule/>
    </div>
  );
}