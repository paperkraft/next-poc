'use client';

import { Plus, Trash2 } from 'lucide-react';
import React from 'react';
import { useFieldArray, useFormContext, WatchObserver } from 'react-hook-form';

import { FloatingInputController } from '@/components/_form-controls/floating-label/input-controller';
import { Button } from '@/components/ui/button';

import { ModuleFormData } from './ModuleForm';
import { cn } from '@/lib/utils';

type RModuleFormProps = {
    nestPath?: string;
    depth?: number;
    parentIndexPath?: string;
    readOnly?: boolean;
    isEdit?: boolean;
    show?: boolean;
}

export function RecursiveModuleForm({
    nestPath = 'children',
    depth = 0,
    parentIndexPath = '',
    readOnly = false,
    isEdit = false,
    show = false,
}: RModuleFormProps) {

    const { control, watch } = useFormContext<ModuleFormData>();

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
                    <div key={field.id}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                            <div className='flex items-center'>
                                
                                <div className={cn("text-muted-foreground w-6 shrink-0", {"mr-2": depth > 0})}>
                                    {currentNumber}
                                </div>

                                <FloatingInputController
                                    name={`${currentPath}.name`}
                                    label={depth === 0 ? 'Submodule' : `Child Submodule`}
                                    aria-label="Submodule name"
                                    readOnly={readOnly}
                                />
                            </div>

                            <FloatingInputController
                                name={`${currentPath}.path`}
                                label="Path"
                                type="text"
                                aria-label="Submodule URL"
                                readOnly={readOnly}
                            />

                            <Button
                                size="icon"
                                type="button"
                                variant="ghost"
                                className="hover:bg-red-500 hover:text-white"
                                aria-label={`Delete submodule ${field.id}`}
                                onClick={() => remove(index)}
                                disabled={readOnly}
                            >
                                <Trash2 size={16} />
                            </Button>
                        </div>

                        {/* Recursive children */}
                        {depth < 2 && (
                            <div className="ml-1 pl-4 border-l border-muted-foreground/20">
                                
                                {depth < 1 && (
                                    <p className="text-sm text-muted-foreground my-4">
                                        {isEdit ? show ? "Update submodules of:" : 'Submodules of:' : 'Add submodules to:'}&nbsp;
                                        {`${watch(`${currentPath}.name` as keyof WatchObserver<ModuleFormData>)}`}
                                    </p>
                                )}

                                <RecursiveModuleForm nestPath={childFieldName} depth={depth + 1} parentIndexPath={currentNumber} readOnly={readOnly} />
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
                        variant={'outline'}
                        onClick={() => append({ name: '', path: '', children: [] })}
                        disabled={readOnly || !watch(`name`)}
                    >
                        <Plus size={16} className="mr-2" />
                        {depth === 0 ? 'SubModule' : ' Child SubModule'}
                    </Button>
                </div>
            )}
        </div>
    );
}