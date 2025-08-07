"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useInstitutionForm } from "../form-provider"
import { academicYears, currencies, languages, timezones } from "../mock"

export const SettingsLimitsSection = () => {
    const { formData, updateNestedField } = useInstitutionForm()

    return (
        <div className="space-y-8">
            {/* Academic Settings */}
            <div className="space-y-4">
                <div className="border-b border-gray-200 pb-2">
                    <h3 className="text-lg font-semibold text-gray-900">Academic Settings</h3>
                    <p className="text-sm text-gray-500">Configure academic year and system preferences</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="academicYear" className="text-sm font-medium text-gray-900">
                            Current Academic Year
                        </Label>
                        <Select
                            value={formData.settings.academicYear || "2024-25"}
                            onValueChange={(value) => updateNestedField("settings", "academicYear", value)}
                        >
                            <SelectTrigger className="h-11">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {academicYears.map((year) => (
                                    <SelectItem key={year.value} value={year.value}>
                                        {year.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="semesterSystem" className="text-sm font-medium text-gray-900">
                            Academic System
                        </Label>
                        <Select
                            value={formData.settings.semesterSystem || "SEMESTER"}
                            onValueChange={(value: "SEMESTER" | "TRIMESTER" | "QUARTER") =>
                                updateNestedField("settings", "semesterSystem", value)
                            }
                        >
                            <SelectTrigger className="h-11">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="SEMESTER">Semester System</SelectItem>
                                <SelectItem value="TRIMESTER">Trimester System</SelectItem>
                                <SelectItem value="QUARTER">Quarter System</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* General Settings */}
            <div className="space-y-4">
                <div className="border-b border-gray-200 pb-2">
                    <h3 className="text-lg font-semibold text-gray-900">General Settings</h3>
                    <p className="text-sm text-gray-500">Configure timezone, currency, and language preferences</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="timezone" className="text-sm font-medium text-gray-900">
                            Timezone
                        </Label>
                        <Select
                            value={formData.settings.timezone || "UTC"}
                            onValueChange={(value) => updateNestedField("settings", "timezone", value)}
                        >
                            <SelectTrigger className="h-11">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {timezones.map((tz) => (
                                    <SelectItem key={tz.value} value={tz.value}>
                                        {tz.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="currency" className="text-sm font-medium text-gray-900">
                            Currency
                        </Label>
                        <Select
                            value={formData.settings.currency || "USD"}
                            onValueChange={(value) => updateNestedField("settings", "currency", value)}
                        >
                            <SelectTrigger className="h-11">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {currencies.map((currency) => (
                                    <SelectItem key={currency.value} value={currency.value}>
                                        {currency.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="language" className="text-sm font-medium text-gray-900">
                            Primary Language
                        </Label>
                        <Select
                            value={formData.settings.language || "en"}
                            onValueChange={(value) => updateNestedField("settings", "language", value)}
                        >
                            <SelectTrigger className="h-11">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {languages.map((lang) => (
                                    <SelectItem key={lang.value} value={lang.value}>
                                        {lang.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="space-y-1">
                        <Label htmlFor="notifications" className="text-sm font-medium text-gray-900">
                            System Notifications
                        </Label>
                        <p className="text-sm text-gray-600">Receive email notifications for important system updates</p>
                    </div>
                    <Switch
                        id="notifications"
                        checked={formData.settings.notifications || false}
                        onCheckedChange={(checked) => updateNestedField("settings", "notifications", checked)}
                    />
                </div>
            </div>

            {/* Capacity Limits */}
            <div className="space-y-4">
                <div className="border-b border-gray-200 pb-2">
                    <h3 className="text-lg font-semibold text-gray-900">Institution Capacity</h3>
                    <p className="text-sm text-gray-500">Set maximum capacity limits for your institution</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="maxStudents" className="text-sm font-medium text-gray-900">
                            Maximum Students
                        </Label>
                        <Input
                            id="maxStudents"
                            type="number"
                            value={formData.limits.maxStudents || ""}
                            onChange={(e) => updateNestedField("limits", "maxStudents", Number.parseInt(e.target.value) || 0)}
                            placeholder="1000"
                            className="h-11"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="maxFaculty" className="text-sm font-medium text-gray-900">
                            Maximum Faculty
                        </Label>
                        <Input
                            id="maxFaculty"
                            type="number"
                            value={formData.limits.maxFaculty || ""}
                            onChange={(e) => updateNestedField("limits", "maxFaculty", Number.parseInt(e.target.value) || 0)}
                            placeholder="100"
                            className="h-11"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="maxCourses" className="text-sm font-medium text-gray-900">
                            Maximum Courses
                        </Label>
                        <Input
                            id="maxCourses"
                            type="number"
                            value={formData.limits.maxCourses || ""}
                            onChange={(e) => updateNestedField("limits", "maxCourses", Number.parseInt(e.target.value) || 0)}
                            placeholder="200"
                            className="h-11"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="maxDepartments" className="text-sm font-medium text-gray-900">
                            Maximum Departments
                        </Label>
                        <Input
                            id="maxDepartments"
                            type="number"
                            value={formData.limits.maxDepartments || ""}
                            onChange={(e) => updateNestedField("limits", "maxDepartments", Number.parseInt(e.target.value) || 0)}
                            placeholder="20"
                            className="h-11"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="storageLimit" className="text-sm font-medium text-gray-900">
                            Storage Limit (GB)
                        </Label>
                        <Input
                            id="storageLimit"
                            type="number"
                            value={formData.limits.storageLimit || ""}
                            onChange={(e) => updateNestedField("limits", "storageLimit", Number.parseInt(e.target.value) || 0)}
                            placeholder="100"
                            className="h-11"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="apiCallsPerMonth" className="text-sm font-medium text-gray-900">
                            API Calls Per Month
                        </Label>
                        <Input
                            id="apiCallsPerMonth"
                            type="number"
                            value={formData.limits.apiCallsPerMonth || ""}
                            onChange={(e) => updateNestedField("limits", "apiCallsPerMonth", Number.parseInt(e.target.value) || 0)}
                            placeholder="10000"
                            className="h-11"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
