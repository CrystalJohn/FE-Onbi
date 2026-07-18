'use client'

import { useState, useEffect, use } from 'react';
import { ArrowLeft, Hash, Barcode, Calendar, Cpu, User, Baby, Wifi, WifiOff } from 'lucide-react';
import Link from 'next/link';

interface DeviceDetail {
  id: string;
  activationCode: string;
  serialNumber?: string;
  model?: string;
  firmwareVersion?: string;
  status: string;
  // BE (device.service.ts adminGetDeviceDetail) trả: device.activatedByUser + device.currentAssignment.child
  activatedByUser?: { id: string; email: string; fullName: string } | null;
  currentAssignment?: {
    childId: string;
    child: { id: string; name: string };
    assignedAt: string;
  } | null;
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

  if (loading) return <div className="text-sm text-slate-500">Đang tải...</div>;
  if (error) return <div className="text-sm text-red-500">{error}</div>;
  if (!device) return <div className="text-sm text-slate-500">Không tìm thấy thiết bị</div>;

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
        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:border-[#000080] hover:text-[#000080]"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại Thiết bị
      </Link>

      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-slate-900">Chi tiết thiết bị</h1>
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
          <h2 className="text-lg font-semibold text-slate-900">Thông tin thiết bị</h2>
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
            <div className="flex items-center gap-3">
              <Cpu className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-slate-500 w-32">Serial:</span>
              {device.serialNumber ? (
                <span className="font-medium text-slate-900">{device.serialNumber}</span>
              ) : (
                <span className="italic text-slate-400">Chờ thiết bị kết nối</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Cpu className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-slate-500 w-32">Model:</span>
              {device.model ? (
                <span className="font-medium text-slate-900">{device.model}</span>
              ) : (
                <span className="italic text-slate-400">Chờ thiết bị báo</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Cpu className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-slate-500 w-32">Firmware:</span>
              {device.firmwareVersion ? (
                <span className="font-medium text-slate-900">{device.firmwareVersion}</span>
              ) : (
                <span className="italic text-slate-400">Chờ thiết bị báo</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-slate-500 w-32">Ngày tạo:</span>
              <span className="font-medium text-slate-900">
                {new Date(device.createdAt).toLocaleString('vi-VN')}
              </span>
            </div>
          </div>
        </div>

        {/* Assignment info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Thông tin gán thiết bị</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-slate-500 w-32">Phụ huynh:</span>
              {device.activatedByUser ? (
                <Link
                  href={`/admin/users/${device.activatedByUser.id}`}
                  className="font-medium text-cyan-600 hover:text-cyan-700 hover:underline"
                >
                  {device.activatedByUser.fullName}
                </Link>
              ) : (
                <span className="text-slate-400 italic">Chưa kích hoạt</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Baby className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-slate-500 w-32">Trẻ:</span>
              {device.currentAssignment?.child ? (
                <span className="font-medium text-slate-900">{device.currentAssignment.child.name}</span>
              ) : (
                <span className="text-slate-400 italic">Chưa gán</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
