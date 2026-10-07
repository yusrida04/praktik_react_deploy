import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, Sparkles, Heart, X, ArrowLeft, ArrowRight, LogOut 
} from 'lucide-react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

import AuthModal from './components/AuthModal';
import PageSheet from './components/PageSheet';
import './App.css';

const DEFAULT_SPREAD = {
  left: { name: '', date: '', moodText: '', selectedEmoji: '', note: '', isSubmitted: false },
  right: { name: '', date: '', moodText: '', selectedEmoji: '', note: '', isSubmitted: false }
};

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [spreadIndex, setSpreadIndex] = useState(0);

  const [isLockShaking, setIsLockShaking] = useState(false);

  const handleTriggerLockShake = () => {
    setIsLockShaking(true);
    setTimeout(() => setIsLockShaking(false), 600);
  };
  
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState(1);
  const [targetSpreadIndex, setTargetSpreadIndex] = useState(0);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [spreads, setSpreads] = useState([DEFAULT_SPREAD]);

  // 1. Panggil data Firestore secara otomatis saat user terautentikasi
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const docRef = doc(db, 'diaries', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data().spreads) {
            setSpreads(docSnap.data().spreads);
          }
        } catch (err) {
          console.error("Gagal mengambil data dari Firestore:", err);
        }
        setIsBookOpen(true);
      } else {
        setIsBookOpen(false);
        setSpreads([DEFAULT_SPREAD]);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fungsi Pembantu untuk Menyimpan langsung ke Firestore
  const saveToFirestore = async (newSpreads, user = currentUser) => {
    if (user) {
      try {
        await setDoc(doc(db, 'diaries', user.uid), {
          spreads: newSpreads
        });
      } catch (err) {
        console.error("Gagal menyimpan data ke Firestore:", err);
      }
    }
  };

  // 2. Perbarui State & Langsung Simpan Perubahan Teks
  const updatePage = (side, field, value) => {
    setSpreads(prevSpreads => {
      const updated = prevSpreads.map((spread, idx) => {
        if (idx !== spreadIndex) return spread;
        return {
          ...spread,
          [side]: {
            ...spread[side],
            [field]: value
          }
        };
      });
      saveToFirestore(updated);
      return updated;
    });
  };

  const turnPage = (targetIndex, direction) => {
    if (isFlipping) return;
    setFlipDirection(direction);
    setTargetSpreadIndex(targetIndex);
    setIsFlipping(true);
  };

  // 3. PERBAIKAN UTAMA: Pastikan tombol Simpan & Kunci langsung mengirim data ke Firestore
  const handleSubmitPage = (side) => {
    setSpreads(prevSpreads => {
      const updated = prevSpreads.map((spread, idx) => {
        if (idx !== spreadIndex) return spread;
        return {
          ...spread,
          [side]: {
            ...spread[side],
            isSubmitted: true
          }
        };
      });
      saveToFirestore(updated);
      return updated;
    });
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const currentSpread = spreads[spreadIndex] || DEFAULT_SPREAD;
  const nextSpread = spreads[targetSpreadIndex] || DEFAULT_SPREAD;

  const pageLeftNum = spreadIndex * 2 + 1;
  const pageRightNum = spreadIndex * 2 + 2;

  return (
    <div className="diary-bg p-3 sm:p-6 flex flex-col items-center justify-center font-sans relative overflow-x-hidden selection:bg-rose-200">
      <div className="desk-overlay" />

      <AnimatePresence>
        {showAuthModal && (
          <AuthModal 
            onClose={() => setShowAuthModal(false)} 
            onErrorShake={handleTriggerLockShake} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!isBookOpen ? (
          <motion.div
            key="closed-cover"
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.05, opacity: 0, rotateY: -80 }}
            transition={{ type: 'spring', duration: 0.8 }}
            className="flex flex-col items-center justify-center z-20 my-auto py-8"
          >
            <div 
              onClick={() => {
                if (!currentUser) {
                  setShowAuthModal(true);
                } else {
                  setIsBookOpen(true);
                }
              }}
              className="group relative cursor-pointer transform transition-transform duration-500 hover:scale-[1.02] active:scale-[0.99]"
            >
              <div className="absolute -inset-4 bg-black/60 rounded-[45px] blur-2xl transform translate-y-6 scale-95 -z-10 group-hover:blur-3xl transition-all" />

              <div className="w-[320px] sm:w-[400px] h-[480px] sm:h-[560px] bg-gradient-to-br from-rose-300 via-pink-400 to-rose-500 rounded-[38px] p-6 sm:p-8 shadow-2xl border-4 border-rose-300/80 relative flex flex-col justify-between overflow-hidden border-r-[12px] border-r-rose-600/60">
                <div className="leather-texture" />

                <div className="absolute left-3 top-0 bottom-0 w-4 border-r-2 border-dashed border-pink-200/60 flex flex-col justify-around py-8 pointer-events-none">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-pink-700/40" />
                  ))}
                </div>

                <div className="absolute -top-2 right-12 w-8 h-20 bg-gradient-to-b from-rose-600 via-rose-700 to-rose-900 rounded-b-md shadow-md border-x border-rose-800 flex items-end justify-center pb-2">
                  <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-rose-400" />
                </div>

                <div className="mt-8 text-center border-2 border-amber-300/60 p-4 rounded-2xl bg-rose-400/20 backdrop-blur-[1px]">
                  <Sparkles className="w-6 h-6 text-amber-300 mx-auto mb-1 animate-pulse" />
                  <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-amber-200">Personal & Secret</p>
                </div>

                <div className="text-center my-auto py-6">
                  <h1 className="font-serif text-4xl sm:text-5xl font-black tracking-wider bg-gradient-to-b from-amber-100 via-amber-200 to-amber-400 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                    My Diary
                  </h1>
                  <p className="text-xs font-serif italic text-rose-100/90 mt-2">
                    Lembaran Catatan & Refleksi Harian
                  </p>
                </div>

                <motion.div 
                  animate={isLockShaking ? {
                    x: [2, 10, -8, 8, -5, 5, 2],
                    rotate: [0, -8, 8, -5, 5, 0]
                  } : {}}
                  transition={{ duration: 0.5 }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 bg-gradient-to-r from-amber-300 via-amber-200 to-amber-500 border-2 border-amber-600 rounded-l-2xl p-3 shadow-xl flex items-center justify-center gap-2 group-hover:translate-x-0 transition-transform"
                >
                  <Lock className="w-5 h-5 text-amber-950" />
                  <div className="w-2 h-6 bg-amber-700/40 rounded-full" />
                </motion.div>

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
          <motion.div
            key="open-diary"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-5xl my-auto flex flex-col items-center"
          >
            <div className="w-full mb-3 flex flex-wrap items-center justify-between gap-2 px-2 text-rose-100">
              <div className="flex items-center gap-2">
                <button
                  disabled={isFlipping}
                  onClick={() => setIsBookOpen(false)}
                  className="px-3.5 py-2 bg-rose-950/80 hover:bg-rose-900 disabled:opacity-50 text-rose-200 rounded-xl text-xs font-bold transition flex items-center gap-2 border border-rose-800/80 shadow-md"
                >
                  <X className="w-4 h-4 text-rose-300" />
                  <span>Tutup Buku</span>
                </button>

                {currentUser && (
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 bg-rose-900/80 hover:bg-rose-950 text-amber-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-rose-700 shadow-md"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar Akun</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  disabled={spreadIndex === 0 || isFlipping}
                  onClick={() => turnPage(spreadIndex - 1, -1)}
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
                      const newSpreads = [...spreads, DEFAULT_SPREAD];
                      setSpreads(newSpreads);
                      saveToFirestore(newSpreads);
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

            <div className="w-full bg-gradient-to-br from-rose-400 via-pink-500 to-rose-600 rounded-[36px] p-3 sm:p-5 shadow-2xl border-4 border-rose-300/80 relative overflow-hidden">
              <div className="leather-texture" />

              <div 
                className="relative page-paper-bg rounded-2xl shadow-inner border border-rose-200/80 min-h-[540px] max-h-[78vh] overflow-hidden"
                style={{ perspective: 2400 }}
              >
                <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-8 -ml-4 bg-gradient-to-r from-rose-900/20 via-rose-900/40 to-rose-900/20 z-30 pointer-events-none border-x border-rose-900/10">
                  <div className="h-full flex flex-col justify-around items-center py-4 opacity-30">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="w-full h-1 bg-rose-900 shadow-sm" />
                    ))}
                  </div>
                </div>

                {!isFlipping ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                    <PageSheet
                      data={currentSpread.left}
                      side="left"
                      pageNum={pageLeftNum}
                      onUpdate={(field, val) => updatePage('left', field, val)}
                      onSubmit={() => handleSubmitPage('left')}
                      isInteractive={true}
                    />

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
                  <div className="relative grid grid-cols-1 md:grid-cols-2 h-full min-h-[540px]">
                    <div className="relative h-full overflow-hidden">
                      <PageSheet
                        data={flipDirection === 1 ? currentSpread.left : nextSpread.left}
                        side="left"
                        pageNum={flipDirection === 1 ? pageLeftNum : targetSpreadIndex * 2 + 1}
                        isInteractive={false}
                      />
                    </div>

                    <div className="relative h-full overflow-hidden">
                      <PageSheet
                        data={flipDirection === 1 ? nextSpread.right : currentSpread.right}
                        side="right"
                        pageNum={flipDirection === 1 ? targetSpreadIndex * 2 + 2 : pageRightNum}
                        isInteractive={false}
                      />
                    </div>

                    <motion.div
                      key={`flip-leaf-${targetSpreadIndex}`}
                      initial={{ rotateY: 0 }}
                      animate={{ rotateY: flipDirection === 1 ? -180 : 180 }}
                      transition={{ duration: 0.9, ease: [0.35, 0, 0.15, 1] }}
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
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          backfaceVisibility: 'hidden',
                          transform: 'rotateY(0deg)',
                          zIndex: 2
                        }}
                        className="h-full w-full overflow-hidden rounded-r-2xl border-y border-r border-rose-200/80 shadow-md page-paper-bg"
                      >
                        <PageSheet
                          data={flipDirection === 1 ? currentSpread.right : currentSpread.left}
                          side={flipDirection === 1 ? 'right' : 'left'}
                          pageNum={flipDirection === 1 ? pageRightNum : pageLeftNum}
                          isInteractive={false}
                        />
                      </div>

                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          backfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)',
                          zIndex: 1
                        }}
                        className="h-full w-full overflow-hidden rounded-l-2xl border-y border-l border-rose-200/80 shadow-md page-paper-bg"
                      >
                        <PageSheet
                          data={flipDirection === 1 ? nextSpread.left : nextSpread.right}
                          side={flipDirection === 1 ? 'left' : 'right'}
                          pageNum={flipDirection === 1 ? targetSpreadIndex * 2 + 1 : targetSpreadIndex * 2 + 2}
                          isInteractive={false}
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