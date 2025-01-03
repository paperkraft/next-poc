import {
    TableFeature,
    OnChangeFn,
    Updater,
    RowData,
    Table,
    makeStateUpdater,
    functionalUpdate,
} from "@tanstack/react-table"

// define types for new feature's custom state
export type DensityState = 'sm' | 'md' | 'lg'
export interface DensityTableState {
    density: DensityState
}

// define types for new feature's table options
export interface DensityOptions {
    enableDensity?: boolean
    onDensityChange?: OnChangeFn<DensityState>
}

// Define types for new feature's table APIs
export interface DensityInstance {
    setDensity: (updater: Updater<DensityState>) => void
    toggleDensity: (value?: DensityState) => void
}

// Use declaration merging to add new feature APIs and state types to TanStack Table's existing types.
declare module '@tanstack/react-table' {
    interface TableState extends DensityTableState { }
    interface TableOptionsResolved<TData extends RowData> extends DensityOptions { }
    interface Table<TData extends RowData> extends DensityInstance { }
}

export const DensityFeature: TableFeature<any> = {
    getInitialState: (state): DensityTableState => {
        return {
            density: 'md',
            ...state,
        }
    },

    getDefaultOptions: <TData extends RowData>(table: Table<TData>): DensityOptions => {
        return {
            enableDensity: true,
            onDensityChange: makeStateUpdater('density', table),
        } as DensityOptions
    },

    createTable: <TData extends RowData>(table: Table<TData>): void => {
        table.setDensity = updater => {
            const safeUpdater: Updater<DensityState> = old => {
                let newState = functionalUpdate(updater, old)
                return newState
            }
            return table.options.onDensityChange?.(safeUpdater)
        }
        table.toggleDensity = value => {
            table.setDensity(old => {
                if (value) return value
                return old === 'lg' ? 'md' : old === 'md' ? 'sm' : 'lg'
            })
        }
    },
}