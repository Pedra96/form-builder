import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { useFormBuilderStore } from "./store/useFormBuilderStore";
import { SortableFieldCard } from "./components/SortableFieldCard";

export default function App(){
  const {fields, selectedFieldId, addField, reorderFields} = useFormBuilderStore();

  // Sensors define input methods for dragging (mouse, touch, keyboard)
  const sensors = useSensors(
    useSensor(PointerSensor,{activationConstraint:{ distance: 5}}),
    useSensor(KeyboardSensor,{ coordinateGetter: sortableKeyboardCoordinates})
  );

  const handleDragEnd=(event: DragEndEvent)=>{
    const{active, over} = event;
    if(over && active.id !== over.id){
      reorderFields(active.id.toString(), over.id.toString());
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-900 text-slate-100">
      {/* Left Sidebar: Palette */}
      <aside className="w-64 border-r border-slate-800 bg-slate-950 p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
        Add Fields
        </h2>
        <div className="flex flex-col gap-2">
        {(['text', 'textarea', 'number', 'select', 'checkbox', 'radio']as const).map((type)=>(
        <button key={type}
        onClick={() => addField(type)}
        className="px-3 py-2 text-left bg-slate-800 hover:bg-slate-700 rounded-md text-sm font-medium transition cursor-pointer capitalize"
        >
          + {type} Field
        </button>
        ))}
        </div>
      </aside>

        {/* Main Canvas Zone */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-900">
          <div className="max-w-2xl mx-auto space-y-4">
          <h1 className="text-2xl font-bold mb-6">Form Canvas</h1>
          {fields.map((field)=>(
            <div
            key={field.id}
            onClick={()=> selectField(field.id)}
            className={`p-4 rounded-lg border transition cursor-pointer ${
              selectedFieldId === field.id
              ? 'border-blue-500 bg-slate-800/80 shadow-lg'
              : 'border-slate-700 bg-slate-800/40 hover:border-slate-600'
            }`}
            >
              <span className="text-xs text-blue-400 uppercase font-mono">{field.type}</span>
              <p className="font-medium text-slate-200 mt-1">{field.label}</p>
            </div>
          ))}
          </div>
        </main>
          {/* Right Sidebar: Field Properties */}
          <aside className="w-80 border-l border-slate-800 bg-slate-950 p-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
            Properties
            </h2>
            {selectedFieldId ? (
              <p className="text-sm text-slate-300">Selected Field ID: {selectedFieldId}</p>
            ) : (
              <p className="text-sm text-slate-500">Select a field to edit its properties.</p>
            
            )}
          </aside>
    </div>
  );
}