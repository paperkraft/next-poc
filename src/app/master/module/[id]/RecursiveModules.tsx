'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { ModuleFormData } from './EditModule';
import { FloatingInputController } from '@/components/_form-controls/floating-label/input-controller';
import React from 'react';

export function RecursiveModuleForm({ nestPath = 'children', depth = 0, parentIndexPath = '', }: { nestPath?: string; depth?: number, parentIndexPath?: string; }) {
    const { control } = useFormContext<ModuleFormData>();

    // Always call useFieldArray at the top level
    const { fields, append, remove } = useFieldArray({
        control,
        name: nestPath as any,
    });

    return (
        <div className="space-y-6">
            {fields.map((field, index) => {
                const currentPath = `${nestPath}.${index}`;
                const childFieldName = `${currentPath}.children`;

                const currentNumber =
                    parentIndexPath === '' ? `${index + 1}` : `${parentIndexPath}.${index + 1}`;

                return (
                    <div key={field.id} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                            <div className='flex items-center gap-2'>
                                <div className="text-muted-foreground w-6 shrink-0">{currentNumber}</div>
                                <FloatingInputController
                                    name={`${currentPath}.name`}
                                    label={depth === 0 ? 'Submodule' : `Child Submodule`}
                                    aria-label="Submodule name"
                                />
                            </div>

                            <FloatingInputController
                                name={`${currentPath}.path`}
                                label="Path / URL"
                                type="text"
                                aria-label="Submodule URL"
                            />

                            <div className="flex gap-2 items-center pt-1">
                                <Button
                                    size="icon"
                                    type="button"
                                    variant="ghost"
                                    className="hover:bg-red-500 hover:text-white"
                                    aria-label={`Delete submodule ${field.id}`}
                                    onClick={() => remove(index)}
                                >
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        </div>

                        {/* Recursive children */}
                        {depth < 2 && (
                            <div className="ml-4 pl-4 border-l border-muted-foreground/20">
                                {depth < 1 && <p className="text-sm text-muted-foreground my-4">Add submodules to this module.</p>}
                                <RecursiveModuleForm nestPath={childFieldName} depth={depth + 1} parentIndexPath={currentNumber} />
                            </div>
                        )}
                    </div>
                );
            })}

            {/* Add new top-level submodule */}
            {depth >= 0 && depth < 2 && (
                <div className="mt-2">
                    <Button
                        type="button"
                        onClick={() => append({ name: '', path: '', children: [] })}
                    >
                        <Plus size={16} className="mr-2" />
                        {depth === 0 ? 'SubModule' : ' Child SubModule'}
                    </Button>
                </div>
            )}
        </div>
    );
}