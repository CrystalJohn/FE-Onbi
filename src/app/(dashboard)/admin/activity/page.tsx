'use client'

import { useState, useEffect } from 'react';
import { Activity, Clock, ShieldAlert, UserCog, MonitorSmartphone, MessageSquareText } from 'lucide-react';

interface ActivityLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  entityType: string;
  entityId?: string;
  detail?: string;
  createdAt: string;
}

const ACTION_LABELS: Record<string, string> = {
  create_user: 'Tạo người dùng',
  delete_user: 'Xóa người dùng',
  create_device: 'Tạo thiết bị',
  delete_device: 'Xóa thiết bị',
  deactivate_device: 'Vô hiệu hóa thiết bị',
  reactivate_device: 'Kích hoạt lại thiết bị',
  update_feedback: 'Cập nhật phản hồi',
  reply_feedback: 'Trả lời phản hồi',
};

const getEntityIcon = (type: string) => {
  switch (type) {
    case 'user':
      return <UserCog className="w-4 h-4 text-indigo-500" />;
    case 'device':
      return <MonitorSmartphone className="w-4 h-4 text-cyan-500" />;
    case 'feedback':
      return <MessageSquareText className="w-4 h-4 text-amber-500" />;
    default:
      return <ShieldAlert className="w-4 h-4 text-slate-500" />;
  }
};

export default function AdminActivityPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getToken = () => localStorage.getItem('token') || '';

  const fetchActivity = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/activity`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error('Không thể tải lịch sử hoạt động');
      const data = await res.json();
      setLogs(data);
    } catch (err: any) {
      setError(err.message || 'Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, []);

  if (loading) {
    return <div className="rounded-3xl border border-white/80 bg-white/75 p-8 text-sm text-slate-500 shadow-sm">Đang tải lịch sử...</div>;
  }

  return (
    <div className="space-y-6 text-slate-900">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700">Audit Log</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 flex items-center gap-2">
          <Activity className="w-8 h-8 text-cyan-600" /> Lịch sử Hoạt động
        </h1>
        <p className="mt-2 text-sm text-slate-500">Xem các thay đổi và tác vụ quản trị gần đây trên hệ thống.</p>
      </header>

      {error && <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-sm text-rose-700">{error}</div>}

      {logs.length === 0 ? (
        <div className="flex min-h-60 flex-col items-center justify-center rounded-[28px] border border-white/80 bg-white/75 px-6 py-12 text-center shadow-sm">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-50 text-slate-400"><Clock className="h-6 w-6" /></span>
          <h2 className="mt-4 text-lg font-bold text-slate-950">Chưa có hoạt động nào</h2>
          <p className="mt-2 max-w-md text-sm text-slate-500">Lịch sử hoạt động của admin sẽ hiển thị tại đây.</p>
        </div>
      ) : (
        <div className="bg-white/75 backdrop-blur-xl rounded-[24px] border border-white/80 shadow-[0_16px_45px_rgba(15,23,42,0.07)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-500 font-medium">
                <tr>
                  <th className="px-5 py-4 w-[180px]">Thời gian</th>
                  <th className="px-5 py-4">Người thực hiện</th>
                  <th className="px-5 py-4">Hành động</th>
                  <th className="px-5 py-4">Đối tượng</th>
                  <th className="px-5 py-4">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4 text-slate-500">
                      {new Date(log.createdAt).toLocaleString('vi-VN', {
                        timeZone: 'Asia/Ho_Chi_Minh',
                        day: '2-digit', month: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-700">
                      {log.adminName}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                        {ACTION_LABELS[log.action] || log.action}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {getEntityIcon(log.entityType)}
                        <span className="capitalize font-medium text-slate-600">{log.entityType}</span>
                        {log.entityId && <span className="text-xs text-slate-400">#{log.entityId}</span>}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-500 text-xs max-w-[200px] truncate" title={log.detail}>
                      {log.detail || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
