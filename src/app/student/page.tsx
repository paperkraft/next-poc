import TitlePage from "@/components/custom/page-heading";
import StudentForm from "./StudentForm";
import SampleForm from "./SampleForm";

export default function Page(){
    return(
        <>
            <TitlePage title="Student" description="description" />
            {/* <StudentForm /> */}
            <SampleForm />
        </>
    )
}