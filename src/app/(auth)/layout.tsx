import type { Metadata } from "next";
import { ChildProps } from "@/types/children";

export const metadata: Metadata = {
  title:{
    default:"Webdesk",
    template:"%s | Auth"
} ,
  description: "Signin to get started",
};

export default function AuthLayout({children}:ChildProps) {
  
  return (
    <div className=" flex flex-col md:flex-row h-screen">
      <div className="w-full md:w-1/2 md:block hidden">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-slate-900"></div>
          <div className="relative z-20 flex items-center text-lg font-medium">
            Webdesk
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">Sample Text</p>
              <footer className="text-sm">-</footer>
            </blockquote>
          </div>
        </div>
      </div>
      {/* Forms */}
      <div className="w-full md:w-1/2 flex justify-center items-center h-screen">
        <div className="max-w-md w-full">
          {children}
        </div>
      </div>
    </div>
  );
}
