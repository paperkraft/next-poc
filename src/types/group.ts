export type Group = {
    id: number;
    name: string;
};

export type FetchGroupsResponse = {
    success: boolean;
    message: string;
    data?: Group[] | null;
};

export type FetchGroupResponse = {
    success: boolean;
    message: string;
    data?: Group | null;
};

export type GroupListProps = {
    data: Group[];
    moduleId?: number;
}