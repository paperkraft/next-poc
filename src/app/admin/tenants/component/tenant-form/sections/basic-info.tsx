"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useInstitutionForm } from "../form-provider"
import { generateSlug } from "@/utils"
import { InstitutionType } from "@/types/tenant"
import { mockParentInstitutions } from "../mock"

export const BasicInfoSection = () => {
    const { formData, updateFormData } = useInstitutionForm()

    const handleNameChange = (name: string) => {
        updateFormData({
            name,
            slug: generateSlug(name),
        })
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-900">
                        Institution Name *
                    </Label>
                    <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        placeholder="e.g., Springfield High School"
                        className="h-11"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="slug" className="text-sm font-medium text-gray-900">
                        Institution Code *
                    </Label>
                    <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => updateFormData({ slug: e.target.value })}
                        placeholder="springfield-high"
                        className="h-11"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-gray-900">
                    Institution Description
                </Label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => updateFormData({ description: e.target.value })}
                    placeholder="Brief description of your educational institution, mission, and vision"
                    rows={4}
                    className="resize-none"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="type" className="text-sm font-medium text-gray-900">
                        Institution Type *
                    </Label>
                    <Select value={formData.type} onValueChange={(value: InstitutionType) => updateFormData({ type: value })}>
                        <SelectTrigger className="h-11">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="UNIVERSITY">🏛️ University</SelectItem>
                            <SelectItem value="COLLEGE">🎓 College</SelectItem>
                            <SelectItem value="SCHOOL">🏫 School</SelectItem>
                            <SelectItem value="ACADEMY">📚 Academy</SelectItem>
                            <SelectItem value="INSTITUTE">🔬 Institute</SelectItem>
                            <SelectItem value="TRAINING_CENTER">💼 Training Center</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="establishedYear" className="text-sm font-medium text-gray-900">
                        Established Year
                    </Label>
                    <Input
                        id="establishedYear"
                        type="number"
                        value={formData.establishedYear || ""}
                        onChange={(e) => updateFormData({ establishedYear: Number.parseInt(e.target.value) || undefined })}
                        placeholder="1995"
                        min="1800"
                        max={new Date().getFullYear()}
                        className="h-11"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="parent" className="text-sm font-medium text-gray-900">
                        Parent Organization
                    </Label>
                    <Select
                        value={formData.parentId?.toString() || "0"}
                        onValueChange={(value) => updateFormData({ parentId: value ? Number.parseInt(value) : null })}
                    >
                        <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select parent organization" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0">Independent Institution</SelectItem>
                            {mockParentInstitutions.map((institution) => (
                                <SelectItem key={institution.id} value={institution.id.toString()}>
                                    {institution.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="accreditation" className="text-sm font-medium text-gray-900">
                    Accreditation Details
                </Label>
                <Input
                    id="accreditation"
                    value={formData.accreditation || ""}
                    onChange={(e) => updateFormData({ accreditation: e.target.value })}
                    placeholder="e.g., NAAC A+ Grade, AICTE Approved"
                    className="h-11"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="affiliatedUniversity" className="text-sm font-medium text-gray-900">
                    Affiliated University (if applicable)
                </Label>
                <Input
                    id="affiliatedUniversity"
                    value={formData.affiliatedUniversity || ""}
                    onChange={(e) => updateFormData({ affiliatedUniversity: e.target.value })}
                    placeholder="e.g., State University"
                    className="h-11"
                />
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="space-y-1">
                    <Label htmlFor="isActive" className="text-sm font-medium text-gray-900">
                        Active Status
                    </Label>
                    <p className="text-sm text-gray-600">Enable this institution immediately after creation</p>
                </div>
                <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => updateFormData({ isActive: checked })}
                />
            </div>
        </div>
    )
}
