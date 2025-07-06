'use client'
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
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
import { TenantWidget, Widget } from '@prisma/client';

interface DashboardContextType {
    userWidgets: FullUserWidget[];
    availableWidgets: AvailableWidget[];
    isLoading: boolean;
    error: string | null;
    initializeDashboard: (userId: number, tenantSlug: string) => Promise<void>;
    updateWidget: (userWidgetId: number, updates: Partial<Omit<FullUserWidget, 'id' | 'widget'>>) => Promise<void>;
    reorderWidgets: (updates: Array<{ userWidgetId: number; sortOrder: number }>) => Promise<void>;
    addWidget: (tenantWidgetId: number) => Promise<void>;
    removeWidget: (userWidgetId: number) => Promise<void>;
    resetWidgets: () => Promise<void>;
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
    const [state, setState] = useState<{
        userWidgets: FullUserWidget[];
        availableWidgets: AvailableWidget[];
        isLoading: boolean;
        error: string | null;
    }>({
        userWidgets: [],
        availableWidgets: [],
        isLoading: false,
        error: null
    });

    const safeAction = async <T,>(action: () => Promise<T>): Promise<T> => {
        try {
            setState(prev => ({ ...prev, error: null }));
            return await action();
        } catch (err) {
            const error = err instanceof Error ? err.message : 'An unknown error occurred';
            setState(prev => ({ ...prev, error }));
            throw err;
        }
    };

    const initializeDashboard = useCallback(async (userId: number, tenantSlug: string) => {
        return safeAction(async () => {
            setState(prev => ({ ...prev, isLoading: true }));
            try {
                const [userWidgets, availableWidgets] = await Promise.all([
                    getUserWidgets(userId),
                    getAvailableWidgets(tenantSlug, userId)
                ]);

                console.log('userWidgets', userWidgets);
                console.log('availableWidgets', availableWidgets);


                setState({
                    userWidgets,
                    availableWidgets,
                    isLoading: false,
                    error: null
                });
            } catch (err) {
                setState(prev => ({ ...prev, isLoading: false }));
                throw err;
            }
        });
    }, []);

    const updateWidget = useCallback(async (userWidgetId: number, updates: Partial<Omit<FullUserWidget, 'id' | 'widget'>>) => {
        return safeAction(async () => {
            setState(prev => ({
                ...prev,
                userWidgets: prev.userWidgets.map(w =>
                    w.id === userWidgetId ? { ...w, ...updates } : w
                )
            }));

            await serverUpdateUserWidget({
                userWidgetId,
                userId,
                updates
            });
        });
    }, []);

    const reorderWidgets = useCallback(async (updates: Array<{ userWidgetId: number; sortOrder: number }>) => {
        return safeAction(async () => {
            const updatedWidgets = state.userWidgets.map(w => {
                const update = updates.find(u => u.userWidgetId === w.id);
                return update ? { ...w, sortOrder: update.sortOrder } : w;
            }).sort((a, b) => a.sortOrder - b.sortOrder);

            setState(prev => ({ ...prev, userWidgets: updatedWidgets }));

            await serverReorderUserWidgets({
                userId,
                updates: updates.map(u => ({
                    userWidgetId: u.userWidgetId,
                    sortOrder: u.sortOrder
                }))
            });
        });
    }, [state.userWidgets, userId]);

    const addWidget = useCallback(async (tenantWidgetId: number) => {
        return safeAction(async () => {
            setState(prev => ({ ...prev, isLoading: true }));
            try {
                const newWidget = await addWidgetToUser({ userId, widgetId: tenantWidgetId });
                setState(prev => ({
                    ...prev,
                    userWidgets: [...prev.userWidgets, newWidget],
                    isLoading: false
                }));
            } catch (err) {
                setState(prev => ({ ...prev, isLoading: false }));
                throw err;
            }
        });
    }, [userId]);

    const removeWidget = useCallback(async (userWidgetId: number) => {
        return safeAction(async () => {
            setState(prev => ({
                ...prev,
                userWidgets: prev.userWidgets.filter(w => w.id !== userWidgetId)
            }));

            await removeWidgetFromUser({
                userWidgetId,
                userId
            });
        });
    }, []);

    const resetWidgets = useCallback(async () => {
        return safeAction(async () => {
            setState(prev => ({ ...prev, isLoading: true }));
            try {
                const defaultWidgets = await serverResetUserWidgets(userId);
                setState(prev => ({
                    ...prev,
                    userWidgets: defaultWidgets,
                    isLoading: false
                }));
            } catch (err) {
                setState(prev => ({ ...prev, isLoading: false }));
                throw err;
            }
        });
    }, [userId]);

    useEffect(() => {
        initializeDashboard(userId, tenantSlug);
    }, [userId, tenantSlug, initializeDashboard]);

    return (
        <DashboardContext.Provider value={{
            userWidgets: state.userWidgets,
            availableWidgets: state.availableWidgets,
            isLoading: state.isLoading,
            error: state.error,
            initializeDashboard,
            updateWidget,
            reorderWidgets,
            addWidget,
            removeWidget,
            resetWidgets
        }}>
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