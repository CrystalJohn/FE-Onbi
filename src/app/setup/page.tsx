'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

export default function SetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState<any[]>([]);

  useEffect(() => {
    const fetchChildren = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/children`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setChildren(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchChildren();
  }, [router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
  }

  // Determine current step based on data
  // Nếu chưa có child -> Bước 1
  // Nếu có child nhưng chưa kích hoạt robot (check trong localStorage HOẶC check nếu child đó đã có device gán sẵn) -> Bước 2/3
  let step = 1;
  if (children.length > 0) {
    // Nếu bé đã có thiết bị -> thực ra không cần Setup nữa, có thể vào thẳng Dashboard,
    // nhưng trong luồng Setup ta có thể coi là đã xong.
    const hasDeviceAssigned = children.some(c => c.devices && c.devices.length > 0);
    
    if (localStorage.getItem('activatedDeviceId') || hasDeviceAssigned) {
      step = 3;
    } else {
      step = 2;
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Illustration (Placeholder using simple CSS for now) */}
        <div className="w-48 h-48 mx-auto bg-slate-50 rounded-full flex items-center justify-center mb-8 border border-slate-100 shadow-inner">
          <div className="text-center">
            <div className="text-4xl mb-2">🤖👦</div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#000080] mb-2">Thiết lập ONBI</h1>
          <p className="text-sm text-slate-500 px-4">
            Hoàn thành 3 bước đơn giản dưới đây để bắt đầu trải nghiệm Guided Care.
          </p>
        </div>

        {/* Steps List */}
        <div className="space-y-3 mb-8">
          {/* Step 1 */}
          <div className={`p-4 rounded-xl border ${step === 1 ? 'border-blue-500 bg-blue-50/50 shadow-sm relative overflow-hidden' : 'border-slate-100 bg-white'}`}>
            {step === 1 && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />}
            <div className="flex gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${step === 1 ? 'bg-blue-600 text-white' : step > 1 ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                {step > 1 ? <Check className="w-4 h-4" /> : '1'}
              </div>
              <div>
                <h3 className={`font-bold ${step === 1 ? 'text-slate-900' : 'text-slate-700'}`}>Tạo hồ sơ cho bé</h3>
                <p className="text-sm text-slate-500 mt-0.5">Thêm tên, ngày sinh và giới tính của bé.</p>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className={`p-4 rounded-xl border ${step === 2 ? 'border-blue-500 bg-blue-50/50 shadow-sm relative overflow-hidden' : 'border-slate-100 bg-white'}`}>
            {step === 2 && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />}
            <div className="flex gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${step === 2 ? 'bg-blue-600 text-white' : step > 2 ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                {step > 2 ? <Check className="w-4 h-4" /> : '2'}
              </div>
              <div>
                <h3 className={`font-bold ${step === 2 ? 'text-slate-900' : 'text-slate-700'}`}>Kích hoạt robot</h3>
                <p className="text-sm text-slate-500 mt-0.5">Nhập mã kích hoạt đi kèm thiết bị ONBI.</p>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className={`p-4 rounded-xl border ${step === 3 ? 'border-blue-500 bg-blue-50/50 shadow-sm relative overflow-hidden' : 'border-slate-100 bg-white'}`}>
            {step === 3 && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />}
            <div className="flex gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${step === 3 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                3
              </div>
              <div>
                <h3 className={`font-bold ${step === 3 ? 'text-slate-900' : 'text-slate-700'}`}>Gán robot cho bé</h3>
                <p className="text-sm text-slate-500 mt-0.5">Liên kết robot với hồ sơ của bé để bắt đầu giám sát.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            if (step === 1) router.push('/setup/step1');
            if (step === 2) router.push('/setup/step2');
            if (step === 3) router.push('/setup/step3');
          }}
          className="w-full py-3.5 rounded-full bg-[#000080] hover:bg-[#000066] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-md"
        >
          {step === 1 ? 'Tạo hồ sơ cho bé' : step === 2 ? 'Kích hoạt robot' : 'Gán robot cho bé'}
          <ArrowRight className="w-4 h-4" />
        </button>
        
        {step > 1 && (
          <button
            onClick={() => router.push('/parent/children')}
            className="w-full mt-4 py-2 text-sm text-slate-500 hover:text-slate-700"
          >
            Bỏ qua thiết lập, vào trang quản lý
          </button>
        )}
      </div>
    </div>
  );
}
