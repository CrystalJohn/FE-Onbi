/** Định dạng thời gian thân thiện cho phụ huynh, dùng chung toàn app.
 *  Hôm nay  -> "Hôm nay, 17:59"
 *  Hôm qua  -> "Hôm qua, 17:59"
 *  Cùng năm -> "05/07, 17:59"
 *  Khác năm -> "05/07/2025, 17:59"
 */
export function formatSmartTime(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  const time = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  const now = new Date();
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diffDays = Math.round((startOfDay(now) - startOfDay(date)) / 86400000);

  if (diffDays === 0) return `Hôm nay, ${time}`;
  if (diffDays === 1) return `Hôm qua, ${time}`;
  const dm = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  if (date.getFullYear() === now.getFullYear()) return `${dm}, ${time}`;
  return `${dm}/${date.getFullYear()}, ${time}`;
}

/** Thời lượng dễ đọc: "45 giây" / "5 phút" / "1 giờ 20 phút" */
export function formatDurationSec(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds));
  if (s < 60) return `${s} giây`;
  const m = Math.floor(s / 60);
  if (m < 60) return s % 60 === 0 ? `${m} phút` : `${m} phút ${String(s % 60).padStart(2, '0')} giây`;
  return `${Math.floor(m / 60)} giờ ${m % 60} phút`;
}

/** Tuổi tròn năm tính từ ngày sinh. */
export function ageFromBirthDate(value: string): number {
  const birth = new Date(value);
  const now = new Date();
  let result = now.getFullYear() - birth.getFullYear();
  if (now < new Date(now.getFullYear(), birth.getMonth(), birth.getDate())) result -= 1;
  return result;
}
