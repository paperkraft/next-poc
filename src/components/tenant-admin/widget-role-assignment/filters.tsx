"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"
import { useWidgetRoleAssignment } from "@/context/widget-role-assignment-context"

function sentenceCase(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function WidgetRoleAssignmentFilters() {
    const {
        widgetFilter,
        roleFilter,
        selectedCategory,
        categories,
        setWidgetFilter,
        setRoleFilter,
        setSelectedCategory,
    } = useWidgetRoleAssignment()

    return (
        <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                        placeholder="Search widgets..."
                        value={widgetFilter}
                        onChange={(e) => setWidgetFilter(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>
            <div className="flex-1">
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                        placeholder="Filter roles..."
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                    {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                            {category === "all" ? "All Categories" : sentenceCase(category)}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
