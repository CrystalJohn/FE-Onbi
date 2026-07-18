'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function SetupStep1() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('male');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getToken = () => localStorage.getItem('token') || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/children`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ name, dateOfBirth, gender }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Thêm thất bại');
        return;
      }

      // Success, move to step 2
      router.push('/setup?refresh=true');
    } catch {
      setError('Không thể kết nối server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#0F172A] p-4 sm:p-6 lg:p-12">
      {/* Background Decorators */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-cyan-900/20 blur-[100px]" />
        <div className="absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-[#0B008B]/30 blur-[120px]" />
      </div>

      <section className="relative w-full max-w-[600px] flex flex-col items-center rounded-[32px] border border-white/40 bg-gradient-to-b from-[#F0F5FA] to-[#E2EAF1] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.5)] sm:p-10 lg:p-12 backdrop-blur-2xl">
      <div className="w-full max-w-md px-2">
        <button
          onClick={() => router.push('/setup')}
          aria-label="Quay lại"
          className="mb-6 grid h-10 w-10 place-items-center rounded-xl bg-[#000080] text-white shadow-md transition hover:bg-[#000066]"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-2xl font-extrabold tracking-tight text-[#0B008B] mb-2">Bước 1: Tạo hồ sơ cho bé</h1>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
          Hồ sơ giúp ONBI cá nhân hóa trải nghiệm và theo dõi quá trình học tập tốt hơn.
        </p>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-2">Tên của bé</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: Bé An"
              required
              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0B008B] focus:border-[#0B008B] transition-all bg-white shadow-sm"
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-2">Ngày sinh</label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0B008B] focus:border-[#0B008B] transition-all bg-white shadow-sm"
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-2">Giới tính</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`py-3.5 rounded-xl border text-sm font-medium transition-all ${
                  gender === 'male' 
                    ? 'border-[#0B008B] bg-[#F2F4FB] text-[#0B008B] shadow-sm' 
                    : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                Nam
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`py-3.5 rounded-xl border text-sm font-medium transition-all ${
                  gender === 'female' 
                    ? 'border-[#0B008B] bg-[#F2F4FB] text-[#0B008B] shadow-sm' 
                    : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                Nữ
              </button>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-full bg-[#0B008B] hover:bg-[#090070] text-white font-bold text-[15px] shadow-[0_8px_20px_rgba(11,0,139,0.2)] transition-all hover:shadow-[0_12px_25px_rgba(11,0,139,0.3)] disabled:opacity-60"
            >
              {loading ? 'Đang lưu...' : 'Lưu và tiếp tục'}
            </button>
          </div>
        </form>
      </div>
      </section>
    </main>
  );
}
