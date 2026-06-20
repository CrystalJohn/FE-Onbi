'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, Camera, BookOpen, Monitor, ExternalLink, Activity } from 'lucide-react';

interface DeviceInfo {
  id: string;
  serialNumber: string;
  model?: string;
}

interface TrackingData {
  snapshotCount: number;
  studySessions: number;
  totalStudySeconds: number;
  completedCycles: number;
}

interface Session {
  id: string;
  childId: string;
  startedAt: string;
  stoppedAt?: string;
  status: string;
  child?: { id: string; name: string };
  device?: DeviceInfo | null;
  tracking?: TrackingData;
}

export default function AdminMonitoringSessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterChildId, setFilterChildId] = useState('');

  const getToken = () => localStorage.getItem('token') || '';

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const url = filterChildId
        ? `${process.env.NEXT_PUBLIC_API_URL}/admin/monitoring-sessions?childId=${filterChildId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/admin/monitoring-sessions`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) setSessions(await res.json());
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSessions(); }, [filterChildId]);

  const getDuration = (start: string, end?: string) => {
    const s = new Date(start).getTime();
    const e = end ? new Date(end).getTime() : Date.now();
    if (!Number.isFinite(s) || !Number.isFinite(e)) return '---';
    const mins = Math.max(0, Math.floor((e - s) / 60000));
    if (mins < 60) return `${mins} phút`;
    return `${Math.floor(mins / 60)} giờ ${mins % 60} phút`;
  };

  const formatDate = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '---';
    return date.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
  };

  const formatStudyTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) return `${hrs} giờ ${mins} phút`;
    return `${mins} phút`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Phiên giám sát</h1>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={filterChildId}
            onChange={(e) => setFilterChildId(e.target.value)}
            placeholder="Lọc theo ID trẻ"
            className="px-3 py-2 rounded-xl border border-gray-300 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent w-44"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-sm text-gray-500">Đang tải...</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">ID</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Trẻ</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Thiết bị</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Bắt đầu</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Thời lượng</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Ảnh</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Học tập</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Trạng thái</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Theo dõi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sessions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500">Không có phiên giám sát nào</td>
                </tr>
              ) : (
                sessions.map((session) => (
                  <tr key={session.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-gray-600">#{session.id}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{session.child?.name || '---'}</div>
                      {session.child?.id && (
                        <div className="text-xs text-gray-400">ID: {session.child.id}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {session.device ? (
                        <div>
                          <div className="flex items-center gap-1.5 text-slate-900">
                            <Monitor className="w-3.5 h-3.5 text-gray-400" />
                            <span>{session.device.serialNumber}</span>
                          </div>
                          {session.device.model && (
                            <div className="text-xs text-gray-400 ml-5">{session.device.model}</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">---</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {formatDate(session.startedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Clock className="w-3.5 h-3.5" />
                        {getDuration(session.startedAt, session.stoppedAt)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {session.tracking ? (
                        <div className="flex flex-col items-center gap-0.5">
                          <div className="flex items-center gap-1 text-gray-600">
                            <Camera className="w-3.5 h-3.5" />
                            <span className="font-semibold">{session.tracking.snapshotCount}</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">---</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {session.tracking && session.tracking.studySessions > 0 ? (
                        <div className="flex flex-col items-center gap-0.5">
                          <div className="flex items-center gap-1 text-gray-600">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span className="font-semibold">{session.tracking.completedCycles}</span>
                            <span className="text-xs text-gray-400">/{session.tracking.studySessions} buổi</span>
                          </div>
                          <div className="text-xs text-gray-400">
                            {formatStudyTime(session.tracking.totalStudySeconds)}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">---</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                        session.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          session.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                        }`} />
                        {session.status === 'active' ? 'Đang chạy' : 'Kết thúc'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {session.child ? (
                        <div className="flex items-center justify-center gap-1">
                          <Link
                            href={`/parent/monitoring/${session.child.id}`}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 transition-colors"
                            title="Xem giám sát"
                            aria-label="Xem giám sát"
                          >
                            <Activity className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/parent/monitoring/${session.child.id}/snapshots`}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 transition-colors"
                            title="Xem ảnh"
                            aria-label="Xem ảnh"
                          >
                            <Camera className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/parent/monitoring/${session.child.id}/pomodoro`}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 transition-colors"
                            title="Xem Pomodoro"
                            aria-label="Xem Pomodoro"
                          >
                            <Clock className="w-4 h-4" />
                          </Link>
                        </div>
                      ) : (
                        <span className="text-gray-400">---</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
