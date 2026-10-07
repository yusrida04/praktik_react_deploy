import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Calendar as CalendarIcon,
  PenTool,
  ChevronDown,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  CheckCircle2,
  Lock,
  Unlock,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Heart,
  X,
  Mail,
  KeyRound
} from 'lucide-react';

const PRESET_EMOJIS = ['🌸', '✨', '🌿', '💡', '☕', '💖', '🔥', '🎀', '🍀', '🦋', '🧸', '🍓', '😎', '🎉', '🌙', '⭐'];

// Custom Pink Calendar Datepicker Popover Component
function CustomPinkDatePicker({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Parse initial date or default to current date
  const parsedDate = value ? new Date(value) : new Date();
  const [viewYear, setViewYear] = useState(parsedDate.getFullYear() || new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(parsedDate.getMonth() || new Date().getMonth());

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // Days in current view month
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay(); // 0 = Sunday

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
            {/* Backdrop click outside */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />

            {/* Pink Calendar Popover Card */}
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 top-full mt-1 z-50 bg-gradient-to-b from-[#fff5f7] to-[#ffeef2] border-2 border-rose-300 rounded-2xl p-3 shadow-2xl w-[220px] font-sans"
            >
              {/* Month & Year Header Navigation */}
              <div className="flex items-center justify-between mb-2 text-rose-950 font-serif">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1 rounded-lg hover:bg-rose-200/60 text-rose-800 transition"
                >
                  <ChevronLeftIcon className="w-3.5 h-3.5" />
                </button>

                <span className="text-xs font-bold text-rose-900">
                  {monthNames[viewMonth]} {viewYear}
                </span>

                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1 rounded-lg hover:bg-rose-200/60 text-rose-800 transition"
                >
                  <ChevronRightIcon className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Weekday Labels (Min, Sen, Sel, Rab, Kam, Jum, Sab) */}
              <div className="grid grid-cols-7 gap-1 text-[9px] font-bold text-rose-400 text-center mb-1">
                <span>M</span><span>S</span><span>S</span><span>R</span><span>K</span><span>J</span><span>S</span>
              </div>

              {/* Day Grid */}
              <div className="grid grid-cols-7 gap-1 text-xs">
                {/* Empty slots before first day */}
                {[...Array(firstDayOfWeek)].map((_, i) => (
                  <div key={`empty-${i}`} className="h-6" />
                ))}

                {/* Day numbers */}
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

// Single Journal Page Component
function PageSheet({
  data,
  side, // 'left' | 'right'
  pageNum,
  onUpdate,
  onSubmit,
  isInteractive = true
}) {
  const isLeft = side === 'left';
  const pageData = data || {
    name: '',
    date: '',
    moodText: '',
    selectedEmoji: '',
    note: '',
    isSubmitted: false
  };

  return (
    <div 
      className={`h-full w-full p-4 sm:p-6 flex flex-col justify-between overflow-y-auto max-h-[75vh] relative bg-[#fdf4f5] text-[#5c3a38] ${
        isLeft ? 'border-b md:border-b-0 md:border-r border-rose-200/80' : ''
      }`}
      style={{
        backgroundImage: 'linear-gradient(#f9a8d4 1px, transparent 1px)',
        backgroundSize: '100% 1.75rem'
      }}
    >
      <div>
        {/* Header Page Info */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-[11px] font-bold text-rose-800/60 uppercase tracking-wider font-serif">
            Halaman {pageNum}
          </span>
          {pageData.isSubmitted && (
            <span className="text-[10px] bg-rose-100 text-rose-900 font-bold px-2.5 py-0.5 rounded-full border border-rose-300/80">
              💖 Tersimpan
            </span>
          )}
        </div>

        {/* Page Form vs Output Saved Mode */}
        {!pageData.isSubmitted ? (
          <div className="space-y-3">
            <h2 className="text-lg font-serif font-bold text-rose-950 flex items-center gap-2">
              <PenTool className="w-4 h-4 text-rose-700" /> Tulis Catatan Diary
            </h2>

            {/* Input Nama & Custom Pink DatePicker */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-rose-900/80 mb-1 block">Nama Panggilan:</label>
                <input
                  type="text"
                  placeholder="Nama kamu..."
                  disabled={!isInteractive}
                  value={pageData.name}
                  onChange={(e) => onUpdate && onUpdate('name', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white/80 border border-rose-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 font-serif placeholder-rose-400/50 disabled:opacity-80"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-rose-900/80 mb-1 block">Tanggal:</label>
                {isInteractive ? (
                  <CustomPinkDatePicker
                    value={pageData.date}
                    onChange={(newDate) => onUpdate && onUpdate('date', newDate)}
                  />
                ) : (
                  <div className="w-full px-2.5 py-1.5 text-xs bg-white/80 border border-rose-300 rounded-lg text-rose-950 font-serif">
                    {pageData.date || 'Pilih Tanggal'}
                  </div>
                )}
              </div>
            </div>

            {/* Freeform Mood Text & Emoji Picker Grid */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-rose-900/80 block">Suasana Hati (Mood) & Emoji TTD:</label>
              <div className="flex gap-1.5 items-center">
                <input
                  type="text"
                  required
                  placeholder="Ketik suasana hatimu hari ini..."
                  disabled={!isInteractive}
                  value={pageData.moodText}
                  onChange={(e) => onUpdate && onUpdate('moodText', e.target.value)}
                  className="flex-1 px-2.5 py-1.5 text-xs bg-white/90 border border-rose-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 font-serif placeholder-rose-400/50 disabled:opacity-80"
                />
                <input
                  type="text"
                  placeholder="✨"
                  disabled={!isInteractive}
                  value={pageData.selectedEmoji}
                  onChange={(e) => onUpdate && onUpdate('selectedEmoji', e.target.value)}
                  className="w-9 text-center bg-rose-100 border border-rose-300 rounded-lg text-base font-bold py-0.5 focus:outline-none placeholder-rose-400/50"
                  title="Ketik atau pilih emoji"
                />
              </div>

              {/* Clickable Preset Emojis */}
              {isInteractive && (
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {PRESET_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => onUpdate && onUpdate('selectedEmoji', emoji)}
                      className={`text-sm px-1.5 py-0.5 rounded-lg transition-transform hover:scale-125 ${
                        pageData.selectedEmoji === emoji ? 'bg-rose-300 border border-rose-400 scale-110 shadow-xs' : 'hover:bg-rose-100/60'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Textarea Catatan */}
            <div>
              <label className="text-[11px] font-bold text-rose-900/80 mb-1 block">Isi Catatan Harian:</label>
              <textarea
                rows={4}
                placeholder="Tuliskan pengalaman atau rasa syukurmu hari ini..."
                disabled={!isInteractive}
                value={pageData.note}
                onChange={(e) => onUpdate && onUpdate('note', e.target.value)}
                className="w-full p-2.5 text-xs bg-white/60 border border-rose-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 font-serif leading-7 disabled:opacity-80"
              />
            </div>

            {/* Submit Button */}
            {isInteractive && (
              <button
                onClick={onSubmit}
                disabled={!pageData.note.trim()}
                className="w-full py-2 bg-gradient-to-r from-rose-800 via-pink-900 to-rose-950 hover:from-rose-900 hover:to-rose-950 disabled:opacity-40 text-rose-100 text-xs font-bold rounded-xl transition shadow-md flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-pink-300" />
                <span>Simpan & Kunci Catatan {isLeft ? 'Kiri' : 'Kanan'}</span>
              </button>
            )}
          </div>
        ) : (
          /* Output Saved View */
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 pt-1">
            <div className="border-b border-rose-300/80 pb-2">
              <h3 className="font-serif text-base font-bold text-rose-950">Catatan Abadi</h3>
              <p className="text-[11px] text-rose-800/80">
                Ditulis oleh <span className="font-bold">{pageData.name || 'Sahabat Diary'}</span> • {pageData.date || 'Hari Ini'}
              </p>
            </div>

            {/* Handwritten Note Display */}
            <div className="bg-white/70 p-4 rounded-xl border border-rose-200 font-serif italic text-rose-950 leading-7 text-xs shadow-inner min-h-[130px]">
              "{pageData.note}"
            </div>

            {/* Signature Stamp Footer */}
            <div className="flex justify-between items-end pt-2">
              {isInteractive ? (
                <button
                  onClick={() => onUpdate && onUpdate('isSubmitted', false)}
                  className="text-[11px] text-rose-800 hover:underline flex items-center gap-1 font-serif"
                >
                  <RotateCcw className="w-3 h-3" /> Edit Catatan
                </button>
              ) : <div />}

              <div className="bg-rose-100/90 border border-rose-300 p-2.5 rounded-xl flex items-center gap-2.5 shadow-sm">
                <span className="text-2xl">{pageData.selectedEmoji || '✨'}</span>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-rose-800/70">TTD MOOD EMOJI</p>
                  <p className="text-xs font-bold font-serif text-rose-950">{pageData.moodText || 'Bahagia'}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="mt-4 pt-2 border-t border-rose-200/80 text-[10px] text-rose-800/50 text-center font-serif">
        My Pink Diary • Halaman {pageNum}
      </div>
    </div>
  );
}

export default function App() {
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [spreadIndex, setSpreadIndex] = useState(0);
  
  // 3D Page Flip Animation States
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState(1); // 1 = Next (turn to left), -1 = Prev (turn to right)
  const [targetSpreadIndex, setTargetSpreadIndex] = useState(0);

  // Fake Password/Email Diary Lock Modal States
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authEmail, setAuthEmail] = useState('yusridajeliantisihite@diary.com');
  const [authPassword, setAuthPassword] = useState('123456');
  const [authError, setAuthError] = useState('');

  // Store journal pages in an array of spreads
  const [spreads, setSpreads] = useState([
    {
      left: {
        name: '',
        date: '',
        moodText: '',
        selectedEmoji: '',
        note: '',
        isSubmitted: false
      },
      right: {
        name: '',
        date: '',
        moodText: '',
        selectedEmoji: '',
        note: '',
        isSubmitted: false
      }
    }
  ]);

  const currentSpread = spreads[spreadIndex] || {
    left: { name: '', date: '', moodText: '', selectedEmoji: '', note: '', isSubmitted: false },
    right: { name: '', date: '', moodText: '', selectedEmoji: '', note: '', isSubmitted: false }
  };

  const updatePage = (side, field, value) => {
    setSpreads(prevSpreads => {
      const updated = [...prevSpreads];
      if (!updated[spreadIndex]) return prevSpreads;
      
      const newSpread = { ...updated[spreadIndex] };
      newSpread[side] = { ...newSpread[side], [field]: value };
      updated[spreadIndex] = newSpread;
      return updated;
    });
  };

  // Trigger smooth 3D page flip
  const turnPage = (targetIndex, direction) => {
    if (isFlipping) return;
    setFlipDirection(direction);
    setTargetSpreadIndex(targetIndex);
    setIsFlipping(true);
  };

  const handleSubmitPage = (side) => {
    setSpreads(prevSpreads => {
      const updated = [...prevSpreads];
      const newSpread = { ...updated[spreadIndex] };
      newSpread[side] = { ...newSpread[side], isSubmitted: true };
      updated[spreadIndex] = newSpread;
      return updated;
    });
  };

  const handleUnlockDiary = (e) => {
    e.preventDefault();
    if (!authEmail.trim() || !authPassword.trim()) {
      setAuthError('Silakan isi email dan kata sandi diary!');
      return;
    }
    setAuthError('');
    setShowAuthModal(false);
    setIsBookOpen(true);
  };

  const pageLeftNum = spreadIndex * 2 + 1;
  const pageRightNum = spreadIndex * 2 + 2;

  // Pages for the 3D flipping animation
  const nextSpread = spreads[targetSpreadIndex] || {
    left: { name: '', date: '', moodText: '', selectedEmoji: '', note: '', isSubmitted: false },
    right: { name: '', date: '', moodText: '', selectedEmoji: '', note: '', isSubmitted: false }
  };

  return (
    <div 
      className="min-h-screen bg-[#2c1a14] text-[#4a2e2b] p-3 sm:p-6 flex flex-col items-center justify-center font-sans relative overflow-x-hidden selection:bg-rose-200"
      style={{
        backgroundImage: 'radial-gradient(#3d241c 1px, transparent 1px), radial-gradient(#3d241c 1px, #20120d 1px)',
        backgroundSize: '24px 24px',
        backgroundPosition: '0 0, 12px 12px'
      }}
    >
      {/* Wooden Desk Plank Overlay Lines */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[linear-gradient(to_right,#000_1px,transparent_1px)] [background-size:120px_100%]" />

      {/* Fake Email & Password Lock Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAuthModal(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative w-full max-w-sm bg-gradient-to-b from-[#3a1d1d] via-[#2a1313] to-[#1e0a0a] border-2 border-amber-400/50 rounded-3xl p-6 sm:p-7 shadow-[0_0_50px_rgba(244,63,94,0.3)] text-rose-100 z-10"
            >
              {/* Close Modal Button */}
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800 transition"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Lock Header */}
              <div className="flex flex-col items-center text-center mb-5">
                <div className="p-3.5 bg-gradient-to-tr from-amber-500 to-amber-300 rounded-2xl shadow-lg text-amber-950 mb-3 border border-amber-200">
                  <Lock className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="font-serif text-xl font-bold text-amber-200 tracking-wide">
                  Gembok Rahasia Diary
                </h3>
                <p className="text-xs text-rose-200/70 mt-1">
                  Masukkan akun & kata sandi rahasia untuk membuka lembaran buku.
                </p>
              </div>

              {/* Form Input Gmail & Password (Fake Auth) */}
              <form onSubmit={handleUnlockDiary} className="space-y-3.5">
                {authError && (
                  <div className="p-2 rounded-lg bg-rose-900/60 border border-rose-500 text-[11px] text-rose-200 text-center font-medium">
                    {authError}
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-bold text-amber-200/90 mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-pink-300" />
                    <span>Alamat Gmail / Email:</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="nama@gmail.com"
                    className="w-full px-3 py-2 text-xs bg-rose-950/70 border border-rose-700/80 focus:border-amber-400 rounded-xl text-rose-100 placeholder-rose-400/40 focus:outline-none focus:ring-1 focus:ring-amber-400 transition"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-amber-200/90 mb-1 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-amber-300" />
                    <span>Kata Sandi / Password:</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="Masukkan sandi..."
                    className="w-full px-3 py-2 text-xs bg-rose-950/70 border border-rose-700/80 focus:border-amber-400 rounded-xl text-rose-100 placeholder-rose-400/40 focus:outline-none focus:ring-1 focus:ring-amber-400 transition"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 active:scale-[0.99] text-amber-950 font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 border border-amber-200"
                  >
                    <Unlock className="w-4 h-4 text-amber-950" />
                    <span>Buka Kunci Diary ✨</span>
                  </button>
                </div>

                <p className="text-[10px] text-center text-rose-300/50 italic pt-1">
                  *Kunci sandi otomatis terisi / bisa kamu ketik bebas
                </p>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {/* =========================================================================
            STATE 1: CLOSED PINK LEATHER DIARY (COVER VIEW)
           ========================================================================= */}
        {!isBookOpen ? (
          <motion.div
            key="closed-cover"
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.05, opacity: 0, rotateY: -80 }}
            transition={{ type: 'spring', duration: 0.8 }}
            className="flex flex-col items-center justify-center z-20 my-auto py-8"
          >
            {/* Clickable Diary Book Container */}
            <div 
              onClick={() => {
                setAuthError('');
                setShowAuthModal(true);
              }}
              className="group relative cursor-pointer transform transition-transform duration-500 hover:scale-[1.02] active:scale-[0.99]"
            >
              {/* Realistic Shadow on Wooden Desk */}
              <div className="absolute -inset-4 bg-black/60 rounded-[45px] blur-2xl transform translate-y-6 scale-95 -z-10 group-hover:blur-3xl transition-all" />

              {/* Pink Leather Cover Outer Frame */}
              <div className="w-[320px] sm:w-[400px] h-[480px] sm:h-[560px] bg-gradient-to-br from-rose-300 via-pink-400 to-rose-500 rounded-[38px] p-6 sm:p-8 shadow-2xl border-4 border-rose-300/80 relative flex flex-col justify-between overflow-hidden border-r-[12px] border-r-rose-600/60">
                
                {/* Leather Texture Grain Overlay */}
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

                {/* Spine Stitching Effect on Left */}
                <div className="absolute left-3 top-0 bottom-0 w-4 border-r-2 border-dashed border-pink-200/60 flex flex-col justify-around py-8 pointer-events-none">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-pink-700/40" />
                  ))}
                </div>

                {/* Silk Bookmark Ribbon Sticking Out at Top */}
                <div className="absolute -top-2 right-12 w-8 h-20 bg-gradient-to-b from-rose-600 via-rose-700 to-rose-900 rounded-b-md shadow-md border-x border-rose-800 flex items-end justify-center pb-2">
                  <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-rose-400" />
                </div>

                {/* Gold Embossed Frame Header */}
                <div className="mt-8 text-center border-2 border-amber-300/60 p-4 rounded-2xl bg-rose-400/20 backdrop-blur-[1px]">
                  <Sparkles className="w-6 h-6 text-amber-300 mx-auto mb-1 animate-pulse" />
                  <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-amber-200">Personal & Secret</p>
                </div>

                {/* Gold Embossed Main Title */}
                <div className="text-center my-auto py-6">
                  <h1 
                    className="font-serif text-4xl sm:text-5xl font-black tracking-wider bg-gradient-to-b from-amber-100 via-amber-200 to-amber-400 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                    style={{ fontFamily: "'Georgia', serif" }}
                  >
                    My Diary
                  </h1>
                  <p className="text-xs font-serif italic text-rose-100/90 mt-2">
                    Lembaran Catatan & Refleksi Harian
                  </p>
                </div>

                {/* Golden Metallic Lock Latch */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 bg-gradient-to-r from-amber-300 via-amber-200 to-amber-500 border-2 border-amber-600 rounded-l-2xl p-3 shadow-xl flex items-center justify-center gap-2 group-hover:translate-x-0 transition-transform">
                  <Lock className="w-5 h-5 text-amber-950" />
                  <div className="w-2 h-6 bg-amber-700/40 rounded-full" />
                </div>

                {/* Bottom Cover Footer Prompt */}
                <div className="text-center pt-4 border-t border-pink-300/40">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-rose-950/40 hover:bg-rose-950/60 text-amber-200 rounded-full text-xs font-bold tracking-wide backdrop-blur-sm transition-colors border border-amber-300/30">
                    <Heart className="w-3.5 h-3.5 text-pink-300 fill-pink-300 animate-bounce" />
                    <span>Klik Untuk Membuka Diary</span>
                  </span>
                </div>

              </div>
            </div>
          </motion.div>
        ) : (
          /* =========================================================================
              STATE 2: OPEN PINK LEATHER DIARY (2-PAGE SPREAD VIEW WITH 3D PAGE FLIP)
             ========================================================================= */
          <motion.div
            key="open-diary"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-5xl my-auto flex flex-col items-center"
          >
            {/* Top Navigation Controls Bar */}
            <div className="w-full mb-3 flex flex-wrap items-center justify-between gap-2 px-2 text-rose-100">
              <button
                disabled={isFlipping}
                onClick={() => setIsBookOpen(false)}
                className="px-3.5 py-2 bg-rose-950/80 hover:bg-rose-900 disabled:opacity-50 text-rose-200 rounded-xl text-xs font-bold transition flex items-center gap-2 border border-rose-800/80 shadow-md"
              >
                <X className="w-4 h-4 text-rose-300" />
                <span>Tutup Buku</span>
              </button>

              {/* Prev / Next Spread Browsing Buttons */}
              <div className="flex items-center gap-2 ml-auto">
                <button
                  disabled={spreadIndex === 0 || isFlipping}
                  onClick={() => {
                    turnPage(spreadIndex - 1, -1);
                  }}
                  className="px-3 py-2 bg-rose-950/80 hover:bg-rose-900 disabled:opacity-40 disabled:cursor-not-allowed text-rose-200 rounded-xl text-xs font-bold transition flex items-center gap-1 border border-rose-800/80 shadow-md"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Halaman Lalu</span>
                </button>

                <button
                  disabled={isFlipping || (spreadIndex >= spreads.length - 1 && (!currentSpread.left.isSubmitted || !currentSpread.right.isSubmitted))}
                  onClick={() => {
                    if (spreadIndex < spreads.length - 1) {
                      turnPage(spreadIndex + 1, 1);
                    } else if (currentSpread.left.isSubmitted && currentSpread.right.isSubmitted) {
                      // Create new spread manually if button clicked
                      setSpreads(prev => [
                        ...prev,
                        {
                          left: { name: '', date: '', moodText: '', selectedEmoji: '', note: '', isSubmitted: false },
                          right: { name: '', date: '', moodText: '', selectedEmoji: '', note: '', isSubmitted: false }
                        }
                      ]);
                      turnPage(spreadIndex + 1, 1);
                    }
                  }}
                  className="px-3 py-2 bg-rose-900 hover:bg-rose-800 disabled:opacity-40 disabled:cursor-not-allowed text-amber-200 rounded-xl text-xs font-bold transition flex items-center gap-1 border border-rose-700/80 shadow-md"
                >
                  <span>Halaman Selanjutnya</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Pink Leather Outer Book Frame */}
            <div className="w-full bg-gradient-to-br from-rose-400 via-pink-500 to-rose-600 rounded-[36px] p-3 sm:p-5 shadow-2xl border-4 border-rose-300/80 relative overflow-hidden">
              
              {/* Leather Texture Overlay */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:14px_14px] pointer-events-none" />

              {/* 3D BOOK SPREAD CONTAINER */}
              <div 
                className="relative bg-[#fdf4f5] text-[#5c3a38] rounded-2xl shadow-inner border border-rose-200/80 min-h-[540px] max-h-[78vh] overflow-hidden"
                style={{ perspective: 2400 }}
              >
                {/* Book Spine Center Line Overlay */}
                <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-8 -ml-4 bg-gradient-to-r from-rose-900/20 via-rose-900/40 to-rose-900/20 z-30 pointer-events-none border-x border-rose-900/10">
                  <div className="h-full flex flex-col justify-around items-center py-4 opacity-30">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="w-full h-1 bg-rose-900 shadow-sm" />
                    ))}
                  </div>
                </div>

                {/* DYNAMIC SHADOW: Center Spine Crease Shadow (Darkens during turn and fades out) */}
                <AnimatePresence>
                  {isFlipping && (
                    <motion.div
                      key="crease-shadow"
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: [0, 0.7, 0],
                        transition: { duration: 0.9, ease: 'easeInOut' }
                      }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-y-0 left-1/2 -ml-16 w-32 bg-gradient-to-r from-transparent via-rose-950/40 to-transparent pointer-events-none z-40"
                    />
                  )}
                </AnimatePresence>

                {/* SCENARIO A: NORMAL STATIC SPREAD (Interactive) */}
                {!isFlipping ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                    {/* Left Page */}
                    <PageSheet
                      data={currentSpread.left}
                      side="left"
                      pageNum={pageLeftNum}
                      onUpdate={(field, val) => updatePage('left', field, val)}
                      onSubmit={() => handleSubmitPage('left')}
                      isInteractive={true}
                    />

                    {/* Right Page */}
                    <PageSheet
                      data={currentSpread.right}
                      side="right"
                      pageNum={pageRightNum}
                      onUpdate={(field, val) => updatePage('right', field, val)}
                      onSubmit={() => handleSubmitPage('right')}
                      isInteractive={true}
                    />
                  </div>
                ) : (
                  /* SCENARIO B: PHYSICAL 3D PAGE FLIP ANIMATION */
                  <div className="relative grid grid-cols-1 md:grid-cols-2 h-full min-h-[540px]">
                    {/* 1. Base Left Page */}
                    <div className="relative h-full overflow-hidden">
                      <PageSheet
                        data={flipDirection === 1 ? currentSpread.left : nextSpread.left}
                        side="left"
                        pageNum={flipDirection === 1 ? pageLeftNum : targetSpreadIndex * 2 + 1}
                        isInteractive={false}
                      />
                      {/* Left Side Dynamic Dynamic Shadow Overlay as leaf approaches */}
                      <motion.div
                        initial={{ opacity: flipDirection === 1 ? 0 : 0.4 }}
                        animate={{ 
                          opacity: flipDirection === 1 ? [0, 0.35, 0] : [0.4, 0.1, 0],
                          transition: { duration: 0.9, ease: [0.4, 0, 0.2, 1] }
                        }}
                        className="absolute inset-0 bg-gradient-to-l from-rose-950/40 via-rose-950/15 to-transparent pointer-events-none z-20"
                      />
                    </div>

                    {/* 2. Base Right Page */}
                    <div className="relative h-full overflow-hidden">
                      <PageSheet
                        data={flipDirection === 1 ? nextSpread.right : currentSpread.right}
                        side="right"
                        pageNum={flipDirection === 1 ? targetSpreadIndex * 2 + 2 : pageRightNum}
                        isInteractive={false}
                      />
                      {/* Right Side Dynamic Cast Shadow Overlay as leaf lifts */}
                      <motion.div
                        initial={{ opacity: flipDirection === 1 ? 0.4 : 0 }}
                        animate={{ 
                          opacity: flipDirection === 1 ? [0.4, 0.15, 0] : [0, 0.35, 0],
                          transition: { duration: 0.9, ease: [0.4, 0, 0.2, 1] }
                        }}
                        className="absolute inset-0 bg-gradient-to-r from-rose-950/40 via-rose-950/15 to-transparent pointer-events-none z-20"
                      />
                    </div>

                    {/* 3. FLIPPING PHYSICAL 3D LEAF */}
                    <motion.div
                      key={`flip-leaf-${targetSpreadIndex}`}
                      initial={{ 
                        rotateY: 0,
                        boxShadow: '0 0 0 rgba(0,0,0,0)'
                      }}
                      animate={{ 
                        rotateY: flipDirection === 1 ? -180 : 180,
                        boxShadow: [
                          '0 0 0 rgba(0,0,0,0)',
                          '0 20px 40px rgba(0,0,0,0.35)',
                          '0 0 0 rgba(0,0,0,0)'
                        ]
                      }}
                      transition={{ 
                        duration: 0.9, 
                        ease: [0.35, 0, 0.15, 1] 
                      }}
                      onAnimationComplete={() => {
                        setSpreadIndex(targetSpreadIndex);
                        setIsFlipping(false);
                      }}
                      style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: flipDirection === 1 ? '50%' : '0%',
                        width: '50%',
                        transformOrigin: flipDirection === 1 ? 'left center' : 'right center',
                        transformStyle: 'preserve-3d',
                        zIndex: 35
                      }}
                      className="hidden md:block"
                    >
                      {/* FRONT FACE of the leaf */}
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          backfaceVisibility: 'hidden',
                          WebkitBackfaceVisibility: 'hidden',
                          transform: 'rotateY(0deg)',
                          zIndex: 2
                        }}
                        className="h-full w-full overflow-hidden rounded-r-2xl border-y border-r border-rose-200/80 shadow-md bg-[#fdf4f5]"
                      >
                        <PageSheet
                          data={flipDirection === 1 ? currentSpread.right : currentSpread.left}
                          side={flipDirection === 1 ? 'right' : 'left'}
                          pageNum={flipDirection === 1 ? pageRightNum : pageLeftNum}
                          isInteractive={false}
                        />

                        {/* Page Curl Highlight Sheen */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none opacity-60" />

                        {/* Front Leaf Gradient Shadow (darkens as it turns up) */}
                        <motion.div
                          animate={{ 
                            opacity: [0, 0.45, 0.8],
                            transition: { duration: 0.9, ease: 'easeInOut' }
                          }}
                          className={`absolute inset-0 pointer-events-none ${
                            flipDirection === 1 
                              ? 'bg-gradient-to-r from-rose-950/40 via-rose-900/20 to-transparent' 
                              : 'bg-gradient-to-l from-rose-950/40 via-rose-900/20 to-transparent'
                          }`}
                        />
                      </div>

                      {/* BACK FACE of the leaf (lands on the other side) */}
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          backfaceVisibility: 'hidden',
                          WebkitBackfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)',
                          zIndex: 1
                        }}
                        className="h-full w-full overflow-hidden rounded-l-2xl border-y border-l border-rose-200/80 shadow-md bg-[#fdf4f5]"
                      >
                        <PageSheet
                          data={flipDirection === 1 ? nextSpread.left : nextSpread.right}
                          side={flipDirection === 1 ? 'left' : 'right'}
                          pageNum={flipDirection === 1 ? targetSpreadIndex * 2 + 1 : targetSpreadIndex * 2 + 2}
                          isInteractive={false}
                        />

                        {/* Dynamic Spine Crease Shadow (Starts dark as it turns and fades out smoothly to 0 as it lands flat) */}
                        <motion.div
                          animate={{ 
                            opacity: [0.75, 0.35, 0],
                            transition: { duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }
                          }}
                          className="absolute inset-0 bg-gradient-to-r from-rose-950/50 via-rose-950/20 to-transparent pointer-events-none"
                        />

                        {/* Soft Landing Ambient Glow */}
                        <motion.div
                          animate={{ 
                            opacity: [0, 0.15, 0],
                            transition: { duration: 0.9, ease: 'easeOut' }
                          }}
                          className="absolute inset-0 bg-white/20 pointer-events-none"
                        />
                      </div>
                    </motion.div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}