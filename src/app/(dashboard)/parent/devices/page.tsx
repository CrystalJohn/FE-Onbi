'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Ban, Bot, CheckCircle2, Link2, Plus, Unlink, WifiOff, X } from 'lucide-react';
import BackButton from '@/components/ui/BackButton';
import PinGateModal from '@/components/parent/PinGateModal';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/reui/alert";
import { toast } from "sonner";

interface Child {
  id: string;
  name: string;
  hasPin?: boolean;
}

interface Device {
  deviceId: string;
  serialNumber: string;
  model?: string;
  firmwareVersion?: string;
  status: string;
  assigned: boolean;
  assignedChildId?: string | null;
  assignedChildName?: string | null;
  assignedAt?: string | null;
}

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);

  // Activate form
  const [showActivate, setShowActivate] = useState(false);
  const [activationCode, setActivationCode] = useState('');
  const [activating, setActivating] = useState(false);

  // Assign form
  const [showAssign, setShowAssign] = useState(false);
  const [assignDeviceId, setAssignDeviceId] = useState('');
  const [assignChildId, setAssignChildId] = useState('');
  const [assigning, setAssigning] = useState(false);

  // Pending action for PIN verification
  const [pendingAction, setPendingAction] = useState<{ type: 'assign' | 'unassign'; childId: string; deviceId: string; childName: string } | null>(null);

  const getToken = () => localStorage.getItem('token') || '';

  const fetchData = async () => {
    try {
      const [devRes, childRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/devices`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/children`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        }),
      ]);

      if (!devRes.ok || !childRes.ok) {
        throw new Error('Failed to load devices');
      }

      const [deviceData, childData] = await Promise.all([
        devRes.json() as Promise<Device[]>,
        childRes.json() as Promise<Child[]>,
      ]);
      setDevices(deviceData);
      setChildren(childData);
    } catch {
      toast.error('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    setActivating(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/devices/activate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ activationCode }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || 'Kích hoạt thất bại');
        return;
      }

      toast.success('Kích hoạt thiết bị thành công!');
      setActivationCode('');
      setShowActivate(false);
      fetchData();
    } catch {
      toast.error('Không thể kết nối server');
    } finally {
      setActivating(false);
    }
  };

  const executeAssign = async (deviceId: string, childId: string) => {
    setAssigning(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/devices/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ deviceId, childId }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || 'Gán thiết bị thất bại');
        return;
      }

      toast.success('Gán thiết bị cho bé thành công!');
      setShowAssign(false);
      setAssignDeviceId('');
      setAssignChildId('');
      fetchData();
    } catch {
      toast.error('Không thể kết nối server');
    } finally {
      setAssigning(false);
    }
  };

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignChildId) {
      toast.error('Vui lòng chọn hồ sơ trẻ');
      return;
    }
    const child = children.find(c => c.id === assignChildId);
    if (!child) return;

    if (child.hasPin) {
      setShowAssign(false);
      setPendingAction({ type: 'assign', childId: child.id, deviceId: assignDeviceId, childName: child.name });
    } else {
      executeAssign(assignDeviceId, assignChildId);
    }
  };

  const executeUnassign = async (deviceId: string, childId: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/devices/unassign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ deviceId, childId }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.message || 'Gỡ thất bại');
        return;
      }

      toast.success('Đã gỡ thiết bị');
      fetchData();
    } catch {
      toast.error('Không thể kết nối server');
    }
  };

  const handleUnassign = (deviceId: string, childId: string) => {
    if (!confirm('Gỡ thiết bị khỏi hồ sơ?\n\nThiết bị này sẽ không còn liên kết với bé. Bạn vẫn có thể gán lại thiết bị sau.')) return;
    
    const child = children.find(c => c.id === childId);
    if (child?.hasPin) {
      setPendingAction({ type: 'unassign', childId, deviceId, childName: child.name });
    } else {
      executeUnassign(deviceId, childId);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl animate-pulse space-y-5">
        <div className="h-16 w-80 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80" />
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="h-72 rounded-xl bg-slate-200/80 dark:bg-slate-800/80" />
          <div className="h-72 rounded-xl bg-slate-200/80 dark:bg-slate-800/80" />
        </div>
      </div>
    );
  }

  const selectedAssignDevice = devices.find((device) => device.deviceId === assignDeviceId) ?? null;
  const openAssign = (deviceId: string) => {
    setAssignDeviceId(deviceId);
    setAssignChildId('');
    setShowAssign(true);
  };

  const availableDevices = devices.filter((device) => device.status !== 'deactivated');
  const deactivatedDevices = devices.filter((device) => device.status === 'deactivated');

  const renderAvailableDevice = (device: Device) => {
    const active = device.status === 'active';

    return (
      <Card key={device.deviceId} className="relative flex flex-col justify-between overflow-hidden">
        <CardHeader className="flex flex-row items-start gap-3.5 space-y-0 p-4 sm:p-5 pb-3">
          <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${active ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400'}`}>
            <Bot className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <CardTitle className="truncate text-lg font-bold text-slate-900 dark:text-slate-100">{device.model || 'Robot ONBI'}</CardTitle>
            <CardDescription className="mt-0.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              S/N: {device.serialNumber}{device.firmwareVersion ? ` · Firmware ${device.firmwareVersion}` : ''}
            </CardDescription>
          </div>
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${active ? 'border-emerald-200 bg-emerald-100 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-400' : 'border-amber-200 bg-amber-100 text-amber-800 dark:border-amber-800 dark:bg-amber-900/50 dark:text-amber-400'}`}>
            {active ? 'Đã kích hoạt' : 'Chưa kích hoạt'}
          </span>
        </CardHeader>
        <CardContent className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 space-y-3">
          {/* Detailed Info Grid */}
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 text-xs">
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Trạng thái kết nối</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 mt-0.5">
                <span className={`h-2 w-2 rounded-full ${active ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                {active ? 'Đang hoạt động' : 'Ngoại tuyến'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Đã gán cho</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100 truncate block mt-0.5">
                {device.assigned ? (device.assignedChildName || 'Hồ sơ bé') : 'Chưa liên kết'}
              </span>
            </div>
          </div>

          {!active ? (
            <Alert variant="warning" className="rounded-xl p-3">
              <AlertTriangle className="size-4" />
              <AlertTitle className="text-xs font-bold uppercase tracking-wide text-amber-800 dark:text-amber-400">Cần kiểm tra</AlertTitle>
              <AlertDescription>
                <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">Vui lòng kiểm tra nguồn điện và kết nối mạng của thiết bị.</p>
              </AlertDescription>
            </Alert>
          ) : device.assigned ? (
            <Alert variant="info" className="rounded-xl p-3">
              <CheckCircle2 className="size-4" />
              <AlertTitle className="text-xs font-bold uppercase tracking-wide text-cyan-800 dark:text-cyan-400">SẴN SÀNG</AlertTitle>
              <AlertDescription>
                <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">Robot đã kết nối cùng hồ sơ bé {device.assignedChildName}.</p>
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="warning" className="rounded-xl p-3">
              <AlertTriangle className="size-4" />
              <AlertTitle className="text-xs font-bold uppercase tracking-wide text-amber-800 dark:text-amber-400">CHƯA GÁN</AlertTitle>
              <AlertDescription>
                <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">Thiết bị chưa được gán cho hồ sơ bé nào.</p>
              </AlertDescription>
            </Alert>
          )}

          <div>
            {device.assigned && device.assignedChildId ? (
              <Button
                variant="outline"
                onClick={() => handleUnassign(device.deviceId, device.assignedChildId!)}
                className="w-full h-10 rounded-xl border-rose-200 bg-rose-50/60 px-4 text-sm font-medium text-rose-700 transition-colors hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-900/60"
              >
                <Unlink className="mr-2 h-4 w-4" aria-hidden="true" />
                Gỡ khỏi hồ sơ bé
              </Button>
            ) : !active ? (
              <p className="w-full text-center text-sm font-medium text-slate-500 dark:text-slate-400">Thiết bị cần hoạt động trước khi có thể gán.</p>
            ) : children.length === 0 ? (
              <div className="w-full">
                <p className="mb-2.5 text-center text-sm text-amber-700 dark:text-amber-400">Bạn cần tạo hồ sơ bé trước khi gán thiết bị.</p>
                <Link
                  href="/setup/step1"
                  className="inline-flex h-10 w-full items-center justify-center rounded-xl bg-[#0B008B] px-4 text-sm font-bold text-white shadow-sm transition-colors duration-200 hover:bg-[#08006D] dark:bg-cyan-600 dark:hover:bg-cyan-500 dark:text-white"
                >
                  Tạo hồ sơ bé
                </Link>
              </div>
            ) : (
              <Button
                onClick={() => openAssign(device.deviceId)}
                className="w-full h-10 rounded-xl bg-[#0B008B] hover:bg-[#08006D] dark:bg-cyan-600 dark:hover:bg-cyan-500 text-white font-bold text-sm shadow-sm"
              >
                <Link2 className="mr-2 h-4 w-4" aria-hidden="true" />
                Gán cho bé
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="mt-1 shrink-0">
            <BackButton fallback="/parent/dashboard" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-400">QUẢN LÝ THIẾT BỊ</p>
            <h1 className="mt-1.5 text-3xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50">Thiết bị ONBI</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">Quản lý robot đã kích hoạt, gán cho bé hoặc đã vô hiệu hóa.</p>
          </div>
        </div>
        <button
          onClick={() => setShowActivate(true)}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#0B008B] px-5 text-sm font-bold text-white shadow-sm transition-colors duration-200 hover:bg-[#08006D] dark:bg-cyan-600 dark:hover:bg-cyan-500 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Kích hoạt thiết bị
        </button>
      </header>

      {/* Activate Dialog */}
      <Dialog open={showActivate} onOpenChange={setShowActivate}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleActivate}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-slate-900 dark:text-slate-100">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-400"><Plus className="h-5 w-5" /></span>
                <span>Nhập mã kích hoạt</span>
              </DialogTitle>
              <DialogDescription className="text-slate-500 dark:text-slate-400">
                Mã được in trên robot ONBI của bạn.
              </DialogDescription>
            </DialogHeader>
            <div className="py-5">
              <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">Mã kích hoạt</label>
              <Input
                type="text"
                value={activationCode}
                onChange={(e) => setActivationCode(e.target.value.toUpperCase())}
                placeholder="ONBI-XXXX-XXXX"
                required
                className="min-h-11 rounded-lg font-mono tracking-wider focus-visible:ring-cyan-500"
              />
            </div>
            <DialogFooter className="gap-2 sm:justify-end">
              <Button type="button" variant="outline" onClick={() => setShowActivate(false)} className="rounded-lg min-h-10 w-full sm:w-auto">Hủy</Button>
              <Button type="submit" disabled={activating} className="rounded-lg min-h-10 w-full sm:w-auto bg-[#0B008B] hover:bg-[#08006D] dark:bg-cyan-600 dark:hover:bg-cyan-500 dark:text-white">
                {activating ? 'Đang kích hoạt...' : 'Kích hoạt'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {devices.length === 0 ? (
        <Card className="text-center py-14">
          <CardContent>
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-xl bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-400">
              <Bot className="h-8 w-8" />
            </span>
            <h2 className="mt-5 text-lg font-bold text-slate-950 dark:text-slate-50">Chưa có thiết bị ONBI</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Kích hoạt thiết bị đầu tiên để bắt đầu sử dụng.</p>
            <button
              onClick={() => setShowActivate(true)}
              className="mt-6 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#0B008B] px-5 text-sm font-bold text-white shadow-sm transition-colors duration-200 hover:bg-[#08006D] dark:bg-cyan-600 dark:hover:bg-cyan-500 dark:text-white"
            >
              <Plus className="h-4 w-4" />Kích hoạt thiết bị mới
            </button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="available" className="w-full">
          <TabsList className="mb-6" variant="line">
            <TabsTrigger value="available" className="text-sm font-semibold">
              Khả dụng
              <span className="ml-2 rounded-full px-2 py-0.5 text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {availableDevices.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="deactivated" className="text-sm font-semibold">
              Đã vô hiệu hóa
              <span className="ml-2 rounded-full px-2 py-0.5 text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {deactivatedDevices.length}
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="mt-0">
            <div className="mb-4">
              <h2 id="available-devices-title" className="text-xl font-bold text-slate-950 dark:text-slate-50">Thiết bị khả dụng</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Thiết bị đang hoạt động hoặc có thể gán cho bé.</p>
            </div>
            {availableDevices.length > 0 ? (
              <div className="grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">{availableDevices.map(renderAvailableDevice)}</div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50 px-5 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                Hiện chưa có thiết bị khả dụng.
              </div>
            )}
          </TabsContent>
          <TabsContent value="deactivated" className="mt-0">
            <div className="mb-4">
              <h2 id="deactivated-devices-title" className="text-xl font-bold text-slate-900 dark:text-slate-100">Thiết bị đã vô hiệu hóa</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Thiết bị không còn khả dụng trong tài khoản.</p>
            </div>
            {deactivatedDevices.length > 0 ? (
              <div className="grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {deactivatedDevices.map((device) => (
                  <Card key={device.deviceId} className="relative flex flex-col justify-between overflow-hidden opacity-80">
                    <CardHeader className="flex flex-row items-start gap-3.5 space-y-0 p-4 sm:p-5 pb-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400">
                        <Ban className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="truncate text-lg font-bold text-slate-900 dark:text-slate-100">{device.model || 'Robot ONBI'}</CardTitle>
                        <CardDescription className="mt-0.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                          S/N: {device.serialNumber}{device.firmwareVersion ? ` · Firmware ${device.firmwareVersion}` : ''}
                        </CardDescription>
                      </div>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-800 dark:border-rose-800 dark:bg-rose-900/50 dark:text-rose-400">
                        Đã vô hiệu hóa
                      </span>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0">
                      <Alert variant="destructive" className="rounded-xl p-3">
                        <Ban className="size-4" />
                        <AlertTitle className="text-xs font-bold uppercase tracking-wide">Đã vô hiệu hóa</AlertTitle>
                        <AlertDescription>
                          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                            Thiết bị này đã bị vô hiệu hóa và hiện không thể sử dụng hoặc gán cho hồ sơ trẻ.
                          </p>
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50 px-5 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                Không có thiết bị đã vô hiệu hóa.
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Assign Dialog */}
      <Dialog open={showAssign} onOpenChange={setShowAssign}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleAssign}>
            <DialogHeader>
              <DialogTitle className="text-slate-900 dark:text-slate-100">Gán thiết bị cho bé</DialogTitle>
              <DialogDescription className="text-slate-500 dark:text-slate-400">
                Thiết bị: <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedAssignDevice?.model || 'Robot ONBI'} (S/N: {selectedAssignDevice?.serialNumber})</span>
              </DialogDescription>
            </DialogHeader>
            <div className="py-5">
              <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">Hồ sơ bé</label>
              <Select value={assignChildId} onValueChange={(val) => setAssignChildId(val || '')}>
                <SelectTrigger className="w-full min-h-11 rounded-lg focus:ring-cyan-500">
                  <SelectValue placeholder="Chọn bé" />
                </SelectTrigger>
                <SelectContent>
                  {children.map((child) => (
                    <SelectItem key={child.id} value={child.id}>{child.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="gap-2 sm:justify-end">
              <Button type="button" variant="outline" onClick={() => setShowAssign(false)} className="rounded-lg min-h-10 w-full sm:w-auto">Hủy</Button>
              <Button type="submit" disabled={assigning} className="rounded-lg min-h-10 w-full sm:w-auto bg-[#0B008B] hover:bg-[#08006D] dark:bg-cyan-600 dark:hover:bg-cyan-500 dark:text-white">
                {assigning ? 'Đang gán...' : 'Xác nhận gán'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* PIN Verification Modal */}
      {pendingAction && (
        <PinGateModal
          childId={pendingAction.childId}
          childName={pendingAction.childName}
          title={pendingAction.type === 'assign' ? 'Xác thực gán thiết bị' : 'Xác thực gỡ thiết bị'}
          onSuccess={() => {
            if (pendingAction.type === 'assign') executeAssign(pendingAction.deviceId, pendingAction.childId);
            else executeUnassign(pendingAction.deviceId, pendingAction.childId);
            setPendingAction(null);
          }}
          onClose={() => setPendingAction(null)}
        />
      )}
    </div>
  );
}
