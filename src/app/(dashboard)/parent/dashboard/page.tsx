"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  Baby,
  Bell,
  Calendar as CalendarIcon,
  Camera,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CircleIcon,
  Clock,
  History,
  ListFilter,
  Lock,
  Play,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Timer,
  Unlock,
  Wifi,
  WifiOff,
} from "lucide-react";
import { api } from "@/lib/api";
import type { Child, MonitoringSession, User } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from "motion/react";
import { useRef } from "react";

/** Chuẩn hóa Date → "YYYY-MM-DD" (khớp định dạng dateOfBirth backend). */
function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Parse "YYYY-MM-DD" → Date (local, không bị lệch múi giờ). */
function fromISODate(value: string): Date | undefined {
  if (!value) return undefined;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
}

function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  isInView = true,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  isInView?: boolean;
}) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) =>
    Math.round(latest).toLocaleString(),
  );

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, { duration: 1.5 });
      return controls.stop;
    }
  }, [value, isInView]);

  return (
    <span>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

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

function getAge(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
  return age;
}

export default function ParentDashboardPage() {
  const [profile, setProfile] = useState<User | null>(null);
  const [children, setChildren] = useState<ChildOverview[]>([]);
  const [alerts24h, setAlerts24h] = useState<number | null>(null);
  const [summaries, setSummaries] = useState<Record<string, string | null>>({});
  const [summariesLoading, setSummariesLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('male');
  const [formLoading, setFormLoading] = useState(false);

  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.2 });

  const addChild = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormLoading(true);
    setError('');
    try {
      await api.post('/children', { name, dateOfBirth, gender });
      setName('');
      setDateOfBirth('');
      setGender('male');
      setShowForm(false);
      await loadDashboard();
    } catch (reason: any) {
      setError(reason?.response?.data?.message ?? 'Không thể thêm hồ sơ trẻ.');
    } finally {
      setFormLoading(false);
    }
  };

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    setSummariesLoading(true);
    try {
      const [profileResponse, childrenResponse, devicesResponse, alertResponse] = await Promise.all([
        api.get<User>("/parents/profile"),
        api.get<Child[]>("/children"),
        api.get<ParentDevice[]>("/devices"),
        api.get<{ last24h: number }>("/parents/alerts/summary"),
      ]);
      setAlerts24h(alertResponse.data.last24h);

      // Đợt 2: chỉ lấy phiên hiện tại (nhanh) — đủ dữ liệu để render card.
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
      // Hiện card ngay, KHÔNG chờ lịch sử (tóm tắt sẽ fill bất đồng bộ bên dưới).
      setLoading(false);

      // Đợt 3 (song song, không block render): lịch sử → tóm tắt "lần học gần nhất".
      const summaryEntries = await Promise.all(
        childrenResponse.data.map(async (child) => {
          try {
            const { data: history } = await api.get<MonitoringSession[]>(`/children/${child.id}/monitoring/history`);
            if (history.length === 0) return [child.id, null] as const;
            // Lấy ngày của session gần nhất
            const latestDate = new Date(history[0].startedAt);
            const dayOfWeek = latestDate.toLocaleDateString("vi-VN", { weekday: "long" });
            const dayMonth = latestDate.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }).replace("/", "-").replace("/", "-");
            const dateLabel = `${dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)}, ${dayMonth}`;
            const text = `Lần học gần nhất: ${dateLabel} · Tổng: ${history.length} phiên`;
            return [child.id, text] as const;
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
      setSummariesLoading(false);
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
  const familyStatus = children.length === 0
    ? "Bạn chưa có hồ sơ bé nào. Vui lòng thêm hồ sơ để bắt đầu."
    : activeSessions > 0
      ? childrenWithoutDevice > 0
        ? `${activeSessions} bé đang trong phiên học. ${childrenWithoutDevice} bé chưa kết nối robot.`
        : `${activeSessions} bé đang trong phiên học.`
      : childrenWithoutDevice > 0
        ? `Có ${childrenWithoutDevice} bé chưa kết nối robot.`
        : "Tất cả hồ sơ bé đã được kết nối robot. Chưa có phiên học đang diễn ra.";

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className={`grid items-start gap-6 ${children.length > 0 && !error ? 'lg:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.55fr)]' : 'grid-cols-1'}`}>
        <Card className="relative overflow-hidden h-full flex flex-col justify-center bg-[#0B008B] border-none shadow-md">
          <img
            src="/onbi-welcome-dashboard.png"
            alt="Onbi Welcome Dashboard"
            aria-hidden="true"
            className="pointer-events-none absolute -right-6 -bottom-6 h-[125%] w-auto object-contain object-right-bottom select-none"
          />
          <div className="relative z-10 p-6">
            <div className="max-w-[60%]">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white/95 backdrop-blur-md border border-white/10 shadow-sm">
                <Clock className="h-3.5 w-3.5 text-cyan-300 animate-pulse shrink-0" />
                <span>
                  {currentTime
                    ? `${currentTime.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })} · ${currentTime.toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" })}`
                    : "Đang tải thời gian..."}
                </span>
              </div>
              <div className="flex gap-4 items-center">
                <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <Sparkles size={24} className="text-white" />
                </div>
                <h5 className="text-2xl font-extrabold tracking-tight text-white">Chào {profile?.fullName || "phụ huynh"}</h5>
              </div>
              <p className="mt-3 text-sm text-white/80 line-clamp-2">
                {children.length > 0 ? familyStatus : "Chọn hồ sơ của bé để bắt đầu phiên học hoặc xem lại hoạt động học tập."}
              </p>
              {/* COUNTERS */}
              <div className="flex flex-wrap w-full mt-6 gap-y-4">
                <div className="border-e border-white/20 pe-4">
                  <p className="text-white opacity-75 text-sm mb-1">Hồ sơ bé</p>
                  <h2 className="text-white text-3xl font-bold tracking-tight">
                    <AnimatedCounter value={children.length} />
                  </h2>
                </div>

                <div className="border-e border-white/20 px-4">
                  <p className="text-white opacity-75 text-sm mb-1">Robot kết nối</p>
                  <h2 className="text-white text-3xl font-bold tracking-tight">
                    <AnimatedCounter value={connectedDevices} />
                    <span className="text-base text-white/60 font-medium ml-1">/ {children.length}</span>
                  </h2>
                </div>

                <div className="px-4">
                  <p className="text-white opacity-75 text-sm mb-1">Đang hoạt động</p>
                  <h2 className="text-white text-3xl font-bold tracking-tight">
                    <AnimatedCounter value={activeSessions} />
                  </h2>
                </div>
              </div>

              <div className="mt-6">
                <Dialog open={showForm} onOpenChange={setShowForm}>
                  <DialogTrigger className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-white px-5 text-sm font-bold text-[#0B008B] shadow transition-colors duration-200 hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B008B]">
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    Thêm hồ sơ bé
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Thêm hồ sơ bé mới</DialogTitle>
                      <DialogDescription>
                        Điền thông tin cơ bản để tạo hồ sơ cho bé. Bạn có thể kết nối robot sau khi hồ sơ được tạo.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={addChild} className="grid gap-4 sm:grid-cols-3 pt-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tên của bé
                        <input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Khang" className="mt-2 min-h-12 w-full rounded-md border border-slate-300 bg-white dark:bg-slate-900 dark:border-slate-700 px-4 text-base outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100 dark:focus:ring-cyan-900" />
                      </label>
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Ngày sinh
                        <Popover>
                          <PopoverTrigger
                            className="mt-2 inline-flex min-h-12 w-full items-center justify-between gap-2 rounded-md border border-slate-300 bg-white dark:bg-slate-900 dark:border-slate-700 px-4 text-base outline-none focus-visible:border-cyan-600 focus-visible:ring-2 focus-visible:ring-cyan-100 dark:focus-visible:ring-cyan-900 data-[state=open]:border-cyan-600"
                          >
                            <span className={fromISODate(dateOfBirth) ? "text-slate-900 dark:text-slate-100" : "text-slate-400"}>
                              {fromISODate(dateOfBirth)
                                ? new Intl.DateTimeFormat("vi-VN").format(fromISODate(dateOfBirth)!)
                                : "Chọn ngày sinh"}
                            </span>
                            <CalendarIcon className="size-4 shrink-0 text-slate-400" aria-hidden="true" />
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              captionLayout="dropdown"
                              classNames={{ month_caption: "mx-0" }}
                              defaultMonth={fromISODate(dateOfBirth) ?? new Date(2018, 0)}
                              hideNavigation
                              mode="single"
                              onSelect={(date) => setDateOfBirth(date ? toISODate(date) : "")}
                              selected={fromISODate(dateOfBirth)}
                              startMonth={new Date(1980, 0)}
                            />
                          </PopoverContent>
                        </Popover>
                      </label>
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Giới tính
                        <Select value={gender} onValueChange={(val) => setGender(val ?? gender)}>
                          <SelectTrigger className="mt-2 w-full min-h-12 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100 dark:focus:ring-cyan-900 [&>span]:flex [&>span]:items-center [&>span]:gap-2">
                            {(() => {
                              const genderStatuses = [
                                { value: "male", label: "Nam", color: "text-blue-500 fill-blue-500" },
                                { value: "female", label: "Nữ", color: "text-pink-500 fill-pink-500" },
                              ];
                              const selectedStatus = genderStatuses.find((s) => s.value === gender);
                              return (
                                <>
                                  {selectedStatus && <CircleIcon className={`size-3 ${selectedStatus.color}`} />}
                                  <SelectValue placeholder="Chọn giới tính">
                                    {selectedStatus?.label}
                                  </SelectValue>
                                </>
                              );
                            })()}
                          </SelectTrigger>
                          <SelectContent align="start" className="data-[state=open]:slide-in-from-bottom-8 data-[state=open]:zoom-in-100 duration-400">
                            {[
                              { value: "male", label: "Nam", color: "text-blue-500 fill-blue-500" },
                              { value: "female", label: "Nữ", color: "text-pink-500 fill-pink-500" },
                            ].map((status) => (
                              <SelectItem
                                key={status.value}
                                value={status.value}
                                className="flex items-center gap-2"
                              >
                                <div className="flex items-center gap-2">
                                  <CircleIcon className={`size-3 ${status.color}`} />
                                  <span className="truncate">{status.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </label>
                      <button disabled={formLoading} className="min-h-12 rounded-lg bg-cyan-600 px-5 font-semibold text-white hover:bg-cyan-500 disabled:opacity-50 sm:col-span-3 transition-colors mt-2">
                        {formLoading ? 'Đang thêm…' : 'Lưu hồ sơ bé'}
                      </button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </Card>

        {children.length > 0 && !error && (() => {
          const unconnectedChildren = children.filter(c => !c.device);
          return (
            <Card className="h-full flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-cyan-700 dark:text-cyan-400 mb-0.5">Nhắc nhở & Lối tắt</div>
                <CardTitle className="text-lg font-bold">Cần chú ý</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 flex-1 flex flex-col justify-center">
                {unconnectedChildren.length > 0 ? (
                  <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3.5 dark:border-amber-900/50 dark:bg-amber-950/40">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                        <span className="text-xs font-bold text-amber-900 dark:text-amber-300">
                          {unconnectedChildren.length} bé chưa có robot
                        </span>
                      </div>
                      <Link href="/parent/devices" className="text-xs font-bold text-[#0B008B] dark:text-cyan-400 hover:underline shrink-0">
                        Kết nối →
                      </Link>
                    </div>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 truncate">
                      Gồm: {unconnectedChildren.map(c => c.name).join(", ")}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-3.5 dark:border-emerald-900/50 dark:bg-emerald-950/40">
                    <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                      <Sparkles className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-xs font-bold">Tất cả các bé đã kết nối robot!</span>
                    </div>
                  </div>
                )}

                <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-slate-900/50">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Cảnh báo trong 24h</span>
                    </div>
                    <span className="rounded-full bg-cyan-100 px-2 py-0.5 text-xs font-bold text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">
                      {alerts24h ?? 0} lượt
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Ghi nhận nhắc nhở tư thế & tập trung từ robot.</p>
                </div>
              </CardContent>
            </Card>
          );
        })()}
      </div>


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
        <Card className="text-center py-12 bg-gradient-to-b from-white to-cyan-50/30 dark:from-slate-900 dark:to-slate-800">
          <CardContent className="flex flex-col items-center pt-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-400"><Baby className="h-8 w-8" aria-hidden="true" /></div>
            <CardTitle className="mt-5 text-xl font-bold">Bắt đầu với hồ sơ đầu tiên</CardTitle>
            <CardDescription className="mx-auto mt-2 max-w-md">Tạo hồ sơ cho bé, kích hoạt robot ONBI và làm theo hướng dẫn kết nối ba bước.</CardDescription>
            <Link href="/setup" className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#0B008B] px-6 text-sm font-bold text-white shadow-md transition-colors hover:bg-[#08006D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B008B] focus-visible:ring-offset-2">
              Bắt đầu thiết lập <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </CardContent>
        </Card>
      ) : !error && (() => {
        let filteredChildren = children.filter(child => child.name.toLowerCase().includes(searchQuery.toLowerCase()));
        
        if (sortOption === "default") {
          filteredChildren.sort((a, b) => {
            const aScore = a.currentSession?.status === "active" ? 2 : a.device ? 1 : 0;
            const bScore = b.currentSession?.status === "active" ? 2 : b.device ? 1 : 0;
            return bScore - aScore;
          });
        } else if (sortOption === "gender-male") {
          filteredChildren = filteredChildren.filter(child => child.gender?.toLowerCase() === "male" || child.gender?.toLowerCase() === "nam");
        } else if (sortOption === "gender-female") {
          filteredChildren = filteredChildren.filter(child => child.gender?.toLowerCase() === "female" || child.gender?.toLowerCase() === "nữ");
        } else if (sortOption === "name-asc") {
          filteredChildren.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortOption === "name-desc") {
          filteredChildren.sort((a, b) => b.name.localeCompare(a.name));
        } else if (sortOption === "age-asc") {
          filteredChildren.sort((a, b) => getAge(a.dateOfBirth) - getAge(b.dateOfBirth));
        } else if (sortOption === "age-desc") {
          filteredChildren.sort((a, b) => getAge(b.dateOfBirth) - getAge(a.dateOfBirth));
        }

        return (
        <section aria-labelledby="children-heading" className="min-w-0">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 id="children-heading" className="text-xl font-bold text-slate-950 dark:text-slate-50 shrink-0">Các bé của bạn</h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-56">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Lọc hồ sơ bé..." 
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-9 h-10 w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus-visible:ring-cyan-500 rounded-full" 
                />
              </div>
              <Select value={sortOption} onValueChange={(val) => { setSortOption(val || 'default'); setCurrentPage(1); }}>
                <SelectTrigger className="w-10 h-10 p-0 flex shrink-0 items-center justify-center rounded-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:ring-cyan-500 [&>svg:last-child]:hidden" aria-label="Sắp xếp">
                  <ListFilter className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectItem value="default">Mặc định</SelectItem>
                  <SelectItem value="name-asc">Tên (A → Z)</SelectItem>
                  <SelectItem value="name-desc">Tên (Z → A)</SelectItem>
                  <SelectItem value="age-asc">Tuổi (Nhỏ → Lớn)</SelectItem>
                  <SelectItem value="age-desc">Tuổi (Lớn → Nhỏ)</SelectItem>
                  <SelectItem value="gender-male">Giới tính: Nam</SelectItem>
                  <SelectItem value="gender-female">Giới tính: Nữ</SelectItem>
                </SelectContent>
              </Select>
              <Link href="/parent/children" className="shrink-0 rounded-full px-4 py-2 h-10 inline-flex items-center justify-center text-sm font-semibold text-cyan-800 dark:text-cyan-400 bg-white/50 dark:bg-slate-800/50 border border-transparent transition-colors hover:bg-white/80 dark:hover:bg-slate-800 hover:text-[#0B008B] dark:hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500">
                Quản lý hồ sơ
              </Link>
            </div>
          </div>
          <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {(() => {
              const itemsPerPage = 3;
              const totalPages = Math.max(1, Math.ceil(filteredChildren.length / itemsPerPage));
              const validPage = Math.min(currentPage, totalPages);
              const displayedChildren = filteredChildren.slice((validPage - 1) * itemsPerPage, validPage * itemsPerPage);
                
                if (filteredChildren.length === 0) {
                  return (
                    <div className="col-span-full py-12 text-center">
                      <p className="text-slate-500 dark:text-slate-400">Không tìm thấy hồ sơ nào phù hợp.</p>
                    </div>
                  );
                }

                return displayedChildren.map((child) => {
                  const monitoring = child.currentSession?.status === "active";
                const hasDevice = Boolean(child.device);
                return (
                  <Card key={child.id} className="relative overflow-hidden flex flex-col justify-between">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-baseline justify-between text-xl">
                        <span className="truncate font-extrabold">{child.name}</span>
                        <span className="shrink-0 text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {getAge(child.dateOfBirth)} tuổi · {child.gender?.toLowerCase() === 'female' || child.gender?.toLowerCase() === 'nữ' ? 'Nữ' : 'Nam'}
                        </span>
                      </CardTitle>
                      <CardDescription>
                        <div className="mt-2.5 flex flex-wrap gap-2">
                          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${monitoring ? "border-emerald-200 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-400 dark:border-emerald-800" : "border-slate-200 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"}`}>
                            <Activity className="h-3 w-3" aria-hidden="true" />
                            {monitoring ? "Đang học" : "Hôm nay chưa học"}
                          </span>
                          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${hasDevice ? "border-cyan-200 bg-cyan-100 text-cyan-800 dark:border-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-400" : "border-amber-200 bg-amber-100 text-amber-800 dark:border-amber-800 dark:bg-amber-900/50 dark:text-amber-400"}`}>
                            {hasDevice ? <Wifi className="h-3 w-3" aria-hidden="true" /> : <WifiOff className="h-3 w-3" aria-hidden="true" />}
                            Robot: {hasDevice ? (child.device?.model || 'Robot ONBI') : "Chưa kết nối"}
                          </span>
                          <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${child.hasPin ? "border-purple-200 bg-purple-100 text-purple-800 dark:border-purple-900/60 dark:bg-purple-950/50 dark:text-purple-300" : "border-slate-200 bg-slate-100 text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"}`}>
                            {child.hasPin ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                            {child.hasPin ? "Có PIN" : "Chưa đặt PIN"}
                          </span>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="min-h-[44px] flex items-center">
                        <p className="whitespace-pre-line text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                          {summaries[child.id] ? (
                            summaries[child.id]
                          ) : summariesLoading ? (
                            <span className="inline-block h-4 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-800 align-middle" />
                          ) : (
                            <span className="text-slate-400 dark:text-slate-500 italic">Chưa có dữ liệu phiên học. Bắt đầu ngay!</span>
                          )}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Link href={hasDevice ? `/parent/monitoring/${child.id}` : "/parent/devices"} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#0B008B] px-4 text-sm font-bold text-white shadow-sm transition-colors duration-200 hover:bg-[#08006D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B008B] focus-visible:ring-offset-2">
                          {!hasDevice ? <Wifi className="h-4 w-4" aria-hidden="true" /> : monitoring ? <Camera className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
                          {monitoring ? "Vào phiên học" : hasDevice ? "Bắt đầu phiên học" : "Kết nối robot"}
                        </Link>
                        <Link href={`/parent/children/${child.id}`} className="inline-flex min-h-10 items-center justify-center rounded-lg border border-input bg-background px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">Chỉnh sửa hồ sơ</Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              });
            })()}
            </div>
            {filteredChildren.length > 3 && (
              <div className="mt-5 flex items-center justify-center gap-4">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 transition-colors hover:bg-slate-200 dark:hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:pointer-events-none disabled:opacity-50"
                  aria-label="Trang trước"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Trang {Math.min(currentPage, Math.ceil(filteredChildren.length / 3))} / {Math.ceil(filteredChildren.length / 3)}</span>
                <button
                  disabled={currentPage >= Math.ceil(filteredChildren.length / 3)}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 transition-colors hover:bg-slate-200 dark:hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:pointer-events-none disabled:opacity-50"
                  aria-label="Trang sau"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
        </section>
        );
      })()}
    </div>
  );
}

function QuickStat({ icon: Icon, label, value, tone }: { icon: typeof Baby; label: string; value: number | string; tone: "navy" | "cyan" | "indigo" | "slate" }) {
  const colors = {
    navy: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400",
    cyan: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-400",
    indigo: "bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-400",
    slate: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
  };
  return (
    <div className="flex flex-col gap-2 h-full justify-center">
      <div className="flex items-center gap-2">
        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${colors[tone]}`}><Icon className="h-4 w-4" aria-hidden="true" /></span>
        <span className="min-w-0 flex-1 text-xs font-medium text-muted-foreground whitespace-nowrap">{label}</span>
      </div>
      <strong className="text-2xl font-bold tabular-nums ml-10">{value}</strong>
    </div>
  );
}
