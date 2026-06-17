'use client'

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Clock, Timer, RefreshCw } from 'lucide-react';

interface PomodoroConfig {
  studyDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  cyclesBeforeLongBreak: number;
}

interface StudySession {
  id: number;
  startTime: string;
  endTime?: string;
  duration?: number;
  subject?: string;
}

export default function PomodoroPage({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = use(params);
  const router = useRouter();

  const [config, setConfig] = useState<PomodoroConfig>({
    studyDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    cyclesBeforeLongBreak: 4,
  });
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const getToken = () => localStorage.getItem('token') || '';

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/children/${childId}/monitoring/pomodoro-config`,
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        if (res.ok) {
          const data = await res.json();
          setConfig({
            studyDuration: data.studyDuration ?? 25,
            shortBreakDuration: data.shortBreakDuration ?? 5,
            longBreakDuration: data.longBreakDuration ?? 15,
            cyclesBeforeLongBreak: data.cyclesBeforeLongBreak ?? 4,
          });
        }
      } catch {
        // Use defaults
      } finally {
        setLoadingConfig(false);
      }
    };

    const fetchSessions = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/children/${childId}/monitoring/study-sessions`,
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        if (res.ok) {
          const data = await res.json();
          setStudySessions(Array.isArray(data) ? data : []);
        }
      } catch {
        // No sessions
      } finally {
        setLoadingSessions(false);
      }
    };

    fetchConfig();
    fetchSessions();
  }, [childId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/children/${childId}/monitoring/pomodoro-config`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify(config),
        }
      );

      if (!res.ok) {
         const data = await res.json();
         setError(data.message || 'Lưu cấu hình thất bại');
         return;
       }

       setMessage('Cấu hình đã được lưu!');
    } catch {
       setError('Không thể kết nối server');
    } finally {
      setSaving(false);
    }
  };

   const formatDuration = (mins?: number) => {
     if (!mins) return '--';
     if (mins < 60) return `${mins} phút`;
     return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  };

   if (loadingConfig || loadingSessions) {
     return <div className="text-sm text-gray-500">Đang tải...</div>;
   }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push(`/parent/monitoring/${childId}`)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <Clock className="w-6 h-6 text-cyan-500" />
        <h1 className="text-2xl font-bold text-slate-900">Pomodoro</h1>
      </div>

      {message && (
        <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700">
          {message}
        </div>
      )}
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Config Form */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Timer className="w-5 h-5 text-gray-500" />
            Cấu hình thời gian
          </h2>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Thời gian học (phút)
              </label>
              <input
                type="number"
                min={1}
                max={120}
                value={config.studyDuration}
                onChange={(e) =>
                  setConfig({ ...config, studyDuration: Number(e.target.value) })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Nghỉ ngắn (phút)
              </label>
              <input
                type="number"
                min={1}
                max={30}
                value={config.shortBreakDuration}
                onChange={(e) =>
                  setConfig({ ...config, shortBreakDuration: Number(e.target.value) })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Nghỉ dài (phút)
              </label>
              <input
                type="number"
                min={1}
                max={60}
                value={config.longBreakDuration}
                onChange={(e) =>
                  setConfig({ ...config, longBreakDuration: Number(e.target.value) })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Số chu kỳ trước khi nghỉ dài
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={config.cyclesBeforeLongBreak}
                onChange={(e) =>
                  setConfig({ ...config, cyclesBeforeLongBreak: Number(e.target.value) })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-500 text-white rounded-xl text-sm font-medium hover:bg-cyan-600 disabled:opacity-50 transition-colors"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Đang lưu...' : 'Lưu cấu hình'}
            </button>
          </form>
        </div>

        {/* Study History */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-gray-500" />
            Lịch sử học tập
          </h2>

           {studySessions.length === 0 ? (
             <p className="text-sm text-gray-400 italic">
               Chưa có phiên học nào.
             </p>
           ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {studySessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-700">
                       {session.subject || 'Học tập'}
                     </p>
                    <p className="text-xs text-gray-400">
                      {new Date(session.startTime).toLocaleString('vi-VN', {
                        timeZone: 'Asia/Ho_Chi_Minh',
                      })}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-cyan-600">
                    {formatDuration(session.duration)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
