import { Metadata } from 'next';

import { auth } from '@/auth';

import SettingsProfilePage from './(forms)/profile/page';
import { getLastThreeLogins } from '@/app/action/audit.action';

export const metadata: Metadata = {
    title: {
        absolute: "Profile | Settings"
    },
    description: "This is how others will see you.",
};

export default async function SettingPage() {
    const session = await auth();
    const lastLogins = session && await getLastThreeLogins(session?.user?.id);
    return (<SettingsProfilePage lastLogins={lastLogins} />)
}