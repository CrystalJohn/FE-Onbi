'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function SetupStep2() {
  const router = useRouter();
  const [activationCode, setActivationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getToken = () => localStorage.getItem('token') || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/devices/activate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ activationCode }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Mã kích hoạt không hợp lệ');
        return;
      }

      const deviceData = await res.json();
      
      // Lưu deviceId vào localStorage tạm thời để truyền sang Bước 3
      if (deviceData && deviceData.id) {
        localStorage.setItem('activatedDeviceId', deviceData.id.toString());
        localStorage.setItem('activatedDeviceSerial', deviceData.serialNumber || activationCode);
      }

      // We successfully activated a device.
      // Move to step 3
      router.push('/setup/step3');
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

        <h1 className="text-2xl font-bold text-[#000080] mb-2">Bước 2: Kích hoạt robot</h1>
        <p className="text-sm text-slate-500 mb-8">
          Vui lòng nhập mã kích hoạt 6 chữ số được in dưới đế của thiết bị ONBI hoặc trong sách hướng dẫn.
        </p>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Mã kích hoạt (Activation Code)</label>
            <input
              type="text"
              value={activationCode}
              onChange={(e) => setActivationCode(e.target.value.toUpperCase())}
              placeholder="VD: ABC123XYZ"
              required
              className="w-full px-4 py-4 rounded-xl border border-slate-200 text-center text-lg tracking-widest uppercase font-mono placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#000080] focus:border-transparent transition-all"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || activationCode.trim() === ''}
              className="w-full py-3.5 rounded-full bg-[#000080] hover:bg-[#000066] text-white font-bold text-sm transition-colors disabled:opacity-50"
            >
              {loading ? 'Đang xác thực...' : 'Kích hoạt ngay'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
