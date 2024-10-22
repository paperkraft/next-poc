import React from "react";
import NotFoundPage from "@/components/custom/layout/NotFound";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Not Found",
  description: "Page under construction",
};

export default async function NotFound() {
  return (
    <React.Fragment>
      <NotFoundPage/>
    </React.Fragment>
  );
}
