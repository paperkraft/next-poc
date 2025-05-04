import FormBuilder from "@/components/_form-builder";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Form Builder",
  description: "Customize form",
};

export default function Page() {
  return (<FormBuilder />);
}