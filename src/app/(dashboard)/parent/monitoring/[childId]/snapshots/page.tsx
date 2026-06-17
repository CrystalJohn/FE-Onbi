'use client'

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Camera, AlertTriangle, Monitor, RefreshCw, X, ImageIcon } from 'lucide-react';

interface Snapshot {
  id: number;
  type: string;
  imageUrl?: string;
  description?: string;
  createdAt: string;
  sessionId?: number;
}

const TYPE_LABELS: Record<string, string> = {
  left_desk: 'Roi ban',
  bad_posture: 'Sai tu the',
  manual: 'Chup tay',
};

const TYPE_COLORS: Record<string, string> = {
  left_desk: 'bg-orange-100 text-orange-700 border-orange-200',
  bad_posture: 'bg-red-100 text-red-700 border-red-200',
  manual: 'bg-blue-100 text-blue-700 border-blue-200',
};

const TYPE_ICONS: Record<string, typeof AlertTriangle> = {
  left_desk: AlertTriangle,
  bad_posture: AlertTriangle,
  manual: Camera,
};

export default function SnapshotsPage({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = use(params);
  const router = useRouter();

  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const getToken = () => localStorage.getItem('token') || '';

  useEffect(() => {
    const fetchSnapshots = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/children/${childId}/monitoring/snapshots?limit=50`,
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        if (!res.ok) throw new Error();
        const data = await res.json();
        setSnapshots(Array.isArray(data) ? data : []);
      } catch {
        setError('Khong the tai anh');
      } finally {
        setLoading(false);
      }
    };

    fetchSnapshots();
  }, [childId]);

  const getImageSrc = (url?: string) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
  };

  const filteredSnapshots = filterType
    ? snapshots.filter((s) => s.type === filterType)
    : snapshots;

  const counts = snapshots.reduce(
    (acc, s) => {
      acc[s.type] = (acc[s.type] || 0) + 1;
      acc.total++;
      return acc;
    },
    { total: 0 } as Record<string, number>
  );

  if (loading) {
    return <div className="text-sm text-gray-500">Dang tai...</div>;
  }

  return (
    <div className="max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push(`/parent/monitoring/${childId}`)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <Camera className="w-6 h-6 text-cyan-500" />
        <h1 className="text-2xl font-bold text-slate-900">Anh & Canh bao</h1>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setFilterType(null)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
            filterType === null
              ? 'bg-slate-800 text-white border-slate-800'
              : 'bg-white text-slate-600 border-gray-200 hover:border-slate-300'
          }`}
        >
          Tat ca ({counts.total})
        </button>
        {Object.entries(TYPE_LABELS).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilterType(key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
              filterType === key
                ? 'bg-slate-800 text-white border-slate-800'
                : 'bg-white text-slate-600 border-gray-200 hover:border-slate-300'
            }`}
          >
            {label} ({counts[key] || 0})
          </button>
        ))}
      </div>

      {/* Gallery */}
      {filteredSnapshots.length === 0 ? (
        <div className="text-center py-16">
          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-400 italic">
            {filterType ? 'Khong co anh loai nay.' : 'Chua co anh nao.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredSnapshots.map((snapshot) => {
            const src = getImageSrc(snapshot.imageUrl);
            const TypeIcon = TYPE_ICONS[snapshot.type] || Camera;

            return (
              <div
                key={snapshot.id}
                className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Image */}
                {src ? (
                  <button
                    onClick={() => setPreviewImage(src)}
                    className="block w-full aspect-[4/3] bg-gray-100 overflow-hidden"
                  >
                    <img
                      src={src}
                      alt={`Snapshot ${snapshot.id}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </button>
                ) : (
                  <div className="w-full aspect-[4/3] bg-gray-50 flex items-center justify-center">
                    <Camera className="w-8 h-8 text-gray-300" />
                  </div>
                )}

                {/* Info */}
                <div className="p-3 space-y-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${
                      TYPE_COLORS[snapshot.type] || 'bg-gray-100 text-gray-700 border-gray-200'
                    }`}
                  >
                    <TypeIcon className="w-3 h-3" />
                    {TYPE_LABELS[snapshot.type] || snapshot.type}
                  </span>
                  <p className="text-xs text-gray-400">
                    {new Date(snapshot.createdAt).toLocaleString('vi-VN', {
                      timeZone: 'Asia/Ho_Chi_Minh',
                    })}
                  </p>
                  {snapshot.description && (
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {snapshot.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full-screen preview modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={previewImage}
            alt="Preview"
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
