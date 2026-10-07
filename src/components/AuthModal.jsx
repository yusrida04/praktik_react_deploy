import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, KeyRound, X, UserPlus, LogIn } from 'lucide-react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { auth } from '../firebase';

export default function AuthModal({ onClose }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onClose();
    } catch (err) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Email atau kata sandi salah.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Email sudah terdaftar. Silakan login.');
      } else if (err.code === 'auth/weak-password') {
        setError('Kata sandi minimal 6 karakter.');
      } else {
        setError('Gagal masuk. Periksa kembali akun kamu.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
      />

      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 20 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="relative w-full max-w-sm bg-gradient-to-b from-[#3a1d1d] via-[#2a1313] to-[#1e0a0a] border-2 border-amber-400/50 rounded-3xl p-6 sm:p-7 shadow-[0_0_50px_rgba(244,63,94,0.3)] text-rose-100 z-10"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800 transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center mb-5">
          <div className="p-3.5 bg-gradient-to-tr from-amber-500 to-amber-300 rounded-2xl shadow-lg text-amber-950 mb-3 border border-amber-200">
            <Lock className="w-6 h-6 animate-pulse" />
          </div>
          <h3 className="font-serif text-xl font-bold text-amber-200 tracking-wide">
            {isRegister ? 'Daftar Akun Diary' : 'Gembok Rahasia Diary'}
          </h3>
          <p className="text-xs text-rose-200/70 mt-1">
            {isRegister ? 'Buat akun baru untuk menyimpan catatanmu.' : 'Masukkan email & password untuk membuka diary.'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-3.5">
          {error && (
            <div className="p-2 rounded-lg bg-rose-900/60 border border-rose-500 text-[11px] text-rose-200 text-center font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="text-[11px] font-bold text-amber-200/90 mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-pink-300" />
              <span>Alamat Email:</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan sandi..."
              className="w-full px-3 py-2 text-xs bg-rose-950/70 border border-rose-700/80 focus:border-amber-400 rounded-xl text-rose-100 placeholder-rose-400/40 focus:outline-none focus:ring-1 focus:ring-amber-400 transition"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 active:scale-[0.99] text-amber-950 font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 border border-amber-200"
            >
              {isRegister ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
              <span>{isRegister ? 'Daftar & Masuk ✨' : 'Buka Kunci Diary ✨'}</span>
            </button>
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              className="text-xs text-amber-200/80 hover:text-amber-100 underline"
            >
              {isRegister ? 'Sudah punya akun? Login di sini' : 'Belum punya akun? Registrasi di sini'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}