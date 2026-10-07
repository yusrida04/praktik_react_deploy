import React from 'react';
import { motion } from 'framer-motion';
import { PenTool, CheckCircle2, RotateCcw } from 'lucide-react';
import CustomPinkDatePicker from './CustomPinkDatePicker';
import { PRESET_EMOJIS } from '../constants/emojis';

export default function PageSheet({
  data,
  side,
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
      className={`h-full w-full p-4 sm:p-6 flex flex-col justify-between overflow-y-auto max-h-[75vh] relative page-paper-bg ${
        isLeft ? 'border-b md:border-b-0 md:border-r border-rose-200/80' : ''
      }`}
    >
      <div>
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

        {!pageData.isSubmitted ? (
          <div className="space-y-3">
            <h2 className="text-lg font-serif font-bold text-rose-950 flex items-center gap-2">
              <PenTool className="w-4 h-4 text-rose-700" /> Tulis Catatan Diary
            </h2>

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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 pt-1">
            <div className="border-b border-rose-300/80 pb-2">
              <h3 className="font-serif text-base font-bold text-rose-950">Catatan Abadi</h3>
              <p className="text-[11px] text-rose-800/80">
                Ditulis oleh <span className="font-bold">{pageData.name || 'Sahabat Diary'}</span> • {pageData.date || 'Hari Ini'}
              </p>
            </div>

            <div className="bg-white/70 p-4 rounded-xl border border-rose-200 font-serif italic text-rose-950 leading-7 text-xs shadow-inner min-h-[130px]">
              "{pageData.note}"
            </div>

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