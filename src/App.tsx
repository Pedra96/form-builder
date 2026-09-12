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
    const {active, over} = event;
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
          {fields.length === 0 ? (
            <div className="p-12 border-2 border-dashed border-slate-800 rounded-xl text-center text-slate-500">
              No questions added yet. Click a field on the left sidebar to begin.
              </div>
          ): (
            <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            >
              <SortableContext
              items={fields.map((f)=> f.id)}
              strategy={verticalListSortingStrategy}
              >
                <div className='space-y-3'>
                  {fields.map((field)=> (
                    <SortableFieldCard key={field.id} field={field} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )
        }
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