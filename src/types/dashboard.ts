export interface UserWidget {
    userWidgetId: string
    widgetId: string
    roleWidgetId: string
    name: string
    component: string
    description?: string
    sortOrder: number
    isPinned: boolean
    isHidden: boolean
    customSize: 'small' | 'medium' | 'large'
    config?: Record<string, any>
}

export interface AvailableWidget {
    id: string
    key: string
    name: string
    description: string
    component: string
    category?: string
    icon?: React.ComponentType
    isDefault?: boolean
}