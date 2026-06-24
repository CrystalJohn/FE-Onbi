'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ClipboardCopy, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface PremiumQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExpire?: () => void;
  price: string;
  orderCode: string;
  parentName: string;
  expiresAt: number; // timestamp in ms
  title?: string;
  subtitle?: string;
  itemLabel?: string;
  inline?: boolean;
  packageName?: string;
}

export function PremiumQRModal({
  isOpen,
  onClose,
  onExpire,
  price,
  orderCode,
  parentName,
  expiresAt,
  title,
  subtitle,
  itemLabel,
  inline = false,
  packageName,
}: PremiumQRModalProps) {
  const { language } = useLanguage();
  const [countdown, setCountdown] = useState<number>(0);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const tick = () => {
      const remaining = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
      setCountdown(remaining);
      if (remaining <= 0) {
        if (onExpire) onExpire();
      }
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [isOpen, expiresAt, onExpire]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const t = {
    successTitle: title || (language === 'vi' ? 'Đăng ký thành công!' : 'Registration successful!'),
    successSub: subtitle || (language === 'vi' ? 'Cảm ơn ba mẹ đã quan tâm đến ONBI' : 'Thank you for choosing ONBI'),
    totalPayment: language === 'vi' ? 'Tổng thanh toán' : 'Total Payment',
    scanToPay: language === 'vi' ? 'Quét QR để thanh toán' : 'Scan to Pay',
    paymentWindow: language === 'vi' ? 'Thời gian thanh toán' : 'Payment window',
    cardTitle: itemLabel || (language === 'vi' ? 'MÃ ĐĂNG KÝ SỚM' : 'PRE-ORDER CODE'),
    member: language === 'vi' ? 'PHỤ HUYNH' : 'PARENT',
    copied: language === 'vi' ? 'Đã sao chép!' : 'Copied!',
    copyBtn: language === 'vi' ? 'Chép mã đơn hàng' : 'Copy order code',
    hint: language === 'vi' ? 'Giữ nguyên nội dung chuyển khoản là mã đơn hàng.' : 'Keep the transfer description as the order code.',
    btnDone: language === 'vi' ? 'Quay về' : 'Go back',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="premium-qr-modal"
          initial={{ opacity: 0, scale: inline ? 0.95 : 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: inline ? 0.95 : 1 }}
          transition={{ duration: 0.5 }}
          className={
            inline 
              ? "relative flex flex-col items-center justify-center w-full py-4"
              : "fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          }
          style={inline ? undefined : { background: 'linear-gradient(145deg, #f0f4ff 0%, #f7f6f2 40%, #eef8f4 100%)' }}
        >
          {/* Close button (only in fullscreen mode) */}
          {!inline && (
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-3 bg-white/50 hover:bg-white/80 dark:bg-zinc-900/50 dark:hover:bg-zinc-800 rounded-full backdrop-blur transition-colors z-20"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          )}

          {/* Background decorations (only in fullscreen mode) */}
          {!inline && (
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden dark:opacity-30">
              <div className="absolute -top-32 -left-32 w-72 h-72 bg-blue-400/10 rounded-full blur-[80px]" />
              <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-cyan-400/10 rounded-full blur-[80px]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400/5 rounded-full blur-[100px]" />
            </div>
          )}

          <div className={`flex flex-col items-center w-full max-w-[420px] px-5 relative z-10`}>

            {/* Success Header (Hidden in inline mode) */}
            {!inline && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col items-center gap-2 mb-5"
              >
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm">
                  <Check className="w-3.5 h-3.5 stroke-[3]" /> {t.successTitle}
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight text-center max-w-[300px]">{t.successSub}</h3>
              </motion.div>
            )}

            {/* Circular Countdown Ring + QR Container */}
            <motion.div 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 24 }}
              className={`w-full bg-white dark:bg-zinc-950/90 backdrop-blur-xl border border-white/80 dark:border-zinc-800/80 rounded-[36px] ${inline ? 'p-6' : 'p-6 md:p-8'} shadow-[0_20px_60px_rgba(0,0,0,0.08)] flex flex-col items-center relative overflow-hidden`}
            >
              {/* Subtle Glows */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-[50px] pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-[50px] pointer-events-none" />

              {/* Price Info */}
              <div className="text-center mb-5 relative z-10">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">
                  {t.totalPayment}
                </div>
                <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {price}
                </div>
              </div>

              {/* Integrated QR + Circular Timer */}
              <div className="relative z-10 flex items-center justify-center mb-1">
                {/* SVG Circular Ring */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ width: inline ? '220px' : '280px', height: inline ? '220px' : '280px', transform: 'translate(-50%, -50%)', top: '50%', left: '50%' }}>
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 transform">
                    <circle 
                      cx="50" cy="50" r="48" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="1.5" 
                      className="text-slate-100 dark:text-zinc-800" 
                    />
                    <circle 
                      cx="50" cy="50" r="48" 
                      fill="none" 
                      stroke="url(#timerGradient)" 
                      strokeWidth="3" 
                      strokeLinecap="round"
                      strokeDasharray="301.59" 
                      strokeDashoffset={301.59 - (301.59 * Math.max(0, countdown)) / 600} 
                      className="transition-all duration-1000 ease-linear drop-shadow-sm"
                    />
                    <defs>
                      <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={countdown > 120 ? '#34d399' : countdown > 30 ? '#fbbf24' : '#f87171'} />
                        <stop offset="100%" stopColor={countdown > 120 ? '#10b981' : countdown > 30 ? '#f59e0b' : '#ef4444'} />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                {/* Timer Text Bubble */}
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 bg-white dark:bg-zinc-900 px-3 py-1 rounded-full shadow-md border ${countdown > 120 ? 'border-emerald-100 dark:border-emerald-900/50 text-emerald-600' : countdown > 30 ? 'border-amber-100 dark:border-amber-900/50 text-amber-600' : 'border-red-100 dark:border-red-900/50 text-red-600'} flex items-center gap-1.5 z-20`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${countdown > 120 ? 'bg-emerald-500' : countdown > 30 ? 'bg-amber-500 animate-pulse' : 'bg-red-500 animate-pulse'}`} />
                  <span className="text-[11px] font-black font-mono">
                    {String(Math.floor(countdown / 60)).padStart(2, '0')}:{String(countdown % 60).padStart(2, '0')}
                  </span>
                </div>

                {/* The QR Image */}
                <div className={`relative bg-white ${inline ? 'p-3 m-4' : 'p-3.5 m-6'} rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-slate-100/50 z-10`}>
                  <Image 
                    src={`https://img.vietqr.io/image/MB-0961161479-compact2.png?amount=${parseInt(price.replace(/[^\d]/g, ''), 10)}&addInfo=${orderCode}&accountName=CAO BA THIEN`}
                    alt="VietQR Payment"
                    width={inline ? 150 : 210}
                    height={inline ? 150 : 210}
                    className="rounded-xl"
                    unoptimized
                  />
                </div>
              </div>

              {/* Order details (compact receipt) */}
              <div className="relative z-10 mt-2 w-full border-t border-dashed border-slate-200 dark:border-zinc-800 pt-5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 dark:bg-zinc-900/50 rounded-xl p-3 border border-slate-100 dark:border-zinc-800/80">
                    <div className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">{t.cardTitle}</div>
                    <div className="text-[13px] font-black text-slate-800 dark:text-slate-200 font-mono mt-1">{orderCode}</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-zinc-900/50 rounded-xl p-3 border border-slate-100 dark:border-zinc-800/80 flex flex-col justify-center overflow-hidden">
                    <div className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">{t.member}</div>
                    <div className="text-[13px] font-bold text-slate-700 dark:text-slate-300 mt-1 truncate">{parentName}</div>
                  </div>
                </div>
                {packageName && (
                  <div className="bg-slate-50 dark:bg-zinc-900/50 rounded-xl p-3 border border-slate-100 dark:border-zinc-800/80 mt-3 flex items-center justify-between">
                    <div className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">GÓI ĐĂNG KÝ</div>
                    <div className="text-[12px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">{packageName}</div>
                  </div>
                )}
              </div>

              {/* Copy button */}
              <button
                onClick={() => handleCopy(orderCode)}
                className={`relative z-10 mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[12px] font-bold transition-all border ${copiedText === orderCode
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                  : 'bg-slate-50 dark:bg-zinc-900 border-slate-100 dark:border-zinc-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800'
                }`}
              >
                <ClipboardCopy className="w-4 h-4" />
                {copiedText === orderCode ? t.copied : t.copyBtn}
              </button>
            </motion.div>

            {/* Hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-3 text-[10px] text-slate-400 text-center leading-relaxed"
            >
              {t.hint}
            </motion.p>

            {/* Done */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              onClick={onClose}
              className="mt-2 text-[11px] font-semibold text-slate-400 hover:text-slate-600 transition-colors py-2"
            >
              {t.btnDone}
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
