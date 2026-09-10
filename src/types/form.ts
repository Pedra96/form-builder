export type FieldType= 'text'
|'textarea'
|'number'
|'select'
|'checkbox'
|'radio';

export interface FieldOption{
    id: string;
    label: string;
    value:string;
}

export interface ValidationRules{
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
}

export interface FormField{
    id: string;
    type: FieldType;
    label: string;
    placeholder?: string;
    options? : FieldOption[];
    validation?: ValidationRules;
}

export interface FormSchema{
    id: string;
    title: string;
    description: string;
    fields: FormField[];
}