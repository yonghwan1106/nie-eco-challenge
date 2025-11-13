"use client";

import { useState } from "react";
import {
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  MapPin,
  User,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import reportsData from "@/data/reports.json";
import speciesData from "@/data/species.json";
import usersData from "@/data/users.json";

type StatusFilter = "all" | "pending" | "confirmed" | "rejected";

export default function AdminPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("pending");
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  // 검색 및 필터링
  const filteredReports = reportsData.filter((report) => {
    const species = speciesData.find((s) => s.id === report.species_id);
    const user = usersData.find((u) => u.user_id === report.user_id);

    // 상태 필터
    if (statusFilter !== "all" && report.status !== statusFilter) {
      return false;
    }

    // 검색어 필터
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        species?.name_ko.toLowerCase().includes(query) ||
        user?.nickname.toLowerCase().includes(query) ||
        report.location.address.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // 통계
  const stats = {
    total: reportsData.length,
    pending: reportsData.filter((r) => r.status === "pending").length,
    confirmed: reportsData.filter((r) => r.status === "confirmed").length,
    rejected: reportsData.filter((r) => r.status === "rejected").length,
  };

  // 선택된 신고 데이터
  const selectedReportData = selectedReport
    ? reportsData.find((r) => r.report_id === selectedReport)
    : null;
  const selectedSpecies = selectedReportData
    ? speciesData.find((s) => s.id === selectedReportData.species_id)
    : null;
  const selectedUser = selectedReportData
    ? usersData.find((u) => u.user_id === selectedReportData.user_id)
    : null;

  // 상태 업데이트 시뮬레이션
  const handleApprove = () => {
    alert("신고가 승인되었습니다!");
    setSelectedReport(null);
  };

  const handleReject = () => {
    alert("신고가 반려되었습니다.");
    setSelectedReport(null);
  };

  return (
    <div className="min-h-screen pb-24 bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-emerald-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-white/20 rounded-xl">
              <Shield className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">관리자 대시보드</h1>
              <p className="text-emerald-100 text-sm">
                생태교란종 신고 검증 시스템
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-emerald-100 text-sm mb-1">전체 신고</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
            <div className="bg-amber-500/20 backdrop-blur-sm rounded-xl p-4 border border-amber-400/30">
              <p className="text-amber-100 text-sm mb-1">검토 대기</p>
              <p className="text-3xl font-bold">{stats.pending}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-emerald-100 text-sm mb-1">승인</p>
              <p className="text-3xl font-bold">{stats.confirmed}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-emerald-100 text-sm mb-1">반려</p>
              <p className="text-3xl font-bold">{stats.rejected}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Search & Filter */}
        <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="종명, 신고자, 위치로 검색..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2">
              <Filter className="h-5 w-5" />
              <span className="hidden md:inline">필터</span>
            </button>
          </div>

          {/* Status Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex-shrink-0 ${
                statusFilter === "all"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              전체 ({reportsData.length})
            </button>
            <button
              onClick={() => setStatusFilter("pending")}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex-shrink-0 ${
                statusFilter === "pending"
                  ? "bg-amber-500 text-white"
                  : "bg-amber-50 text-amber-700 hover:bg-amber-100"
              }`}
            >
              검토 대기 ({stats.pending})
            </button>
            <button
              onClick={() => setStatusFilter("confirmed")}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex-shrink-0 ${
                statusFilter === "confirmed"
                  ? "bg-emerald-500 text-white"
                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              }`}
            >
              승인 ({stats.confirmed})
            </button>
            <button
              onClick={() => setStatusFilter("rejected")}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex-shrink-0 ${
                statusFilter === "rejected"
                  ? "bg-red-500 text-white"
                  : "bg-red-50 text-red-700 hover:bg-red-100"
              }`}
            >
              반려 ({stats.rejected})
            </button>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    신고 ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    종명
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    신고자
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    위치
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    날짜
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    상태
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center">
                      <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 font-medium">
                        검색 결과가 없습니다
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredReports.map((report) => {
                    const species = speciesData.find(
                      (s) => s.id === report.species_id
                    );
                    const user = usersData.find(
                      (u) => u.user_id === report.user_id
                    );

                    const statusColors = {
                      pending: "bg-amber-100 text-amber-700",
                      confirmed: "bg-emerald-100 text-emerald-700",
                      rejected: "bg-red-100 text-red-700",
                    };

                    const statusLabels = {
                      pending: "검토 중",
                      confirmed: "승인",
                      rejected: "반려",
                    };

                    return (
                      <tr
                        key={report.report_id}
                        className="hover:bg-gray-50 transition-all"
                      >
                        <td className="px-4 py-4 text-sm font-mono text-gray-600">
                          {report.report_id}
                        </td>
                        <td className="px-4 py-4">
                          <p className="font-semibold text-gray-900">
                            {species?.name_ko}
                          </p>
                          <p className="text-sm text-gray-500">
                            {species?.category}
                          </p>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700">
                          {user?.nickname}
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm text-gray-700 max-w-xs truncate">
                            {report.location.address}
                          </p>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {new Date(report.report_date).toLocaleDateString(
                            "ko-KR"
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              statusColors[report.status]
                            }`}
                          >
                            {statusLabels[report.status]}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => setSelectedReport(report.report_id)}
                            className="text-primary hover:text-primary-dark font-semibold text-sm"
                          >
                            상세보기
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedReportData && selectedSpecies && selectedUser && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedReport(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">신고 검증</h2>
                <p className="text-sm text-gray-500">
                  ID: {selectedReportData.report_id}
                </p>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Species Info */}
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-5 border border-emerald-200">
                <h3 className="font-bold text-emerald-900 text-lg mb-2">
                  {selectedSpecies.name_ko}
                </h3>
                <p className="text-emerald-700 italic text-sm mb-3">
                  {selectedSpecies.name_en} ({selectedSpecies.scientific_name})
                </p>
                <p className="text-sm text-emerald-800 leading-relaxed">
                  {selectedSpecies.description}
                </p>
                <div className="mt-3 flex gap-2">
                  <span className="px-3 py-1 bg-white/60 rounded-full text-xs font-semibold text-emerald-900">
                    {selectedSpecies.category}
                  </span>
                  <span className="px-3 py-1 bg-white/60 rounded-full text-xs font-semibold text-emerald-900">
                    원산지: {selectedSpecies.origin}
                  </span>
                </div>
              </div>

              {/* Reporter */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-5 w-5 text-gray-600" />
                    <p className="font-semibold text-gray-700">신고자</p>
                  </div>
                  <p className="font-bold text-gray-900">
                    {selectedUser.nickname}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    랭킹 #{selectedUser.rank} · {selectedUser.total_points}P
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-5 w-5 text-gray-600" />
                    <p className="font-semibold text-gray-700">신고 일시</p>
                  </div>
                  <p className="font-bold text-gray-900">
                    {new Date(selectedReportData.report_date).toLocaleString(
                      "ko-KR"
                    )}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-700 mb-1">
                      발견 위치
                    </p>
                    <p className="font-medium text-gray-900">
                      {selectedReportData.location.address}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      위도: {selectedReportData.location.lat}, 경도:{" "}
                      {selectedReportData.location.lng}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedReportData.description && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="font-semibold text-gray-700 mb-2">상세 설명</p>
                  <p className="text-gray-800 leading-relaxed">
                    {selectedReportData.description}
                  </p>
                </div>
              )}

              {/* Current Status */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <p className="font-semibold text-blue-900 mb-2">현재 상태</p>
                <div className="flex items-center gap-2">
                  {selectedReportData.status === "pending" && (
                    <>
                      <Clock className="h-5 w-5 text-amber-600" />
                      <span className="font-bold text-amber-700">
                        검토 대기 중
                      </span>
                    </>
                  )}
                  {selectedReportData.status === "confirmed" && (
                    <>
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                      <span className="font-bold text-emerald-700">
                        승인됨
                      </span>
                    </>
                  )}
                  {selectedReportData.status === "rejected" && (
                    <>
                      <XCircle className="h-5 w-5 text-red-600" />
                      <span className="font-bold text-red-700">반려됨</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            {selectedReportData.status === "pending" && (
              <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3">
                <button
                  onClick={handleReject}
                  className="flex-1 py-3 px-4 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <XCircle className="h-5 w-5" />
                  반려
                </button>
                <button
                  onClick={handleApprove}
                  className="flex-1 py-3 px-4 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <CheckCircle className="h-5 w-5" />
                  승인
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
