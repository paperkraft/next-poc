import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StepperState {
    key?: string;
    activeStep: number;
    setActiveStep: (step: number) => void;
    formData: Record<string, any>;
    updateFormData: (data: Record<string, any>) => void;
    resetForm: () => void;  
}

export const useStepperStore = create<StepperState>()(
    persist(
        (set) => ({
            activeStep: 1,
            setActiveStep: (step) => set({ activeStep: step }),
            formData: {},
            updateFormData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),
            resetForm: () => set({ formData: {} }),
        }),
        { name: "stepper-form" }
    )
);