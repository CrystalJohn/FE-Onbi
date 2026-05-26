'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, X, User, Calendar, Pencil, Trash2, GraduationCap } from 'lucide-react';

interface Child {
  id: number;
  name: string;
  dateOfBirth: string;
  gender: string;
}

export default function ChildrenListPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('male');
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');

  const getToken = () => localStorage.getItem('token') || '';

  const fetchChildren = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/children`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setChildren(data);
    } catch {
      setError('Không thể tải danh sách');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchChildren(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/children`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ name, dateOfBirth, gender }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Thêm thất bại');
        return;
      }

      setName('');
      setDateOfBirth('');
      setGender('male');
      setShowForm(false);
      fetchChildren();
    } catch {
      setError('Không thể kết nối server');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa hồ sơ này?')) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/children/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error();
      fetchChildren();
    } catch {
      setError('Xóa thất bại');
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN');
  };

  const getAge = (dateStr: string) => {
    const birth = new Date(dateStr);
    const now = new Date();
    return now.getFullYear() - birth.getFullYear();
  };

  if (loading) return <div className="text-sm text-slate-500">Đang tải...</div>;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#000080]">Hồ sơ học sinh</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#000080] hover:bg-[#000066] text-white text-sm font-semibold transition-all"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Đóng' : 'Thêm học sinh'}
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">{error}</div>
      )}

      {/* Add Form */}
      {showForm && (
        <form onSubmit={handleAdd} className="rounded-2xl border border-slate-200/60 bg-white/70 p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-[#000080]">Thêm học sinh mới</h2>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Họ tên</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Bé An"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Ngày sinh</label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Giới tính</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all"
            >
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={formLoading}
            className="px-6 py-2.5 rounded-xl bg-[#000080] hover:bg-[#000066] text-white font-semibold text-sm transition-all disabled:opacity-50"
          >
            {formLoading ? 'Đang thêm...' : 'Thêm hồ sơ'}
          </button>
        </form>
      )}

      {/* Children Cards */}
      {children.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-slate-200/60 bg-white/70 shadow-sm">
          <GraduationCap className="w-14 h-14 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500">Chưa có hồ sơ học sinh nào</p>
          <p className="text-xs text-slate-400 mt-1">Nhấn &quot;Thêm học sinh&quot; để bắt đầu</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {children.map((child) => (
            <div
              key={child.id}
              className="relative rounded-2xl border border-slate-200/60 bg-white/70 p-5 shadow-sm hover:shadow-md transition-all group"
            >
              {/* Student card header stripe */}
              <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl bg-[#000080]" />

              <div className="flex items-start gap-4 pt-2">
                {/* Avatar */}
                <div className="w-14 h-14 rounded-xl bg-[#000080] flex items-center justify-center text-white font-bold text-xl shadow-sm">
                  {child.name.charAt(0)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[#000080] text-base truncate">{child.name}</h3>
                  <div className="mt-2 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDate(child.dateOfBirth)}</span>
                      <span className="text-slate-300">•</span>
                      <span className="font-medium text-slate-700">{getAge(child.dateOfBirth)} tuổi</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${
                        child.gender === 'male' 
                          ? 'bg-slate-100 text-slate-700' 
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {child.gender === 'male' ? 'Nam' : 'Nữ'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
                <Link
                  href={`/parent/children/${child.id}`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Chỉnh sửa
                </Link>
                <Link
                  href={`/parent/monitoring/${child.id}`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium text-white bg-[#000080] hover:bg-[#000066] transition-colors"
                >
                  Giám sát
                </Link>
                <button
                  onClick={() => handleDelete(child.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
