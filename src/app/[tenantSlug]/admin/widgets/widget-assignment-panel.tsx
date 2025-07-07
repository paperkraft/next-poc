"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Search, Filter, Grid3X3, List, Users, Check, X } from "lucide-react"
import { useWidgetAssignment } from "@/context/WidgetAssignmentContext"
import { sentenceCase } from "@/lib/utils"

type ViewMode = "table" | "cards" | "roles"

export function WidgetAssignmentPanel() {
    const [viewMode, setViewMode] = useState<ViewMode>("cards")
    const [selectedCategory, setSelectedCategory] = useState<string>("all")

    const {
        widgets,
        roles,
        selectedWidgets,
        roleFilter,
        widgetFilter,
        isUpdating,
        setWidgetFilter,
        setSelectedWidgets,
        setRoleFilter,
        toggleWidgetSelection,
        toggleAssignment,
        bulkAssignToRole,
    } = useWidgetAssignment();

    const categories = ["all", ...Array.from(new Set(widgets.map((w) => w.category)))]

    const filteredWidgets = widgets.filter((widget) => {
        const matchesWidget = widget.name.toLowerCase().includes(widgetFilter.toLowerCase())
        const matchesCategory = selectedCategory === "all" || widget.category === selectedCategory
        return matchesWidget && matchesCategory
    })

    const filteredRoles = roles.filter((role) => role.name.toLowerCase().includes(roleFilter.toLowerCase()))

    const getAssignmentStatus = (widget: any, roleId: number) => {
        return widget.roles.find((r: any) => r.roleId === roleId)?.isAssigned || false
    }

    const getAssignedRolesCount = (widget: any) => {
        return widget.roles.filter((r: any) => r.isAssigned).length
    }

    // Table View Component
    const TableView = () => (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
                <thead>
                    <tr>
                        <th className="px-4 py-3 text-left w-12">
                            <Checkbox
                                checked={selectedWidgets.length === filteredWidgets.length}
                                onCheckedChange={(checked) => {
                                    if (checked) {
                                        setSelectedWidgets(filteredWidgets.map((w) => w.id))
                                    } else {
                                        setSelectedWidgets([])
                                    }
                                }}
                            />
                        </th>
                        <th className="px-4 py-3 text-left min-w-[200px] sticky left-0 bg-background">Widget</th>
                        {filteredRoles.map((role) => (
                            <th key={role.id} className="px-4 py-3 text-center min-w-[120px]">
                                <Badge variant="secondary" className={role.color}>
                                    {role.name}
                                </Badge>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {filteredWidgets.map((widget) => {
                        const isSelected = selectedWidgets.includes(widget.id)
                        return (
                            <tr key={widget.id} className={isSelected ? "bg-accent/50" : undefined}>
                                <td className="px-4 py-4">
                                    <Checkbox
                                        checked={isSelected}
                                        onCheckedChange={() => toggleWidgetSelection(widget.id)}
                                        disabled={isUpdating}
                                    />
                                </td>
                                <td className="px-4 py-4 sticky left-0 bg-background">
                                    <div>
                                        <div className="font-medium">{widget.name}</div>
                                        <div className="text-sm text-muted-foreground">{widget.category}</div>
                                    </div>
                                </td>
                                {filteredRoles.map((role) => (
                                    <td key={role.id} className="px-4 py-4 text-center">
                                        <Switch
                                            checked={getAssignmentStatus(widget, role.id)}
                                            onCheckedChange={(checked) => toggleAssignment(widget.id, role.id, checked)}
                                            disabled={isUpdating}
                                        />
                                    </td>
                                ))}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )

    // Cards View Component
    const CardsView = () => (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredWidgets.map((widget) => {
                const isSelected = selectedWidgets.includes(widget.id)
                const assignedCount = getAssignedRolesCount(widget)

                return (
                    <Card key={widget.id} className={`transition-all ${isSelected ? "ring-2 ring-primary" : ""}`}>
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                    <Checkbox
                                        checked={isSelected}
                                        onCheckedChange={() => toggleWidgetSelection(widget.id)}
                                        disabled={isUpdating}
                                    />
                                    <div>
                                        <CardTitle className="text-base">{widget.name}</CardTitle>
                                        <Badge variant="outline" className="mt-1">
                                            {widget.category}
                                        </Badge>
                                    </div>
                                </div>
                                <Badge variant="secondary">
                                    {assignedCount}/{roles.length} roles
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {filteredRoles.map((role) => (
                                    <div key={role.id} className="flex items-center justify-between">
                                        <Badge variant="outline" className={`${role.color} text-xs`}>
                                            {role.name}
                                        </Badge>
                                        <Switch
                                            checked={getAssignmentStatus(widget, role.id)}
                                            onCheckedChange={(checked) => toggleAssignment(widget.id, role.id, checked)}
                                            disabled={isUpdating}
                                        // size="sm"
                                        />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )

    // Roles View Component
    const RolesView = () => (
        <Accordion type="multiple" className="w-full">
            {filteredRoles.map((role) => {
                const assignedWidgets = filteredWidgets.filter((widget) => getAssignmentStatus(widget, role.id))

                return (
                    <AccordionItem key={role.id} value={`${role.id}`}>
                        <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center gap-3">
                                <Badge className={role.color}>{role.name}</Badge>
                                <span className="text-sm text-muted-foreground">
                                    {assignedWidgets.length} of {filteredWidgets.length} widgets assigned
                                </span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-2 pt-2">
                                {filteredWidgets.map((widget) => (
                                    <div key={widget.id} className="flex items-center justify-between p-3 rounded-lg border">
                                        <div className="flex items-center gap-3">
                                            <Checkbox
                                                checked={selectedWidgets.includes(widget.id)}
                                                onCheckedChange={() => toggleWidgetSelection(widget.id)}
                                                disabled={isUpdating}
                                            />
                                            <div>
                                                <div className="font-medium">{widget.name}</div>
                                                <div className="text-sm text-muted-foreground">{widget.category}</div>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={getAssignmentStatus(widget, role.id)}
                                            onCheckedChange={(checked) => toggleAssignment(widget.id, role.id, checked)}
                                            disabled={isUpdating}
                                        />
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )
            })}
        </Accordion>
    )


    return (
        <div className="space-y-6">
            {/* Header with filters and controls */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Widget Assignment</h2>
                    <div className="flex items-center gap-2">
                        <Button
                            variant={viewMode === "table" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setViewMode("table")}
                        >
                            <List className="w-4 h-4" />
                        </Button>
                        <Button
                            variant={viewMode === "cards" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setViewMode("cards")}
                        >
                            <Grid3X3 className="w-4 h-4" />
                        </Button>
                        <Button
                            variant={viewMode === "roles" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setViewMode("roles")}
                        >
                            <Users className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Filters */}
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
            </div>

            {/* Bulk actions */}
            {selectedWidgets.length > 0 && (
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Badge variant="secondary">{selectedWidgets.length} widget(s) selected</Badge>
                                <Separator orientation="vertical" className="h-6" />
                                <span className="text-sm text-muted-foreground">Bulk assign to:</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ScrollArea className="w-96]">
                                    <div className="flex items-center gap-2 pb-2">
                                        {filteredRoles.map((role) => (
                                            <div key={role.id} className="flex items-center gap-1">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => bulkAssignToRole(role.id, true)}
                                                    disabled={isUpdating}
                                                    className="whitespace-nowrap"
                                                >
                                                    <Check className="w-3 h-3 mr-1" />
                                                    {role.name}
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => bulkAssignToRole(role.id, false)}
                                                    disabled={isUpdating}
                                                >
                                                    <X className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                    <ScrollBar orientation="horizontal" />
                                </ScrollArea>
                                <Button variant="ghost" size="sm" onClick={() => setSelectedWidgets([])}>
                                    Clear
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Main content */}
            <div className="min-h-[360px]">
                {viewMode === "table" && <TableView />}
                {viewMode === "cards" && <CardsView />}
                {viewMode === "roles" && <RolesView />}

                {filteredWidgets.length === 0 || filteredRoles.length === 0 && (
                    <div className="flex items-center justify-center h-64">
                        <p className="text-muted-foreground">No widgets or roles found</p>
                    </div>
                )}
            </div>

            {/* Summary */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>
                            Showing {filteredWidgets.length} of {widgets.length} widgets
                        </span>
                        <span>{filteredRoles.length} roles configured</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
