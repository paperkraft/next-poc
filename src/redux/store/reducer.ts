import { combineReducers } from 'redux';

import stepperFormReducer from '@/redux/slice/stepper-form-slice';

// Combine all reducers
export const rootReducer = combineReducers({
    stepperForm: stepperFormReducer
});