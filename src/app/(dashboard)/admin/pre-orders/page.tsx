'use client';

import { useState, useEffect, useMemo } from 'react';
import { ShoppingCart, CheckCircle, Clock, AlertCircle, Timer, Package, RefreshCw } from 'lucide-react';
import { api } from '@/lib/api';

interface PreOrder {
  id: string;
  parentName: string;
  phone: string;
  email: string;
  shippingAddress: string;
  packageId: string;
  price: number;
  orderCode: string;
  reservationNum: number;
  status: string;
  createdAt: string;
}

interface Stats {
  total: number;
  pending: number;
  paid: number;
  cancelled: number;
  expired: number;
}

type TabKey = 'ALL' | 'PENDING' | 'PAID' | 'CANCELLED' | 'EXPIRED';

const STATUS_CONFIG = {
  PAID: { label: 'Đã thanh toán', icon: CheckCircle, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  PENDING: { label: 'Chờ thanh toán', icon: Clock, bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  CANCELLED: { label: 'Đã hủy', icon: AlertCircle, bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  EXPIRED: { label: 'Hết hạn', icon: Timer, bg: 'bg-slate-50', text: 'text-slate-500', border: 'border-slate-200' },
} as const;

export default function AdminPreOrdersPage() {
  const [orders, setOrders] = useState<PreOrder[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, paid: 0, cancelled: 0, expired: 0 });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('ALL');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ordersRes, statsRes] = await Promise.all([
        api.get('/pre-orders'),
        api.get('/pre-orders/stats'),
      ]);
      setOrders(ordersRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Failed to fetch pre-orders', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdating(id);
    try {
      await api.patch(`/pre-orders/${id}/status`, { status: newStatus });
      setOrders(prev => prev.map(order => order.id === id ? { ...order, status: newStatus } : order));
      // Refresh stats
      const statsRes = await api.get('/pre-orders/stats');
      setStats(statsRes.data);
    } catch (err) {
      console.error('Failed to update status', err);
      alert('Có lỗi xảy ra khi cập nhật trạng thái!');
    } finally {
      setUpdating(null);
    }
  };

  const filteredOrders = useMemo(() => {
    if (activeTab === 'ALL') return orders;
    return orders.filter(o => o.status === activeTab);
  }, [orders, activeTab]);

  const tabs: { key: TabKey; label: string; count: number; color: string }[] = [
    { key: 'ALL', label: 'Tất cả', count: stats.total, color: 'text-slate-700' },
    { key: 'PENDING', label: 'Chờ thanh toán', count: stats.pending, color: 'text-amber-600' },
    { key: 'PAID', label: 'Đã thanh toán', count: stats.paid, color: 'text-emerald-600' },
    { key: 'CANCELLED', label: 'Đã hủy', count: stats.cancelled, color: 'text-red-600' },
    { key: 'EXPIRED', label: 'Hết hạn', count: stats.expired, color: 'text-slate-500' },
  ];

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-slate-500 font-medium">Đang tải danh sách đơn hàng...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-blue-600" />
            </div>
            Quản lý Đơn Đặt Hàng
          </h1>
          <p className="text-sm text-slate-500 mt-1 ml-[52px]">
            Theo dõi và cập nhật trạng thái thanh toán các đơn đăng ký sớm.
          </p>
        </div>
        <button
          onClick={() => { setLoading(true); fetchData(); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Làm mới
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
              <div className="text-[11px] text-slate-500 font-medium">Tổng đơn</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-amber-100 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
              <div className="text-[11px] text-slate-500 font-medium">Chờ thanh toán</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-emerald-100 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600">{stats.paid}</div>
              <div className="text-[11px] text-slate-500 font-medium">Đã thanh toán</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
              <Timer className="w-5 h-5 text-slate-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-500">{stats.expired + stats.cancelled}</div>
              <div className="text-[11px] text-slate-500 font-medium">Hết hạn / Hủy</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 mb-4 bg-white rounded-xl border border-slate-200 p-1.5 w-fit shadow-sm">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === tab.key
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            {tab.label}
            <span className={`min-w-[20px] h-5 flex items-center justify-center rounded-md text-[10px] font-bold ${
              activeTab === tab.key
                ? 'bg-white/20 text-white'
                : 'bg-slate-100 text-slate-500'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Mã Đơn / Số TT</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Khách hàng</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Gói / Giá</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Ngày tạo</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <ShoppingCart className="w-8 h-8 text-slate-300" />
                      <span className="text-sm text-slate-400 font-medium">
                        {activeTab === 'ALL' ? 'Chưa có đơn đặt hàng nào.' : `Không có đơn nào ở trạng thái "${tabs.find(t => t.key === activeTab)?.label}".`}
                      </span>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.map((order) => {
                const statusConfig = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.PENDING;
                const StatusIcon = statusConfig.icon;
                return (
                  <tr key={order.id} className={`hover:bg-slate-50/50 transition-colors ${order.status === 'EXPIRED' || order.status === 'CANCELLED' ? 'opacity-50' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="font-mono text-sm font-bold text-slate-900">{order.orderCode}</div>
                      <div className="text-xs text-emerald-600 font-semibold mt-1">#{order.reservationNum}</div>
                    </td>
                    <td className="px-6 py-4 max-w-[300px]">
                      <div className="text-sm text-slate-900 mb-1">
                        <span className="font-medium text-slate-400 text-[11px] uppercase tracking-wider mr-1.5">Tên:</span> 
                        <span className="font-bold">{order.parentName}</span>
                      </div>
                      <div className="text-xs text-slate-700 mb-1">
                        <span className="font-medium text-slate-400 text-[10px] uppercase tracking-wider mr-1.5">SĐT:</span> 
                        {order.phone}
                      </div>
                      <div className="text-xs text-slate-700 mb-1 truncate" title={order.email}>
                        <span className="font-medium text-slate-400 text-[10px] uppercase tracking-wider mr-1.5">Email:</span> 
                        {order.email}
                      </div>
                      {order.shippingAddress && (
                        <div className="text-xs text-slate-700 line-clamp-2" title={order.shippingAddress}>
                          <span className="font-medium text-slate-400 text-[10px] uppercase tracking-wider mr-1.5">Địa chỉ:</span> 
                          {order.shippingAddress}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                        {order.packageId}
                      </div>
                      <div className="text-sm font-bold text-slate-900 mt-1">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.price)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(order.createdAt).toLocaleString('vi-VN')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                        <StatusIcon className="w-3.5 h-3.5" /> {statusConfig.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {order.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => updateStatus(order.id, 'PAID')}
                              disabled={updating === order.id}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                            >
                              Duyệt
                            </button>
                            <button
                              onClick={() => updateStatus(order.id, 'CANCELLED')}
                              disabled={updating === order.id}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                            >
                              Hủy
                            </button>
                          </>
                        )}
                        {(order.status === 'PAID' || order.status === 'CANCELLED') && (
                          <button
                            onClick={() => updateStatus(order.id, 'PENDING')}
                            disabled={updating === order.id}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                          >
                            Hoàn tác
                          </button>
                        )}
                        {order.status === 'EXPIRED' && (
                          <span className="text-[11px] text-slate-400 italic">Đã hết hạn</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer hint */}
      <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-400 font-medium">
        <Timer className="w-3.5 h-3.5" />
        <span>Đơn hàng chưa thanh toán sẽ tự động hết hạn sau 24 giờ.</span>
      </div>
    </div>
  );
}
