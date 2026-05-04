import React from 'react';
interface TimeSlotPickerProps {
  availableSlots: string[];
  bookedSlots: string[];
  selectedSlot: string | null;
  onSelectSlot: (slot: string) => void;
}
export function TimeSlotPicker({
  availableSlots,
  bookedSlots,
  selectedSlot,
  onSelectSlot
}: TimeSlotPickerProps) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
      {availableSlots.map((slot) => {
        const isBooked = bookedSlots.includes(slot);
        const isSelected = selectedSlot === slot;
        return (
          <button
            key={slot}
            type="button"
            disabled={isBooked}
            onClick={() => onSelectSlot(slot)}
            className={`
              py-2 px-3 text-sm font-medium rounded-lg border transition-all
              ${isBooked ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' : isSelected ? 'bg-primary-600 border-primary-600 text-white shadow-sm' : 'bg-white border-slate-300 text-slate-700 hover:border-primary-500 hover:text-primary-600'}
            `}>
            
            {slot}
          </button>);

      })}
    </div>);

}