import StepperForm from "@/components/_stepper-form/StepperForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Stepper Form",
    description: "Multi-step form",
};

export default function StepperPage() {
    return (<StepperForm />);
}