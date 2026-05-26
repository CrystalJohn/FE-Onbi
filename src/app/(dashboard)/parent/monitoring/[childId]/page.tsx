'use client'

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Play, Square, Clock, Camera, Activity } from 'lucide-react';
import { io, Socket } from 'socket.io-client';

interface Session {
  id: number;
  startTime: string;
  endTime?: string;
  status: string;
}

interface Alert {
  type: string;
  description?: string;
  imageUrl?: string;
  timestamp: string;
}

export default function MonitoringDashboardPage({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = use(params);
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [deviceOnline, setDeviceOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);

  const getToken = () => localStorage.getItem('token') || '';

  // Fetch sessions history
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [historyRes, currentRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/children/${childId}/monitoring/history`, {
            headers: { Authorization: `Bearer ${getToken()}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/children/${childId}/monitoring/current`, {
            headers: { Authorization: `Bearer ${getToken()}` },
          }),
        ]);

        if (historyRes.ok) {
          const data = await historyRes.json();
          setSessions(Array.isArray(data) ? data : []);
        }

        if (currentRes.ok) {
          const data = await currentRes.json();
          if (data && data.id) setCurrentSession(data);
        }
      } catch {
        setError('Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [childId]);

  // WebSocket connection
  useEffect(() => {
    const s = io(`${process.env.NEXT_PUBLIC_API_URL}/monitoring`, {
      transports: ['websocket'],
    });

    s.on('connect', () => {
      s.emit('join-room', { childId });
    });

    s.on('alert', (data: Alert) => {
      setAlerts((prev) => [data, ...prev].slice(0, 20));
    });

    s.on('device-status', (data: { online: boolean }) => {
      setDeviceOnline(data.online);
    });

    s.on('device-online', () => {
      setDeviceOnline(true);
    });

    setSocket(s);

    return () => {
      s.emit('leave-room', { childId });
      s.disconnect();
    };
  }, [childId]);

  const handleStart = async () => {
    setActionLoading(true);
    setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/children/${childId}/monitoring/start`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Không thể bắt đầu');
        return;
      }
      const data = await res.json();
      setCurrentSession(data);
    } catch {
      setError('Không thể kết nối server');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStop = async () => {
    setActionLoading(true);
    setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/children/${childId}/monitoring/stop`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Không thể dừng');
        return;
      }
      setCurrentSession(null);
    } catch {
      setError('Không thể kết nối server');
    } finally {
      setActionLoading(false);
    }
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
  };

  const getDuration = (start: string, end?: string) => {
    const s = new Date(start).getTime();
    const e = end ? new Date(end).getTime() : Date.now();
    const mins = Math.floor((e - s) / 60000);
    if (mins < 60) return `${mins} phút`;
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  };

  if (loading) return <div className="text-sm text-gray-500">Đang tải...</div>;

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.push('/parent/children')} className="p-2 rounded-lg hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900">Giám sát</h1>
        <div className={`ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${deviceOnline ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
          <span className={`w-2 h-2 rounded-full ${deviceOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
          {deviceOnline ? 'Thiết bị online' : 'Thiết bị offline'}
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">{error}</div>
      )}

      {/* Current Session / Controls */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {currentSession ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-500" />
                  Đang giám sát
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Bắt đầu: {formatTime(currentSession.startTime)} • Thời lượng: {getDuration(currentSession.startTime)}
                </p>
              </div>
              <button
                onClick={handleStop}
                disabled={actionLoading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-all disabled:opacity-50"
              >
                <Square className="w-4 h-4" />
                Dừng
              </button>
            </div>

            {/* Quick links */}
            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <Link
                href={`/parent/monitoring/${childId}/pomodoro`}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-50 text-cyan-700 text-sm font-medium hover:bg-cyan-100 transition-colors"
              >
                <Clock className="w-4 h-4" /> Pomodoro
              </Link>
              <Link
                href={`/parent/monitoring/${childId}/snapshots`}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-50 text-purple-700 text-sm font-medium hover:bg-purple-100 transition-colors"
              >
                <Camera className="w-4 h-4" /> Snapshots
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Chưa có phiên giám sát</h2>
              <p className="text-sm text-gray-500 mt-1">Bắt đầu giám sát để theo dõi hoạt động của trẻ</p>
            </div>
            <button
              onClick={handleStart}
              disabled={actionLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold transition-all disabled:opacity-50"
            >
              <Play className="w-4 h-4" />
              Bắt đầu
            </button>
          </div>
        )}
      </div>

      {/* Realtime Alerts */}
      {alerts.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Cảnh báo realtime</h2>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {alerts.map((alert, idx) => (
              <div key={idx} className={`flex items-start gap-3 p-3 rounded-lg text-sm ${
                alert.type === 'bad_posture' || alert.type === 'posture_bad' ? 'bg-red-50 text-red-700' :
                alert.type === 'left_desk' ? 'bg-amber-50 text-amber-700' :
                'bg-green-50 text-green-700'
              }`}>
                <span className="font-mono text-xs opacity-60">{new Date(alert.timestamp).toLocaleTimeString('vi-VN')}</span>
                <span>{alert.description || alert.type}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sessions History */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Lịch sử phiên giám sát</h2>

        {sessions.length === 0 ? (
          <p className="text-sm text-gray-500 py-4 text-center">Chưa có phiên nào</p>
        ) : (
          <div className="space-y-2">
            {sessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
                <div>
                  <p className="text-sm font-medium text-slate-900">{formatTime(session.startTime)}</p>
                  <p className="text-xs text-gray-500">
                    Thời lượng: {getDuration(session.startTime, session.endTime)}
                    {' • '}
                    <span className={session.status === 'active' ? 'text-green-600 font-medium' : ''}>
                      {session.status === 'active' ? 'Đang chạy' : 'Đã kết thúc'}
                    </span>
                  </p>
                </div>
                <Link
                  href={`/parent/monitoring/${childId}/snapshots`}
                  className="text-xs text-cyan-600 hover:text-cyan-700 font-medium"
                >
                  Xem chi tiết
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
