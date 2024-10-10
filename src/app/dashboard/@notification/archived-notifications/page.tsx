'use client'
import CustomCard from "@/components/custom/card-component";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ArchivedNotifications() {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const timeoutId = setTimeout(()=>{
      setLoading(false);
    },500)

    return() => {
      clearTimeout(timeoutId)
    }
  },[]);

  return(
    <>
      <CustomCard header={'Archived Notifications'} description="description">
        {
          loading ? (
            <div className="space-y-2">
              <Skeleton className="h-4"/>
              <Skeleton className="h-4"/>
              <Skeleton className="h-4"/>
            </div>
          ) : (
            <div>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. 
              Cum, voluptate quo! Cupiditate eveniet aut expedita tempore, fugit quis doloribus nostrum. 
              Hic illo tenetur consequuntur nesciunt, sint officia doloribus ex dolorum.
              <div className="flex justify-end mt-4">
                <Link href={'/dashboard'} className="text-blue-600">Default</Link>
              </div>
            </div>
          )
        }
      </CustomCard>
    </>
  )
} 
