"use client";

import { useState, useEffect, useRef } from "react";
import Script from "next/script";
import { MapPin, CheckCircle, XCircle, Clock } from "lucide-react";
import reportsData from "@/data/reports.json";

declare global {
  interface Window {
    naver: any;
  }
}

type StatusFilter = "all" | "pending" | "confirmed" | "rejected";

export function MapContainer() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedReport, setSelectedReport] = useState<any>(null);

  // Map initialization
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || !window.naver || !window.naver.maps || map) return;

    try {
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
    } catch (error) {
      console.error("Failed to initialize Naver Map:", error);
    }
  }, [isMapLoaded, map]);

  // Add markers
  useEffect(() => {
    if (!map || !window.naver || !window.naver.maps) return;

    // Clear existing markers
    markers.forEach((marker) => marker.setMap(null));

    // Filter reports
    const filteredReports = reportsData.filter((report) => {
      if (statusFilter === "all") return true;
      return report.status === statusFilter;
    });

    // Create new markers
    const newMarkers = filteredReports.map((report) => {
      const markerOptions: any = {
        position: new window.naver.maps.LatLng(
          report.location.lat,
          report.location.lng
        ),
        map: map,
        icon: {
          content: `
            <div style="
              width: 32px;
              height: 32px;
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              background-color: ${
                report.status === "confirmed"
                  ? "#10B981"
                  : report.status === "rejected"
                  ? "#EF4444"
                  : "#F59E0B"
              };
            ">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
          `,
          anchor: new window.naver.maps.Point(16, 32),
        },
      };

      const marker = new window.naver.maps.Marker(markerOptions);

      // Add click event
      window.naver.maps.Event.addListener(marker, "click", () => {
        setSelectedReport(report);
      });

      return marker;
    });

    setMarkers(newMarkers);
  }, [map, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "text-emerald-600 bg-emerald-50";
      case "rejected":
        return "text-red-600 bg-red-50";
      default:
        return "text-amber-600 bg-amber-50";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "승인됨";
      case "rejected":
        return "반려됨";
      default:
        return "검토 중";
    }
  };

  return (
    <>
      <Script
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_KEY_ID}`}
        onReady={() => setIsMapLoaded(true)}
        strategy="afterInteractive"
      />

      {/* Map Container */}
      <div className="relative h-[60vh] overflow-hidden">
        <div ref={mapRef} className="w-full h-full" />

        {/* Loading State */}
        {!isMapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">지도를 불러오는 중...</p>
            </div>
          </div>
        )}

        {/* Filter Buttons */}
        <div className="absolute top-4 left-4 right-4 flex gap-2 z-10">
          <button
            onClick={() => setStatusFilter("all")}
            className={`flex-1 py-2 px-3 rounded-lg font-semibold text-sm shadow-lg transition-all ${
              statusFilter === "all"
                ? "bg-primary text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            전체 ({reportsData.length})
          </button>
          <button
            onClick={() => setStatusFilter("pending")}
            className={`flex-1 py-2 px-3 rounded-lg font-semibold text-sm shadow-lg transition-all ${
              statusFilter === "pending"
                ? "bg-amber-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            검토 중
          </button>
          <button
            onClick={() => setStatusFilter("confirmed")}
            className={`flex-1 py-2 px-3 rounded-lg font-semibold text-sm shadow-lg transition-all ${
              statusFilter === "confirmed"
                ? "bg-emerald-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            승인
          </button>
        </div>
      </div>

      {/* Report Details Modal */}
      {selectedReport && (
        <div
          className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-4"
          onClick={() => setSelectedReport(null)}
        >
          <div
            className="bg-white rounded-t-2xl max-w-lg w-full p-6 space-y-4 max-h-[70vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-bold">{selectedReport.species_name}</h3>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                selectedReport.status
              )}`}
            >
              {getStatusIcon(selectedReport.status)}
              {getStatusText(selectedReport.status)}
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500 mb-1">위치</p>
                <p className="font-medium">{selectedReport.location.address}</p>
              </div>

              <div>
                <p className="text-gray-500 mb-1">신고 일시</p>
                <p className="font-medium">
                  {new Date(selectedReport.reported_at).toLocaleString("ko-KR")}
                </p>
              </div>

              {selectedReport.notes && (
                <div>
                  <p className="text-gray-500 mb-1">메모</p>
                  <p className="font-medium">{selectedReport.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
