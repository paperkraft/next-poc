'use client'

import { ArrowLeft, Edit, Plus, Trash2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { memo } from 'react';

import { Separator } from '@/components/ui/separator';
import { useMounted } from '@/hooks/use-mounted';

import { IconTooltipButton } from '../common/IconTooltipButton';
import { PermissionGuard } from '../PermissionGuard';

type Props = {
    title: string
    description?: string
    listPage?: boolean
    createPage?: boolean
    viewPage?: boolean

    canEdit?: boolean
    canDelete?: boolean
    isEditingVisible?: boolean
    onEdit?: () => void
    onDelete?: () => void
}

const TitlePage = memo(({
    title,
    description,
    createPage,
    listPage,
    viewPage,
    canEdit = true,
    canDelete = true,
    isEditingVisible = true,
    onEdit,
    onDelete,
}: Props) => {
    const mounted = useMounted();
    const path = usePathname();
    const router = useRouter();

    if (!mounted) return null;

    const showAddButton = listPage
    const showBackButton = createPage || viewPage
    const showEditDelete = viewPage && isEditingVisible

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center">
                <div className="space-y-0.5">
                    <h1 className="text-lg font-semibold">{title}</h1>
                    {description && <p className="text-sm text-muted-foreground">{description}</p>}
                </div>

                <div className="ml-auto flex gap-2">
                    {showAddButton && (
                        <PermissionGuard action="WRITE" path={path}>
                            <IconTooltipButton
                                icon={<Plus className="size-5" />}
                                tooltip="Add New"
                                asChild
                                href={`${path}/add`}
                            />
                        </PermissionGuard>
                    )}

                    {showBackButton && (
                        <IconTooltipButton
                            icon={<ArrowLeft className="size-5" />}
                            tooltip="Back"
                            onClick={() => router.back()}
                        />
                    )}

                    {showEditDelete && (
                        <>
                            {canEdit && onEdit && (
                                <PermissionGuard action="UPDATE" path={path}>
                                    <IconTooltipButton
                                        icon={<Edit className="size-5" />}
                                        tooltip="Edit"
                                        onClick={onEdit}
                                    />
                                </PermissionGuard>
                            )}
                            {canDelete && onDelete && (
                                <PermissionGuard action="DELETE" path={path}>
                                    <IconTooltipButton
                                        icon={<Trash2 className="size-5 text-destructive" />}
                                        tooltip="Delete"
                                        onClick={onDelete}
                                    />
                                </PermissionGuard>
                            )}
                        </>
                    )}
                </div>
            </div>
            <Separator />
        </div>
    )
})

TitlePage.displayName = "TitlePage";
export default TitlePage;