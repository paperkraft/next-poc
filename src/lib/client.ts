import prisma from "./prisma"

export async function getTenantDb(tenantId: string) {
    // List of models that should be tenant-scoped
    const TENANT_AWARE_MODELS = [
        'User',
        'Role',
        'Permission',
        'MenuItem',
        // ... other tenant-specific models
    ] as const

    return prisma.$extends({
        query: {
            $allModels: {
                async $allOperations({ model, operation, args, query }) {
                    // Only modify operations that have a where clause
                    if (TENANT_AWARE_MODELS.includes(model as typeof TENANT_AWARE_MODELS[number])) {
                        if (args && 'where' in args) {
                            args.where = { ...args.where, tenantId: +tenantId }
                        }
                    }
                    return query(args)
                }
            }
        }
    })
}