'use client'

import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, MessageSquareText, Send, CheckCircle2, RefreshCw } from 'lucide-react';

type Status = 'new' | 'in_progress' | 'resolved';

interface Reply {
  id: string;
  senderRole: 'admin' | 'parent';
  senderName: string;
  content: string;
  createdAt: string;
}

interface AdminFeedback {
  id: string;
  subject: string;
  message: string;
  deviceSerial?: string | null;
  status: Status;
  createdAt: string;
  parent?: { id: string; email: string; fullName: string } | null;
  replies?: Reply[];
}

const STATUS_META: Record<Status, { label: string; className: string }> = {
  new: { label: 'Mới', className: 'bg-amber-50 text-amber-700 ring-amber-200/80' },
  in_progress: { label: 'Đang xử lý', className: 'bg-cyan-50 text-cyan-700 ring-cyan-200/80' },
  resolved: { label: 'Đã xử lý', className: 'bg-emerald-50 text-emerald-700 ring-emerald-200/80' },
};
const STATUS_OPTIONS: Status[] = ['new', 'in_progress', 'resolved'];

const fmt = (iso: string) =>
  new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(iso));

export default function AdminFeedbackPage() {
  const [items, setItems] = useState<AdminFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [sendingReplyId, setSendingReplyId] = useState<string | null>(null);

  const getToken = () => localStorage.getItem('token') || '';

  const load = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/feedback`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) setItems(await res.json());
      else setError('Không thể tải danh sách phản hồi');
    } catch {
      setError('Không thể kết nối server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const changeStatus = async (id: string, status: Status) => {
    setSavingId(id);
    setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/feedback/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const updated = await res.json();
        setItems((prev) => prev.map((f) => (f.id === id ? { ...f, status: updated.status } : f)));
      } else {
        setError('Không thể cập nhật trạng thái');
      }
    } catch {
      setError('Không thể kết nối server');
    } finally {
      setSavingId(null);
    }
  };

  const sendReply = async (id: string) => {
    const content = replyTexts[id]?.trim();
    if (!content) return;
    setSendingReplyId(id);
    setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/feedback/${id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        const newReply: Reply = await res.json();
        setItems((prev) =>
          prev.map((f) =>
            f.id === id ? { 
              ...f, 
              replies: [...(f.replies ?? []), newReply],
              status: f.status === 'new' ? 'in_progress' : f.status
            } : f,
          ),
        );
        setReplyTexts((prev) => ({ ...prev, [id]: '' }));
      } else {
        setError('Không thể gửi phản hồi');
      }
    } catch {
      setError('Không thể kết nối server');
    } finally {
      setSendingReplyId(null);
    }
  };

  if (loading) {
    return <div className="rounded-3xl border border-white/80 bg-white/75 p-8 text-sm text-slate-500 shadow-sm">Đang tải phản hồi...</div>;
  }

  return (
    <div className="space-y-6 text-slate-900">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700">Hỗ trợ phụ huynh</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Phản hồi</h1>
        <p className="mt-2 text-sm text-slate-500">Phản hồi &amp; báo lỗi từ phụ huynh. Cập nhật trạng thái và trả lời trực tiếp.</p>
      </header>

      {error && <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-sm text-rose-700">{error}</div>}

      {items.length === 0 ? (
        <div className="flex min-h-60 flex-col items-center justify-center rounded-[28px] border border-white/80 bg-white/75 px-6 py-12 text-center shadow-sm">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-cyan-50 text-cyan-700"><MessageSquareText className="h-6 w-6" /></span>
          <h2 className="mt-4 text-lg font-bold text-slate-950">Chưa có phản hồi nào</h2>
          <p className="mt-2 max-w-md text-sm text-slate-500">Khi phụ huynh gửi phản hồi, chúng sẽ xuất hiện ở đây.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((f) => {
            const meta = STATUS_META[f.status];
            const isExpanded = expandedId === f.id;
            const replies = f.replies ?? [];
            return (
              <article key={f.id} className="rounded-[24px] border border-white/80 bg-white/75 shadow-[0_16px_45px_rgba(15,23,42,0.07)] backdrop-blur-xl">
                {/* Header */}
                <div 
                  className="flex flex-wrap items-start justify-between gap-3 p-5 cursor-pointer hover:bg-slate-50/50 transition-colors rounded-t-[24px]"
                  onClick={() => setExpandedId(isExpanded ? null : f.id)}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900">{f.subject}</h3>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${meta.className}`}>{meta.label}</span>
                      {replies.length > 0 && (
                        <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">{replies.length} tin nhắn</span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      {f.parent?.fullName ?? 'Phụ huynh'} · {f.parent?.email ?? ''}
                      {f.deviceSerial ? ` · ${f.deviceSerial}` : ''} · {fmt(f.createdAt)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {f.status !== 'resolved' ? (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); changeStatus(f.id, 'resolved'); }}
                        disabled={savingId === f.id}
                        className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-emerald-500 bg-emerald-50 px-3 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-500 hover:text-white disabled:opacity-50"
                      >
                        <CheckCircle2 className="h-4 w-4" /> Đánh dấu Đã xử lý
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); changeStatus(f.id, 'in_progress'); }}
                        disabled={savingId === f.id}
                        className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50"
                      >
                        <RefreshCw className="h-4 w-4" /> Mở lại
                      </button>
                    )}
                  </div>
                </div>

                {/* Message gốc của phụ huynh luôn hiện */}
                <div className="border-t border-slate-100 px-5 pb-3 pt-3">
                  <p className="whitespace-pre-line text-sm leading-6 text-slate-700">{f.message}</p>
                </div>

                {/* Thread + reply box — chỉ hiện khi expand */}
                {isExpanded && (
                  <div className="border-t border-slate-100 px-5 pb-5 pt-4 space-y-3">
                    {replies.length > 0 && (
                      <div className="space-y-2">
                        {replies.map((r) => (
                          <div
                            key={r.id}
                            className={`flex gap-2 ${r.senderRole === 'admin' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-5 ${
                              r.senderRole === 'admin'
                                ? 'bg-[#0B008B] text-white'
                                : 'bg-slate-100 text-slate-800'
                            }`}>
                              <p className="font-semibold text-[11px] mb-1 opacity-75">
                                {r.senderRole === 'admin' ? 'Admin' : (f.parent?.fullName || 'Phụ huynh')}
                              </p>
                              <p className="whitespace-pre-line">{r.content}</p>
                              <p className={`mt-1 text-[10px] opacity-60`}>{fmt(r.createdAt)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {replies.length === 0 && (
                      <p className="text-xs text-slate-400 text-center py-2">Chưa có tin nhắn nào. Gửi phản hồi đầu tiên bên dưới.</p>
                    )}

                    {/* Reply input */}
                    {f.status === 'resolved' ? (
                      <div className="mt-2 rounded-xl bg-slate-50 p-3 text-center text-xs font-medium text-slate-500">
                        Phản hồi này đã được xử lý và đóng lại. Thay đổi trạng thái để tiếp tục thảo luận.
                      </div>
                    ) : (
                      <>
                        <div className="flex gap-2 pt-1">
                          <textarea
                            rows={2}
                            value={replyTexts[f.id] ?? ''}
                            onChange={(e) => setReplyTexts((prev) => ({ ...prev, [f.id]: e.target.value }))}
                            placeholder="Nhập phản hồi cho phụ huynh..."
                            className="min-h-10 flex-1 resize-none rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-2.5 text-sm text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-[#0B008B] focus:ring-2 focus:ring-[#0B008B]/15"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                                e.preventDefault();
                                void sendReply(f.id);
                              }
                            }}
                          />
                          <button
                            type="button"
                            disabled={sendingReplyId === f.id || !replyTexts[f.id]?.trim()}
                            onClick={() => void sendReply(f.id)}
                            className="grid h-10 w-10 shrink-0 place-items-center self-end rounded-full bg-[#0B008B] text-white shadow-[0_8px_20px_rgba(11,0,139,0.2)] transition-colors hover:bg-[#08006D] disabled:cursor-not-allowed disabled:opacity-50"
                            title="Gửi (Ctrl+Enter)"
                          >
                            <Send className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-400">Ctrl+Enter để gửi nhanh</p>
                      </>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
