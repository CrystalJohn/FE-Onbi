'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, User, ArrowLeftRight, Bot, AlertCircle, Check, HelpCircle, HeadphonesIcon } from 'lucide-react';

interface Child {
  id: number;
  name: string;
}

interface Device {
  id: number;
  serialNumber: string;
}

export default function SetupStep3() {
  const router = useRouter();
  const [children, setChildren] = useState<Child[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const getToken = () => localStorage.getItem('token') || '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/children`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        
        if (res.ok) {
          const childData = await res.json();
          setChildren(childData);
          if (childData.length > 0) {
            setSelectedChildId(childData[0].id);
          }
        }
        
        // Lấy deviceId đã được active ở Bước 2 từ localStorage
        const activatedId = localStorage.getItem('activatedDeviceId');
        const activatedSerial = localStorage.getItem('activatedDeviceSerial');
        
        if (activatedId) {
          setSelectedDeviceId(Number(activatedId));
          setDevices([{ id: Number(activatedId), serialNumber: activatedSerial || 'Unknown' }]);
        }
      } catch {
        setError('Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedChildId || !selectedDeviceId) {
      setError('Vui lòng chọn bé và thiết bị');
      return;
    }

    setSubmitLoading(true);
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/devices/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ childId: selectedChildId.toString(), deviceId: selectedDeviceId.toString() }),
      });

      if (!res.ok) {
        const data = await res.json();
        
        // Nếu lỗi là do robot chưa kích hoạt
        if (data.message === "Robot chưa được kích hoạt") {
          setError('Thiết bị này chưa được kích hoạt. Vui lòng quay lại Bước 2 để kích hoạt thiết bị trước khi gán.');
        } else {
          setError(data.message || 'Gán thiết bị thất bại');
        }
        
        setSubmitLoading(false);
        return;
      }

      setSuccess(true);
      
      // Xóa device lưu nháp trong localStorage
      localStorage.removeItem('activatedDeviceId');
      localStorage.removeItem('activatedDeviceSerial');

      setTimeout(() => {
        router.push('/parent/children');
      }, 1500);
      
    } catch {
      setError('Không thể kết nối server');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Hoàn tất thiết lập!</h1>
          <p className="text-slate-500 mb-8">Robot đã được kết nối thành công với hồ sơ của bé.</p>
          <div className="animate-pulse text-sm text-slate-400">Đang chuyển hướng vào ứng dụng...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col items-center p-4">
      <div className="w-full max-w-xl mt-10">
        <button 
          onClick={() => router.push('/setup')}
          className="flex items-center gap-2 mb-6 text-cyan-600 hover:text-cyan-700 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại
        </button>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-10 text-slate-500">Đang tải dữ liệu...</div>
        ) : (
          <div className="space-y-6">
            {/* Main Card */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Xác nhận gán thiết bị</h1>
                <p className="text-slate-500 text-sm">
                  Bạn đang thực hiện kết nối <span className="font-bold text-cyan-600">{devices[0]?.serialNumber || 'Robot-001'}</span> để giám sát việc học của <span className="font-bold text-cyan-600">{children.find(c => c.id === selectedChildId)?.name || 'Bé'}</span>.
                </p>
              </div>

              {/* Graphic */}
              <div className="flex items-center justify-center gap-4 mb-10 mt-6 relative">
                {/* Child Side */}
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-4 border-cyan-500 flex items-center justify-center bg-cyan-50 overflow-hidden">
                      <img src="https://api.dicebear.com/9.x/notionists/svg?seed=Felix&backgroundColor=e0f2fe" alt="Child" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center border-2 border-white">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="mt-3 font-bold text-slate-700">
                    <select
                      value={selectedChildId || ''}
                      onChange={(e) => setSelectedChildId(Number(e.target.value))}
                      className="bg-transparent text-center font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded p-1 cursor-pointer hover:bg-slate-50"
                    >
                      {children.map(child => (
                        <option key={child.id} value={child.id}>{child.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Connection Line */}
                <div className="flex-1 flex items-center justify-center relative">
                  <div className="h-[2px] w-full bg-slate-200 absolute top-1/2 -translate-y-1/2 -z-10" />
                  <div className="bg-white px-2 py-3 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center">
                    <ArrowLeftRight className="w-6 h-6 text-cyan-500" />
                  </div>
                </div>

                {/* Robot Side */}
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-3xl border-2 border-slate-200 flex items-center justify-center bg-slate-50 overflow-hidden">
                      <div className="w-16 h-16 relative">
                        <Bot className="w-full h-full text-slate-400" />
                      </div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center border-2 border-white">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="mt-3 font-bold text-slate-700">
                    {devices.length > 0 && selectedDeviceId ? (
                       devices[0]?.serialNumber || 'Robot-001'
                    ) : (
                      <input
                        type="number"
                        value={selectedDeviceId || ''}
                        onChange={(e) => setSelectedDeviceId(Number(e.target.value))}
                        placeholder="Nhập ID (VD: 1)"
                        required
                        className="w-24 text-center bg-transparent border-b border-slate-300 focus:outline-none focus:border-cyan-500 text-sm font-normal text-slate-600"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Warning Box */}
              <div className="bg-cyan-50/50 rounded-2xl p-4 flex gap-3 mb-8">
                <AlertCircle className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1">Lưu ý bảo mật</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Việc gán thiết bị sẽ cho phép Robot truy cập vào hồ sơ học tập và camera giám sát của trẻ. Bạn có thể thay đổi cài đặt này bất cứ lúc nào trong mục Quản lý thiết bị.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => router.push('/setup')}
                  disabled={submitLoading}
                  className="flex-1 py-3.5 rounded-full border border-cyan-600 text-cyan-600 font-bold hover:bg-cyan-50 transition-colors disabled:opacity-50"
                >
                  Quay lại
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitLoading || !selectedChildId || !selectedDeviceId}
                  className="flex-[1.5] py-3.5 rounded-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-md shadow-cyan-600/20"
                >
                  {submitLoading ? (
                    'Đang xử lý...'
                  ) : (
                    <>
                      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-white" />
                      </div>
                      Xác nhận gán
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Bottom Support Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-start gap-3 hover:border-orange-200 transition-colors cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0 group-hover:bg-orange-200 transition-colors">
                  <HelpCircle className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm mb-0.5">Hướng dẫn kết nối</h4>
                  <p className="text-slate-500 text-xs">Xem các bước gán Robot chi tiết</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-start gap-3 hover:border-slate-200 transition-colors cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-slate-200 transition-colors">
                  <HeadphonesIcon className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm mb-0.5">Hỗ trợ kỹ thuật</h4>
                  <p className="text-slate-500 text-xs">Liên hệ đội ngũ ONBI để được trợ giúp</p>
                </div>
              </div>
            </div>
            
            {/* Step Indicators (Faint at bottom) */}
            <div className="flex justify-center gap-8 mt-10 opacity-30 pointer-events-none">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-slate-300 text-white flex items-center justify-center text-[10px] font-bold">1</div>
                <div className="h-1 w-8 bg-slate-300 rounded-full"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-slate-300 text-white flex items-center justify-center text-[10px] font-bold">2</div>
                <div className="h-1 w-8 bg-slate-300 rounded-full"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-cyan-500 text-white flex items-center justify-center text-[10px] font-bold">3</div>
                <div className="h-1 w-8 bg-cyan-500 rounded-full"></div>
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}
