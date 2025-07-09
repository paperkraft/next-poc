"use client"

import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

type Props = {
    searchTerm: string
    filteredCount: number
    totalGroups: number
    onClearSearch: () => void
}

export function SearchResultsInfo({ searchTerm, filteredCount, totalGroups, onClearSearch }: Props) {
    if (!searchTerm) return null

    return (
        <div className="flex items-center gap-2 text-sm text-gray-600">
            <Search className="h-4 w-4" />
            <span>{totalGroups === 0 ? "No results found" : `Found ${filteredCount} modules in ${totalGroups} groups`}</span>
            <Button variant="link" size="sm" onClick={onClearSearch} className="h-auto p-0 text-blue-600 hover:text-blue-800">
                Clear search
            </Button>
        </div>
    )
}