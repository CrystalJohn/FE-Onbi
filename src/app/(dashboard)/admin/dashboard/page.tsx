"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BellRing,
  Bot,
  CheckCircle2,
  CircleCheckBig,
  Clock3,
  ListChecks,
  MessageSquareText,
  PowerOff,
  ShieldCheck,
  UserRound,
  Users,
  Wifi,
  WifiOff,
  Wrench,
} from "lucide-react";

interface DashboardStats {
  devices: { total: number; inactive: number; active: number; deactivated: number };
  users: { total: number; parents: number; admins: number };
  feedback?: { new: number; unresolved: number };
  recentActivity?: ActivityLogEntry[];
}

interface RecentFeedback {
  id: string;
  subject: string;
  status: "new" | "in_progress" | "resolved";
  createdAt: string;
  parent?: { fullName: string; email: string } | null;
}

interface ActivityLogEntry {
  id: string;
  adminName: string;
  action: string;
  entityType: string;
  entityId?: string;
  detail?: string;
  createdAt: string;
}

const ACTION_LABELS: Record<string, string> = {
  create_device: "Tạo thiết bị",
  delete_device: "Xóa thiết bị",
  deactivate_device: "Vô hiệu hóa thiết bị",
  reactivate_device: "Kích hoạt lại thiết bị",
  create_user: "Tạo người dùng",
  delete_user: "Xóa người dùng",
  update_feedback: "Cập nhật phản hồi",
  reply_feedback: "Phản hồi feedback",
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentFeedback, setRecentFeedback] = useState<RecentFeedback[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const getToken = () => localStorage.getItem("token") || "";

  useEffect(() => {
    const headers = { Authorization: `Bearer ${getToken()}` };
    const fetchAll = async () => {
      try {
        const [statsRes, fbRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/feedback`, { headers }),
        ]);
        if (statsRes.ok) {
          const data: DashboardStats = await statsRes.json();
          setStats(data);
          setRecentActivity(data.recentActivity ?? []);
        }
        if (fbRes.ok) setRecentFeedback((await fbRes.json()).slice(0, 4));
      } catch { /* ignore */ } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return <div className="mx-auto max-w-7xl animate-pulse space-y-5"><div className="h-20 rounded-[28px] bg-slate-200/80" /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{[1, 2, 3, 4, 5, 6].map((item) => <div key={item} className="h-28 rounded-[24px] bg-slate-200/80" />)}</div><div className="grid gap-5 lg:grid-cols-2"><div className="h-80 rounded-[30px] bg-slate-200/80" /><div className="h-80 rounded-[30px] bg-slate-200/80" /></div></div>;
  }

  const devices = stats?.devices ?? { total: 0, active: 0, inactive: 0, deactivated: 0 };
  const users = stats?.users ?? { total: 0, parents: 0, admins: 0 };
  const feedback = stats?.feedback ?? { new: 0, unresolved: 0 };
  const needsAttention = devices.deactivated > 0 || feedback.unresolved > 0;

  const attentionItems: string[] = [];
  if (devices.deactivated > 0) attentionItems.push(`${devices.deactivated} thiết bị vô hiệu hóa`);
  if (feedback.unresolved > 0) attentionItems.push(`${feedback.unresolved} phản hồi chưa xử lý`);
  const attentionHref = devices.deactivated > 0 ? "/admin/devices?status=deactivated" : "/admin/feedback";

  const statCards = [
    { label: "Tổng người dùng", value: users.total, helper: "Tất cả tài khoản hệ thống", icon: Users, tone: "navy" as const },
    { label: "Phụ huynh", value: users.parents, helper: "Tài khoản phụ huynh", icon: UserRound, tone: "cyan" as const },
    { label: "Quản trị viên", value: users.admins, helper: "Quản trị viên đang có quyền", icon: ShieldCheck, tone: "indigo" as const },
    { label: "Tổng thiết bị", value: devices.total, helper: "Robot đã được khai báo", icon: Bot, tone: "navy" as const },
    { label: "Thiết bị hoạt động", value: devices.active, helper: "Thiết bị sẵn sàng vận hành", icon: Activity, tone: "success" as const },
    { label: "Thiết bị chờ", value: devices.inactive, helper: "Robot đang chờ kích hoạt", icon: WifiOff, tone: "warning" as const },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-700">Vận hành ONBI</p>
          <h1 className="mt-1.5 text-3xl font-extrabold tracking-tight text-slate-950">Tổng quan</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">Tổng quan vận hành hệ thống ONBI hôm nay</p>
        </div>
        {needsAttention ? (
          <Link
            href={attentionHref}
            className={`inline-flex min-h-11 items-center gap-2 self-start rounded-full border px-4 text-sm font-semibold shadow-sm transition-colors hover:opacity-80 sm:self-auto border-amber-200 bg-amber-50 text-amber-800`}
          >
            <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
            Cần xử lý: {attentionItems.join(' và ')}
          </Link>
        ) : (
          <div className="inline-flex min-h-11 items-center gap-2 self-start rounded-full border border-emerald-200 bg-emerald-50 px-4 text-sm font-semibold text-emerald-800 shadow-sm sm:self-auto">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            Hệ thống đang ổn định
          </div>
        )}
      </header>

      <section aria-label="Chỉ số tổng quan" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statCards.map((card) => <MetricCard key={card.label} {...card} />)}
      </section>

      <section aria-label="Chỉ số vận hành" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <OperationalMetric icon={MessageSquareText} label="Feedback mới" value={feedback.new} helper={feedback.new > 0 ? "Cần xem sớm" : "Không có phản hồi mới"} tone={feedback.new > 0 ? "warning" : "success"} />
        <OperationalMetric icon={BellRing} label="Feedback chưa xử lý" value={feedback.unresolved} helper={feedback.unresolved > 0 ? "Đang chờ xử lý" : "Đã xử lý hết"} tone={feedback.unresolved > 0 ? "warning" : "success"} />
        <OperationalMetric icon={Wrench} label="Thiết bị cần kiểm tra" value={devices.deactivated} helper={devices.deactivated > 0 ? "Cần xử lý sớm" : "Không có thiết bị lỗi"} tone={devices.deactivated > 0 ? "danger" : "success"} />
        <OperationalMetric icon={PowerOff} label="Robot chưa kích hoạt" value={devices.inactive} helper={devices.inactive > 0 ? "Đang chờ thiết lập" : "Không có tác vụ chờ"} tone={devices.inactive > 0 ? "warning" : "success"} />
      </section>

      <div className="grid items-stretch gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[30px] border border-white/80 bg-white/75 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div><h2 className="text-xl font-bold text-slate-950">Tình trạng thiết bị</h2><p className="mt-1 text-sm text-slate-600">Ưu tiên kiểm tra robot bị vô hiệu hóa hoặc chưa kích hoạt.</p></div>
            <Link href="/admin/devices" className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/80 px-3 text-sm font-semibold text-[#0B008B] shadow-sm transition-colors hover:bg-cyan-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500">Quản lý <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
          <div className="mt-6 space-y-5">
            <DeviceStatusRow icon={CircleCheckBig} label="Đang hoạt động" value={devices.active} total={devices.total} color="bg-emerald-500" iconClass="bg-emerald-50 text-emerald-700" />
            <DeviceStatusRow icon={Clock3} label="Chờ kích hoạt" value={devices.inactive} total={devices.total} color="bg-amber-400" iconClass="bg-amber-50 text-amber-700" />
            <DeviceStatusRow icon={AlertTriangle} label="Đã vô hiệu hóa" value={devices.deactivated} total={devices.total} color="bg-red-500" iconClass="bg-red-50 text-red-700" />
          </div>
          <div className={`mt-6 flex items-start gap-3 rounded-2xl border p-4 ${needsAttention ? "border-amber-200/80 bg-amber-50/80" : "border-emerald-100 bg-emerald-50/70"}`}>
            {needsAttention ? <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" /> : <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />}
            <div><p className="text-sm font-semibold text-slate-900">{needsAttention ? `${devices.deactivated} thiết bị cần được kiểm tra` : "Không phát hiện thiết bị lỗi"}</p><p className="mt-1 text-sm leading-5 text-slate-600">{needsAttention ? <>Mở <Link href="/admin/devices" className="font-semibold text-amber-700 underline underline-offset-2 transition-colors hover:text-amber-900">danh sách thiết bị</Link> để xác định nguyên nhân và xử lý.</> : "Các thiết bị đã kích hoạt đang ở trạng thái vận hành bình thường."}</p></div>
          </div>
        </section>

        <section className="flex flex-col rounded-[30px] border border-white/80 bg-white/75 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div><h2 className="text-xl font-bold text-slate-950">Phản hồi từ phụ huynh</h2><p className="mt-1 text-sm text-slate-600">Phản hồi gần đây khi thiết bị có vấn đề</p></div>
            <Link href="/admin/feedback" className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/80 px-3 text-sm font-semibold text-[#0B008B] shadow-sm transition-colors hover:bg-cyan-50">Xem tất cả <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
          {recentFeedback.length === 0 ? (
            <div className="grid min-h-64 flex-1 place-items-center py-8 text-center">
              <div className="max-w-sm">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-[20px] bg-cyan-50 text-cyan-700"><MessageSquareText className="h-6 w-6" aria-hidden="true" /></span>
                <h3 className="mt-4 font-bold text-slate-900">Chưa có feedback mới</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">Khi phụ huynh báo lỗi thiết bị, phản hồi sẽ xuất hiện tại đây.</p>
              </div>
            </div>
          ) : (
            <div className="mt-5 flex-1 space-y-3">
              {recentFeedback.map((f) => (
                <Link key={f.id} href="/admin/feedback" className="block rounded-2xl border border-slate-200/80 bg-white/70 p-4 transition-colors hover:border-cyan-200 hover:bg-cyan-50/40">
                  <div className="flex items-start justify-between gap-3">
                    <p className="min-w-0 truncate font-semibold text-slate-900">{f.subject}</p>
                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${f.status === "resolved" ? "bg-emerald-50 text-emerald-700 ring-emerald-200/80" : f.status === "in_progress" ? "bg-cyan-50 text-cyan-700 ring-cyan-200/80" : "bg-amber-50 text-amber-700 ring-amber-200/80"}`}>{f.status === "resolved" ? "Đã xử lý" : f.status === "in_progress" ? "Đang xử lý" : "Mới"}</span>
                  </div>
                  <p className="mt-1 truncate text-xs text-slate-500">{f.parent?.fullName ?? "Phụ huynh"} · {new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(new Date(f.createdAt))}</p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-[28px] border border-white/80 bg-white/75 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] backdrop-blur-xl sm:p-6">
          <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-indigo-50 text-[#0B008B]"><Activity className="h-5 w-5" aria-hidden="true" /></span><div><h2 className="font-bold text-slate-950">Hoạt động gần đây</h2><p className="text-sm text-slate-500">Các thay đổi vận hành mới nhất</p></div></div>
          {recentActivity.length === 0 ? (
            <div className="mt-5 grid min-h-36 place-items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-5 text-center"><div><Clock3 className="mx-auto h-6 w-6 text-slate-300" /><p className="mt-2 text-sm font-medium text-slate-600">Chưa có hoạt động nào</p><p className="mt-1 text-xs text-slate-400">Tạo thiết bị, người dùng, hoặc xử lý feedback để bắt đầu ghi lại lịch sử.</p></div></div>
          ) : (
            <ul className="mt-4 space-y-0 divide-y divide-slate-100">
              {recentActivity.map((a) => (
                <li key={a.id} className="flex items-start gap-3 py-3">
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-indigo-50 text-[10px] font-bold text-[#0B008B]">{a.adminName.charAt(0).toUpperCase()}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800">{ACTION_LABELS[a.action] ?? a.action}</p>
                    <p className="mt-0.5 truncate text-xs text-slate-500">{a.adminName}{a.detail ? ` · ${a.detail}` : ""}</p>
                  </div>
                  <time className="shrink-0 text-[11px] text-slate-400">{new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(new Date(a.createdAt))}</time>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-[28px] border border-white/80 bg-white/75 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] backdrop-blur-xl sm:p-6">
          <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-cyan-50 text-cyan-700"><ListChecks className="h-5 w-5" aria-hidden="true" /></span><div><h2 className="font-bold text-slate-950">Việc cần xử lý</h2><p className="text-sm text-slate-500">Sắp xếp theo mức độ ưu tiên</p></div></div>
          <div className="mt-5 space-y-3">
            {devices.deactivated > 0 && <ActionItem icon={AlertTriangle} label={`Kiểm tra ${devices.deactivated} thiết bị đã vô hiệu hóa`} priority="Ưu tiên cao" href="/admin/devices?status=deactivated" danger />}
            {devices.inactive > 0 && <ActionItem icon={PowerOff} label={`Kích hoạt ${devices.inactive} robot đang chờ`} priority="Ưu tiên vừa" href="/admin/devices?status=inactive" />}
            {devices.deactivated === 0 && devices.inactive === 0 && <div className="flex min-h-28 items-center gap-3 rounded-2xl bg-emerald-50/70 p-4"><CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-600" aria-hidden="true" /><div><p className="font-semibold text-emerald-900">Không có việc tồn đọng</p><p className="mt-1 text-sm text-emerald-700">Tất cả thiết bị đã được xử lý.</p></div></div>}
          </div>
        </section>
      </div>
    </div>
  );
}

type Tone = "navy" | "cyan" | "indigo" | "success" | "warning";

const metricTones: Record<Tone, string> = {
  navy: "bg-indigo-50 text-[#0B008B]",
  cyan: "bg-cyan-50 text-cyan-700",
  indigo: "bg-violet-50 text-indigo-700",
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
};

function MetricCard({ label, value, helper, icon: Icon, tone }: { label: string; value: number; helper: string; icon: typeof Users; tone: Tone }) {
  return <article className="rounded-[24px] border border-white/80 bg-white/75 p-4 shadow-[0_14px_40px_rgba(15,23,42,0.07)] backdrop-blur-xl"><div className="flex items-center gap-3"><span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${metricTones[tone]}`}><Icon className="h-5 w-5" aria-hidden="true" /></span><div className="min-w-0"><div className="flex items-baseline gap-2"><strong className="text-2xl font-extrabold tabular-nums text-slate-950">{value}</strong><span className="truncate text-sm font-semibold text-slate-700">{label}</span></div><p className="mt-0.5 truncate text-xs text-slate-500">{helper}</p></div></div></article>;
}

function OperationalMetric({ icon: Icon, label, value, helper, tone }: { icon: typeof MessageSquareText; label: string; value: number | string; helper: string; tone: "slate" | "danger" | "warning" | "success" }) {
  const colors = { slate: "bg-slate-50 text-slate-500", danger: "bg-red-50 text-red-700", warning: "bg-amber-50 text-amber-700", success: "bg-emerald-50 text-emerald-700" };
  return <article className="flex items-center gap-3 rounded-[22px] border border-white/80 bg-white/65 p-3 shadow-sm backdrop-blur-xl"><span className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${colors[tone]}`}><Icon className="h-[18px] w-[18px]" aria-hidden="true" /></span><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-slate-600">{label}</p><p className="mt-0.5 truncate text-[11px] text-slate-400">{helper}</p></div><strong className="text-xl font-extrabold tabular-nums text-slate-950">{value}</strong></article>;
}

function DeviceStatusRow({ icon: Icon, label, value, total, color, iconClass }: { icon: typeof Wifi; label: string; value: number; total: number; color: string; iconClass: string }) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  return <div><div className="mb-2 flex items-center gap-3"><span className={`grid h-9 w-9 place-items-center rounded-xl ${iconClass}`}><Icon className="h-[18px] w-[18px]" aria-hidden="true" /></span><span className="flex-1 text-sm font-semibold text-slate-700">{label}</span><span className="text-sm font-bold tabular-nums text-slate-950">{value} <span className="font-medium text-slate-400">· {percentage}%</span></span></div><div className="ml-12 h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${color}`} style={{ width: `${percentage}%` }} /></div></div>;
}

function ActionItem({ icon: Icon, label, priority, href, danger = false }: { icon: typeof AlertTriangle; label: string; priority: string; href: string; danger?: boolean }) {
  return <Link href={href} className="flex min-h-16 items-center gap-3 rounded-2xl border border-slate-100 bg-white/70 p-3 transition-colors hover:border-cyan-200 hover:bg-cyan-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"><span className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${danger ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}><Icon className="h-[18px] w-[18px]" aria-hidden="true" /></span><div className="min-w-0 flex-1"><p className="text-sm font-semibold text-slate-800">{label}</p><p className={`mt-0.5 text-xs font-medium ${danger ? "text-red-600" : "text-amber-600"}`}>{priority}</p></div><ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" /></Link>;
}
