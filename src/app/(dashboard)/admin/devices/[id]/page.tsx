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
  activatedByUser?: { id: string; email: string; fullName: string } | null;
  currentAssignment?: {
    childId: string;
    child: { id: string; name: string };
    assignedAt: string;
  } | null;
  createdAt: string;
}

const STATUS_LABEL: Record<string, string> = {
  active: 'Đang hoạt động',
  inactive: 'Chưa hoạt động',
  deactivated: 'Đã vô hiệu hóa',
};

const STATUS_STYLE: Record<string, string> = {
  active: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  inactive: 'text-amber-700 bg-amber-50 border-amber-200',
  deactivated: 'text-rose-700 bg-rose-50 border-rose-200',
};

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
        else setError('Không thể tải thông tin thiết bị');
      } catch {
        setError('Không thể kết nối máy chủ');
      } finally {
        setLoading(false);
      }
    };
    fetchDevice();
  }, [id]);

  if (loading) return <div className="p-8 text-sm text-slate-500">Đang tải...</div>;
  if (error) return <div className="p-8 text-sm text-rose-600">{error}</div>;
  if (!device) return <div className="p-8 text-sm text-slate-500">Không tìm thấy thiết bị</div>;

  const StatusIcon = device.status === 'active' ? Wifi : WifiOff;

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/admin/devices"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại Danh sách thiết bị
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-slate-900">Chi tiết thiết bị</h1>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
            STATUS_STYLE[device.status] ?? 'text-slate-600 bg-slate-50 border-slate-200'
          }`}
        >
          <StatusIcon className="h-3.5 w-3.5" />
          {STATUS_LABEL[device.status] ?? device.status}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Device info card */}
        <div className="rounded-[24px] border border-white/80 bg-white/75 p-6 shadow-[0_16px_45px_rgba(15,23,42,0.07)] backdrop-blur-xl space-y-4">
          <h2 className="text-base font-bold text-slate-950">Thông tin thiết bị</h2>
          <div className="space-y-3 text-sm">
            <InfoRow icon={Hash} label="ID" value={device.id} mono />
            <InfoRow
              icon={Barcode}
              label="Mã kích hoạt"
              value={device.activationCode}
              mono
            />
            <InfoRow
              icon={Cpu}
              label="Serial"
              value={device.serialNumber}
              empty="Chờ thiết bị kết nối"
              mono
            />
            <InfoRow
              icon={Cpu}
              label="Model"
              value={device.model}
              empty="Chờ thiết bị báo"
            />
            <InfoRow
              icon={Cpu}
              label="Firmware"
              value={device.firmwareVersion}
              empty="Chờ thiết bị báo"
              mono
            />
            <InfoRow
              icon={Calendar}
              label="Ngày tạo"
              value={new Intl.DateTimeFormat('vi-VN', {
                dateStyle: 'short',
                timeStyle: 'short',
              }).format(new Date(device.createdAt))}
            />
          </div>
        </div>

        {/* Assignment info card */}
        <div className="rounded-[24px] border border-white/80 bg-white/75 p-6 shadow-[0_16px_45px_rgba(15,23,42,0.07)] backdrop-blur-xl space-y-4">
          <h2 className="text-base font-bold text-slate-950">Thông tin gán thiết bị</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 shrink-0 text-slate-400" />
              <span className="w-32 text-slate-500">Phụ huynh:</span>
              {device.activatedByUser ? (
                <Link
                  href={`/admin/users/${device.activatedByUser.id}`}
                  className="font-medium text-cyan-600 transition-colors hover:text-cyan-700 hover:underline"
                >
                  {device.activatedByUser.fullName}
                </Link>
              ) : (
                <span className="italic text-slate-400">Chưa kích hoạt</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Baby className="h-4 w-4 shrink-0 text-slate-400" />
              <span className="w-32 text-slate-500">Trẻ:</span>
              {device.currentAssignment?.child ? (
                <span className="font-medium text-slate-900">
                  {device.currentAssignment.child.name}
                </span>
              ) : (
                <span className="italic text-slate-400">Chưa gán</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  empty = '—',
  mono = false,
}: {
  icon: typeof Hash;
  label: string;
  value?: string | null;
  empty?: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 shrink-0 text-slate-400" />
      <span className="w-32 text-slate-500">{label}:</span>
      {value ? (
        <span className={`font-medium text-slate-900 ${mono ? 'font-mono text-xs' : ''}`}>
          {value}
        </span>
      ) : (
        <span className="italic text-slate-400">{empty}</span>
      )}
    </div>
  );
}
