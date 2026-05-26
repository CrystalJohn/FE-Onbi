'use client'

import { useState, useEffect } from 'react';
import { Plus, X, Wifi, WifiOff, Link2, Unlink } from 'lucide-react';

interface Child {
  id: number;
  name: string;
}

interface Device {
  id: number;
  activationCode: string;
  status: string;
  child?: Child | null;
}

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Activate form
  const [showActivate, setShowActivate] = useState(false);
  const [activationCode, setActivationCode] = useState('');
  const [activating, setActivating] = useState(false);

  // Assign form
  const [showAssign, setShowAssign] = useState(false);
  const [assignDeviceId, setAssignDeviceId] = useState<number | ''>('');
  const [assignChildId, setAssignChildId] = useState<number | ''>('');
  const [assigning, setAssigning] = useState(false);

  const getToken = () => localStorage.getItem('token') || '';

  const fetchData = async () => {
    try {
      const [devRes, childRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/children`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/children`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        }),
      ]);

      if (childRes.ok) {
        const childData = await childRes.json();
        setChildren(childData);

        // Extract devices from children data if available
        const allDevices: Device[] = [];
        for (const child of childData) {
          if (child.devices) {
            for (const device of child.devices) {
              allDevices.push({ ...device, child: { id: child.id, name: child.name } });
            }
          }
        }
        setDevices(allDevices);
      }
    } catch {
      setError('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    setActivating(true);
    setError('');
    setMessage('');

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
        setError(data.message || 'Kích hoạt thất bại');
        return;
      }

      setMessage('Kích hoạt thiết bị thành công!');
      setActivationCode('');
      setShowActivate(false);
      fetchData();
    } catch {
      setError('Không thể kết nối server');
    } finally {
      setActivating(false);
    }
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    setAssigning(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/devices/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ deviceId: assignDeviceId, childId: assignChildId }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Gán thiết bị thất bại');
        return;
      }

      setMessage('Gán thiết bị cho trẻ thành công!');
      setShowAssign(false);
      setAssignDeviceId('');
      setAssignChildId('');
      fetchData();
    } catch {
      setError('Không thể kết nối server');
    } finally {
      setAssigning(false);
    }
  };

  const handleUnassign = async (deviceId: number, childId: number) => {
    if (!confirm('Gỡ thiết bị khỏi trẻ?')) return;
    setError('');
    setMessage('');

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
        setError(data.message || 'Gỡ thất bại');
        return;
      }

      setMessage('Đã gỡ thiết bị');
      fetchData();
    } catch {
      setError('Không thể kết nối server');
    }
  };

  if (loading) return <div className="text-sm text-gray-500">Đang tải...</div>;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Quản lý thiết bị</h1>
        <div className="flex gap-2">
          <button
            onClick={() => { setShowAssign(false); setShowActivate(!showActivate); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold transition-all"
          >
            {showActivate ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            Kích hoạt
          </button>
          <button
            onClick={() => { setShowActivate(false); setShowAssign(!showAssign); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-all"
          >
            {showAssign ? <X className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
            Gán cho trẻ
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">{error}</div>
      )}
      {message && (
        <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700">{message}</div>
      )}

      {/* Activate Form */}
      {showActivate && (
        <form onSubmit={handleActivate} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Kích hoạt thiết bị mới</h2>
          <p className="text-xs text-gray-500">Nhập mã kích hoạt in trên thiết bị ONBI của bạn</p>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Mã kích hoạt</label>
            <input
              type="text"
              value={activationCode}
              onChange={(e) => setActivationCode(e.target.value.toUpperCase())}
              placeholder="ONBI-XXXX-XXXX"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-mono tracking-wider placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={activating}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-semibold text-sm transition-all disabled:opacity-50"
          >
            {activating ? 'Đang kích hoạt...' : 'Kích hoạt'}
          </button>
        </form>
      )}

      {/* Assign Form */}
      {showAssign && (
        <form onSubmit={handleAssign} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Gán thiết bị cho trẻ</h2>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Thiết bị</label>
            <select
              value={assignDeviceId}
              onChange={(e) => setAssignDeviceId(Number(e.target.value))}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
            >
              <option value="">Chọn thiết bị</option>
              {devices.filter(d => !d.child).map((d) => (
                <option key={d.id} value={d.id}>{d.activationCode} (ID: {d.id})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Trẻ</label>
            <select
              value={assignChildId}
              onChange={(e) => setAssignChildId(Number(e.target.value))}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
            >
              <option value="">Chọn trẻ</option>
              {children.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={assigning}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-all disabled:opacity-50"
          >
            {assigning ? 'Đang gán...' : 'Gán thiết bị'}
          </button>
        </form>
      )}

      {/* Devices List */}
      {devices.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <WifiOff className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Chưa có thiết bị nào</p>
          <p className="text-xs text-gray-400 mt-1">Nhấn &quot;Kích hoạt&quot; để thêm thiết bị ONBI</p>
        </div>
      ) : (
        <div className="space-y-3">
          {devices.map((device) => (
            <div
              key={device.id}
              className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4 hover:border-cyan-300 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${device.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                  <Wifi className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 font-mono text-sm">{device.activationCode}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${device.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {device.status}
                    </span>
                    {device.child && (
                      <span>Gán cho: <span className="font-medium text-slate-700">{device.child.name}</span></span>
                    )}
                  </div>
                </div>
              </div>

              {device.child && (
                <button
                  onClick={() => handleUnassign(device.id, device.child!.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors"
                >
                  <Unlink className="w-3.5 h-3.5" />
                  Gỡ
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
