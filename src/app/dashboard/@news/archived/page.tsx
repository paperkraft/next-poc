import CustomCard from "@/components/custom/card-component";
import Link from "next/link";

export default async function ArchivedNews() {
  return(
    <CustomCard header={'Archived News'} description="description">
      <div>
        <i>- {new Date(new Date().setDate(new Date().getDate() - 1)).toDateString()}</i><br/>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Quis, veniam ipsa. Aperiam, alias a facilis consectetur eligendi 
        quae eius voluptatibus temporibus, ratione quas totam rem illo 
        earum sed accusantium officiis.
      </div>
      <div className="flex justify-end mt-2">
        <Link href={'/dashboard'} className="text-blue-600">Default</Link>
      </div>
    </CustomCard>
  )
} 
