"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Search } from "lucide-react"

type NoRoleSelectedProps = {
    // No props needed
}

export function NoRoleSelected({ }: NoRoleSelectedProps) {
    return (
        <Card className="p-8 text-center">
            <div className="flex flex-col items-center gap-4 text-gray-500">
                <Users className="h-12 w-12" />
                <div>
                    <h3 className="text-lg font-medium text-gray-900">Select a Role</h3>
                    <p>Choose a role from the dropdown above to manage its permissions.</p>
                </div>
            </div>
        </Card>
    )
}

type LoadingStateProps = {
    roleName: string
}

export function LoadingState({ roleName }: LoadingStateProps) {
    return (
        <Card className="p-8 text-center">
            <div className="flex flex-col items-center gap-4 text-gray-500">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <div>
                    <h3 className="text-lg font-medium text-gray-900">Loading Permissions</h3>
                    <p>Fetching permission data for {roleName}...</p>
                </div>
            </div>
        </Card>
    )
}

type NoSearchResultsProps = {
    onClearSearch: () => void
}

export function NoSearchResults({ onClearSearch }: NoSearchResultsProps) {
    return (
        <Card className="p-8 text-center">
            <div className="flex flex-col items-center gap-4 text-gray-500">
                <Search className="h-12 w-12" />
                <div>
                    <h3 className="text-lg font-medium text-gray-900">No results found</h3>
                    <p>Try adjusting your search terms or clear the search to see all modules.</p>
                </div>
                <Button variant="outline" onClick={onClearSearch}>
                    Clear Search
                </Button>
            </div>
        </Card>
    )
}