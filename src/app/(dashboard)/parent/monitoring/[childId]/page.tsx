'use client';

import { use, useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import {
  Activity, AlertTriangle, ArrowLeft, Camera, Clock3, History,
  LoaderCircle, Play, Radio, RefreshCw, Square, VideoOff,
} from 'lucide-react';
import { api } from '@/lib/api';

interface Session {
  id: string; childId: string; deviceId: string; startedAt: string;
  stoppedAt?: string | null; status: string;
}
interface Child { id: string; name: string; }
interface AssignedDevice { deviceId: string; serialNumber: string; status: string; }
interface AlertEvent { type: string; description?: string; imageUrl?: string; timestamp?: string; }
interface PomodoroEvent { type: string; cycleNumber: number; message: string; }
interface StreamConfig { iceServers: RTCIceServer[]; }

const apiOrigin = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export default function MonitoringPage({ params }: { params: Promise<{ childId: string }> }) {
  const { childId } = use(params);
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const [child, setChild] = useState<Child | null>(null);
  const [device, setDevice] = useState<AssignedDevice | null>(null);
  const [current, setCurrent] = useState<Session | null>(null);
  const [alerts, setAlerts] = useState<AlertEvent[]>([]);
  const [pomodoro, setPomodoro] = useState<PomodoroEvent | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [deviceOnline, setDeviceOnline] = useState(false);
  const [streamState, setStreamState] = useState<'idle' | 'connecting' | 'live' | 'failed'>('idle');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const closePeer = useCallback(() => {
    peerRef.current?.close();
    peerRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setStreamState('idle');
  }, []);

  const connectStream = useCallback(async (socket: Socket) => {
    closePeer();
    setStreamState('connecting');
    try {
      const { data: config } = await api.get<StreamConfig>(`/children/${childId}/monitoring/stream-config`);
      const peer = new RTCPeerConnection({ iceServers: config.iceServers });
      peerRef.current = peer;
      peer.addTransceiver('video', { direction: 'recvonly' });
      peer.ontrack = ({ streams }) => {
        if (videoRef.current) videoRef.current.srcObject = streams[0];
        setStreamState('live');
      };
      peer.onicecandidate = ({ candidate }) => {
        if (candidate) socket.emit('webrtc-ice-candidate', { childId, candidate, target: 'device' });
      };
      peer.onconnectionstatechange = () => {
        if (peer.connectionState === 'connected') setStreamState('live');
        if (['failed', 'disconnected'].includes(peer.connectionState)) setStreamState('failed');
      };
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      socket.emit('webrtc-offer', { childId, sdp: offer });
    } catch {
      setStreamState('failed');
      setError('Không thể thiết lập luồng camera. Hãy kiểm tra robot và thử lại.');
    }
  }, [childId, closePeer]);

  const loadData = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const [childRes, deviceRes, currentRes] = await Promise.all([
        api.get<Child>(`/children/${childId}`),
        api.get<AssignedDevice[]>(`/children/${childId}/devices`),
        api.get<Session | { message: string }>(`/children/${childId}/monitoring/current`),
      ]);
      setChild(childRes.data);
      setDevice(deviceRes.data[0] ?? null);
      const active = 'id' in currentRes.data ? currentRes.data : null;
      setCurrent(active);
    } catch {
      setError('Không thể tải dữ liệu giám sát.');
    } finally { setLoading(false); }
  }, [childId]);

  useEffect(() => { void loadData(); }, [loadData]);

  useEffect(() => {
    const socket = io(`${apiOrigin}/monitoring`, { transports: ['websocket'] });
    socketRef.current = socket;
    socket.on('connect', () => { setSocketConnected(true); socket.emit('join-room', { childId }); });
    socket.on('disconnect', () => setSocketConnected(false));
    socket.on('device-online', () => setDeviceOnline(true));
    socket.on('device-status', ({ online }: { online: boolean }) => setDeviceOnline(online));
    socket.on('alert', (event: AlertEvent) => setAlerts((items) => [event, ...items].slice(0, 20)));
    socket.on('pomodoro-event', (event: PomodoroEvent) => setPomodoro(event));
    socket.on('webrtc-answer', async ({ sdp }: { sdp: RTCSessionDescriptionInit }) => {
      try { await peerRef.current?.setRemoteDescription(sdp); } catch { setStreamState('failed'); }
    });
    socket.on('webrtc-ice-candidate', async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
      try { await peerRef.current?.addIceCandidate(candidate); } catch { /* candidate may arrive before SDP */ }
    });
    return () => { socket.emit('leave-room', { childId }); socket.disconnect(); closePeer(); };
  }, [childId, closePeer]);

  useEffect(() => {
    if (current && socketConnected && socketRef.current) void connectStream(socketRef.current);
  }, [current, socketConnected, connectStream]);

  const start = async () => {
    if (!device) { setError('Chưa có robot nào được gán cho bé.'); return; }
    setBusy(true); setError('');
    try {
      const { data } = await api.post<Session>(`/children/${childId}/monitoring/start`, { deviceId: String(device.deviceId) });
      setCurrent(data);
    } catch (reason: any) {
      setError(reason?.response?.data?.message ?? 'Không thể bắt đầu giám sát.');
    } finally { setBusy(false); }
  };

  const stop = async () => {
    setBusy(true); setError('');
    try { await api.post(`/children/${childId}/monitoring/stop`); setCurrent(null); closePeer(); }
    catch (reason: any) { setError(reason?.response?.data?.message ?? 'Không thể dừng giám sát.'); }
    finally { setBusy(false); }
  };

  if (loading) return <MonitoringSkeleton />;

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <header className="flex flex-wrap items-center gap-3">
        <button onClick={() => router.back()} aria-label="Quay lại" className="grid min-h-11 min-w-11 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"><ArrowLeft className="h-5 w-5" /></button>
        <div><p className="text-sm font-medium text-cyan-700">Live Monitoring</p><h1 className="text-2xl font-bold tracking-tight text-slate-950">{child?.name ?? 'Bé'}</h1></div>
        <div className="ml-auto flex gap-2 text-xs font-semibold">
          <StatusBadge active={socketConnected} label={socketConnected ? 'Realtime' : 'Mất kết nối'} />
          <StatusBadge active={deviceOnline} label={deviceOnline ? 'Robot online' : 'Robot offline'} />
        </div>
      </header>

      {error && <div role="alert" className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><AlertTriangle className="h-5 w-5 shrink-0" /><span className="flex-1">{error}</span><button onClick={loadData} className="font-semibold underline">Thử lại</button></div>}

      <section className="overflow-hidden rounded-3xl bg-[#070b2b] shadow-xl shadow-navy-950/10">
        <div className="relative aspect-video min-h-64 bg-slate-950">
          <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-contain" aria-label={`Camera của ${child?.name ?? 'bé'}`} />
          {streamState !== 'live' && <div className="absolute inset-0 grid place-items-center p-6 text-center text-white"><div>{streamState === 'connecting' ? <LoaderCircle className="mx-auto mb-3 h-9 w-9 animate-spin text-cyan-400" /> : <VideoOff className="mx-auto mb-3 h-9 w-9 text-slate-500" />}<p className="font-semibold">{!current ? 'Camera chưa được bật' : streamState === 'failed' ? 'Chưa nhận được hình ảnh' : 'Đang kết nối camera…'}</p><p className="mt-1 text-sm text-slate-400">{!current ? 'Bắt đầu phiên để theo dõi trực tiếp.' : 'Robot cần online và tham gia phòng WebRTC.'}</p></div></div>}
          {streamState === 'live' && <span className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-red-600 px-3 py-1.5 text-xs font-bold text-white"><Radio className="h-3.5 w-3.5" /> LIVE</span>}
        </div>
        <div className="flex flex-col gap-4 p-4 text-white sm:flex-row sm:items-center sm:justify-between">
          <div><p className="font-semibold">{current ? 'Phiên giám sát đang hoạt động' : 'Sẵn sàng giám sát'}</p><p className="text-sm text-slate-400">{device ? `${device.serialNumber} · ${current ? formatDuration(current.startedAt) : 'đã gán'}` : 'Chưa gán robot'}</p></div>
          {current ? <button onClick={stop} disabled={busy} className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 font-semibold hover:bg-red-500 disabled:opacity-50"><Square className="h-4 w-4" /> Dừng phiên</button> : <button onClick={start} disabled={busy || !device} className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 font-semibold text-[#000033] hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"><Play className="h-4 w-4" /> Bắt đầu giám sát</button>}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between"><h2 className="font-bold text-slate-900">Cảnh báo realtime</h2><span className="text-xs text-slate-500">{alerts.length} sự kiện</span></div>
          {alerts.length === 0 ? <Empty icon={Activity} text="Chưa có cảnh báo trong phiên này." /> : <div className="max-h-80 space-y-2 overflow-y-auto">{alerts.map((alert, index) => <div key={`${alert.timestamp}-${index}`} className="flex gap-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-900"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /><div><p className="font-medium">{alert.description ?? alert.type}</p><p className="mt-1 text-xs text-amber-700">{alert.timestamp ? formatDate(alert.timestamp) : 'Vừa xong'}</p>{alert.imageUrl && <img src={imageUrl(alert.imageUrl)} alt="Ảnh cảnh báo" className="mt-2 max-h-40 rounded-lg object-cover" />}</div></div>)}</div>}
        </section>
        <div className="space-y-4">
          {pomodoro && <section className="rounded-2xl border border-cyan-200 bg-cyan-50 p-5"><p className="text-xs font-bold uppercase tracking-wider text-cyan-700">Pomodoro · vòng {pomodoro.cycleNumber}</p><p className="mt-2 font-semibold text-slate-900">{pomodoro.message}</p></section>}
          <nav aria-label="Tính năng giám sát" className="grid grid-cols-2 gap-3">
            <QuickLink href={`/parent/monitoring/${childId}/history`} icon={History} label="Lịch sử" />
            <QuickLink href={`/parent/monitoring/${childId}/pomodoro`} icon={Clock3} label="Pomodoro" />
            <QuickLink href={`/parent/monitoring/${childId}/snapshots`} icon={Camera} label="Snapshots" />
            <button onClick={() => socketRef.current && connectStream(socketRef.current)} disabled={!current} className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:border-cyan-300 hover:text-cyan-700 disabled:opacity-40"><RefreshCw className="h-5 w-5" /> Kết nối lại</button>
          </nav>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ active, label }: { active: boolean; label: string }) { return <span className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 ${active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}><span className={`h-2 w-2 rounded-full ${active ? 'bg-emerald-500' : 'bg-slate-400'}`} />{label}</span>; }
function QuickLink({ href, icon: Icon, label }: { href: string; icon: typeof History; label: string }) { return <Link href={href} className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:border-cyan-300 hover:text-cyan-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"><Icon className="h-5 w-5" />{label}</Link>; }
function Empty({ icon: Icon, text }: { icon: typeof Activity; text: string }) { return <div className="grid min-h-36 place-items-center rounded-xl bg-slate-50 p-5 text-center text-sm text-slate-500"><div><Icon className="mx-auto mb-2 h-6 w-6 text-slate-400" />{text}</div></div>; }
function MonitoringSkeleton() { return <div className="mx-auto max-w-6xl animate-pulse space-y-5"><div className="h-14 w-72 rounded-xl bg-slate-200" /><div className="aspect-video rounded-3xl bg-slate-200" /><div className="grid gap-4 lg:grid-cols-2"><div className="h-56 rounded-2xl bg-slate-200" /><div className="h-56 rounded-2xl bg-slate-200" /></div></div>; }
function formatDate(value: string) { return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value)); }
function formatDuration(start: string) { const minutes = Math.max(0, Math.floor((Date.now() - new Date(start).getTime()) / 60000)); return minutes < 60 ? `${minutes} phút` : `${Math.floor(minutes / 60)} giờ ${minutes % 60} phút`; }
function imageUrl(value: string) { return value.startsWith('http') ? value : `${apiOrigin}${value.startsWith('/') ? '' : '/'}${value}`; }
