'use client'
import React from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import LeftSidebar from "./LeftSidebar";

function AppLayout({ children }:{children: React.ReactNode}) {
    useSession({
        required: true,
        onUnauthenticated(){
          redirect('/signin')
        }
    });

    return <LeftSidebar>{children}</LeftSidebar>
}
export default AppLayout;