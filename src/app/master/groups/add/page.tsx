import AccessDenied from '@/components/custom/access-denied';
import TitlePage from '@/components/custom/page-heading';
import { can } from '@/lib/abac/checkPermissions';
import { getSessionModules } from '@/lib/abac/sessionModules';

import CreateGroupForm from './CreateGroupForm';

export const dynamic = 'force-dynamic'; // Force dynamic rendering for this route

export default async function CreateGroup() {
  const { session, modules } = await getSessionModules();

  if (!session) {
    return <AccessDenied />;
  }

  const hasPermission = can({
    name: "Groups",
    action: "WRITE",
    modules,
  });

  if (!hasPermission) {
    return <AccessDenied />;
  }

  return (
    <div className="space-y-4 p-2">
      <TitlePage title="Create Group" description="Define a new group" createPage />
      <CreateGroupForm />
    </div>
  );
}