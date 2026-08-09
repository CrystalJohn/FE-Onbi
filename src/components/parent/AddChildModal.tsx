'use client';

import { useEffect, useState } from 'react';
import { Baby, Loader2 } from 'lucide-react';
import PinBoxes from '@/components/ui/PinBoxes';
import { api } from '@/lib/api';

interface AddChildModalProps {
  open: boolean;
  onClose: () => void;
  /** Gọi sau khi tạo xong để trang cha tải lại danh sách. */
  onCreated: () => void | Promise<void>;
}

const FIELD_CLASS =
  'mt-2 min-h-12 w-full rounded-2xl border border-slate-200/80 bg-white px-4 text-base text-slate-950 outline-none transition-colors focus:border-[#0B008B] focus:ring-2 focus:ring-indigo-100';

/** Form thêm hồ sơ bé dùng chung cho trang Tổng quan và trang Hồ sơ trẻ. */
export default function AddChildModal({ open, onClose, onCreated }: AddChildModalProps) {
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('male');
  const [pinEnabled, setPinEnabled] = useState(false);
  const [pin, setPin] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (pinEnabled && pin.length !== 6) { setError('Mã PIN phải gồm đúng 6 chữ số.'); return; }
    setSaving(true); setError('');
    try {
      await api.post('/children', { name, dateOfBirth, gender, pin: pinEnabled ? pin : undefined });
      setName(''); setDateOfBirth(''); setGender('male'); setPinEnabled(false); setPin('');
      await onCreated();
      onClose();
    } catch (reason: unknown) {
      const message = (reason as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message ?? 'Không thể thêm hồ sơ bé.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="add-child-title" className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in-0 duration-200" onClick={onClose} />

      <form
        onSubmit={submit}
        className="relative w-full max-w-lg rounded-[28px] border border-white/80 bg-white p-6 shadow-[0_32px_80px_rgba(15,23,42,0.22)] animate-in fade-in-0 zoom-in-95 duration-200 sm:p-7"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-[#0B008B]">
          <Baby className="h-6 w-6" aria-hidden="true" />
        </div>
        <h2 id="add-child-title" className="mt-4 text-lg font-bold text-slate-950">Thêm hồ sơ bé</h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">Tạo hồ sơ để gán robot ONBI và bắt đầu theo dõi.</p>

        <div className="mt-5 space-y-4">
          <label className="block text-sm font-semibold text-slate-700">
            Tên của bé
            <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Bé An" className={FIELD_CLASS} />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-slate-700">
              Ngày sinh
              <input required type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className={FIELD_CLASS} />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Giới tính
              <select value={gender} onChange={(e) => setGender(e.target.value)} className={FIELD_CLASS}>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
              </select>
            </label>
          </div>

          <div>
            <label className="flex items-center gap-2.5 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={pinEnabled}
                onChange={(e) => { setPinEnabled(e.target.checked); if (!e.target.checked) setPin(''); }}
                className="h-4 w-4 rounded border-slate-300 text-[#0B008B] focus:ring-[#0B008B]"
              />
              Đặt mã PIN cho hồ sơ này
            </label>
            {pinEnabled && <PinBoxes value={pin} onChange={setPin} className="mt-3" />}
            <p className="mt-1.5 text-xs leading-5 text-slate-500">Khi đặt mã PIN, phải nhập đúng mã mới bắt đầu giám sát hoặc chỉnh sửa hồ sơ này.</p>
          </div>
        </div>

        {error && <p role="alert" className="mt-4 text-sm font-semibold text-red-600">{error}</p>}

        <div className="mt-6 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 min-h-11 rounded-full border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400">
            Hủy
          </button>
          <button type="submit" disabled={saving} className="flex-1 min-h-11 rounded-full bg-[#0B008B] text-sm font-bold text-white transition-colors hover:bg-[#07006D] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B008B]">
            {saving ? <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />Đang lưu…</span> : 'Lưu hồ sơ bé'}
          </button>
        </div>
      </form>
    </div>
  );
}
