import TitlePage from "@/components/custom/page-heading";
import StudentForm from "./StudentForm";

export default function Page(){
    return(
        <>
            <TitlePage title="Student" description="description" />
            <StudentForm />
        </>
    )
}