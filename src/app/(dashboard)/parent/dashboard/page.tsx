"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  Baby,
  Camera,
  ChevronRight,
  CircleAlert,
  History,
  Plus,
  RefreshCw,
  Sparkles,
  Timer,
  Wifi,
  WifiOff,
} from "lucide-react";
import { api } from "@/lib/api";
import type { Child, MonitoringSession, User } from "@/types";

type ParentDevice = {
  deviceId: string;
  serialNumber: string;
  model?: string;
  status: "inactive" | "active" | "deactivated";
  assigned: boolean;
  assignedChildId?: string | null;
  assignedChildName?: string | null;
};

type ChildOverview = Child & {
  currentSession: MonitoringSession | null;
  device: ParentDevice | null;
};

export default function ParentDashboardPage() {
  const [profile, setProfile] = useState<User | null>(null);
  const [children, setChildren] = useState<ChildOverview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [profileResponse, childrenResponse, devicesResponse] = await Promise.all([
        api.get<User>("/parents/profile"),
        api.get<Child[]>("/children"),
        api.get<ParentDevice[]>("/devices"),
      ]);

      const sessionResponses = await Promise.all(
        childrenResponse.data.map((child) =>
          api.get<MonitoringSession | { message: string }>(`/children/${child.id}/monitoring/current`),
        ),
      );

      setProfile(profileResponse.data);
      setChildren(
        childrenResponse.data.map((child, index) => {
          const session = sessionResponses[index].data;
          return {
            ...child,
            currentSession: "id" in session ? session : null,
            device: devicesResponse.data.find((device) => device.assignedChildId === child.id) ?? null,
          };
        }),
      );
    } catch {
      setError("Không thể tải dữ liệu gia đình. Hãy kiểm tra kết nối và thử lại.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl space-y-5" aria-label="Đang tải dashboard">
        <div className="h-32 animate-pulse rounded-[30px] bg-slate-200/80" />
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.55fr)]">
          <div className="h-80 animate-pulse rounded-[30px] bg-slate-200/80" />
          <div className="h-64 animate-pulse rounded-[30px] bg-slate-200/80" />
        </div>
      </div>
    );
  }

  const connectedDevices = children.filter((child) => Boolean(child.device)).length;
  const activeSessions = children.filter((child) => child.currentSession?.status === "active").length;
  const childrenWithoutDevice = children.length - connectedDevices;
  const familyStatus = activeSessions > 0 && childrenWithoutDevice > 0
    ? `${activeSessions} bé đang trong phiên giám sát. ${childrenWithoutDevice} bé chưa kết nối robot.`
    : activeSessions > 0
      ? `${activeSessions} bé đang trong phiên giám sát.`
      : childrenWithoutDevice > 0
        ? `${childrenWithoutDevice} bé chưa kết nối robot.`
        : "Tất cả hồ sơ trẻ đã được kết nối robot. Chưa có phiên giám sát đang chạy.";

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="relative overflow-hidden rounded-[30px] border border-white/80 bg-white/80 px-5 py-4 shadow-[0_18px_55px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:px-6 sm:py-5">
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-[#0B008B] to-cyan-400" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-cyan-200/25 blur-3xl" />
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 max-w-4xl">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.17em] text-cyan-700">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Tổng quan hôm nay
            </div>
            <h1 className="mt-1.5 text-2xl font-extrabold tracking-tight text-slate-950">Chào {profile?.fullName || "phụ huynh"}</h1>
            <p className="mt-1 text-sm leading-5 text-slate-600">{children.length > 0 ? familyStatus : "Chọn hồ sơ của bé để bắt đầu giám sát hoặc xem lại hoạt động học tập."}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50/80 px-3 py-1 text-xs font-semibold text-[#0B008B]"><Baby className="h-3.5 w-3.5" aria-hidden="true" />{children.length} hồ sơ trẻ</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-100 bg-cyan-50/80 px-3 py-1 text-xs font-semibold text-cyan-800"><Wifi className="h-3.5 w-3.5" aria-hidden="true" />{connectedDevices}/{children.length} robot kết nối</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50/80 px-3 py-1 text-xs font-semibold text-emerald-800"><Activity className="h-3.5 w-3.5" aria-hidden="true" />{activeSessions} phiên hoạt động</span>
            </div>
          </div>
          <Link href="/setup/step1" className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-[#0B008B] px-5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(11,0,139,0.20)] transition-colors duration-200 hover:bg-[#08006D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B008B] focus-visible:ring-offset-2 sm:w-auto">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Thêm hồ sơ bé
          </Link>
        </div>
      </section>

      {error && (
        <div role="alert" className="flex items-start gap-3 rounded-3xl border border-red-200/80 bg-red-50/90 p-4 text-sm text-red-800 shadow-sm backdrop-blur">
          <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <div className="flex-1"><p className="font-semibold">Chưa tải được dashboard</p><p className="mt-1">{error}</p></div>
          <button onClick={() => void loadDashboard()} className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 font-semibold transition-colors hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500">
            <RefreshCw className="h-4 w-4" aria-hidden="true" /> Thử lại
          </button>
        </div>
      )}

      {children.length === 0 && !error ? (
        <section className="rounded-[30px] border border-white/80 bg-gradient-to-b from-white to-cyan-50/80 px-6 py-12 text-center shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-cyan-50 to-indigo-50 text-[#0B008B]"><Baby className="h-8 w-8" aria-hidden="true" /></div>
          <h2 className="mt-5 text-xl font-bold text-slate-900">Bắt đầu với hồ sơ đầu tiên</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">Tạo hồ sơ cho bé, kích hoạt robot ONBI và làm theo hướng dẫn kết nối ba bước.</p>
          <Link href="/setup" className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#0B008B] px-6 text-sm font-bold text-white shadow-[0_10px_24px_rgba(11,0,139,0.20)] transition-colors hover:bg-[#08006D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B008B] focus-visible:ring-offset-2">
            Bắt đầu thiết lập <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </section>
      ) : !error && (
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.55fr)]">
          <section aria-labelledby="children-heading" className="min-w-0">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div><h2 id="children-heading" className="text-xl font-bold text-slate-950">Các bé của bạn</h2><p className="mt-1 text-sm text-slate-600">Trạng thái mới nhất từ ONBI</p></div>
              <Link href="/parent/children" className="rounded-full px-3 py-2 text-sm font-semibold text-cyan-800 transition-colors hover:bg-white/70 hover:text-[#0B008B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500">Quản lý hồ sơ</Link>
            </div>
            <div className="grid gap-5 xl:grid-cols-2">
              {children.map((child) => {
                const monitoring = child.currentSession?.status === "active";
                const hasDevice = Boolean(child.device);
                return (
                  <article key={child.id} className="relative overflow-hidden rounded-[30px] border border-white/80 bg-gradient-to-b from-white via-white/95 to-cyan-50/80 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.09)] backdrop-blur-xl sm:p-6">
                    <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 right-4 h-44 w-64 rounded-full bg-cyan-300/20 blur-3xl" />
                    <div className="relative z-10">
                      <div className="flex items-start gap-4">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[22px] bg-gradient-to-br from-[#0B008B] to-indigo-500 text-2xl font-bold text-white shadow-[0_12px_28px_rgba(11,0,139,0.24)]">{child.name.charAt(0).toUpperCase()}</div>
                        <div className="min-w-0 flex-1 pt-1">
                          <h3 className="truncate text-xl font-bold tracking-tight text-slate-950">{child.name}</h3>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${monitoring ? "border-emerald-100 bg-emerald-50/90 text-emerald-800" : "border-slate-200/80 bg-white/80 text-slate-600"}`}><Activity className="h-3.5 w-3.5" aria-hidden="true" />{monitoring ? "Đang giám sát" : "Chưa bắt đầu"}</span>
                            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${hasDevice ? "border-cyan-100 bg-cyan-50/90 text-cyan-800" : "border-amber-100 bg-amber-50/90 text-amber-800"}`}>
                              {hasDevice ? <Wifi className="h-3.5 w-3.5" aria-hidden="true" /> : <WifiOff className="h-3.5 w-3.5" aria-hidden="true" />}Robot: {hasDevice ? child.device?.serialNumber : "Chưa kết nối"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 rounded-2xl border border-white/80 bg-white/60 px-4 py-3 text-sm text-slate-600 shadow-sm">
                        <span className="font-semibold text-slate-800">Trạng thái phiên: </span>
                        {monitoring ? "Phiên đang hoạt động" : hasDevice ? "Sẵn sàng bắt đầu giám sát" : "Cần kết nối robot trước khi giám sát"}
                      </div>
                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <Link href={hasDevice ? `/parent/monitoring/${child.id}` : "/parent/devices"} className="col-span-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#0B008B] px-4 text-sm font-bold text-white shadow-[0_10px_24px_rgba(11,0,139,0.22)] transition-colors duration-200 hover:bg-[#08006D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B008B] focus-visible:ring-offset-2"><Camera className="h-4 w-4" aria-hidden="true" />{monitoring ? "Mở giám sát" : hasDevice ? "Bắt đầu giám sát" : "Kết nối robot"}</Link>
                        <Link href={`/parent/monitoring/${child.id}/history`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-200/80 bg-white/75 px-4 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:border-cyan-200 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"><History className="h-4 w-4" aria-hidden="true" />Lịch sử</Link>
                        <Link href={`/parent/monitoring/${child.id}/pomodoro`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-200/80 bg-white/75 px-4 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:border-cyan-200 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"><Timer className="h-4 w-4" aria-hidden="true" />Pomodoro</Link>
                        <Link href={`/parent/children/${child.id}`} className="col-span-2 inline-flex min-h-11 items-center justify-center rounded-full border border-slate-200/80 bg-white/60 px-4 text-sm font-semibold text-slate-600 transition-colors hover:border-cyan-200 hover:bg-white hover:text-[#0B008B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500">Quản lý hồ sơ</Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <aside className="rounded-[30px] border border-white/80 bg-white/70 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-cyan-700">Gia đình của bạn</p>
            <h2 className="mt-2 text-lg font-bold text-slate-950">Tổng quan gia đình</h2>
            <div className="mt-5 space-y-3">
              <QuickStat icon={Baby} label="Hồ sơ trẻ" value={children.length} tone="navy" />
              <QuickStat icon={Wifi} label="Robot đã kết nối" value={`${connectedDevices} / ${children.length}`} tone="cyan" />
              <QuickStat icon={Activity} label="Phiên đang hoạt động" value={activeSessions} tone="indigo" />
              <QuickStat icon={CircleAlert} label="Cảnh báo mới" value="—" tone="slate" />
            </div>
            <div className="mt-5 rounded-2xl border border-cyan-100/80 bg-cyan-50/70 p-4">
              <p className="text-sm font-semibold text-slate-800">Trạng thái hôm nay</p>
              <p className="mt-1 text-sm leading-5 text-slate-600">{familyStatus}</p>
              <p className="mt-2 text-xs leading-5 text-slate-500">Chưa có dữ liệu cảnh báo để tổng hợp.</p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function QuickStat({ icon: Icon, label, value, tone }: { icon: typeof Baby; label: string; value: number | string; tone: "navy" | "cyan" | "indigo" | "slate" }) {
  const colors = {
    navy: "bg-indigo-50 text-[#0B008B]",
    cyan: "bg-cyan-50 text-cyan-700",
    indigo: "bg-violet-50 text-indigo-700",
    slate: "bg-slate-100 text-slate-500",
  };
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white/75 p-3 shadow-sm">
      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${colors[tone]}`}><Icon className="h-[18px] w-[18px]" aria-hidden="true" /></span>
      <span className="min-w-0 flex-1 text-sm font-medium text-slate-600">{label}</span>
      <strong className="text-lg font-bold tabular-nums text-slate-950">{value}</strong>
    </div>
  );
}
