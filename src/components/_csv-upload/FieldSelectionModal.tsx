import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SelectedField } from './types';

interface FieldSelectionModalProps {
    open: boolean;
    csvHeaders: string[];
    onConfirm: (selectedFields: SelectedField[]) => void;
    onCancel: () => void;
}

export const FieldSelectionModal = ({
    open,
    csvHeaders,
    onConfirm,
    onCancel
}: FieldSelectionModalProps) => {
    const [selectedFields, setSelectedFields] = useState<Record<string, SelectedField>>({});

    useEffect(() => {
        // Initialize with all fields selected as text type
        const initialFields: Record<string, SelectedField> = {};
        csvHeaders.forEach(header => {
            initialFields[header] = {
                name: header,
                type: 'text',
                required: true
            };
        });
        setSelectedFields(initialFields);
    }, [csvHeaders]);

    const handleToggle = (field: string) => {
        setSelectedFields(prev => {
            if (prev[field]) {
                const newFields = { ...prev };
                delete newFields[field];
                return newFields;
            } else {
                return {
                    ...prev,
                    [field]: {
                        name: field,
                        type: 'text',
                        required: true
                    }
                };
            }
        });
    };

    const handleTypeChange = (field: string, type: any) => {
        setSelectedFields(prev => ({
            ...prev,
            [field]: {
                ...prev[field],
                type
            }
        }));
    };

    const handleRequiredChange = (field: string, required: boolean) => {
        setSelectedFields(prev => ({
            ...prev,
            [field]: {
                ...prev[field],
                required
            }
        }));
    };

    return (
        <Dialog open={open} onOpenChange={onCancel}>
            <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Configure Fields to Import</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <div className="font-semibold">Include</div>
                        <div className="font-semibold">Field Name</div>
                        <div className="font-semibold">Type</div>
                        <div className="font-semibold">Required</div>

                        {csvHeaders.map(header => (
                            <React.Fragment key={header}>
                                <div>
                                    <Checkbox
                                        checked={!!selectedFields[header]}
                                        onCheckedChange={() => handleToggle(header)}
                                    />
                                </div>
                                <div>{header}</div>
                                <div>
                                    {selectedFields[header] && (
                                        <Select
                                            value={selectedFields[header]?.type || 'textOnly'}
                                            onValueChange={(value) => handleTypeChange(header, value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="textOnly">Text(only)</SelectItem>
                                                <SelectItem value="text">Text</SelectItem>
                                                <SelectItem value="number">Number</SelectItem>
                                                <SelectItem value="email">Email</SelectItem>
                                                <SelectItem value="date">Date</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                </div>
                                <div>
                                    {selectedFields[header] && (
                                        <Checkbox
                                            checked={selectedFields[header]?.required ?? true}
                                            onCheckedChange={(checked) =>
                                                handleRequiredChange(header, Boolean(checked))
                                            }
                                        />
                                    )}
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button
                        onClick={() => onConfirm(Object.values(selectedFields))}
                        disabled={Object.keys(selectedFields).length === 0}
                    >
                        Confirm Selection
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};