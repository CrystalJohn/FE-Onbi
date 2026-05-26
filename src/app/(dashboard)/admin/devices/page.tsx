'use client'

import { useState, useEffect } from 'react';
import { Plus, X, Wifi, WifiOff } from 'lucide-react';

interface Device {
  id: number;
  activationCode: string;
  status: string;
  child?: { id: number; name: string } | null;
  parent?: { id: number; fullName: string } | null;
  createdAt: string;
}

interface DeviceStats {
  total: number;
  active: number;
  inactive: number;
  deactivated: number;
}

export default function AdminDevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [stats, setStats] = useState<DeviceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Create form
  const [showForm, setShowForm] = useState(false);
  const [serialNumber, setSerialNumber] = useState('');
  const [activationCode, setActivationCode] = useState('');
  const [model, setModel] = useState('Onbi Robot V2');
  const [firmwareVersion, setFirmwareVersion] = useState('1.0.0');
  const [formLoading, setFormLoading] = useState(false);

  // Filters
  const [filterStatus, setFilterStatus] = useState('');
  const [filterUserId, setFilterUserId] = useState('');

  const getToken = () => localStorage.getItem('token') || '';

  const fetchData = async () => {
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.set('status', filterStatus);
      if (filterUserId) params.set('userId', filterUserId);
      const query = params.toString() ? `?${params.toString()}` : '';

      const [devRes, statsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/devices${query}`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/devices/stats`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        }),
      ]);
      if (devRes.ok) setDevices(await devRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [filterStatus, filterUserId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/devices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ serialNumber, activationCode, model, firmwareVersion }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Tạo device thất bại');
        return;
      }

      setMessage('Tạo device thành công');
      setShowForm(false);
      setSerialNumber('');
      setActivationCode('');
      setModel('Onbi Robot V2');
      setFirmwareVersion('1.0.0');
      fetchData();
    } catch {
      setError('Không thể kết nối server');
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const endpoint = currentStatus === 'active' ? 'deactivate' : 'reactivate';
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/devices/${id}/${endpoint}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) fetchData();
      else {
        const data = await res.json();
        setError(data.message || 'Thao tác thất bại');
      }
    } catch {
      setError('Không thể kết nối server');
    }
  };

  if (loading) return <div className="text-sm text-gray-500">Đang tải...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Quản lý Devices</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold transition-all"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Đóng' : 'Tạo Device'}
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            <p className="text-xs text-gray-500">Tổng</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            <p className="text-xs text-gray-500">Active</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-amber-500">{stats.inactive}</p>
            <p className="text-xs text-gray-500">Inactive</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-red-500">{stats.deactivated}</p>
            <p className="text-xs text-gray-500">Deactivated</p>
          </div>
        </div>
      )}

      {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">{error}</div>}
      {message && <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700">{message}</div>}

      {/* Filters */}
      <div className="flex items-center gap-3">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
        >
          <option value="">Tất cả status</option>
          <option value="inactive">Inactive</option>
          <option value="active">Active</option>
          <option value="deactivated">Deactivated</option>
        </select>
        <input
          type="text"
          value={filterUserId}
          onChange={(e) => setFilterUserId(e.target.value)}
          placeholder="Filter by User ID"
          className="px-3 py-2 rounded-xl border border-gray-300 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent w-44"
        />
        {(filterStatus || filterUserId) && (
          <button
            onClick={() => { setFilterStatus(''); setFilterUserId(''); }}
            className="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Xóa filter
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Tạo Device mới (trước khi bán)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Serial Number</label>
              <input
                type="text"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="SN-2024-001"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-mono placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Mã kích hoạt</label>
              <input
                type="text"
                value={activationCode}
                onChange={(e) => setActivationCode(e.target.value.toUpperCase())}
                placeholder="ACT-XYZ-123"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-mono placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Model</label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="Onbi Robot V2"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Firmware Version</label>
              <input
                type="text"
                value={firmwareVersion}
                onChange={(e) => setFirmwareVersion(e.target.value)}
                placeholder="1.0.0"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-mono placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              />
            </div>
          </div>
          <button type="submit" disabled={formLoading} className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-semibold text-sm disabled:opacity-50">
            {formLoading ? 'Đang tạo...' : 'Tạo Device'}
          </button>
        </form>
      )}

      {/* Devices Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Device</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Gán cho</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Ngày tạo</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {devices.map((device) => (
              <tr key={device.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {device.status === 'active' ? <Wifi className="w-4 h-4 text-green-500" /> : <WifiOff className="w-4 h-4 text-gray-400" />}
                    <span className="font-mono font-medium text-slate-900">{device.activationCode}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${device.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {device.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {device.child ? device.child.name : <span className="text-gray-400">—</span>}
                </td>
                <td className="px-4 py-3 text-gray-500">{new Date(device.createdAt).toLocaleDateString('vi-VN')}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggleStatus(device.id, device.status)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      device.status === 'active'
                        ? 'text-red-600 bg-red-50 hover:bg-red-100'
                        : 'text-green-600 bg-green-50 hover:bg-green-100'
                    }`}
                  >
                    {device.status === 'active' ? 'Deactivate' : 'Reactivate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
