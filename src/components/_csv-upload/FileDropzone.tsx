import React from "react"
import { Upload, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FileDropzoneProps {
    isLoading: boolean
    onDrop: (e: React.DragEvent) => void
    onDragOver: (e: React.DragEvent) => void
    onDragLeave: (e: React.DragEvent) => void
    onClick: () => void
    isDragOver: boolean
    fileInputRef: React.RefObject<HTMLInputElement>
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
    isLoading,
    onDrop,
    onDragOver,
    onDragLeave,
    onClick,
    isDragOver,
    fileInputRef,
    onChange,
}) => (
    <div
        className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"}
            ${isLoading ? "pointer-events-none opacity-50" : "cursor-pointer hover:border-gray-400"}
        `}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={onClick}
    >
        <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={onChange}
            className="hidden"
        />

        {isLoading ? (
            <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <p className="text-gray-600">Processing CSV file...</p>
            </div>
        ) : (
            <div className="flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-gray-400" />
                <p className="text-lg font-medium">Drop your CSV file here or click to browse</p>
                <p className="text-sm text-gray-500">Supports CSV files with Name, Email, and Age columns</p>
                <Button variant="outline" className="mt-2">
                    Select File
                </Button>
            </div>
        )}
    </div>
)