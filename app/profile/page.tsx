"use client";

import {
  ArrowLeft,
  Trophy,
  Camera,
  CheckCircle2,
  Award,
  TrendingUp,
  Calendar,
  Target,
  Settings,
} from "lucide-react";
import Link from "next/link";
import usersData from "@/data/users.json";
import reportsData from "@/data/reports.json";
import speciesData from "@/data/species.json";

export default function ProfilePage() {
  // Mock: 현재 로그인한 사용자 (user001)
  const currentUser = usersData[0];

  // 사용자의 신고 내역
  const userReports = reportsData.filter(
    (r) => r.user_id === currentUser.user_id
  );

  // 최근 활동 (최근 3건)
  const recentReports = userReports
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 3);

  // 배지 정보 매핑
  const badgeInfo: Record<
    string,
    { label: string; description: string; icon: any; color: string }
  > = {
    first_report: {
      label: "첫 신고",
      description: "첫 신고를 완료했습니다",
      icon: Camera,
      color: "bg-blue-500",
    },
    species_hunter: {
      label: "종 수집가",
      description: "4종 이상 발견",
      icon: Target,
      color: "bg-emerald-500",
    },
    top_contributor: {
      label: "최고 기여자",
      description: "20건 이상 신고",
      icon: Trophy,
      color: "bg-amber-500",
    },
  };

  // 승인률 계산
  const approvalRate =
    userReports.length > 0
      ? Math.round((currentUser.confirmed_count / userReports.length) * 100)
      : 0;

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white border-b sticky top-16 z-30">
        <div className="flex items-center justify-between px-4 py-4 max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-lg font-bold">마이페이지</h1>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Settings className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="px-4 py-6 max-w-lg mx-auto space-y-6">
        {/* Profile Card */}
        <div className="bg-gradient-to-br from-primary via-emerald-600 to-emerald-700 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                {currentUser.nickname.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold">{currentUser.nickname}</h2>
                <p className="text-emerald-100 text-sm">
                  시민 과학자 #{currentUser.user_id.replace("user", "")}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-emerald-100 text-sm">랭킹</p>
              <p className="text-3xl font-bold">#{currentUser.rank}</p>
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-5 w-5" />
              <span className="font-semibold">누적 포인트</span>
            </div>
            <p className="text-4xl font-bold">
              {currentUser.total_points.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
            <Camera className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {currentUser.reports_count}
            </p>
            <p className="text-xs text-gray-600">총 신고</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
            <CheckCircle2 className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {currentUser.confirmed_count}
            </p>
            <p className="text-xs text-gray-600">승인됨</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
            <TrendingUp className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{approvalRate}%</p>
            <p className="text-xs text-gray-600">승인률</p>
          </div>
        </div>

        {/* Badges Section */}
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-5 w-5 text-amber-600" />
            <h3 className="font-bold text-gray-900">획득 배지</h3>
            <span className="ml-auto text-sm text-gray-500">
              {currentUser.badges.length}개
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {currentUser.badges.map((badgeId) => {
              const badge = badgeInfo[badgeId];
              const Icon = badge.icon;
              return (
                <div
                  key={badgeId}
                  className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
                >
                  <div
                    className={`w-12 h-12 ${badge.color} rounded-full flex items-center justify-center`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-xs font-semibold text-center text-gray-700">
                    {badge.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Collection Progress */}
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-gray-900">에코 도감</h3>
            </div>
            <Link
              href="/collection"
              className="text-sm text-primary font-semibold hover:underline"
            >
              전체보기
            </Link>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">수집 진행률</p>
                <p className="font-bold text-primary">
                  {currentUser.collected_species.length}/{speciesData.length}
                </p>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-emerald-600 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      (currentUser.collected_species.length /
                        speciesData.length) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              {speciesData.map((species) => {
                const isCollected = currentUser.collected_species.includes(
                  species.id
                );
                return (
                  <div
                    key={species.id}
                    className={`flex-1 aspect-square rounded-lg flex items-center justify-center text-xs font-medium ${
                      isCollected
                        ? "bg-primary/10 text-primary border-2 border-primary"
                        : "bg-gray-100 text-gray-400 border-2 border-gray-200"
                    }`}
                  >
                    {isCollected ? "✓" : "?"}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-gray-600" />
            <h3 className="font-bold text-gray-900">최근 활동</h3>
          </div>

          <div className="space-y-3">
            {recentReports.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                아직 신고 내역이 없습니다
              </p>
            ) : (
              recentReports.map((report) => {
                const species = speciesData.find(
                  (s) => s.id === report.species_id
                );
                const statusColors = {
                  pending: "bg-amber-100 text-amber-700 border-amber-200",
                  confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
                  rejected: "bg-red-100 text-red-700 border-red-200",
                };
                const statusLabels = {
                  pending: "검토 중",
                  confirmed: "승인",
                  rejected: "반려",
                };

                return (
                  <div
                    key={report.report_id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">
                        {species?.name_ko || "알 수 없음"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(report.created_at).toLocaleDateString(
                          "ko-KR"
                        )}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                        statusColors[report.status as keyof typeof statusColors]
                      }`}
                    >
                      {statusLabels[report.status as keyof typeof statusLabels]}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/report"
            className="bg-primary text-white rounded-xl p-4 text-center font-semibold hover:bg-primary-dark transition-all shadow-md hover:shadow-lg"
          >
            <Camera className="h-6 w-6 mx-auto mb-2" />
            신고하기
          </Link>
          <Link
            href="/missions"
            className="bg-white text-gray-900 border-2 border-gray-200 rounded-xl p-4 text-center font-semibold hover:bg-gray-50 transition-all"
          >
            <Target className="h-6 w-6 mx-auto mb-2" />
            미션 보기
          </Link>
        </div>
      </div>
    </div>
  );
}
