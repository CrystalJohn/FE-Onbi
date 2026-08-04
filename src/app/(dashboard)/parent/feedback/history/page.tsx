'use client';

import { useCallback, useEffect, useState } from 'react';
import { MessageSquareText, Send } from 'lucide-react';
import { api } from '@/lib/api';
import BackButton from '@/components/ui/BackButton';

interface Reply {
  id: string;
  senderRole: 'admin' | 'parent';
  senderName: string;
  content: string;
  createdAt: string;
}

interface Feedback {
  id: string;
  subject: string;
  message: string;
  deviceSerial?: string | null;
  status: 'new' | 'in_progress' | 'resolved';
  createdAt: string;
  replies?: Reply[];
}

const STATUS_META: Record<Feedback['status'], { label: string; className: string }> = {
  new: { label: 'Mới gửi', className: 'bg-amber-50 text-amber-700 ring-amber-200/80' },
  in_progress: { label: 'Đang xử lý', className: 'bg-cyan-50 text-cyan-700 ring-cyan-200/80' },
  resolved: { label: 'Đã xử lý', className: 'bg-emerald-50 text-emerald-700 ring-emerald-200/80' },
};

export default function FeedbackHistoryPage() {
  const [items, setItems] = useState<Feedback[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [sendingReplyId, setSendingReplyId] = useState<string | null>(null);

  const loadMine = useCallback(async () => {
    try {
      const { data } = await api.get<Feedback[]>('/feedback/mine');
      setItems(data);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => { void loadMine(); }, [loadMine]);

  const sendReply = async (id: string) => {
    const content = replyTexts[id]?.trim();
    if (!content) return;
    setSendingReplyId(id);
    try {
      const { data: newReply } = await api.post<Reply>(`/feedback/${id}/reply`, { content });
      setItems((prev) =>
        prev.map((f) =>
          f.id === id ? { ...f, replies: [...(f.replies ?? []), newReply] } : f
        )
      );
      setReplyTexts((prev) => ({ ...prev, [id]: '' }));
    } catch {
      alert('Không thể gửi phản hồi, vui lòng thử lại.');
    } finally {
      setSendingReplyId(null);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="flex items-start gap-4">
        <BackButton fallback="/parent/feedback" />
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700">LỊCH SỬ</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Phản hồi đã gửi</h1>
          <p className="mt-2 text-sm text-slate-600">Xem lại các phản hồi bạn đã gửi và phản hồi từ ONBI.</p>
        </div>
      </header>

      <section>
        {items.length === 0 ? (
          <div className="grid min-h-32 place-items-center rounded-2xl border border-dashed border-slate-200 bg-white/60 p-5 text-center text-sm text-slate-500">
            <div><MessageSquareText className="mx-auto mb-2 h-6 w-6 text-slate-300" />Bạn chưa gửi phản hồi nào.</div>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((f) => {
              const meta = STATUS_META[f.status];
              const isExpanded = expandedId === f.id;
              const replies = f.replies ?? [];
              
              return (
                <article key={f.id} className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-[0_4px_20px_rgba(15,23,42,0.04)] transition-all">
                  <div 
                    className="p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => setExpandedId(isExpanded ? null : f.id)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-semibold text-slate-900">{f.subject}</p>
                      <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${meta.className}`}>{meta.label}</span>
                    </div>
                    <p className="mt-1.5 text-sm leading-5 text-slate-600 line-clamp-2">{f.message}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-xs text-slate-400">
                        {new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(f.createdAt))}
                        {f.deviceSerial ? ` · ${f.deviceSerial}` : ''}
                      </p>
                      <p className="text-xs font-medium text-[#0B008B]">
                        {replies.length > 0 ? `${replies.length} tin nhắn` : 'Chưa có phản hồi'} 
                        {isExpanded ? ' (Thu gọn)' : ' (Xem chi tiết)'}
                      </p>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-slate-100 bg-slate-50/50 p-4 space-y-4">
                      <div className="flex gap-2 justify-start">
                        <div className="max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-5 bg-[#0B008B] text-white">
                          <p className="font-semibold text-[11px] mb-1 opacity-75">Tôi</p>
                          <p className="whitespace-pre-line">{f.message}</p>
                        </div>
                      </div>

                      {replies.map((r) => (
                        <div
                          key={r.id}
                          className={`flex gap-2 ${r.senderRole === 'parent' ? 'justify-start' : 'justify-end'}`}
                        >
                          <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-5 ${
                            r.senderRole === 'parent'
                              ? 'bg-[#0B008B] text-white'
                              : 'bg-white border border-slate-200 text-slate-800 shadow-sm'
                          }`}>
                            <p className="font-semibold text-[11px] mb-1 opacity-75">
                              {r.senderRole === 'parent' ? 'Tôi' : 'Quản trị viên ONBI'}
                            </p>
                            <p className="whitespace-pre-line">{r.content}</p>
                            <p className={`mt-1 text-[10px] opacity-60`}>
                              {new Intl.DateTimeFormat('vi-VN', { timeStyle: 'short', dateStyle: 'short' }).format(new Date(r.createdAt))}
                            </p>
                          </div>
                        </div>
                      ))}

                      {f.status === 'resolved' ? (
                        <div className="mt-4 rounded-xl bg-slate-100 p-3 text-center text-xs font-medium text-slate-500">
                          Phản hồi này đã được xử lý và đóng lại.
                        </div>
                      ) : (
                        <div className="flex gap-2 pt-2">
                          <textarea
                            rows={1}
                            value={replyTexts[f.id] ?? ''}
                            onChange={(e) => setReplyTexts((prev) => ({ ...prev, [f.id]: e.target.value }))}
                            placeholder="Nhập tin nhắn..."
                            className="min-h-10 flex-1 resize-none rounded-2xl border border-slate-200/80 bg-white px-4 py-2.5 text-sm text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-[#0B008B] focus:ring-2 focus:ring-[#0B008B]/15"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
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
                          >
                            <Send className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
