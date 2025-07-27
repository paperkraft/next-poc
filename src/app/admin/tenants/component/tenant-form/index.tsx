"use client"

import { Button } from "@/components/ui/button"
import { GraduationCap, Save, X } from "lucide-react"
import { InstitutionFormProvider, useInstitutionForm } from "./form-provider"
import { InstitutionFormTabs } from "./form-tabs"
import type { FormEvent } from "react"

const InstitutionFormActions = () => {
    const { formData } = useInstitutionForm()

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        console.log("Institution Data:", formData)
        alert("Institution created successfully! Check console for data.")
    }

    const handleSaveDraft = () => {
        console.log("Saving draft:", formData)
        alert("Draft saved successfully!")
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <Button variant="outline" onClick={handleSaveDraft} className="flex items-center gap-2 h-11 bg-transparent">
                    <Save className="w-4 h-4" />
                    Save as Draft
                </Button>
                <div className="flex gap-3">
                    <Button variant="outline" className="flex items-center gap-2 h-11 bg-transparent">
                        <X className="w-4 h-4" />
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} className="flex items-center gap-2 h-11 bg-blue-600 hover:bg-blue-700">
                        <GraduationCap className="w-4 h-4" />
                        Create Institution
                    </Button>
                </div>
            </div>
        </div>
    )
}

const InstitutionFormContent = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="container mx-auto p-6 space-y-6">
                <form className="space-y-6">
                    <InstitutionFormTabs />
                    <InstitutionFormActions />
                </form>
            </div>
        </div>
    )
}

export default function InstitutionForm() {
    return (
        <InstitutionFormProvider>
            <InstitutionFormContent />
        </InstitutionFormProvider>
    )
}
