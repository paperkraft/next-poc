"use client"

import { InstitutionFormData } from "@/types/tenant"
import { createContext, useContext, useState, type ReactNode } from "react"

interface InstitutionContextType {
    formData: InstitutionFormData
    updateFormData: (updates: Partial<InstitutionFormData>) => void
    updateNestedField: (field: keyof InstitutionFormData, nestedField: string, value: any) => void
}

const InstitutionContext = createContext<InstitutionContextType | undefined>(undefined)

export const useInstitutionForm = () => {
    const context = useContext(InstitutionContext)
    if (!context) {
        throw new Error("useInstitutionForm must be used within an InstitutionFormProvider")
    }
    return context
}

const initialFormData: InstitutionFormData = {
    name: "",
    description: "",
    slug: "",
    type: "SCHOOL",
    parentId: null,
    address: {},
    settings: {
        timezone: "UTC",
        currency: "USD",
        language: "en",
        academicYear: "2024-25",
        semesterSystem: "SEMESTER",
        notifications: true,
    },
    contact: {},
    limits: {
        maxStudents: 1000,
        maxFaculty: 100,
        maxCourses: 200,
        maxDepartments: 20,
        storageLimit: 100,
        apiCallsPerMonth: 10000,
    },
    branding: {
        primaryColor: "#1e40af",
        secondaryColor: "#64748b",
    },
    customField: {},
    features: [],
    isActive: true,
    educationalServices: [],
    subscriptionId: null,
    establishedYear: new Date().getFullYear(),
}

export const InstitutionFormProvider = ({ children }: { children: ReactNode }) => {
    const [formData, setFormData] = useState<InstitutionFormData>(initialFormData)

    const updateFormData = (updates: Partial<InstitutionFormData>) => {
        setFormData((prev) => ({ ...prev, ...updates }))
    }

    const updateNestedField = (field: keyof InstitutionFormData, nestedField: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: {
                ...prev[field] as any,
                [nestedField]: value,
            },
        }))
    }

    return (
        <InstitutionContext.Provider value={{ formData, updateFormData, updateNestedField }}>
            {children}
        </InstitutionContext.Provider>
    )
}
