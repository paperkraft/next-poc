// types/widget.ts
import { UserWidget, Widget, TenantWidget, RoleWidget } from "@prisma/client";

// export type FullUserWidget = UserWidget & {
//     widget: TenantWidget & {
//         widget: Widget;
//         tenant: {
//             id: number;
//             name: string;
//             slug: string;
//         };
//     };
//     roleWidget: RoleWidget | null;
// };

// export type AvailableWidget = TenantWidget & {
//     widget: Widget;
//     roleWidget: {
//         isAssigned: boolean;
//         sortOrder: number;
//     }[];
// };

export interface AvailableWidget {
    id: number; // TenantWidget.id
    widget: {
        id: number; // Widget.id
        key: string;
        name: string;
        description: string;
        component: string;
    };
}


export interface FullUserWidget {
    id: number;
    widgetId: number;
    isPinned: boolean;
    isHidden: boolean;
    customSize: string;
    sortOrder: number;
    widget: {
        id: number;
        key: string;
        name: string;
        description: string;
        component: string;
    };
    roleWidget: {
        id: number;
        roleId: number;
        widgetId: number;
        isAssigned: boolean;
        sortOrder: number;
    };
}
