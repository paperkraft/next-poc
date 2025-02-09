import { Metadata } from "next";
import SettingsProfilePage from "./(forms)/profile/page";

export const metadata: Metadata = {
    title: {
       absolute: "Profile | Settings"
    },
    description: "This is how others will see you.",
};

export default function SettingPage(){
    return(<SettingsProfilePage/>)
}