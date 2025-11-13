"use client";

import dynamic from "next/dynamic";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

// Dynamic import with ssr: false to avoid hydration errors
const MapContainer = dynamic(
  () => import("@/components/features/map-container").then((mod) => ({ default: mod.MapContainer })),
  {
    ssr: false,
    loading: () => (
      <div className="h-[60vh] flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">지도를 불러오는 중...</p>
        </div>
      </div>
    ),
  }
);

export default function MapPage() {
  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="flex items-center gap-3 px-4 py-4 max-w-lg mx-auto">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-bold">신고 지도</h1>
        </div>
      </div>

      {/* Map Container */}
      <MapContainer />

      {/* Legend */}
      <div className="px-4 py-6 max-w-lg mx-auto">
        <div className="bg-white rounded-xl p-4 border border-gray-200 space-y-3">
          <h3 className="font-bold text-gray-900 mb-3">범례</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-amber-500"></div>
              <span className="text-gray-700">검토 중</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
              <span className="text-gray-700">승인됨</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="text-gray-700">반려됨</span>
            </div>
          </div>
        </div>

        {/* Tips Card */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200 mt-4">
          <h3 className="font-bold text-blue-900 mb-2">지도 사용 팁</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 마커를 클릭하면 신고 상세 정보를 볼 수 있습니다</li>
            <li>• 상단 필터로 상태별 신고를 확인할 수 있습니다</li>
            <li>• 지도를 드래그하거나 줌하여 다른 지역을 탐색하세요</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
