export type Role = {
    id: string;
    name: string;
};

export type FetchRolesResponse = {
    success: boolean;
    message: string;
    data?: Role[] | null;
};

export type FetchRoleResponse = {
    success: boolean;
    message: string;
    data?: Role | null;
};

export type RoleListProps = {
    data: Role[];
    moduleId?: string;
}