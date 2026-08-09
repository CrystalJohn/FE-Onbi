"use client";

import { useState, useEffect } from "react";
import { Check, Crown, Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import { PremiumQRModal } from "@/components/payment/PremiumQRModal";

export default function ParentSubscriptionPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState<{ fullName?: string } | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) setProfile(JSON.parse(stored));
    } catch { }

    api.get("/parents/profile")
      .then(res => setProfile(res.data))
      .catch(() => { });
  }, []);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderData, setOrderData] = useState<{ price: string; orderCode: string; expiresAt: number; packageName: string } | null>(null);

  useEffect(() => {
    // Khôi phục đơn hàng đang chờ từ Local Storage
    const saved = localStorage.getItem("pendingSubscriptionOrder");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Date.now() < parsed.expiresAt) {
          setOrderData(parsed);
          setIsModalOpen(true);
        } else {
          localStorage.removeItem("pendingSubscriptionOrder");
        }
      } catch (e) { }
    }
  }, []);

  const handleSubscribe = async (packageId: "monthly" | "yearly", price: string) => {
    const targetPackageName = packageId === "monthly" ? "Thành viên Tháng" : "Thành viên Năm";

    // 1. Kiểm tra cache trong localStorage trước
    const savedStr = localStorage.getItem("pendingSubscriptionOrder");
    if (savedStr) {
      try {
        const cachedData = JSON.parse(savedStr);
        // Nếu gói đang lưu trùng khớp và vẫn còn hạn
        if (cachedData.packageName === targetPackageName && Date.now() < cachedData.expiresAt) {
          setOrderData(cachedData);
          setIsModalOpen(true);
          return; // Dừng lại, không gọi API nữa!
        }
      } catch (e) { }
    }

    // 2. Mở lại mã QR nếu state vẫn còn lưu
    if (orderData && orderData.packageName === targetPackageName && Date.now() < orderData.expiresAt) {
      setIsModalOpen(true);
      return;
    }

    setLoading(packageId);
    setError("");
    try {
      const response = await api.post("/subscription-orders/create", {
        packageId,
        price,
      });
      const data = response.data;
      const remainingMs = data.remainingMs ? data.remainingMs : (10 * 60 * 1000);

      const newOrderData = {
        price: data.price,
        orderCode: data.orderCode,
        expiresAt: Date.now() + remainingMs,
        packageName: targetPackageName,
      };

      setOrderData(newOrderData);
      localStorage.setItem("pendingSubscriptionOrder", JSON.stringify(newOrderData));
      setIsModalOpen(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      {/* Bỏ card bọc: tiêu đề đứng thẳng trên nền trang, đỡ một lớp khung + padding */}
      <header className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.17em] text-[#0B008B]">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          Gói dịch vụ cao cấp
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Duy trì quyền lợi thành viên</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">Mở khóa toàn bộ các tính năng giúp ba mẹ đồng hành cùng bé mọi lúc mọi nơi.</p>
      </header>

      {error && (
        <div role="alert" className="flex items-start gap-3 rounded-3xl border border-red-200/80 bg-red-50/90 p-4 text-sm text-red-800 shadow-sm backdrop-blur max-w-2xl mx-auto">
          <div className="flex-1 text-center font-semibold">{error}</div>
        </div>
      )}

      {/* Content Area */}
      {!orderData ? (
        <div className="grid md:grid-cols-2 gap-6 lg:gap-10 max-w-4xl mx-auto items-stretch">

          {/* Monthly Plan */}
          <div className="relative overflow-hidden rounded-[36px] border border-slate-200/60 bg-white p-8 shadow-xl transition-transform hover:-translate-y-1 hover:shadow-2xl flex flex-col">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-100/30 rounded-bl-[100px] pointer-events-none" />
            <div className="absolute top-4 right-4 bg-cyan-50 text-cyan-600 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-cyan-100">
              GIA HẠN APP
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-cyan-200 mb-6 relative z-10">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Thành viên Tháng</h3>
            <p className="text-sm text-slate-500 mb-6">Duy trì các tính năng theo dõi và nhắc nhở thông minh mỗi tháng.</p>
            <div className="mb-8">
              <span className="text-4xl font-black text-slate-900">149.000đ</span>
              <span className="text-slate-500 font-medium ml-1">/tháng</span>
            </div>

            <div className="flex-1">
              <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-4 flex items-center">
                <span className="w-4 h-[1px] bg-slate-200 mr-2" /> QUYỀN TRUY CẬP THÁNG <span className="w-4 h-[1px] bg-slate-200 ml-2" />
              </div>
              <ul className="space-y-4 mb-8">
                {['Tự động Pomodoro 25/5', 'Theo dõi realtime trên app', 'Cảnh báo tư thế & tập trung', 'Báo cáo tiến độ chi tiết cho ba mẹ'].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                    <div className="mt-0.5 bg-cyan-50 p-0.5 rounded-full text-cyan-500 shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleSubscribe("monthly", "149.000đ")}
              disabled={loading !== null}
              className="w-full py-4 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold transition-colors disabled:opacity-50"
            >
              {loading === "monthly" ? "Đang xử lý..." : "Đăng ký theo Tháng \u2192"}
            </button>
          </div>

          {/* Yearly Plan */}
          <div className="relative overflow-hidden rounded-[36px] border border-amber-200/60 bg-gradient-to-b from-amber-50/50 to-white p-8 shadow-xl transition-transform hover:-translate-y-1 hover:shadow-2xl flex flex-col">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-bl-[100px] pointer-events-none" />
            <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md shadow-orange-200">
              TIẾT KIỆM 11%
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-200 mb-6 relative z-10">
              <Crown className="w-6 h-6 stroke-[2]" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Thành viên Năm</h3>
            <p className="text-sm text-slate-500 mb-6">Duy trì các tính năng theo dõi và nhắc nhở thông minh trọn năm.</p>
            <div className="mb-8">
              <span className="text-4xl font-black text-slate-900">1.599.000đ</span>
              <span className="text-slate-500 font-medium ml-1">/năm</span>
            </div>

            <div className="flex-1">
              <div className="text-[10px] uppercase tracking-widest font-bold text-amber-500 mb-4 flex items-center">
                <span className="w-4 h-[1px] bg-amber-200 mr-2" /> QUYỀN TRUY CẬP NĂM <span className="w-4 h-[1px] bg-amber-200 ml-2" />
              </div>
              <ul className="space-y-4 mb-8">
                {['Tự động Pomodoro 25/5', 'Theo dõi realtime trên app', 'Cảnh báo tư thế & tập trung', 'Báo cáo tiến độ chi tiết cho ba mẹ', 'Tiết kiệm 11% so với trả tháng'].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                    <div className="mt-0.5 bg-amber-100 p-0.5 rounded-full text-amber-600 shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleSubscribe("yearly", "1.599.000đ")}
              disabled={loading !== null}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold shadow-lg shadow-orange-200 transition-all disabled:opacity-50"
            >
              {loading === "yearly" ? "Đang xử lý..." : "Đăng ký theo Năm \u2192"}
            </button>
          </div>

        </div>
      ) : (
        <div className="flex justify-center max-w-4xl mx-auto w-full">
          <PremiumQRModal
            inline={true}
            isOpen={isModalOpen}
            onClose={() => setOrderData(null)}
            onExpire={() => setOrderData(null)}
            price={orderData.price}
            orderCode={orderData.orderCode}
            parentName={profile?.fullName || "PHỤ HUYNH ONBI"}
            packageName={orderData.packageName}
            expiresAt={orderData.expiresAt}
            title="Yêu cầu gia hạn thành công"
            subtitle="Quét mã QR bên dưới để hoàn tất gia hạn gói dịch vụ."
            itemLabel="MÃ GIA HẠN"
          />
        </div>
      )}
    </div>
  );
}
