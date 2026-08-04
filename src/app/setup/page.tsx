'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowRight, Check, Sparkles, Baby, ScanFace, Smartphone, Bot, Link as LinkIcon } from 'lucide-react';
import { api } from '@/lib/api';

export default function SetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);

  useEffect(() => {
    const loadSetup = async () => {
      try {
        const [childrenRes, devicesRes] = await Promise.all([
          api.get('/children'),
          api.get('/devices'),
        ]);
        setChildren(childrenRes.data);
        setDevices(devicesRes.data);

        const hasAssignedDevice = devicesRes.data.some(
          (device: any) => device.assigned || device.assignedChildId
        );
        if (hasAssignedDevice) {
          router.replace('/parent/dashboard');
          return;
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadSetup();
  }, [router]);

  if (loading) {
    return <div className="flex min-h-dvh items-center justify-center bg-[#0a0f2c] text-sm font-medium text-white/50">Đang tải...</div>;
  }

  let step = 1;
  if (children.length > 0) {
    const hasActivatedDevice = devices.length > 0;
    const hasDeviceAssigned = devices.some(device => device.assigned || device.assignedChildId);
    
    if (hasDeviceAssigned) {
      step = 3; // Technically it redirects, but keep it robust
    } else if (hasActivatedDevice) {
      // Đã kích hoạt nhưng chưa gán -> Hiện onboarding Bước 3
      step = 3;
    } else {
      // Chưa kích hoạt -> Hiện onboarding Bước 2
      step = 2;
    }
  }

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#0F172A] p-4 sm:p-6 lg:p-12">
      {/* Background Decorators */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-cyan-900/20 blur-[100px]" />
        <div className="absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-[#0B008B]/30 blur-[120px]" />
      </div>

      <section className="relative w-full max-w-[900px] rounded-[32px] border border-white/40 bg-gradient-to-b from-[#F0F5FA] to-[#E2EAF1] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.5)] sm:p-10 lg:p-12 backdrop-blur-2xl">
        
        {/* Logo */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2">
          <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-gray-300 bg-gradient-to-br from-gray-100 via-gray-300 to-gray-400 p-1 shadow-[0_10px_25px_rgba(0,0,0,0.2)]">
            <div className="relative h-full w-full overflow-hidden rounded-full bg-white">
              <Image
                src="/logo_onbi.jpg"
                alt="Logo ONBI"
                fill
                priority
                sizes="80px"
                className="object-cover"
              />
            </div>
            {/* Metallic shine overlay */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/40 to-transparent mix-blend-overlay"></div>
          </div>
        </div>

        <div className="mt-8 text-center sm:mt-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-cyan-800">BƯỚC {step} / 3</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0B008B] sm:text-4xl">Thiết lập ONBI</h1>
          <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
            Hoàn thành 3 bước đơn giản dưới đây để bắt đầu trải nghiệm.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="relative mx-auto mt-8 mb-12 flex max-w-[240px] items-center justify-between">
          <div className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 bg-slate-300" />
          
          {/* Node 1 */}
          <div className="relative z-10 flex flex-col items-center">
            <div className={`flex h-5 w-5 items-center justify-center rounded-full ${step > 1 ? 'bg-cyan-500 text-white' : step === 1 ? 'bg-cyan-500 ring-4 ring-cyan-500/20' : 'bg-slate-300'}`}>
              {step > 1 ? <Check className="h-3 w-3" strokeWidth={3} /> : <div className="h-2 w-2 rounded-full bg-white" />}
            </div>
          </div>
          
          {/* Node 2 */}
          <div className="relative z-10 flex flex-col items-center">
            <div className={`flex h-5 w-5 items-center justify-center rounded-full ${step > 2 ? 'bg-cyan-500 text-white' : step === 2 ? 'bg-cyan-500 ring-4 ring-cyan-500/20' : 'bg-slate-300'}`}>
              {step > 2 ? <Check className="h-3 w-3" strokeWidth={3} /> : <div className="h-2 w-2 rounded-full bg-white" />}
            </div>
          </div>

          {/* Node 3 */}
          <div className="relative z-10 flex flex-col items-center">
            <div className={`flex h-5 w-5 items-center justify-center rounded-full ${step === 3 ? 'bg-cyan-500 ring-4 ring-cyan-500/20' : 'bg-slate-300'}`}>
              <div className="h-2 w-2 rounded-full bg-white" />
            </div>
          </div>
        </div>

        {/* 3 Step Cards Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 relative">
          
          {/* CARD 1 */}
          <div className={`relative flex min-h-[260px] flex-col items-center justify-between overflow-hidden rounded-[24px] p-6 text-center transition-all duration-500 ${
            step === 1 
              ? 'scale-105 bg-gradient-to-b from-[#0b008b] to-[#0A84FF] text-white shadow-[0_20px_40px_rgba(10,132,255,0.3)] z-10' 
              : 'scale-95 bg-[#E6F0F2] border border-white/50 text-slate-800 shadow-sm opacity-90'
          }`}>
            <div className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${step === 1 ? 'border-white/20 bg-white/10 text-white shadow-inner' : 'border-slate-300 text-slate-400 bg-white/50'}`}>
              {step > 1 ? <Check className="h-6 w-6 text-emerald-500" strokeWidth={3} /> : <span className="text-xl font-bold">1</span>}
            </div>
            <div className="mt-2 flex-1">
              <h3 className={`text-lg font-bold ${step === 1 ? 'text-white' : 'text-slate-800'}`}>Tạo hồ sơ cho bé</h3>
              <p className={`mt-1 text-[13px] leading-relaxed ${step === 1 ? 'text-cyan-100' : 'text-slate-500'}`}>
                Thêm tên, ngày sinh<br/>và giới tính của bé.
              </p>
            </div>
            <div className={`mt-4 mb-2 flex w-full items-center justify-center opacity-60 ${step === 1 ? 'text-white' : 'text-slate-400'}`}>
               {/* Line art baby stroller placeholder */}
               <Baby className="h-16 w-16 stroke-[1.2]" />
            </div>
          </div>

          {/* CARD 2 */}
          <div className={`relative flex min-h-[260px] flex-col items-center justify-between overflow-hidden rounded-[24px] p-6 text-center transition-all duration-500 ${
            step === 2 
              ? 'scale-105 bg-gradient-to-b from-[#0b008b] to-[#0A84FF] text-white shadow-[0_20px_40px_rgba(10,132,255,0.4)] z-10' 
              : 'scale-95 bg-[#E6F0F2] border border-white/50 text-slate-800 shadow-sm opacity-90'
          }`}>
            {/* Glow effect inside card 2 */}
            {step === 2 && <div className="absolute top-1/2 left-1/2 w-32 h-32 -translate-x-1/2 -translate-y-1/2 bg-cyan-400/30 blur-[40px] rounded-full pointer-events-none" />}
            
            <div className={`flex h-12 w-12 items-center justify-center rounded-full border-2 relative z-10 ${step === 2 ? 'border-white/20 bg-white/10 text-white shadow-inner' : 'border-slate-300 text-slate-400 bg-white/50'}`}>
              {step > 2 ? <Check className="h-6 w-6 text-emerald-500" strokeWidth={3} /> : <span className="text-xl font-bold">2</span>}
            </div>
            <div className="mt-2 flex-1 relative z-10">
              <h3 className={`text-lg font-bold ${step === 2 ? 'text-white' : 'text-slate-800'}`}>Kích hoạt robot</h3>
              <p className={`mt-1 text-[13px] leading-relaxed ${step === 2 ? 'text-cyan-100' : 'text-slate-500'}`}>
                Nhập mã kích hoạt<br/>đi kèm thiết bị ONBI.
              </p>
            </div>
            <div className={`mt-4 mb-2 flex w-full items-center justify-center gap-3 opacity-60 relative z-10 ${step === 2 ? 'text-white' : 'text-slate-400'}`}>
              <ScanFace className="h-14 w-14 stroke-[1.2]" />
              <Smartphone className="h-14 w-14 stroke-[1.2]" />
            </div>
          </div>

          {/* CARD 3 */}
          <div className={`relative flex min-h-[260px] flex-col items-center justify-between overflow-hidden rounded-[24px] p-6 text-center transition-all duration-500 ${
            step === 3 
              ? 'scale-105 bg-gradient-to-b from-[#0b008b] to-[#0A84FF] text-white shadow-[0_20px_40px_rgba(10,132,255,0.4)] z-10' 
              : 'scale-95 bg-[#F2F4F7] border border-white/50 text-slate-800 shadow-sm opacity-80'
          }`}>
            <div className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${step === 3 ? 'border-white/20 bg-white/10 text-white shadow-inner' : 'border-slate-300 text-slate-400 bg-white/50'}`}>
              <span className="text-xl font-bold">3</span>
            </div>
            <div className="mt-2 flex-1">
              <h3 className={`text-lg font-bold ${step === 3 ? 'text-white' : 'text-slate-800'}`}>Gán robot cho bé</h3>
              <p className={`mt-1 text-[13px] leading-relaxed ${step === 3 ? 'text-cyan-100' : 'text-slate-500'}`}>
                Liên kết robot với hồ<br/>sơ của bé để bắt đầu.
              </p>
            </div>
            <div className={`mt-4 mb-2 flex w-full items-center justify-center gap-1 opacity-60 ${step === 3 ? 'text-white' : 'text-slate-400'}`}>
              <Baby className="h-10 w-10 stroke-[1.2]" />
              <LinkIcon className="h-5 w-5 stroke-[2] mx-1" />
              <Bot className="h-14 w-14 stroke-[1.2]" />
            </div>
          </div>

        </div>

        {/* Action Button */}
        <div className="mt-10 md:px-12">
          <button
            onClick={() => {
              if (step === 1) router.push('/setup/step1');
              if (step === 2) router.push('/setup/step2');
              if (step === 3) router.push('/setup/step3');
            }}
            className="group relative flex min-h-[60px] w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-[#0B008B] to-[#0A128F] px-8 text-[15px] font-bold text-white shadow-[0_12px_28px_rgba(11,0,139,0.25)] transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_16px_36px_rgba(11,0,139,0.35)]"
          >
            {/* Button Shine Effect */}
            <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-150%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(150%)]">
              <div className="relative h-full w-8 bg-white/20" />
            </div>
            <span className="relative z-10">{step === 1 ? 'Tạo hồ sơ cho bé' : step === 2 ? 'Kích hoạt robot' : 'Gán robot cho bé'}</span>
            <ArrowRight className="relative z-10 h-5 w-5" />
          </button>
        </div>

        {/* Skip Link */}
        <button
          onClick={() => router.push('/parent/dashboard')}
          className="mx-auto mt-6 flex items-center justify-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
        >
          Bỏ qua thiết lập, vào trang quản lý
          <Sparkles className="h-4 w-4" />
        </button>

      </section>
    </main>
  );
}
