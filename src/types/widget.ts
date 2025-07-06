// types/widget.ts
import { UserWidget, Widget, TenantWidget, RoleWidget } from "@prisma/client";

export type FullUserWidget = UserWidget & {
    widget: TenantWidget & {
        widget: Widget;
        tenant: {
            id: number;
            name: string;
            slug: string;
        };
    };
    roleWidget: RoleWidget | null;
};

export type AvailableWidget = TenantWidget & {
    widget: Widget;
    roleWidget: {
        isAssigned: boolean;
        sortOrder: number;
    }[];
};