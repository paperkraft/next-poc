"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, X, BookOpen } from "lucide-react"
import { useInstitutionForm } from "../form-provider"

export const CustomFieldsSection = () => {
    const { formData, updateFormData } = useInstitutionForm()
    const [newFieldKey, setNewFieldKey] = useState("")
    const [newFieldValue, setNewFieldValue] = useState("")

    const addCustomField = () => {
        if (newFieldKey && newFieldValue) {
            updateFormData({
                customField: {
                    ...formData.customField,
                    [newFieldKey]: newFieldValue,
                },
            })
            setNewFieldKey("")
            setNewFieldValue("")
        }
    }

    const removeCustomField = (key: string) => {
        const { [key]: removed, ...rest } = formData.customField
        updateFormData({ customField: rest })
    }

    const updateCustomFieldKey = (oldKey: string, newKey: string) => {
        const { [oldKey]: value, ...rest } = formData.customField
        updateFormData({
            customField: {
                ...rest,
                [newKey]: value,
            },
        })
    }

    const updateCustomFieldValue = (key: string, value: string) => {
        updateFormData({
            customField: {
                ...formData.customField,
                [key]: value,
            },
        })
    }

    return (
        <div className="space-y-6">
            <div className="border-b border-gray-200 pb-2">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Custom Institution Fields
                </h3>
                <p className="text-sm text-gray-500">Add custom fields specific to your institution's requirements</p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <Label className="text-sm font-medium text-gray-900 mb-3 block">Add New Custom Field</Label>
                <div className="flex gap-3">
                    <Input
                        placeholder="Field name (e.g., Board Affiliation)"
                        value={newFieldKey}
                        onChange={(e) => setNewFieldKey(e.target.value)}
                        className="h-11"
                    />
                    <Input
                        placeholder="Field value (e.g., CBSE)"
                        value={newFieldValue}
                        onChange={(e) => setNewFieldValue(e.target.value)}
                        className="h-11"
                    />
                    <Button
                        onClick={addCustomField}
                        disabled={!newFieldKey || !newFieldValue}
                        className="h-11 px-4 bg-blue-600 hover:bg-blue-700"
                    >
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {Object.keys(formData.customField).length > 0 && (
                <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-900">
                        Custom Fields ({Object.keys(formData.customField).length})
                    </Label>
                    {Object.entries(formData.customField).map(([key, value]) => (
                        <div key={key} className="flex gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                            <Input
                                value={key}
                                onChange={(e) => updateCustomFieldKey(key, e.target.value)}
                                className="flex-1 h-10"
                                placeholder="Field name"
                            />
                            <Input
                                value={value as string}
                                onChange={(e) => updateCustomFieldValue(key, e.target.value)}
                                className="flex-1 h-10"
                                placeholder="Field value"
                            />
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeCustomField(key)}
                                className="h-10 px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            {Object.keys(formData.customField).length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No custom fields added yet.</p>
                    <p className="text-sm">Use the form above to add institution-specific fields.</p>
                </div>
            )}
        </div>
    )
}
