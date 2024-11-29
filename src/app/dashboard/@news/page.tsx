'use client'
import CustomCard from "@/components/custom/card-component";
import Link from "next/link";
import { memo } from "react";

const News = memo(() => {
  return(
    <CustomCard header={'News'} description="description">
      <div>
        <i>- {new Date().toDateString()}</i><br/>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Cum, voluptate quo! Cupiditate eveniet aut expedita tempore, fugit quis doloribus nostrum. 
        Hic illo tenetur consequuntur nesciunt, sint officia doloribus ex dolorum.
      </div>
      <div className="flex justify-end mt-2">
        <Link href={'/dashboard/archived'} className="text-blue-600">Archived</Link>
      </div>
    </CustomCard>
  )
}) 

News.displayName = "News";
export default News;