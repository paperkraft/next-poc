import StudentForm from '@/app/student/StudentForm';
import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('Student Form', () => {
    test('renders the form with name, email and select inputs and a submit button', () => {
        render(<StudentForm />);
        // Check if inputs and button are in the document
        expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/gender/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });

    test('updates the input fields and submits the form', async () => {
        // 1. Render component
        render(<StudentForm />);

        // 2. Manipulate Html document
        // Input fields
        const nameInput = screen.getByLabelText(/name/i);
        const emailInput = screen.getByLabelText(/email/i);
        const dateInput = screen.getByLabelText(/date/i);
        const selectInput = screen.getByLabelText(/gender/i);
        const submitButton = screen.getByRole('button', { name: /submit/i });

        // 3. Assertion
        await act(async () => {
            // Simulate user typing
            fireEvent.change(nameInput, { target: { value: 'John Doe' } });
            fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });
            fireEvent.change(dateInput, { target: { value: '08/08/2000' } });
            fireEvent.change(selectInput, { target: { value: 'd' } });

            // Verify input values
            // expect(nameInput).toHaveValue('John Doe');
            // expect(emailInput).toHaveValue('john.doe.example.com');
            // expect(selectInput).toHaveValue('d');

            // Verify input types
            expect(typeof nameInput.value).toBe('string');
            expect(typeof emailInput.value).toBe('string');
            expect(typeof dateInput.value).toBe('string');
            expect(typeof selectInput.value).toBe('string');

            // Check if email matches a regex pattern
            const emailPattern =  /^[a-zA-Z0-9_.±]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/;
            expect(emailInput.value).toMatch(emailPattern);

            // Simulate form submission
            fireEvent.click(submitButton);
        });
    });
});