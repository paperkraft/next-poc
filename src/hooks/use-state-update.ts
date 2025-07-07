import React from 'react';

export function useStateUpdater<T>(setState: React.Dispatch<React.SetStateAction<T>>) {
    return React.useCallback((
        updatedFields: Partial<T> | ((prev: T) => T)
    ) => {
        setState(prev =>
            typeof updatedFields === 'function'
                ? { ...prev, ...updatedFields(prev) }
                : { ...prev, ...updatedFields }
        );
    }, [setState]);
}