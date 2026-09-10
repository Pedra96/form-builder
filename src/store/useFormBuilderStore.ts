import {create} from 'zustand';
import {type FormField, type FieldType } from '../types/form';
import {arrayMove} from '@dnd-kit/sortable';

interface FormBuilderState{
    fields: FormField[];
    selectedFieldId: string| null;
    addField: (type: FieldType) => void;
    updateField: (id: string, updatedField: Partial<FormField>) => void;
    removeField: (activateId: string, overId: string) => void;
    reorderFields: (activeId: string, overId: string) => void;
    selectField: (id: string | null)=> void;
}

export const useFormBuilderStore = create<FormBuilderState>((set) => ({
    fields:[
        {
            id: 'field-1',
            type: 'text',
            label: 'Question',
            placeholder: 'Type your answer here...',
            validation: {required: true},
        },
    ],
    selectedFieldId: 'field-1',

addField: (type) =>
    set((state) => {
        const newField: FormField = {
            id: `field-${Date.now()}`,
            type,
            label: `New ${type.toUpperCase()} Field`,
            placeholder: '',
            options: type === 'select' || type === 'radio' || type ===  'checkbox'
             ?  [
                    {id:'1', label: 'Option 1', value: 'option_1'},
                    {id: '2', label: 'Option 2', value: 'option_2'},
                ]
                : undefined,
                validation: { required: false },
            };
            return {
                fields: [...state.fields, newField],
                selectedFieldId: newField.id,
            };
    }),
updateField: (id,updatedField)=>
    set((state) => ({
        fields: state.fields.map((field)=>
        field.id === id ? {...field, ...updatedField} : field
    ),
    })),

removeField: (id) =>
    set((state) => ({
        fields: state.fields.filter((field)=> field.id !== id),
        selectedFieldId: state.selectedFieldId === id ? null : state.selectedFieldId,
    })),

reorderFields:(activeId, overId) =>
    set((state)=> {
        const oldIndex= state.fields.findIndex((f) => f.id === activeId);
        const newIndex= state.fields.findIndex((f)=> f.id === overId);
        if (oldIndex === -1 || newIndex === -1) return state;
        return{
            fields: arrayMove(state.fields, oldIndex, newIndex),
        };
    }),

selectField: (id) => set({ selectedFieldId: id}),
}));