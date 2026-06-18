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
    <div className="min-h-screen bg-white flex flex-col items-center p-4">
      <div className="w-full max-w-md mt-10">
        <button 
          onClick={() => router.push('/setup')}
          className="p-2 -ml-2 mb-4 text-slate-500 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-2xl font-bold text-[#000080] mb-2">Bước 1: Tạo hồ sơ cho bé</h1>
        <p className="text-sm text-slate-500 mb-8">
          Hồ sơ giúp ONBI cá nhân hóa trải nghiệm và theo dõi quá trình học tập tốt hơn.
        </p>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Tên của bé</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: Bé An"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#000080] focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Ngày sinh</label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#000080] focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Giới tính</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`py-3 rounded-xl border text-sm font-medium transition-all ${
                  gender === 'male' 
                    ? 'border-[#000080] bg-[#000080]/5 text-[#000080]' 
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                Nam
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`py-3 rounded-xl border text-sm font-medium transition-all ${
                  gender === 'female' 
                    ? 'border-[#000080] bg-[#000080]/5 text-[#000080]' 
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
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
              className="w-full py-3.5 rounded-full bg-[#000080] hover:bg-[#000066] text-white font-bold text-sm transition-colors disabled:opacity-50"
            >
              {loading ? 'Đang lưu...' : 'Lưu và tiếp tục'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
