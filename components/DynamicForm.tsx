import React from 'react';
import { Controller } from 'react-hook-form';
import { FormDefinition, FormField, TranslationKey } from '../types';
import { Label } from './ui/Label';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { MultiSelect } from './ui/MultiSelect';
import { TagsInput } from './ui/TagsInput';

const DynamicField: React.FC<{ fieldDef: FormField; control: any; t: (key: TranslationKey) => string; }> = ({ fieldDef, control, t }) => {
    return (
        <Controller
            name={fieldDef.name}
            control={control}
            render={({ field }) => {
                const commonProps = {
                    ...field,
                    id: fieldDef.name,
                    placeholder: fieldDef.placeholderKey ? t(fieldDef.placeholderKey) : ''
                };

                switch (fieldDef.type) {
                    case 'text':
                    case 'number':
                    case 'email':
                        return <Input {...commonProps} type={fieldDef.type} />;
                    case 'textarea':
                        return <textarea {...commonProps} className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />;
                    case 'select':
                        return (
                            <Select {...commonProps}>
                                <option value="">{`Select ${t(fieldDef.labelKey)}`}</option>
                                {fieldDef.options?.map(opt => <option key={opt.value} value={opt.value}>{t(opt.labelKey)}</option>)}
                            </Select>
                        );
                    case 'multiselect':
                        return (
                            <MultiSelect
                                options={fieldDef.options?.map(opt => ({ value: opt.value, label: t(opt.labelKey) })) || []}
                                value={field.value || []}
                                onChange={field.onChange}
                                placeholder={fieldDef.placeholderKey ? t(fieldDef.placeholderKey) : `Select...`}
                            />
                        );
                    case 'tags':
                        return (
                            <TagsInput
                                value={field.value || []}
                                onChange={field.onChange}
                                placeholder={fieldDef.placeholderKey ? t(fieldDef.placeholderKey) : ''}
                            />
                        );
                    default:
                        return null;
                }
            }}
        />
    );
};

interface DynamicFormProps {
    formDefinition: FormDefinition;
    control: any;
    t: (key: TranslationKey) => string;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({ formDefinition, control, t }) => {
    return (
        <>
            {formDefinition.fields.map(fieldDef => (
                <div key={fieldDef.name} className="space-y-2">
                    <Label htmlFor={fieldDef.name}>{t(fieldDef.labelKey)}</Label>
                    <DynamicField fieldDef={fieldDef} control={control} t={t} />
                </div>
            ))}
        </>
    );
};
