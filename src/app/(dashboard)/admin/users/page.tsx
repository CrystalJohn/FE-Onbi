'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trash2, Plus, X, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Frame, FramePanel } from '@/components/reui/frame';
import { Badge } from '@/components/reui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface User {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  role: 'admin' | 'parent';
  createdAt: string;
  avatarUrl?: string;
}

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Create form
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // Delete modal
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);

  const getToken = () => localStorage.getItem('token') || '';

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) setUsers(await res.json());
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ email, password, fullName, phone }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Tạo user thất bại');
        return;
      }

      setMessage('Tạo user thành công');
      setShowForm(false);
      setEmail('');
      setPassword('');
      setFullName('');
      setPhone('');
      fetchUsers();
    } catch {
      setError('Không thể kết nối server');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteUser) return;
    setDeleting(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${deleteUser.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setDeleteUser(null);
      fetchUsers();
    } catch {
      setError('Xóa thất bại');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div className="text-sm text-gray-500">Đang tải...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Quản lý Users</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold transition-all"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Đóng' : 'Tạo User'}
        </button>
      </div>

      {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">{error}</div>}
      {message && <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700">{message}</div>}

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="user@example.com" className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 placeholder:opacity-100 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-cyan-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Mật khẩu</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 placeholder:opacity-100 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-cyan-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Họ tên</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="Nguyễn Văn A" className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 placeholder:opacity-100 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-cyan-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">SĐT</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="0901234567" className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 placeholder:opacity-100 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-cyan-400" />
            </div>
          </div>
          <button type="submit" disabled={formLoading} className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-semibold text-sm disabled:opacity-50">
            {formLoading ? 'Đang tạo...' : 'Tạo User'}
          </button>
        </form>
      )}

      {/* Users Table */}
      <Frame spacing="xs">
        <FramePanel className="p-0!">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Thành viên</TableHead>
                <TableHead>SĐT</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar size="sm">
                        <AvatarImage src={user.avatarUrl} alt={user.fullName} />
                        <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{user.fullName}</span>
                        <span className="text-muted-foreground text-xs">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">{user.phone || '—'}</TableCell>
                  <TableCell>
                    {user.role === 'admin' ? (
                      <Badge variant="default" size="sm">Admin</Badge>
                    ) : (
                      <Badge variant="info-light" size="sm">Parent</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-cyan-600 hover:bg-cyan-50"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => setDeleteUser(user)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </FramePanel>
      </Frame>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteUser} onOpenChange={(open) => { if (!open) setDeleteUser(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa user</DialogTitle>
            <DialogDescription>
              Bạn có chắc muốn xóa <span className="font-semibold text-slate-900">{deleteUser?.fullName}</span> ({deleteUser?.email})? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteUser(null)} disabled={deleting}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Đang xóa...' : 'Xóa user'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
