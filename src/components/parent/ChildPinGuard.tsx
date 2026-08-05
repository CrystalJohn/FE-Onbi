'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoaderCircle } from 'lucide-react';
import { api } from '@/lib/api';
import PinGateModal from './PinGateModal';

/**
 * Chặn render toàn bộ nội dung con cho tới khi hồ sơ được mở khóa bằng mã PIN.
 * Đặt ở layout của monitoring/[childId] và children/[id] nên gõ thẳng URL cũng
 * phải nhập PIN — không chỉ chặn ở nút bấm. Nội dung con không mount khi còn khóa,
 * nên trang giám sát không bắt đầu tải/stream trước khi xác thực.
 */
export default function ChildPinGuard({ childId, children }: { childId: string; children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<'checking' | 'locked' | 'unlocked'>('checking');
  const [childName, setChildName] = useState('');

  useEffect(() => {
    let alive = true;
    api.get<{ name?: string; hasPin?: boolean }>(`/children/${childId}`)
      .then(({ data }) => {
        if (!alive) return;
        setChildName(data.name ?? '');
        setState(data.hasPin ? 'locked' : 'unlocked');
      })
      // Lỗi (401 tự redirect login; 403/404) → cho trang tự hiển thị lỗi của nó.
      .catch(() => { if (alive) setState('unlocked'); });
    return () => { alive = false; };
  }, [childId]);

  if (state === 'unlocked') return <>{children}</>;

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center">
      <LoaderCircle className="h-8 w-8 animate-spin text-slate-300" aria-hidden="true" />
      {state === 'locked' && (
        <PinGateModal
          childId={childId}
          childName={childName}
          title="Hồ sơ được bảo vệ bằng mã PIN"
          onSuccess={() => setState('unlocked')}
          onClose={() => {
            // Quay lại đúng trang trước đó (vd: dashboard); mở thẳng URL thì về dashboard.
            if (typeof window !== 'undefined' && window.history.length > 1) router.back();
            else router.push('/parent/dashboard');
          }}
        />
      )}
    </div>
  );
}
