import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

export default function CustomPinkDatePicker({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const parsedDate = value ? new Date(value) : new Date();
  const [viewYear, setViewYear] = useState(parsedDate.getFullYear() || new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(parsedDate.getMonth() || new Date().getMonth());

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleSelectDay = (day) => {
    const formattedMonth = String(viewMonth + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const selectedString = `${viewYear}-${formattedMonth}-${formattedDay}`;
    onChange(selectedString);
    setIsOpen(false);
  };

  const displayDateText = value ? new Date(value).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }) : 'Pilih Tanggal';

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-2.5 py-1.5 text-xs bg-white/90 hover:bg-white border border-rose-300 focus:border-rose-500 rounded-lg flex items-center justify-between text-rose-950 font-serif shadow-xs transition"
      >
        <span className="flex items-center gap-1.5 truncate">
          <CalendarIcon className="w-3.5 h-3.5 text-rose-500" />
          <span>{displayDateText}</span>
        </span>
        <ChevronDown className={`w-3 h-3 text-rose-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 top-full mt-1 z-50 bg-gradient-to-b from-[#fff5f7] to-[#ffeef2] border-2 border-rose-300 rounded-2xl p-3 shadow-2xl w-[220px] font-sans"
            >
              <div className="flex items-center justify-between mb-2 text-rose-950 font-serif">
                <button type="button" onClick={handlePrevMonth} className="p-1 rounded-lg hover:bg-rose-200/60 text-rose-800 transition">
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-bold text-rose-900">
                  {monthNames[viewMonth]} {viewYear}
                </span>
                <button type="button" onClick={handleNextMonth} className="p-1 rounded-lg hover:bg-rose-200/60 text-rose-800 transition">
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 text-[9px] font-bold text-rose-400 text-center mb-1">
                <span>M</span><span>S</span><span>S</span><span>R</span><span>K</span><span>J</span><span>S</span>
              </div>

              <div className="grid grid-cols-7 gap-1 text-xs">
                {[...Array(firstDayOfWeek)].map((_, i) => (
                  <div key={`empty-${i}`} className="h-6" />
                ))}
                {[...Array(daysInMonth)].map((_, i) => {
                  const dayNum = i + 1;
                  const isSelected = value && 
                    new Date(value).getFullYear() === viewYear && 
                    new Date(value).getMonth() === viewMonth && 
                    new Date(value).getDate() === dayNum;

                  return (
                    <button
                      key={dayNum}
                      type="button"
                      onClick={() => handleSelectDay(dayNum)}
                      className={`h-6 w-6 mx-auto flex items-center justify-center rounded-full text-[11px] font-medium transition-all ${
                        isSelected 
                          ? 'bg-rose-600 text-white font-bold shadow-xs scale-105' 
                          : 'hover:bg-rose-200 text-rose-900'
                      }`}
                    >
                      {dayNum}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}