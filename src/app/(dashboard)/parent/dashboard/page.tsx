"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  Baby,
  Bell,
  Camera,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Clock,
  History,
  Lock,
  Plus,
  Search,
  TriangleAlert,
  RefreshCw,
  Sparkles,
  Timer,
  Wifi,
  WifiOff,
} from "lucide-react";
import { api } from "@/lib/api";
import { ageFromBirthDate, formatDurationSec } from "@/lib/format";
import type { Child, MonitoringSession, Snapshot, StudySession, User } from "@/types";
import AddChildModal from "@/components/parent/AddChildModal";

type ParentDevice = {
  deviceId: string;
  serialNumber: string;
  model?: string;
  status: "inactive" | "active" | "deactivated";
  assigned: boolean;
  assignedChildId?: string | null;
  assignedChildName?: string | null;
};

// Ảnh mascot cho hero. Chưa có file thì hero tự ẩn ảnh (onError), không vỡ layout.
const HERO_ART = "/onbi-mascot.webp";

type ChildOverview = Child & {
  currentSession: MonitoringSession | null;
  device: ParentDevice | null;
};

export default function ParentDashboardPage() {
  const [profile, setProfile] = useState<User | null>(null);
  const [children, setChildren] = useState<ChildOverview[]>([]);
  const [alerts24h, setAlerts24h] = useState<number | null>(null);
  // Tách sẵn 3 dòng (ngày | số liệu | cảnh báo) thay vì nhét \n vào một chuỗi.
  const [summaries, setSummaries] = useState<Record<string, { date: string; stats: string; alerts: string } | null>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Đồng hồ chạy theo giây; khởi tạo null để server và client render giống nhau lần đầu.
  const [now, setNow] = useState<Date | null>(null);
  const [heroArtOk, setHeroArtOk] = useState(true);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const [showForm, setShowForm] = useState(false);
  const [query, setQuery] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [profileResponse, childrenResponse, devicesResponse, alertResponse] = await Promise.all([
        api.get<User>("/parents/profile"),
        api.get<Child[]>("/children"),
        api.get<ParentDevice[]>("/devices"),
        api.get<{ last24h: number }>("/parents/alerts/summary"),
      ]);
      setAlerts24h(alertResponse.data.last24h);

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

      // Lịch sử giám sát của mỗi bé → tóm tắt hiển thị trên card
      // (tổng hợp toàn bộ lịch sử cấp child, khớp với trang /monitoring/[id]/history)
      const summaryEntries = await Promise.all(
        childrenResponse.data.map(async (child) => {
          try {
            const [{ data: history }, { data: studies }, { data: snapshots }] = await Promise.all([
              api.get<MonitoringSession[]>(`/children/${child.id}/monitoring/history`),
              api.get<StudySession[]>(`/children/${child.id}/monitoring/study-sessions?limit=200`),
              api.get<Snapshot[]>(`/children/${child.id}/monitoring/snapshots?limit=200`),
            ]);
            if (history.length === 0) return [child.id, null] as const;
            // history đã được BE sắp startedAt DESC nên phần tử đầu là phiên gần nhất.
            const latestDate = new Date(history[0].startedAt);
            // Số liệu tính trong ĐÚNG ngày học cuối đó, không phải tổng mọi thời điểm —
            // nếu không thì nhãn "Lần học cuối" sẽ chỏi với con số bên dưới.
            const sameDay = (value: string) => {
              const d = new Date(value);
              return d.getFullYear() === latestDate.getFullYear()
                && d.getMonth() === latestDate.getMonth()
                && d.getDate() === latestDate.getDate();
            };
            const sessionsOfDay = history.filter((s) => sameDay(s.startedAt));
            const studiesOfDay = studies.filter((s) => sameDay(s.startedAt));
            const cycleCount = studiesOfDay.length;
            const studySec = studiesOfDay.reduce((sum, s) => sum + (s.actualStudySeconds ?? 0), 0);
            const alertCount = snapshots.filter((s) => sameDay(s.capturedAt)).length;
            // getDay(): 0 = Chủ Nhật, 1 = Thứ 2, … 6 = Thứ 7.
            const weekday = latestDate.getDay() === 0 ? "Chủ Nhật" : `Thứ ${latestDate.getDay() + 1}`;
            const dayMonth = `${String(latestDate.getDate()).padStart(2, "0")}/${String(latestDate.getMonth() + 1).padStart(2, "0")}`;
            const summary = {
              date: `${weekday} - ${dayMonth}`,
              stats: `${sessionsOfDay.length} phiên · ${cycleCount} chu kỳ · học ${formatDurationSec(studySec)}`,
              // Tách hẳn ra dòng riêng: nhét chung vào stats thì câu quá dài, xuống dòng giữa
              // chừng thành "24 / cảnh báo". Luôn hiện kể cả khi bằng 0 để mọi card cùng 3 dòng.
              alerts: alertCount > 0 ? `${alertCount} cảnh báo` : "Không có cảnh báo",
            };
            return [child.id, summary] as const;
          } catch {
            return [child.id, null] as const;
          }
        }),
      );
      setSummaries(Object.fromEntries(summaryEntries));
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

  const clockLabel = now
    ? `${now.toLocaleTimeString("vi-VN", { hour12: false })} · ${now.toLocaleDateString("vi-VN", { weekday: "long" })}, ${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`
    : "";

  // Lọc chỉ ảnh hưởng danh sách hiển thị; các số liệu ở hero vẫn tính trên toàn bộ hồ sơ.
  const filteredChildren = query.trim()
    ? children.filter((child) => child.name.toLowerCase().includes(query.trim().toLowerCase()))
    : children;

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
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className="relative overflow-hidden rounded-[30px] bg-[#0B008B] px-6 py-6 shadow-[0_24px_70px_rgba(11,0,139,0.25)] sm:px-8 sm:py-7">
          <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-indigo-400/25 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 right-24 h-64 w-64 rounded-full bg-cyan-400/15 blur-3xl" />

          {heroArtOk && (
            <img
              src={HERO_ART}
              alt=""
              onError={() => setHeroArtOk(false)}
              className="pointer-events-none absolute -right-2 bottom-0 hidden h-[112%] w-auto max-w-[46%] object-contain object-bottom xl:block"
            />
          )}

          <div className="relative z-10 max-w-xl">
            {/* Màu đặt inline: globals.css remap mọi class bg-white/* thành slate tối
                trong .dash-root dark mode, mà hero thì luôn nền xanh đậm. */}
            <span
              style={{ backgroundColor: "rgba(255,255,255,0.12)", borderColor: "rgba(255,255,255,0.25)" }}
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur"
            >
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="tabular-nums">{clockLabel || "—"}</span>
            </span>

            <div className="mt-4 flex items-center gap-3">
              <span style={{ backgroundColor: "rgba(255,255,255,0.15)" }} className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-white backdrop-blur">
                <Sparkles className="h-5 w-5" aria-hidden="true" />
              </span>
              <h1 className="truncate text-3xl font-extrabold tracking-tight text-white">Chào {profile?.fullName || "phụ huynh"}</h1>
            </div>

            <p className="mt-3 text-sm leading-6 text-white/70">
              {children.length > 0 ? familyStatus : "Chọn hồ sơ của bé để bắt đầu giám sát hoặc xem lại hoạt động học tập."}
            </p>

            <div className="mt-6 flex flex-wrap items-end gap-x-10 gap-y-4">
              <HeroStat label="Hồ sơ bé" value={children.length} />
              <HeroStat label="Robot kết nối" value={connectedDevices} suffix={`/${children.length}`} />
              <HeroStat label="Đang hoạt động" value={activeSessions} />
            </div>

            <button
              onClick={() => setShowForm(true)}
              style={{ backgroundColor: "#ffffff", color: "#0B008B" }}
              className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-bold shadow-[0_10px_24px_rgba(2,6,23,0.22)] transition-all duration-200 hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B008B]"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Thêm hồ sơ bé
            </button>
          </div>
        </section>

        <aside className="rounded-[30px] border border-white/80 bg-white/80 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-cyan-700">Nhắc nhở &amp; lối tắt</p>
          <h2 className="mt-1.5 text-xl font-extrabold tracking-tight text-slate-950">Cần chú ý</h2>

          <div className="mt-5 space-y-3">
            {childrenWithoutDevice > 0 && (
              <div className="rounded-2xl border border-amber-200/80 bg-amber-50/80 p-3.5">
                <div className="flex items-start justify-between gap-3">
                  <p className="flex items-center gap-2 text-sm font-bold text-amber-900">
                    <TriangleAlert className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {childrenWithoutDevice} bé chưa có robot
                  </p>
                  <Link href="/parent/devices" className="shrink-0 text-sm font-bold text-amber-900 transition-colors hover:text-amber-950 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500">
                    Kết nối →
                  </Link>
                </div>
                <p className="mt-1 text-xs leading-5 text-amber-800/80">
                  Gồm: {children.filter((child) => !child.device).map((child) => child.name).join(", ")}
                </p>
              </div>
            )}

            <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-3.5">
              <div className="flex items-start justify-between gap-3">
                <p className="flex items-center gap-2 text-sm font-bold text-slate-800">
                  <Bell className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                  Cảnh báo trong 24h
                </p>
                <span className="shrink-0 rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-bold text-cyan-800">{alerts24h ?? "—"} lượt</span>
              </div>
              <p className="mt-1 text-xs leading-5 text-slate-500">Ghi nhận nhắc nhở tư thế &amp; tập trung từ robot.</p>
            </div>
          </div>
        </aside>
      </div>

      <AddChildModal open={showForm} onClose={() => setShowForm(false)} onCreated={loadDashboard} />

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
        <section className="rounded-[30px] border border-white/80 bg-gradient-to-b from-white to-cyan-50/80 px-6 py-10 text-center shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-cyan-50 to-indigo-50 text-[#0B008B]"><Baby className="h-8 w-8" aria-hidden="true" /></div>
          <h2 className="mt-5 text-xl font-bold text-slate-900">Bắt đầu với hồ sơ đầu tiên</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">Tạo hồ sơ cho bé, kích hoạt robot ONBI và làm theo hướng dẫn kết nối ba bước.</p>
          <Link href="/setup" className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#0B008B] px-6 text-sm font-bold text-white shadow-[0_10px_24px_rgba(11,0,139,0.20)] transition-colors hover:bg-[#08006D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B008B] focus-visible:ring-offset-2">
            Bắt đầu thiết lập <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </section>
      ) : !error && (
        <div className="grid items-start gap-6">
          <section aria-labelledby="children-heading" className="min-w-0">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div><h2 id="children-heading" className="text-xl font-bold text-slate-950">Các bé của bạn</h2><p className="mt-1 text-sm text-slate-600">Trạng thái mới nhất từ ONBI</p></div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setCurrentPage(1); }}
                    type="search"
                    placeholder="Tìm tên bé…"
                    aria-label="Tìm hồ sơ bé theo tên"
                    className="min-h-11 w-full rounded-full border border-slate-200/80 bg-white/75 pl-10 pr-4 text-sm text-slate-950 outline-none transition-colors focus:border-[#0B008B] focus:ring-2 focus:ring-indigo-100 sm:w-56"
                  />
                </div>
                <Link href="/parent/children" className="shrink-0 rounded-full px-3 py-2 text-sm font-semibold text-cyan-800 transition-colors hover:bg-white/70 hover:text-[#0B008B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500">Quản lý hồ sơ</Link>
              </div>
            </div>
            <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
              {(() => {
                const itemsPerPage = 3;
                const totalPages = Math.max(1, Math.ceil(filteredChildren.length / itemsPerPage));
                const validPage = Math.min(currentPage, totalPages);
                const displayedChildren = filteredChildren.slice((validPage - 1) * itemsPerPage, validPage * itemsPerPage);

                if (displayedChildren.length === 0) {
                  return <p className="text-sm text-slate-500">Không tìm thấy hồ sơ nào khớp “{query}”.</p>;
                }

                return displayedChildren.map((child) => {
                  const monitoring = child.currentSession?.status === "active";
                const hasDevice = Boolean(child.device);
                return (
                  <article key={child.id} className="relative flex h-full flex-col overflow-hidden rounded-[30px] border border-white/80 bg-gradient-to-b from-white via-white/95 to-cyan-50/80 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.09)] backdrop-blur-xl sm:p-6">
                    <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 right-4 h-44 w-64 rounded-full bg-cyan-300/20 blur-3xl" />
                      <div className="relative z-10 flex flex-1 flex-col">
                        {/* không flex-1 ở đây, để mt-auto của cụm nút ăn hết chỗ trống → nút thẳng hàng */}
                        <div className="min-w-0 pt-1">
                          <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-2">
                            {child.hasPin && (
                              <span
                                title="Hồ sơ được bảo vệ bằng mã PIN"
                                className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-cyan-50 text-cyan-700"
                              >
                                <Lock aria-hidden="true" className="h-3.5 w-3.5" />
                                <span className="sr-only">Hồ sơ được bảo vệ bằng mã PIN</span>
                              </span>
                            )}
                            <h3 className="truncate text-xl font-bold tracking-tight text-slate-950">{child.name}</h3>
                          </div>
                          {child.dateOfBirth && (
                            <p className="shrink-0 whitespace-nowrap pt-1 text-xs font-semibold text-slate-500">
                              {ageFromBirthDate(child.dateOfBirth)} tuổi · {child.gender === "female" ? "Nữ" : "Nam"}
                            </p>
                          )}
                          </div>
                          {/* Không flex-wrap: serial robot dài (JETSON-1424722009748) sẽ đẩy thẻ
                              thứ hai xuống dòng, làm phần dưới của các card lệch nhau. Giữ 1 hàng,
                              thẻ robot tự co lại và cắt bớt serial. */}
                          <div className="mt-2 flex gap-2">
                            <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${monitoring ? "border-emerald-100 bg-emerald-50/90 text-emerald-800" : "border-slate-200/80 bg-white/80 text-slate-600"}`}><Activity className="h-3.5 w-3.5" aria-hidden="true" />{monitoring ? "Đang giám sát" : "Chưa bắt đầu"}</span>
                            <span
                              title={hasDevice ? child.device?.serialNumber ?? undefined : undefined}
                              className={`inline-flex min-w-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${hasDevice ? "border-cyan-100 bg-cyan-50/90 text-cyan-800" : "border-amber-100 bg-amber-50/90 text-amber-800"}`}
                            >
                              {hasDevice ? <Wifi className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> : <WifiOff className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
                              <span className="truncate">Robot: {hasDevice ? child.device?.serialNumber : "Chưa kết nối"}</span>
                            </span>
                        </div>
                      </div>
                      {/* Cố định 3 dòng cho mọi card để phần dưới thẳng hàng nhau. Ngày / số liệu /
                          cảnh báo tách dòng sẵn, không dồn vào một chuỗi rồi để trình duyệt ngắt bừa. */}
                      <div className="mt-4 min-h-[68px] text-sm leading-relaxed">
                        {summaries[child.id] ? (
                          <div className="flex items-baseline gap-3">
                            <span className="shrink-0 font-semibold text-slate-600">Lần học cuối:</span>
                            <span className="min-w-0 text-slate-500">
                              {summaries[child.id]!.date}
                              <br />
                              {summaries[child.id]!.stats}
                              <br />
                              {summaries[child.id]!.alerts}
                            </span>
                          </div>
                        ) : (
                          <span className="select-none opacity-0" aria-hidden="true">-<br />-<br />-</span>
                        )}
                      </div>
                      <div className="mt-auto flex flex-col gap-3 pt-5">
                        <Link href={hasDevice ? `/parent/monitoring/${child.id}` : "/parent/devices"} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#0B008B] px-4 text-sm font-bold text-white shadow-[0_10px_24px_rgba(11,0,139,0.22)] transition-colors duration-200 hover:bg-[#08006D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B008B] focus-visible:ring-offset-2"><Camera className="h-4 w-4" aria-hidden="true" />{monitoring ? "Mở giám sát" : hasDevice ? "Bắt đầu giám sát" : "Kết nối robot"}</Link>
                        <Link href={`/parent/children/${child.id}`} className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-200/80 bg-white/60 px-4 text-sm font-semibold text-slate-600 transition-colors hover:border-cyan-200 hover:bg-white hover:text-[#0B008B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500">Chỉnh sửa hồ sơ bé</Link>
                      </div>
                      <p className="mt-4 text-center text-sm font-medium text-slate-500">
                        {monitoring ? "Phiên đang hoạt động" : hasDevice ? "Sẵn sàng bắt đầu giám sát" : "Cần kết nối robot trước khi giám sát"}
                      </p>
                    </div>
                  </article>
                );
              });
            })()}
            </div>
            {filteredChildren.length > 3 && (
              <div className="mt-5 flex items-center justify-center gap-4">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:pointer-events-none disabled:opacity-50"
                  aria-label="Trang trước"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="text-sm font-semibold text-slate-600">Trang {Math.min(currentPage, Math.ceil(filteredChildren.length / 3))} / {Math.ceil(filteredChildren.length / 3)}</span>
                <button
                  disabled={currentPage >= Math.ceil(filteredChildren.length / 3)}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:pointer-events-none disabled:opacity-50"
                  aria-label="Trang sau"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </section>

        </div>
      )}
    </div>
  );
}

function HeroStat({ label, value, suffix }: { label: string; value: number; suffix?: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-white/60">{label}</p>
      <p className="mt-1 text-3xl font-extrabold tabular-nums text-white">
        {value}
        {suffix && <span className="text-lg font-bold text-white/50">{suffix}</span>}
      </p>
    </div>
  );
}
