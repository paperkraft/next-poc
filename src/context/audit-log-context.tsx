"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { Plus, Edit3, Trash2, LogIn, LogOut, AlertCircle, Activity } from "lucide-react"

// 1. Define the AuditLog interface
interface AuditLog {
    id: number
    action: string
    user: { id: number; name: string }
    tenant: { id: number; name: string; slug: string } | null
    // userId: number
    // tenantId: number | null
    // slug: string
    entity: string
    details: Record<string, any>
    device: { type: string; os: string; browser: string, ip: string } | null
    createdAt: string
}

// 2. Define the Filters interface
interface Filters {
    action: string
    userId: string
    tenantId: string
    entity: string
    dateFrom: string
    dateTo: string
    search: string
}

// 3. Define the Context Value interface
interface AuditLogContextType {
    open: boolean
    logs: AuditLog[]
    filteredLogs: AuditLog[]
    paginatedLogs: AuditLog[] // Added to context
    loading: boolean
    selectedLog: AuditLog | null
    filters: Filters
    currentPage: number
    showFilters: boolean
    logsPerPage: number
    totalPages: number
    setSelectedLog: (log: AuditLog | null) => void
    setFilters: (filters: Filters) => void
    setCurrentPage: (page: number) => void
    setShowFilters: (show: boolean) => void
    getActionIcon: (action: string) => ReactNode
    getActionColor: (action: string) => string
    formatDate: (dateString: string) => string
    handleFilterChange: (key: keyof Filters, value: string) => void
    clearFilters: () => void
    setOpen: (b: boolean) => void
}

// 4. Create the Context
const AuditLogContext = createContext<AuditLogContextType | undefined>(undefined)

// 5. Create the Provider Component
interface AuditLogProviderProps {
    children: ReactNode
    data: any[]
}

export function AuditLogProvider({ children, data }: AuditLogProviderProps) {
    const [logs, setLogs] = useState<AuditLog[]>([])
    const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([])
    const [loading, setLoading] = useState(true)
    const [open, setOpen] = useState(false)
    const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
    const [filters, setFilters] = useState<Filters>({
        action: "All Actions",
        userId: "",
        tenantId: "",
        entity: "",
        dateFrom: "",
        dateTo: "",
        search: "",
    })
    const [currentPage, setCurrentPage] = useState(1)
    const [showFilters, setShowFilters] = useState(false)
    const logsPerPage = 10

    // Mock data generation
    const generateMockLogs = useCallback((): AuditLog[] => {
        const actions = ["CREATE", "UPDATE", "DELETE", "LOGIN", "LOGOUT", "ERROR"]
        const entities = ["User", "Tenant", "Product", "Order", "Payment", "Settings"]
        const users = ["John Doe", "Jane Smith", "Admin User", "Bob Johnson", "Alice Brown"]
        const tenants = ["Acme Corp", "TechStart Inc", "Global Ltd", "Innovation Co", "Enterprise X"]

        const mockLogs: AuditLog[] = []
        for (let i = 1; i <= 150; i++) {
            const action = actions[Math.floor(Math.random() * actions.length)]
            const entity = entities[Math.floor(Math.random() * entities.length)]
            const user = users[Math.floor(Math.random() * users.length)]
            const tenant = tenants[Math.floor(Math.random() * tenants.length)]

            mockLogs.push({
                id: i,
                action,
                user: { id: Math.floor(Math.random() * 100), name: user },
                // userId: Math.floor(Math.random() * 100),
                tenant: { id: Math.floor(Math.random() * 50), name: tenant, slug: `${entity.toLowerCase()}-${i}` },
                // tenantId: Math.floor(Math.random() * 50),
                // slug: `${entity.toLowerCase()}-${i}`,
                entity,
                details: {
                    changes: action === "UPDATE" ? { name: "Updated value", status: "active" } : {},
                    reason: action === "DELETE" ? "User requested deletion" : "",
                    errorMessage: action === "ERROR" ? "Database connection failed" : "",
                },
                device: {
                    type: "desktop",
                    os: "Windows 10",
                    browser: "Chrome",
                    ip: `192.168.1.${Math.floor(Math.random() * 255)}`
                },
                createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
            })
        }
        return mockLogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }, [])

    useEffect(() => {
        // Simulate API call
        // setTimeout(() => {
        //     const mockData = generateMockLogs()
        //     setLogs(mockData)
        //     setFilteredLogs(mockData)
        //     setLoading(false)
        // }, 1000)

        if (data) {
            const format = data.map((item) => {
                return {
                    id: item?.id,
                    action: item?.action,
                    user: {
                        id: item?.user?.id,
                        name: item?.user?.profile?.firstName + " " + item?.user?.profile?.lastName
                    },
                    tenant: {
                        id: item?.tenant?.id,
                        name: item?.tenant?.name,
                        slug: item?.tenant?.slug,
                    },
                    entity: item?.entity,
                    details: item?.details,
                    device: {
                        type: item?.device?.type ?? item?.device?.device,
                        os: item?.device?.os,
                        browser: item?.device?.browser,
                        ip: item?.device?.ip
                    },
                    createdAt: item?.createdAt
                }
            })
            setLogs(format)
            setFilteredLogs(format)
            setLoading(false)
        }

    }, [data])

    const applyFilters = useCallback(() => {
        let filtered = [...logs]
        if (filters.action !== "All Actions") {
            filtered = filtered.filter((log) => log?.action === filters.action)
        }
        if (filters.userId) {
            filtered = filtered.filter((log) => log?.user?.id.toString().includes(filters.userId))
        }
        if (filters.tenantId) {
            filtered = filtered.filter((log) => log?.tenant?.id?.toString().includes(filters.tenantId))
        }
        if (filters.entity) {
            filtered = filtered.filter((log) => log?.entity?.toLowerCase().includes(filters.entity.toLowerCase()))
        }
        if (filters.dateFrom) {
            filtered = filtered.filter((log) => new Date(log.createdAt) >= new Date(filters.dateFrom))
        }
        if (filters.dateTo) {
            filtered = filtered.filter((log) => new Date(log.createdAt) <= new Date(filters.dateTo))
        }
        if (filters.search) {
            filtered = filtered.filter(
                (log) =>
                    log?.user?.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
                    log?.entity?.toLowerCase().includes(filters.search.toLowerCase()) ||
                    log?.tenant?.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
                    JSON.stringify(log?.details)?.toLowerCase().includes(filters.search.toLowerCase())
                // JSON.stringify(log.metadata).toLowerCase().includes(filters.search.toLowerCase()),
            )
        }
        setFilteredLogs(filtered)
        setCurrentPage(1)
    }, [filters, logs])

    useEffect(() => {
        applyFilters()
    }, [filters, logs, applyFilters])

    const getActionIcon = useCallback((action: string) => {
        switch (action) {
            case "CREATE":
                return <Plus className="w-3 h-3" />
            case "UPDATE":
                return <Edit3 className="w-3 h-3" />
            case "DELETE":
                return <Trash2 className="w-3 h-3" />
            case "LOGIN":
                return <LogIn className="w-3 h-3" />
            case "LOGOUT":
                return <LogOut className="w-3 h-3" />
            case "ERROR":
                return <AlertCircle className="w-3 h-3" />
            default:
                return <Activity className="w-3 h-3" />
        }
    }, [])

    const getActionColor = useCallback((action: string) => {
        switch (action) {
            case "CREATE":
                return "bg-green-100 text-green-700 hover:bg-green-200"
            case "UPDATE":
                return "bg-blue-100 text-blue-700 hover:bg-blue-200"
            case "DELETE":
                return "bg-red-100 text-red-700 hover:bg-red-200"
            case "LOGIN":
                return "bg-purple-100 text-purple-700 hover:bg-purple-200"
            case "LOGOUT":
                return "bg-gray-100 text-gray-700 hover:bg-gray-200"
            case "ERROR":
                return "bg-orange-100 text-orange-700 hover:bg-orange-200"
            default:
                return "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }
    }, [])

    const formatDate = useCallback((dateString: string) => {
        return new Date(dateString).toLocaleString()
    }, [])

    const handleFilterChange = useCallback((key: keyof Filters, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }))
    }, [])

    const clearFilters = useCallback(() => {
        setFilters({
            action: "All Actions",
            userId: "",
            tenantId: "",
            entity: "",
            dateFrom: "",
            dateTo: "",
            search: "",
        })
    }, [])

    const paginatedLogs = filteredLogs.slice((currentPage - 1) * logsPerPage, currentPage * logsPerPage)
    const totalPages = Math.ceil(filteredLogs.length / logsPerPage)

    const contextValue = {
        open,
        logs,
        filteredLogs,
        paginatedLogs, // Provide paginatedLogs through context
        loading,
        selectedLog,
        filters,
        currentPage,
        showFilters,
        logsPerPage,
        totalPages,
        setSelectedLog,
        setFilters,
        setCurrentPage,
        setShowFilters,
        getActionIcon,
        getActionColor,
        formatDate,
        handleFilterChange,
        clearFilters,
        setOpen
    }

    return <AuditLogContext.Provider value={contextValue}>{children}</AuditLogContext.Provider>
}

// 6. Custom hook to use the context
export function useAuditLog() {
    const context = useContext(AuditLogContext)
    if (context === undefined) {
        throw new Error("useAuditLog must be used within an AuditLogProvider")
    }
    return context
}
