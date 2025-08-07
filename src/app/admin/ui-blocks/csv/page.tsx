import CsvImporter from "@/components/custom/csv-importer";
import TitlePage from "@/components/custom/page-heading";

export const metadata = {
    title: "Data Migration",
    description: "Transfer data from csv to system",
};

export default function Page() {
    return (
        <>
            <TitlePage {...metadata} />
            <CsvImporter />
        </>
    );
}