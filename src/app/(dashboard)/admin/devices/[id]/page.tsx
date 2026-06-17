'use client'

import { useState, useEffect, use } from 'react';
import { ArrowLeft, Hash, Barcode, Calendar, Cpu, User, Baby, Wifi, WifiOff } from 'lucide-react';
import Link from 'next/link';

interface DeviceDetail {
  id: number;
  activationCode: string;
  serialNumber?: string;
  model?: string;
  firmwareVersion?: string;
  status: string;
  child?: { id: number; name: string } | null;
  parent?: { id: number; fullName: string } | null;
  createdAt: string;
}

export default function AdminDeviceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [device, setDevice] = useState<DeviceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getToken = () => localStorage.getItem('token') || '';

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/devices/${id}`,
          { headers: { Authorization: `Bearer ${getToken()}` } },
        );
        if (res.ok) setDevice(await res.json());
        else setError('Không thể tải thông tin device');
      } catch {
        setError('Không thể kết nối server');
      } finally {
        setLoading(false);
      }
    };
    fetchDevice();
  }, [id]);

  if (loading) return <div className="text-sm text-slate-500">Dang tai...</div>;
  if (error) return <div className="text-sm text-red-500">{error}</div>;
  if (!device) return <div className="text-sm text-slate-500">Khong tim thay device</div>;

  const statusStyle: Record<string, string> = {
    active: 'text-green-600 bg-green-50 border-green-200',
    inactive: 'text-amber-600 bg-amber-50 border-amber-200',
    deactivated: 'text-red-600 bg-red-50 border-red-200',
  };

  const statusIcon: Record<string, typeof Wifi> = {
    active: Wifi,
    inactive: WifiOff,
    deactivated: WifiOff,
  };

  const StatusIcon = statusIcon[device.status] || Wifi;

  return (
    <div className="space-y-6">
      <Link
        href="/admin/devices"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lai Devices
      </Link>

      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-slate-900">Chi tiet Device</h1>
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
            statusStyle[device.status] || 'text-slate-600 bg-slate-50 border-slate-200'
          }`}
        >
          <StatusIcon className="w-3.5 h-3.5" />
          {device.status === 'active'
            ? 'Active'
            : device.status === 'inactive'
              ? 'Inactive'
              : 'Deactivated'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Thong tin thiet bi</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <Hash className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-slate-500 w-32">ID:</span>
              <span className="font-medium text-slate-900">{device.id}</span>
            </div>
            <div className="flex items-center gap-3">
              <Barcode className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-slate-500 w-32">Activation Code:</span>
              <span className="font-mono text-sm text-slate-900">{device.activationCode}</span>
            </div>
            {device.serialNumber && (
              <div className="flex items-center gap-3">
                <Cpu className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-slate-500 w-32">Serial:</span>
                <span className="font-medium text-slate-900">{device.serialNumber}</span>
              </div>
            )}
            {device.model && (
              <div className="flex items-center gap-3">
                <Cpu className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-slate-500 w-32">Model:</span>
                <span className="font-medium text-slate-900">{device.model}</span>
              </div>
            )}
            {device.firmwareVersion && (
              <div className="flex items-center gap-3">
                <Cpu className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-slate-500 w-32">Firmware:</span>
                <span className="font-medium text-slate-900">{device.firmwareVersion}</span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-slate-500 w-32">Ngay tao:</span>
              <span className="font-medium text-slate-900">
                {new Date(device.createdAt).toLocaleString('vi-VN')}
              </span>
            </div>
          </div>
        </div>

        {/* Assignment info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Thong tin gan thiet bi</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-slate-500 w-32">Phu huynh:</span>
              {device.parent ? (
                <Link
                  href={`/admin/users/${device.parent.id}`}
                  className="font-medium text-cyan-600 hover:text-cyan-700 hover:underline"
                >
                  {device.parent.fullName}
                </Link>
              ) : (
                <span className="text-slate-400 italic">Chua gan</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Baby className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-slate-500 w-32">Tre:</span>
              {device.child ? (
                <span className="font-medium text-slate-900">{device.child.name}</span>
              ) : (
                <span className="text-slate-400 italic">Chua gan</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
