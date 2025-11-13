"use client";

import { useState } from "react";
import { ArrowLeft, Trophy, Clock, Target } from "lucide-react";
import Link from "next/link";
import missionsData from "@/data/missions.json";
import { MissionCard } from "@/components/features/mission-card";

type FilterType = "all" | "active" | "completed";
type DifficultyFilter = "all" | "easy" | "medium" | "hard";

export default function MissionsPage() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [difficultyFilter, setDifficultyFilter] =
    useState<DifficultyFilter>("all");

  // Mock: 실제로는 사용자의 완료 미션을 서버에서 가져와야 함
  const completedMissionIds = ["m001"]; // 가시박 찾기 미션 완료 상태

  const filteredMissions = missionsData.filter((mission) => {
    const isCompleted = completedMissionIds.includes(mission.mission_id);

    // 상태 필터
    if (filter === "active" && isCompleted) return false;
    if (filter === "completed" && !isCompleted) return false;

    // 난이도 필터
    if (
      difficultyFilter !== "all" &&
      mission.difficulty !== difficultyFilter
    ) {
      return false;
    }

    return true;
  });

  const activeMissionsCount = missionsData.filter(
    (m) => !completedMissionIds.includes(m.mission_id)
  ).length;
  const completedMissionsCount = completedMissionIds.length;

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white border-b sticky top-16 z-30">
        <div className="flex items-center gap-3 px-4 py-4 max-w-lg mx-auto">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-bold">미션</h1>
        </div>
      </div>

      <div className="px-4 py-6 max-w-lg mx-auto space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-5 w-5 text-emerald-600" />
              <p className="text-sm font-medium text-emerald-900">진행 중</p>
            </div>
            <p className="text-3xl font-bold text-emerald-700">
              {activeMissionsCount}
            </p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-5 w-5 text-amber-600" />
              <p className="text-sm font-medium text-amber-900">완료</p>
            </div>
            <p className="text-3xl font-bold text-amber-700">
              {completedMissionsCount}
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl p-2 border border-gray-200 flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-all ${
              filter === "all"
                ? "bg-primary text-white shadow-md"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            전체
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-all ${
              filter === "active"
                ? "bg-primary text-white shadow-md"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            진행 중
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-all ${
              filter === "completed"
                ? "bg-primary text-white shadow-md"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            완료
          </button>
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <p className="text-sm font-semibold text-gray-700 flex-shrink-0">
            난이도:
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setDifficultyFilter("all")}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex-shrink-0 ${
                difficultyFilter === "all"
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setDifficultyFilter("easy")}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex-shrink-0 ${
                difficultyFilter === "easy"
                  ? "bg-sky-500 text-white"
                  : "bg-sky-100 text-sky-700 hover:bg-sky-200"
              }`}
            >
              쉬움
            </button>
            <button
              onClick={() => setDifficultyFilter("medium")}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex-shrink-0 ${
                difficultyFilter === "medium"
                  ? "bg-orange-500 text-white"
                  : "bg-orange-100 text-orange-700 hover:bg-orange-200"
              }`}
            >
              보통
            </button>
            <button
              onClick={() => setDifficultyFilter("hard")}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex-shrink-0 ${
                difficultyFilter === "hard"
                  ? "bg-purple-500 text-white"
                  : "bg-purple-100 text-purple-700 hover:bg-purple-200"
              }`}
            >
              어려움
            </button>
          </div>
        </div>

        {/* Missions List */}
        <div className="space-y-4">
          {filteredMissions.length === 0 ? (
            <div className="bg-white rounded-xl p-8 border border-gray-200 text-center">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">
                해당하는 미션이 없습니다
              </p>
              <p className="text-sm text-gray-500 mt-1">
                필터를 변경해보세요
              </p>
            </div>
          ) : (
            filteredMissions.map((mission) => {
              const isCompleted = completedMissionIds.includes(
                mission.mission_id
              );
              // 완료된 미션은 100% 진행률, 진행 중인 미션은 30% (mock data)
              const progress = isCompleted ? 100 : 30;

              return (
                <div key={mission.mission_id} className="relative">
                  {isCompleted && (
                    <div className="absolute top-3 right-3 z-10 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1">
                      <Trophy className="h-3 w-3" />
                      완료
                    </div>
                  )}
                  <MissionCard
                    title={mission.title}
                    description={mission.description}
                    rewardPoints={mission.reward_points}
                    difficulty={
                      mission.difficulty as "easy" | "medium" | "hard"
                    }
                    progress={progress}
                    deadline={mission.end_date}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Info Card */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
            <Target className="h-5 w-5" />
            미션 팁
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 쉬운 미션부터 도전해서 포인트를 모으세요</li>
            <li>• 주간 미션은 매주 월요일에 새로 시작됩니다</li>
            <li>• 미션 달성 시 배지를 획득할 수 있습니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
