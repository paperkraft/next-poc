export type InstitutionType = "UNIVERSITY" | "COLLEGE" | "SCHOOL" | "ACADEMY" | "INSTITUTE" | "TRAINING_CENTER"

export interface Address {
    street?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
}

export interface Contact {
    email?: string
    phone?: string
    website?: string
    principalName?: string
    registrarEmail?: string
    admissionsPhone?: string
}

export interface InstitutionSettings {
    timezone?: string
    currency?: string
    language?: string
    academicYear?: string
    semesterSystem?: "SEMESTER" | "TRIMESTER" | "QUARTER"
    notifications?: boolean
}

export interface Limits {
    maxStudents?: number
    maxFaculty?: number
    maxCourses?: number
    maxDepartments?: number
    storageLimit?: number
    apiCallsPerMonth?: number
}

export interface Branding {
    primaryColor?: string
    secondaryColor?: string
    logo?: string
    favicon?: string
    institutionMotto?: string
}

export interface EducationalService {
    id: number
    name: string
    description?: string
    price: number
    billingCycle: "MONTHLY" | "YEARLY" | "ONE_TIME"
    category: string
    isActive: boolean
}

export interface EducationPlan {
    id: number
    planName: string
    planType: "BASIC" | "STANDARD" | "PREMIUM" | "ENTERPRISE"
    billingCycle: "MONTHLY" | "YEARLY"
    price: number
    status: "ACTIVE" | "INACTIVE" | "PENDING" | "CANCELLED"
    startDate: string
    endDate?: string
    autoRenew: boolean
    features: string[]
    popular?: boolean
    maxStudents: number
    maxFaculty: number
}

export interface InstitutionFormData {
    name: string
    description: string
    slug: string
    type: InstitutionType
    parentId: number | null
    address: Address
    settings: InstitutionSettings
    contact: Contact
    limits: Limits
    branding: Branding
    customField: Record<string, any>
    features: string[]
    isActive: boolean
    educationalServices: number[]
    subscriptionId: number | null
    establishedYear?: number
    accreditation?: string
    affiliatedUniversity?: string
}

export interface ParentInstitution {
    id: number
    name: string
    slug: string
    type: InstitutionType
}
