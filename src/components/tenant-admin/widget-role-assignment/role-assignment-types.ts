export type Widget = {
    id: number
    name: string
    category: string
    roles: Array<{
        roleId: number
        isAssigned: boolean
    }>
}

export type Role = {
    id: number
    name: string
    color: string
}