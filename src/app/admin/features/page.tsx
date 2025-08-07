import TitlePage from "@/components/custom/page-heading";
import PlanForm from "./subscription-plan-form";

export const metadata = {
    title: "Subscription Plan",
    description: "Configure a new subscription plan for your customers.",
};

export default function SubscriptionPlanPage() {
    return (
        <>
            <TitlePage {...metadata} />
            <PlanForm />
        </>
    );
}