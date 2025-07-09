"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"

type Props = {
    searchTerm: string
    onSearchChange: (term: string) => void
}

export function SearchBar({ searchTerm, onSearchChange }: Props) {
    return (
        <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
                type="text"
                placeholder="Search modules and groups..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-10"
            />
            {searchTerm && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSearchChange("")}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
                >
                    <X className="h-3 w-3" />
                </Button>
            )}
        </div>
    )
}
