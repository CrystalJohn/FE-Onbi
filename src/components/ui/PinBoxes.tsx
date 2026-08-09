'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface PinBoxesProps {
  value: string;
  onChange: (value: string) => void;
  /** Ô đang gõ viền đỏ thay vì cyan — dùng cho luồng xóa PIN. */
  danger?: boolean;
  autoFocus?: boolean;
  className?: string;
  'aria-label'?: string;
}

/**
 * 6 ô nhập mã PIN: một input thật (ẩn, phủ kín khối) + 6 ô chỉ để hiển thị.
 * ponytail: tự vẽ thay vì thêm dependency input-otp — gõ/xóa/paste vẫn là hành vi
 * mặc định của input, không cần quản lý focus từng ô.
 */
export default function PinBoxes({
  value,
  onChange,
  danger,
  autoFocus,
  className,
  'aria-label': ariaLabel = 'Mã PIN 6 số',
}: PinBoxesProps) {
  const [focused, setFocused] = useState(false);
  const activeIndex = focused ? Math.min(value.length, 5) : -1;

  return (
    <div className={cn('relative flex gap-2', className)}>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value.replace(/\D/g, '').slice(0, 6))}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        autoFocus={autoFocus}
        aria-label={ariaLabel}
        // Chữ/caret/nền được ẩn ở globals.css qua `input[data-pin-input]` — không dùng
        // class Tailwind được vì `-webkit-text-fill-color !important` trong đó thắng `color`.
        data-pin-input=""
        className="absolute inset-0 h-full w-full rounded-xl border-0 p-0 outline-none"
      />
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <div
          key={index}
          aria-hidden="true"
          className={cn(
            'flex h-12 flex-1 items-center justify-center rounded-xl border bg-white text-lg font-semibold text-slate-900 transition-colors',
            // `!`: globals.css có `* { border-color: var(--border) }` ngoài @layer nên
            // thắng mọi utility border-* của Tailwind nếu không đánh important.
            index === activeIndex
              ? danger
                ? 'border-red-500! ring-2 ring-red-100'
                : 'border-cyan-600! ring-2 ring-cyan-100'
              : 'border-slate-300!',
          )}
        >
          {value[index] ?? ''}
        </div>
      ))}
    </div>
  );
}
