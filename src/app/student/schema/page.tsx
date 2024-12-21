import TitlePage from "@/components/custom/page-heading";
import UpdateSchemaForm from "./UpdateForm";

export default function Page() {
    return (
        <div className="p-4 pt-0">
            <TitlePage title="Update schema" description="This will update form schema"/>
            <UpdateSchemaForm />
        </div>
    );
}