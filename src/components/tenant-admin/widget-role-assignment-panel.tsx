"use client"

import {
    useWidgetRoleAssignment, WidgetRoleAssignmentProvider
} from '@/context/widget-role-assignment-context';

import { WidgetRoleAssignmentBulkActions } from './widget-role-assignment/bulk-actions';
import { WidgetRoleAssignmentEmptyState } from './widget-role-assignment/empty-state';
import { WidgetRoleAssignmentFilters } from './widget-role-assignment/filters';
import { WidgetRoleAssignmentHeader } from './widget-role-assignment/header';
import { Role, Widget } from './widget-role-assignment/role-assignment-types';
import { RoleSelector } from './widget-role-assignment/role-selector';
import { WidgetRoleAssignmentSummary } from './widget-role-assignment/summary';
import { CardsView } from './widget-role-assignment/views/cards-view';
import { CategoryView } from './widget-role-assignment/views/category-view';
import { TableView } from './widget-role-assignment/views/table-view';

function WidgetRoleAssignmentContent() {
    const { viewMode, selectedRole } = useWidgetRoleAssignment()

    return (
        <div className="space-y-6">
            <WidgetRoleAssignmentHeader />
            <RoleSelector />

            {selectedRole && (
                <>
                    <WidgetRoleAssignmentFilters />
                    <WidgetRoleAssignmentBulkActions />
                </>
            )}

            <div className="min-h-[360px]">
                {viewMode === "table" && <TableView />}
                {viewMode === "cards" && <CardsView />}
                {viewMode === "category" && <CategoryView />}
                <WidgetRoleAssignmentEmptyState />
            </div>

            {selectedRole && <WidgetRoleAssignmentSummary />}
        </div>
    )
}

interface WidgetRoleAssignmentPanelProps {
    tenantSlug: string
    widgets: Widget[]
    roles: Role[]
}

export function WidgetRoleAssignmentPanel({ widgets, roles, tenantSlug }: WidgetRoleAssignmentPanelProps) {
    return (
        <WidgetRoleAssignmentProvider initialWidgets={widgets} roles={roles} tenantSlug={tenantSlug}>
            <WidgetRoleAssignmentContent />
        </WidgetRoleAssignmentProvider>
    )
}
