'use client'
import React, { createContext, useCallback, useContext, useEffect, useReducer, useMemo } from 'react';
import {
    addWidgetToUser,
    getAvailableWidgets,
    getUserWidgets,
    removeWidgetFromUser,
    reorderUserWidgets as serverReorderUserWidgets,
    resetUserWidgets as serverResetUserWidgets,
    updateUserWidget as serverUpdateUserWidget
} from '@/app/action/widgets';
import { AvailableWidget, FullUserWidget } from '@/types/widget';

// Enhanced types for better type safety
interface DashboardState {
    userWidgets: FullUserWidget[];
    availableWidgets: AvailableWidget[];
    isLoading: boolean;
    isInitialized: boolean;
    error: string | null;
    optimisticUpdates: Set<number>; // Track optimistic updates
}

type DashboardAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'INITIALIZE_SUCCESS'; payload: { userWidgets: FullUserWidget[]; availableWidgets: AvailableWidget[] } }
    | { type: 'UPDATE_WIDGET_OPTIMISTIC'; payload: { userWidgetId: number; updates: Partial<FullUserWidget> } }
    | { type: 'UPDATE_WIDGET_SUCCESS'; payload: FullUserWidget }
    | { type: 'REORDER_WIDGETS_OPTIMISTIC'; payload: Array<{ userWidgetId: number; sortOrder: number }> }
    | { type: 'ADD_WIDGET_OPTIMISTIC'; payload: FullUserWidget }
    | { type: 'REMOVE_WIDGET_OPTIMISTIC'; payload: number }
    | { type: 'RESET_WIDGETS_SUCCESS'; payload: FullUserWidget[] }
    | { type: 'REFRESH_AVAILABLE_WIDGETS'; payload: AvailableWidget[] }
    | { type: 'SET_OPTIMISTIC_UPDATE'; payload: { id: number; isOptimistic: boolean } }

interface DashboardContextType {
    // State
    userWidgets: FullUserWidget[];
    availableWidgets: AvailableWidget[];
    isLoading: boolean;
    isInitialized: boolean;
    error: string | null;

    // Actions
    initializeDashboard: (userId: number, tenantSlug: string) => Promise<void>;
    updateWidget: (userWidgetId: number, updates: Partial<Omit<FullUserWidget, 'id' | 'widget'>>) => Promise<void>;
    reorderWidgets: (updates: Array<{ userWidgetId: number; sortOrder: number }>) => Promise<void>;
    addWidget: (tenantWidgetId: number) => Promise<void>;
    removeWidget: (userWidgetId: number) => Promise<void>;
    resetWidgets: () => Promise<void>;
    refreshAvailableWidgets: () => Promise<void>;
    clearError: () => void;

    // Selectors
    getWidgetById: (id: number) => FullUserWidget | undefined;
    getVisibleWidgets: () => FullUserWidget[];
    getPinnedWidgets: () => FullUserWidget[];
    getHiddenWidgets: () => FullUserWidget[];
}

// Initial state
const initialState: DashboardState = {
    userWidgets: [],
    availableWidgets: [],
    isLoading: false,
    isInitialized: false,
    error: null,
    optimisticUpdates: new Set<number>()
};

// Reducer for better state management
function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };

        case 'SET_ERROR':
            return { ...state, error: action.payload };

        case 'INITIALIZE_SUCCESS':
            return {
                ...state,
                userWidgets: action.payload.userWidgets,
                availableWidgets: action.payload.availableWidgets,
                isLoading: false,
                isInitialized: true,
                error: null
            };

        case 'UPDATE_WIDGET_OPTIMISTIC':
            return {
                ...state,
                userWidgets: state.userWidgets.map(w =>
                    w.id === action.payload.userWidgetId
                        ? { ...w, ...action.payload.updates }
                        : w
                ),
                optimisticUpdates: new Set<number>([...state.optimisticUpdates, action.payload.userWidgetId])
            };

        case 'UPDATE_WIDGET_SUCCESS':
            return {
                ...state,
                userWidgets: state.userWidgets.map(w =>
                    w.id === action.payload.id ? action.payload : w
                ),
                optimisticUpdates: new Set<number>([...state.optimisticUpdates].filter(id => id !== action.payload.id))
            };

        case 'REORDER_WIDGETS_OPTIMISTIC':
            const reorderedWidgets = state.userWidgets.map(w => {
                const update = action.payload.find(u => u.userWidgetId === w.id);
                return update ? { ...w, sortOrder: update.sortOrder } : w;
            }).sort((a, b) => a.sortOrder - b.sortOrder);

            return {
                ...state,
                userWidgets: reorderedWidgets
            };

        case 'ADD_WIDGET_OPTIMISTIC':
            return {
                ...state,
                userWidgets: [...state.userWidgets, action.payload],
                isLoading: false
            };

        case 'REMOVE_WIDGET_OPTIMISTIC':
            return {
                ...state,
                userWidgets: state.userWidgets.filter(w => w.id !== action.payload)
            };

        case 'RESET_WIDGETS_SUCCESS':
            return {
                ...state,
                userWidgets: action.payload,
                isLoading: false
            };

        case 'REFRESH_AVAILABLE_WIDGETS':
            return {
                ...state,
                availableWidgets: action.payload
            };

        case 'SET_OPTIMISTIC_UPDATE':
            const newOptimisticUpdates = new Set<number>(state.optimisticUpdates);
            if (action.payload.isOptimistic) {
                newOptimisticUpdates.add(action.payload.id);
            } else {
                newOptimisticUpdates.delete(action.payload.id);
            }
            return {
                ...state,
                optimisticUpdates: newOptimisticUpdates
            };

        default:
            return state;
    }
}

const DashboardContext = createContext<DashboardContextType | null>(null);


export function DashboardProvider({
    children,
    userId,
    tenantSlug
}: {
    children: React.ReactNode;
    userId: number;
    tenantSlug: string;
}) {

    const [state, dispatch] = useReducer(dashboardReducer, initialState);

    // Enhanced error handling with retry mechanism
    const safeAction = useCallback(async <T,>(
        action: () => Promise<T>,
        rollbackAction?: () => void,
        retryCount = 0
    ): Promise<T> => {
        try {
            dispatch({ type: 'SET_ERROR', payload: null });
            return await action();
        } catch (err) {
            const error = err instanceof Error ? err.message : 'An unknown error occurred';

            // Rollback optimistic updates if provided
            if (rollbackAction) {
                rollbackAction();
            }

            // Retry logic for network errors
            if (retryCount < 2 && error.includes('fetch')) {
                await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
                return safeAction(action, rollbackAction, retryCount + 1);
            }

            dispatch({ type: 'SET_ERROR', payload: error });
            throw err;
        }
    }, []);

    const initializeDashboard = useCallback(async (userId: number, tenantSlug: string) => {
        if (state.isInitialized) return; // Prevent re-initialization

        return safeAction(async () => {
            dispatch({ type: 'SET_LOADING', payload: true });

            const [userWidgets, availableWidgets] = await Promise.all([
                getUserWidgets(userId),
                getAvailableWidgets(tenantSlug, userId)
            ]);

            console.log('Dashboard initialized:', { userWidgets, availableWidgets });

            dispatch({
                type: 'INITIALIZE_SUCCESS',
                payload: { userWidgets, availableWidgets }
            });
        });
    }, [state.isInitialized, safeAction]);

    const updateWidget = useCallback(async (
        userWidgetId: number,
        updates: Partial<Omit<FullUserWidget, 'id' | 'widget'>>
    ) => {
        // Optimistic update
        dispatch({
            type: 'UPDATE_WIDGET_OPTIMISTIC',
            payload: { userWidgetId, updates }
        });

        const originalWidget = state.userWidgets.find(w => w.id === userWidgetId);

        return safeAction(
            async () => {
                const updatedWidget = await serverUpdateUserWidget({
                    userWidgetId,
                    userId,
                    updates
                });

                dispatch({
                    type: 'UPDATE_WIDGET_SUCCESS',
                    payload: updatedWidget
                });
            },
            // Rollback function
            () => {
                if (originalWidget) {
                    dispatch({
                        type: 'UPDATE_WIDGET_OPTIMISTIC',
                        payload: { userWidgetId, updates: originalWidget }
                    });
                }
            }
        );
    }, [state.userWidgets, userId, safeAction]);

    const reorderWidgets = useCallback(async (updates: Array<{ userWidgetId: number; sortOrder: number }>) => {
        const originalOrder = state.userWidgets.map(w => ({ id: w.id, sortOrder: w.sortOrder }));

        // Optimistic update
        dispatch({
            type: 'REORDER_WIDGETS_OPTIMISTIC',
            payload: updates
        });

        return safeAction(
            async () => {
                await serverReorderUserWidgets({
                    userId,
                    updates
                });
            },
            // Rollback function
            () => {
                dispatch({
                    type: 'REORDER_WIDGETS_OPTIMISTIC',
                    payload: originalOrder.map(w => ({ userWidgetId: w.id, sortOrder: w.sortOrder }))
                });
            }
        );
    }, [state.userWidgets, userId, safeAction]);

    const addWidget = useCallback(async (tenantWidgetId: number) => {
        return safeAction(async () => {
            dispatch({ type: 'SET_LOADING', payload: true });

            const newWidget = await addWidgetToUser({ userId, widgetId: tenantWidgetId });

            dispatch({
                type: 'ADD_WIDGET_OPTIMISTIC',
                payload: newWidget
            });

            // Refresh available widgets to remove the added one
            await refreshAvailableWidgets();
        });
    }, [userId, safeAction]);

    const removeWidget = useCallback(async (userWidgetId: number) => {
        const widgetToRemove = state.userWidgets.find(w => w.id === userWidgetId);

        // Optimistic update
        dispatch({
            type: 'REMOVE_WIDGET_OPTIMISTIC',
            payload: userWidgetId
        });

        return safeAction(
            async () => {
                await removeWidgetFromUser({
                    userWidgetId,
                    userId
                });

                // Refresh available widgets to show the removed one
                await refreshAvailableWidgets();
            },
            // Rollback function
            () => {
                if (widgetToRemove) {
                    dispatch({
                        type: 'ADD_WIDGET_OPTIMISTIC',
                        payload: widgetToRemove
                    });
                }
            }
        );
    }, [state.userWidgets, userId, safeAction]);

    const resetWidgets = useCallback(async () => {
        const originalWidgets = state.userWidgets;

        return safeAction(
            async () => {
                dispatch({ type: 'SET_LOADING', payload: true });

                const defaultWidgets = await serverResetUserWidgets(userId);

                dispatch({
                    type: 'RESET_WIDGETS_SUCCESS',
                    payload: defaultWidgets
                });

                // Refresh available widgets
                await refreshAvailableWidgets();
            },
            // Rollback function
            () => {
                dispatch({
                    type: 'RESET_WIDGETS_SUCCESS',
                    payload: originalWidgets
                });
            }
        );
    }, [state.userWidgets, userId, safeAction]);

    const refreshAvailableWidgets = useCallback(async () => {
        return safeAction(async () => {
            const availableWidgets = await getAvailableWidgets(tenantSlug, userId);
            dispatch({
                type: 'REFRESH_AVAILABLE_WIDGETS',
                payload: availableWidgets
            });
        });
    }, [tenantSlug, userId, safeAction]);

    const clearError = useCallback(() => {
        dispatch({ type: 'SET_ERROR', payload: null });
    }, []);

    // Memoized selectors for better performance
    const selectors = useMemo(() => ({
        getWidgetById: (id: number) => state.userWidgets.find(w => w.id === id),

        getVisibleWidgets: () => state.userWidgets.filter(w => !w.isHidden),

        getPinnedWidgets: () => state.userWidgets.filter(w => w.isPinned && !w.isHidden),

        getHiddenWidgets: () => state.userWidgets.filter(w => w.isHidden)
    }), [state.userWidgets]);

    // Initialize dashboard on mount
    useEffect(() => {
        initializeDashboard(userId, tenantSlug);
    }, [userId, tenantSlug, initializeDashboard]);

    // Auto-refresh available widgets periodically
    useEffect(() => {
        if (!state.isInitialized) return;

        const interval = setInterval(() => {
            refreshAvailableWidgets();
        }, 5 * 60 * 1000); // Refresh every 5 minutes

        return () => clearInterval(interval);
    }, [state.isInitialized, refreshAvailableWidgets]);

    // Memoized context value to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({
        // State
        userWidgets: state.userWidgets,
        availableWidgets: state.availableWidgets,
        isLoading: state.isLoading,
        isInitialized: state.isInitialized,
        error: state.error,

        // Actions
        initializeDashboard,
        updateWidget,
        reorderWidgets,
        addWidget,
        removeWidget,
        resetWidgets,
        refreshAvailableWidgets,
        clearError,

        // Selectors
        ...selectors
    }), [
        state.userWidgets,
        state.availableWidgets,
        state.isLoading,
        state.isInitialized,
        state.error,
        initializeDashboard,
        updateWidget,
        reorderWidgets,
        addWidget,
        removeWidget,
        resetWidgets,
        refreshAvailableWidgets,
        clearError,
        selectors
    ]);


    return (
        <DashboardContext.Provider value={contextValue}>
            {children}
        </DashboardContext.Provider>
    );
}

export const useDashboard = () => {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error('useDashboard must be used within a DashboardProvider');
    }
    return context;
};

// Additional hooks for specific use cases
export const useUserWidgets = () => {
    const { userWidgets, isLoading } = useDashboard();
    return { userWidgets, isLoading };
};

export const useAvailableWidgets = () => {
    const { availableWidgets, refreshAvailableWidgets } = useDashboard();
    return { availableWidgets, refreshAvailableWidgets };
};

export const useWidgetActions = () => {
    const { updateWidget, reorderWidgets, addWidget, removeWidget, resetWidgets } = useDashboard();
    return { updateWidget, reorderWidgets, addWidget, removeWidget, resetWidgets };
};