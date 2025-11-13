"use client";

import { Camera, Trophy, Target, TrendingUp, Award } from "lucide-react";
import Link from "next/link";
import { MissionCard } from "@/components/features/mission-card";
import usersData from "@/data/users.json";
import missionsData from "@/data/missions.json";
import reportsData from "@/data/reports.json";

export default function HomePage() {
  // Mock current user (첫 번째 유저를 현재 유저로 가정)
  const currentUser = usersData[0];

  // 활성 미션 (최대 3개)
  const activeMissions = missionsData.filter(m => m.status === "active").slice(0, 3);

  // 최근 승인된 신고 수
  const recentConfirmed = reportsData.filter(r => r.status === "confirmed").length;

  return (
    <div className="min-h-screen">
      {/* Hero Banner - 오늘의 미션 */}
      <section className="bg-gradient-to-br from-primary via-emerald-600 to-emerald-700 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-5 w-5" />
            <span className="text-sm font-medium opacity-90">오늘의 추천 미션</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">{activeMissions[0]?.title}</h2>
          <p className="text-sm opacity-90">{activeMissions[0]?.description}</p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white/20 rounded-full h-3 overflow-hidden backdrop-blur-sm">
          <div
            className="bg-white h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.min((activeMissions[0]?.current_progress || 0) / (activeMissions[0]?.progress_goal || 1) * 100, 100)}%`
            }}
          />
        </div>
        <div className="flex items-center justify-between mt-2 text-sm">
          <span className="opacity-90">
            {activeMissions[0]?.current_progress || 0}/{activeMissions[0]?.progress_goal || 0}
          </span>
          <span className="font-semibold">
            {Math.round((activeMissions[0]?.current_progress || 0) / (activeMissions[0]?.progress_goal || 1) * 100)}%
          </span>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="px-4 py-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          내 활동 요약
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {/* Total Points */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-accent rounded-lg">
                <Trophy className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm text-gray-600 font-medium">포인트</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-accent">{currentUser.total_points.toLocaleString()}</span>
              <span className="text-sm text-gray-600">pt</span>
            </div>
          </div>

          {/* Rank */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-primary rounded-lg">
                <Award className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm text-gray-600 font-medium">랭킹</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-primary">{currentUser.rank}</span>
              <span className="text-sm text-gray-600">위</span>
            </div>
          </div>

          {/* Total Reports */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <span className="text-sm text-gray-600 mb-1 block">총 신고</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-foreground">{currentUser.reports_count}</span>
              <span className="text-sm text-gray-600">건</span>
            </div>
          </div>

          {/* Confirmed Reports */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <span className="text-sm text-gray-600 mb-1 block">승인됨</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-emerald-600">{currentUser.confirmed_count}</span>
              <span className="text-sm text-gray-600">건</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Button - 신고하기 */}
      <section className="px-4 pb-4">
        <Link
          href="/report"
          className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-primary to-emerald-600 text-white rounded-xl py-4 font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Camera className="h-6 w-6" />
          생태교란종 신고하기
        </Link>
      </section>

      {/* Active Missions */}
      <section className="px-4 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            진행 중인 미션
          </h3>
          <Link
            href="/missions"
            className="text-sm text-primary font-medium hover:underline"
          >
            전체보기
          </Link>
        </div>
        <div className="space-y-3">
          {activeMissions.map((mission) => (
            <MissionCard
              key={mission.mission_id}
              title={mission.title}
              description={mission.description}
              progress={mission.current_progress}
              goal={mission.progress_goal}
              reward={mission.reward_points}
              difficulty={mission.difficulty as "easy" | "medium" | "hard"}
              endDate={mission.end_date}
            />
          ))}
        </div>
      </section>

      {/* Recent Activity Stats */}
      <section className="px-4 pb-8">
        <h3 className="text-lg font-bold mb-4">최근 활동</h3>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">전체 승인된 신고</span>
            <span className="text-2xl font-bold text-primary">{recentConfirmed}</span>
          </div>
          <p className="text-xs text-gray-500">
            여러분의 참여로 생태계가 더 건강해지고 있습니다!
          </p>
        </div>
      </section>
    </div>
  );
}
