"use client";

import { useState, useEffect, useRef } from "react";
import Script from "next/script";
import { ArrowLeft, MapPin, Filter, X } from "lucide-react";
import Link from "next/link";
import reportsData from "@/data/reports.json";
import speciesData from "@/data/species.json";
import usersData from "@/data/users.json";

// Naver Maps 타입 선언
declare global {
  interface Window {
    naver: any;
  }
}

type CategoryFilter = "all" | "식물" | "동물" | "어류";
type StatusFilter = "all" | "pending" | "confirmed" | "rejected";

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [showFilters, setShowFilters] = useState(false);

  // 필터링된 신고 내역
  const filteredReports = reportsData.filter((report) => {
    const species = speciesData.find((s) => s.id === report.species_id);

    // 카테고리 필터
    if (categoryFilter !== "all" && species?.category !== categoryFilter) {
      return false;
    }

    // 상태 필터
    if (statusFilter !== "all" && report.status !== statusFilter) {
      return false;
    }

    return true;
  });

  // 선택된 신고 상세 정보
  const selectedReportData = selectedReport
    ? reportsData.find((r) => r.report_id === selectedReport)
    : null;
  const selectedSpecies = selectedReportData
    ? speciesData.find((s) => s.id === selectedReportData.species_id)
    : null;
  const selectedUser = selectedReportData
    ? usersData.find((u) => u.user_id === selectedReportData.user_id)
    : null;

  // 상태별 색상
  const statusColors = {
    pending: "bg-amber-500",
    confirmed: "bg-emerald-500",
    rejected: "bg-red-500",
  };

  const statusLabels = {
    pending: "검토 중",
    confirmed: "승인",
    rejected: "반려",
  };

  // 카테고리별 이모지
  const categoryEmoji = {
    식물: "🌿",
    동물: "🐾",
    어류: "🐟",
  };

  // 상태별 실제 색상 (마커용)
  const markerColors = {
    pending: "#f59e0b",
    confirmed: "#10b981",
    rejected: "#ef4444",
  };

  // 지도 초기화 - isMapLoaded가 true일 때만 실행
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || !window.naver || map) return;

    const mapOptions = {
      center: new window.naver.maps.LatLng(36.5040, 127.2621),
      zoom: 12,
      zoomControl: true,
      zoomControlOptions: {
        position: window.naver.maps.Position.TOP_RIGHT,
      },
    };

    const newMap = new window.naver.maps.Map(mapRef.current, mapOptions);
    setMap(newMap);
  }, [isMapLoaded, map]);

  // 마커 업데이트
  useEffect(() => {
    if (!map) return;

    // 기존 마커 제거
    markers.forEach((marker) => marker.setMap(null));

    // 새로운 마커 생성
    const newMarkers = filteredReports.map((report) => {
      const species = speciesData.find((s) => s.id === report.species_id);
      const position = new window.naver.maps.LatLng(
        report.location.lat,
        report.location.lng
      );

      // 커스텀 마커 HTML
      const markerContent = `
        <div style="position: relative; cursor: pointer;">
          <div style="
            width: 40px;
            height: 40px;
            background-color: ${markerColors[report.status as keyof typeof markerColors]};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            border: 4px solid white;
            font-size: 20px;
          ">
            ${categoryEmoji[species?.category as keyof typeof categoryEmoji] || "📍"}
          </div>
          <div style="
            width: 0;
            height: 0;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-top: 12px solid ${markerColors[report.status as keyof typeof markerColors]};
            margin: 0 auto;
          "></div>
        </div>
      `;

      const marker = new window.naver.maps.Marker({
        position,
        map,
        icon: {
          content: markerContent,
          anchor: new window.naver.maps.Point(20, 52),
        },
      });

      // 마커 클릭 이벤트
      window.naver.maps.Event.addListener(marker, "click", () => {
        setSelectedReport(report.report_id);
        map.panTo(position);
      });

      return marker;
    });

    setMarkers(newMarkers);

    // 모든 마커가 보이도록 지도 범위 조정
    if (newMarkers.length > 0) {
      const bounds = new window.naver.maps.LatLngBounds();
      filteredReports.forEach((report) => {
        bounds.extend(
          new window.naver.maps.LatLng(report.location.lat, report.location.lng)
        );
      });
      map.fitBounds(bounds);
    }
  }, [map, filteredReports]);

  return (
    <>
      <Script
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_KEY_ID}`}
        onReady={() => setIsMapLoaded(true)}
        strategy="afterInteractive"
      />
      <div className="min-h-screen pb-24 relative z-0">
        {/* Header */}
        <div className="bg-white border-b sticky top-16 z-30">
        <div className="flex items-center justify-between px-4 py-4 max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-lg font-bold">신고 지도</h1>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 hover:bg-gray-100 rounded-lg relative"
          >
            <Filter className="h-5 w-5" />
            {(categoryFilter !== "all" || statusFilter !== "all") && (
              <div className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            )}
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="border-t bg-gray-50 p-4 max-w-lg mx-auto space-y-4">
            {/* Category Filter */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">종류</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCategoryFilter("all")}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    categoryFilter === "all"
                      ? "bg-primary text-white"
                      : "bg-white text-gray-600 border border-gray-200"
                  }`}
                >
                  전체
                </button>
                <button
                  onClick={() => setCategoryFilter("식물")}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    categoryFilter === "식물"
                      ? "bg-primary text-white"
                      : "bg-white text-gray-600 border border-gray-200"
                  }`}
                >
                  🌿 식물
                </button>
                <button
                  onClick={() => setCategoryFilter("동물")}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    categoryFilter === "동물"
                      ? "bg-primary text-white"
                      : "bg-white text-gray-600 border border-gray-200"
                  }`}
                >
                  🐾 동물
                </button>
                <button
                  onClick={() => setCategoryFilter("어류")}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    categoryFilter === "어류"
                      ? "bg-primary text-white"
                      : "bg-white text-gray-600 border border-gray-200"
                  }`}
                >
                  🐟 어류
                </button>
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">상태</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    statusFilter === "all"
                      ? "bg-gray-800 text-white"
                      : "bg-white text-gray-600 border border-gray-200"
                  }`}
                >
                  전체
                </button>
                <button
                  onClick={() => setStatusFilter("pending")}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    statusFilter === "pending"
                      ? "bg-amber-500 text-white"
                      : "bg-white text-gray-600 border border-gray-200"
                  }`}
                >
                  검토 중
                </button>
                <button
                  onClick={() => setStatusFilter("confirmed")}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    statusFilter === "confirmed"
                      ? "bg-emerald-500 text-white"
                      : "bg-white text-gray-600 border border-gray-200"
                  }`}
                >
                  승인
                </button>
                <button
                  onClick={() => setStatusFilter("rejected")}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    statusFilter === "rejected"
                      ? "bg-red-500 text-white"
                      : "bg-white text-gray-600 border border-gray-200"
                  }`}
                >
                  반려
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-lg mx-auto">
        {/* Map Container */}
        <div className="relative h-[60vh] overflow-hidden z-0">
          {/* Naver Map */}
          <div ref={mapRef} className="w-full h-full z-0" />

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg">
            <p className="text-xs font-semibold text-gray-700 mb-2">범례</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 bg-amber-500 rounded-full" />
                <span className="text-gray-600">검토 중</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                <span className="text-gray-600">승인</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span className="text-gray-600">반려</span>
              </div>
            </div>
          </div>

          {/* Count Badge */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
            <p className="text-sm font-bold text-gray-900">
              신고 {filteredReports.length}건
            </p>
          </div>
        </div>

        {/* Report List */}
        <div className="px-4 py-6 space-y-3">
          <h2 className="text-lg font-bold text-gray-900">신고 목록</h2>

          {filteredReports.length === 0 ? (
            <div className="bg-white rounded-xl p-8 border border-gray-200 text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">신고 내역이 없습니다</p>
              <p className="text-sm text-gray-500 mt-1">
                필터를 변경해보세요
              </p>
            </div>
          ) : (
            filteredReports.map((report) => {
              const species = speciesData.find(
                (s) => s.id === report.species_id
              );
              const user = usersData.find((u) => u.user_id === report.user_id);

              return (
                <button
                  key={report.report_id}
                  onClick={() => setSelectedReport(report.report_id)}
                  className="w-full bg-white rounded-xl p-4 border border-gray-200 hover:border-primary hover:shadow-md transition-all text-left"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-12 h-12 rounded-full ${
                        statusColors[report.status as keyof typeof statusColors]
                      } flex items-center justify-center text-white text-xl flex-shrink-0`}
                    >
                      {categoryEmoji[species?.category as keyof typeof categoryEmoji]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900">
                          {species?.name_ko}
                        </h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold text-white ${
                            statusColors[report.status as keyof typeof statusColors]
                          }`}
                        >
                          {statusLabels[report.status as keyof typeof statusLabels]}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {report.location.address}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span>{user?.nickname}</span>
                        <span>•</span>
                        <span>
                          {new Date(report.created_at).toLocaleDateString(
                            "ko-KR"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedReportData && selectedSpecies && selectedUser && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end"
          onClick={() => setSelectedReport(null)}
        >
          <div
            className="bg-white rounded-t-3xl w-full max-w-lg mx-auto p-6 space-y-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedSpecies.name_ko}
                </h2>
                <p className="text-gray-600 italic text-sm">
                  {selectedSpecies.name_en}
                </p>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-2">
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold text-white ${
                  statusColors[selectedReportData.status as keyof typeof statusColors]
                }`}
              >
                {statusLabels[selectedReportData.status as keyof typeof statusLabels]}
              </span>
              <span className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                {selectedSpecies.category}
              </span>
            </div>

            {/* Reporter Info */}
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">신고자</p>
              <p className="font-semibold text-gray-900">
                {selectedUser.nickname}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(selectedReportData.created_at).toLocaleString(
                  "ko-KR"
                )}
              </p>
            </div>

            {/* Location */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">발견 위치</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedReportData.location.address}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    위도: {selectedReportData.location.lat}, 경도:{" "}
                    {selectedReportData.location.lng}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            {selectedReportData.description && (
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-2">상세 설명</p>
                <p className="text-sm text-gray-800">
                  {selectedReportData.description}
                </p>
              </div>
            )}

            {/* Species Info */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <h3 className="font-bold text-blue-900 mb-2">종 정보</h3>
              <p className="text-sm text-blue-800 leading-relaxed">
                {selectedSpecies.description}
              </p>
              <p className="text-sm text-blue-700 mt-2">
                <strong>원산지:</strong> {selectedSpecies.origin}
              </p>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
}
