'use client';

import { useEffect, useRef, useState } from 'react';
import { KeyRound } from 'lucide-react';
import { api } from '@/lib/api';

interface PinGateModalProps {
  childId: string;
  childName: string;
  title: string;
  onSuccess: () => void;
  onClose: () => void;
}

export default function PinGateModal({ childId, childName, title, onSuccess, onClose }: PinGateModalProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 6) return;
    setChecking(true); setError('');
    try {
      const { data } = await api.post<{ valid: boolean }>(`/children/${childId}/verify-pin`, { pin });
      if (data.valid) onSuccess();
      else { setError('Mã PIN không đúng.'); setPin(''); inputRef.current?.focus(); }
    } catch {
      setError('Không thể xác thực. Vui lòng thử lại.');
    } finally { setChecking(false); }
  };

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="pin-gate-title" className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <form onSubmit={submit} className="relative w-full max-w-sm rounded-[28px] border border-white/80 bg-white p-6 shadow-[0_32px_80px_rgba(15,23,42,0.22)]">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50">
          <KeyRound className="h-6 w-6 text-cyan-700" />
        </div>
        <h2 id="pin-gate-title" className="mt-4 text-lg font-bold text-slate-950">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Nhập mã PIN 6 số của hồ sơ <span className="font-semibold text-slate-900">{childName}</span> để tiếp tục.
        </p>
        <input
          ref={inputRef}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
          inputMode="numeric"
          autoComplete="off"
          maxLength={6}
          placeholder="••••••"
          className="mt-4 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-center text-2xl tracking-[0.5em] outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
        />
        {error && <p role="alert" className="mt-2 text-sm font-semibold text-red-600">{error}</p>}
        <div className="mt-6 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 min-h-11 rounded-full border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400">Hủy</button>
          <button type="submit" disabled={checking || pin.length !== 6} className="flex-1 min-h-11 rounded-full bg-[#0B008B] text-sm font-bold text-white transition-colors hover:bg-[#07006D] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B008B]">{checking ? 'Đang kiểm tra…' : 'Xác nhận'}</button>
        </div>
      </form>
    </div>
  );
}
