import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {type FormField } from '../types/form';
import { useFormBuilderStore } from '../store/useFormBuilderStore';
import { GripVertical,Trash2 } from 'lucide-react';

interface Props{
    field:FormField;
}

export function SortableFieldCard({field}: Props){
    const {selectedFieldId, selectField, removeField}= useFormBuilderStore();

    // Connect this component to @dnd-kit's sortable system
    const{
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    }= useSortable({id: field.id});

    const isSelected= selectedFieldId === field.id;

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1
    };

    return(
        <div
        ref= {setNodeRef}
        style= {style}
        onClick={()=> selectField(field.id)}
        className={`group relative p-4 rounded-lg border transition cursor-pointer bg-slate-800 ${
            isSelected
            ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-lg'
            : 'border-slate-700 hover:border-slate-600'
        }`}
        >
        <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
            {/* Drag Handle Button */}
            <button
            type="button"
            {...attributes}
            {...listeners}
            onClick={(e)=> e.stopPropagation()}// Avoid triggering selection when grabbing handle
            className="p-1 text-slate-500 hover:text-slate-300 cursor-grab active:cursor-grabbing rounded"
            title="Drag to reorder"
            >
                <GripVertical className="w-4 h-4"/>
            </button>
            <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold">
                {field.type}
            </span>
        </div>

        {/* Delete Action Button */}
        <button
        type="button"
        onClick={(e)=> {
            e.stopPropagation();
            removeField(field.id);
        }}
        className="p-1 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity rounded"
        title="Delete field"
        >
            <Trash2 className="w-4 h-4" />
        </button>
        </div>
        {/* Field Label Display */}
      <p className="font-medium text-slate-100 pl-7">{field.label}</p>
      {field.placeholder && (
        <p className="text-xs text-slate-500 pl-7 mt-1 italic">
            PlaceHolder: "{field.placeholder}"
        </p>
      )}
        </div>
    );
    
}