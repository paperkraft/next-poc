export type RowData = Record<string, any>;
export type RowErrors = Record<number, Record<string, string[]>>;
export type SortDirection = "asc" | "desc" | null

export type SortConfig = {
    field: string | null
    direction: SortDirection
}

export type CsvUploadProps = {
    onSave?: (rows: RowData[]) => Promise<void>
}

export type FieldType = 'textOnly' | 'text' | 'number' | 'email' | 'date';

export interface SelectedField {
    name: string;
    type: FieldType;
    required: boolean;
}