'use client'

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface Session {
  id: number;
  startTime: string;
  endTime?: string;
  status: string;
  child?: { id: number; name: string };
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
    const mins = Math.floor((e - s) / 60000);
    if (mins < 60) return `${mins} phút`;
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Monitoring Sessions</h1>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={filterChildId}
            onChange={(e) => setFilterChildId(e.target.value)}
            placeholder="Filter by Child ID"
            className="px-3 py-2 rounded-xl border border-gray-300 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent w-44"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-sm text-gray-500">Đang tải...</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">ID</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Trẻ</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Bắt đầu</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Thời lượng</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sessions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">Không có session nào</td>
                </tr>
              ) : (
                sessions.map((session) => (
                  <tr key={session.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-gray-600">#{session.id}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">{session.child?.name || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(session.startTime).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}
                    </td>
                    <td className="px-4 py-3 text-gray-600 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {getDuration(session.startTime, session.endTime)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        session.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {session.status === 'active' ? 'Đang chạy' : 'Kết thúc'}
                      </span>
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
