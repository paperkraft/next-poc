import { FieldErrors, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

interface NestedErrors {
  [key: string]: any;
}

// Helper function to retrieve a nested error message using a dot-separated path
const getNestedError = (errors: NestedErrors, fieldPath: string): { message?: string } | undefined => {
  return fieldPath.split('.').reduce((acc, key) => acc?.[key], errors);
};

// Recursively collect all field paths from a nested object structure (including arrays and objects)
const collectFieldPaths = (values: any, parentPath = ""): string[] => {
  return Object.entries(values).flatMap(([key, value]) => {
    const path = parentPath ? `${parentPath}.${key}` : key;

    // If the value is an array, recurse into each item using its index
    if (Array.isArray(value)) {
      return value.flatMap((item, index) =>
        collectFieldPaths(item ?? {}, `${path}.${index}`)
      );
    }
    // If the value is an object, recursively collect its nested paths
    else if (typeof value === "object" && value !== null) {
      return collectFieldPaths(value, path);
    }
    // For primitive values, return the current path
    return [path];
  });
};

// Main function to handle and display validation errors using toast
export const handleFormError = <T extends Record<string, any>>(form: UseFormReturn<T>, errors: FieldErrors<T>) => {
  let ErrorMessage: string | undefined;

  // Get all possible field paths from the current form values
  const allFieldPaths = collectFieldPaths(form.getValues());

  // Filter the list of all fields to include only those that have associated validation errors
  const fieldsWithErrors = allFieldPaths.filter((path) => getNestedError(errors, path));


  // Loop through the erroneous fields and display the first error message found
  for (const fieldPath of fieldsWithErrors) {
    const error = getNestedError(errors, fieldPath);
    if (error?.message) {
      ErrorMessage = error.message;
      break;
    }
  }

  // If an error message was found, show it using a toast notification
  if (ErrorMessage) {
    toast.error(ErrorMessage);
  }
};

// error handler function
export const handleUserFormError = (error: unknown, fallbackMessage: string) => {
  if (error instanceof Error) {
    toast.error(error.message);
  } else {
    toast.error(fallbackMessage);
  }
};

