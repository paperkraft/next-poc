import { StepperFormValues } from "@/types/sample-form";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const InitialFormValue = {
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    gender: "",
    bloodGroup: "",

    location: {
        addressLine1: "",
        addressLine2: "",
        addressLine3: "",
        country: "",
        state: "",
        city: "",
    },

    email: "",
    mobile: "",
    alternateMobile: "",

    emergencyContacts: [],
}

interface InitialState {
    activeStep: number;
    formData: StepperFormValues;
}
const initialState: InitialState = {
    activeStep: 1,
    formData: InitialFormValue as unknown as StepperFormValues
}

export const stepperFormSlice = createSlice({
    name: 'stepper-form',
    initialState,
    reducers: {
        // Update the active form step
        updateStep: (state, action: PayloadAction<number>) => {
            state.activeStep = action.payload;
        },

        // Update the admissionForm partially (used in progressive form saving)
        updateForm: (state, action: PayloadAction<Partial<StepperFormValues>>) => {
            state.formData = { ...state.formData, ...action.payload };
        },

        //  Reset the form back to initial state
        clearForm: () => {
            return initialState;
        }
    }
});

// Action creators are generated for each case reducer function
export const {
    updateStep,
    updateForm,
    clearForm
} = stepperFormSlice.actions;
export default stepperFormSlice.reducer;