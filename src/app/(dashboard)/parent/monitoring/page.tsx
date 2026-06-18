import { redirect } from 'next/navigation';

export default function MonitoringRedirectPage() {
  // Vì route giám sát yêu cầu một childId cụ thể (/parent/monitoring/[childId])
  // Nếu user truy cập thẳng /parent/monitoring thì redirect về trang danh sách bé
  redirect('/parent/children');
}
