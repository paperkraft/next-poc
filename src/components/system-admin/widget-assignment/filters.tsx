"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { useWidgetAssignment } from "@/context/widget-assignment-context"

export function WidgetAssignmentFilters() {
    const { searchFilter, setSearchFilter, categoryFilter, setCategoryFilter, categories } = useWidgetAssignment()

    return (
        <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                        placeholder="Search widgets..."
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                    {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                            {category === "all" ? "All Categories" : category}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
