import AppLayout from "@/components/custom/layout/AppLayout";
import TitlePage from "@/components/custom/page-heading";
import StudentForm from "./StudentForm";

export default function Page(){
    return(
        <AppLayout>
            <TitlePage title="Student" description="description" />
            <StudentForm />
        </AppLayout>
    )
}