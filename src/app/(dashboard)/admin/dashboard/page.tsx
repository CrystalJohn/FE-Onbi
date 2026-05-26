'use client'

import { useState, useEffect } from 'react';
import { Users, Wifi, Activity, WifiOff, ShieldCheck } from 'lucide-react';
import { Pie, PieChart, Label } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface DashboardStats {
  devices: {
    total: number;
    inactive: number;
    active: number;
    deactivated: number;
  };
  users: {
    total: number;
    parents: number;
    admins: number;
  };
}

const devicesChartConfig = {
  count: { label: 'Devices' },
  active: { label: 'Active', color: '#1e293b' },
  inactive: { label: 'Inactive', color: '#94a3b8' },
  deactivated: { label: 'Deactivated', color: '#cbd5e1' },
} satisfies ChartConfig;

const usersChartConfig = {
  count: { label: 'Users' },
  parents: { label: 'Parents', color: '#334155' },
  admins: { label: 'Admins', color: '#0f172a' },
} satisfies ChartConfig;

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const getToken = () => localStorage.getItem('token') || '';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (res.ok) setStats(await res.json());
      } catch { /* ignore */ } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-sm text-slate-500">Đang tải...</div>;

  const statCards = [
    { label: 'Tổng Users', value: stats?.users.total ?? 0, icon: Users },
    { label: 'Parents', value: stats?.users.parents ?? 0, icon: Users },
    { label: 'Admins', value: stats?.users.admins ?? 0, icon: ShieldCheck },
    { label: 'Tổng Devices', value: stats?.devices.total ?? 0, icon: Wifi },
    { label: 'Devices Active', value: stats?.devices.active ?? 0, icon: Activity },
    { label: 'Devices Inactive', value: stats?.devices.inactive ?? 0, icon: WifiOff },
  ];

  const devicesChartData = [
    { status: 'active', count: stats?.devices.active ?? 0, fill: '#1e293b' },
    { status: 'inactive', count: stats?.devices.inactive ?? 0, fill: '#94a3b8' },
    { status: 'deactivated', count: stats?.devices.deactivated ?? 0, fill: '#cbd5e1' },
  ];

  const usersChartData = [
    { role: 'parents', count: stats?.users.parents ?? 0, fill: '#334155' },
    { role: 'admins', count: stats?.users.admins ?? 0, fill: '#0f172a' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#000080]">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-2xl border border-slate-200/60 bg-white/70 p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#000080] flex items-center justify-center">
                  <Icon className="w-5 h-5 text-slate-300" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#000080]">{card.value}</p>
                  <p className="text-xs text-slate-500">{card.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pie Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-slate-200/60 bg-white/70 shadow-sm rounded-2xl">
          <CardHeader className="items-center pb-0">
            <CardTitle className="text-[#000080]">Thiết bị</CardTitle>
            <CardDescription className="text-slate-500">Phân bổ trạng thái</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer config={devicesChartConfig} className="mx-auto aspect-square max-h-[250px]">
              <PieChart>
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={devicesChartData}
                  dataKey="count"
                  nameKey="status"
                  innerRadius={60}
                  strokeWidth={5}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                            <tspan x={viewBox.cx} y={viewBox.cy} className="fill-slate-900 text-3xl font-bold">
                              {stats?.devices.total ?? 0}
                            </tspan>
                            <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-slate-500 text-sm">
                              Devices
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 bg-white/70 shadow-sm rounded-2xl">
          <CardHeader className="items-center pb-0">
            <CardTitle className="text-[#000080]">Người dùng</CardTitle>
            <CardDescription className="text-slate-500">Phân bổ roles</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer config={usersChartConfig} className="mx-auto aspect-square max-h-[250px]">
              <PieChart>
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={usersChartData}
                  dataKey="count"
                  nameKey="role"
                  innerRadius={60}
                  strokeWidth={5}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                            <tspan x={viewBox.cx} y={viewBox.cy} className="fill-slate-900 text-3xl font-bold">
                              {stats?.users.total ?? 0}
                            </tspan>
                            <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-slate-500 text-sm">
                              Users
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
