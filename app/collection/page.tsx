"use client";

import { useState } from "react";
import { ArrowLeft, Lock, CheckCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";
import speciesData from "@/data/species.json";
import usersData from "@/data/users.json";

type FilterCategory = "all" | "식물" | "동물" | "어류";

export default function CollectionPage() {
  const [filter, setFilter] = useState<FilterCategory>("all");
  const [selectedSpecies, setSelectedSpecies] = useState<string | null>(null);

  // Mock: 현재 로그인한 사용자
  const currentUser = usersData[0];

  // 카테고리 필터링
  const filteredSpecies =
    filter === "all"
      ? speciesData
      : speciesData.filter((s) => s.category === filter);

  // 수집된 종 개수
  const collectedCount = speciesData.filter((s) =>
    currentUser.collected_species.includes(s.id)
  ).length;
  const collectionRate = Math.round((collectedCount / speciesData.length) * 100);

  // 선택된 종 정보
  const selectedSpeciesData = selectedSpecies
    ? speciesData.find((s) => s.id === selectedSpecies)
    : null;

  // 위협 수준별 색상
  const threatLevelColors = {
    high: "bg-red-500",
    medium: "bg-orange-500",
    low: "bg-yellow-500",
  };

  const threatLevelLabels = {
    high: "높음",
    medium: "보통",
    low: "낮음",
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white border-b sticky top-16 z-30">
        <div className="flex items-center gap-3 px-4 py-4 max-w-lg mx-auto">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-bold">에코 도감</h1>
        </div>
      </div>

      <div className="px-4 py-6 max-w-lg mx-auto space-y-6">
        {/* Progress Card */}
        <div className="bg-gradient-to-br from-primary via-emerald-600 to-emerald-700 text-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-2">수집 진행률</h2>
          <div className="flex items-end gap-2 mb-4">
            <p className="text-5xl font-bold">{collectionRate}%</p>
            <p className="text-emerald-100 mb-2">
              {collectedCount}/{speciesData.length} 종
            </p>
          </div>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${collectionRate}%` }}
            />
          </div>
          <p className="text-emerald-100 text-sm mt-3">
            생태교란종을 신고하고 도감을 완성하세요!
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-full font-semibold text-sm transition-all flex-shrink-0 ${
              filter === "all"
                ? "bg-primary text-white shadow-md"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            전체 ({speciesData.length})
          </button>
          <button
            onClick={() => setFilter("식물")}
            className={`px-4 py-2 rounded-full font-semibold text-sm transition-all flex-shrink-0 ${
              filter === "식물"
                ? "bg-primary text-white shadow-md"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            식물 ({speciesData.filter((s) => s.category === "식물").length})
          </button>
          <button
            onClick={() => setFilter("동물")}
            className={`px-4 py-2 rounded-full font-semibold text-sm transition-all flex-shrink-0 ${
              filter === "동물"
                ? "bg-primary text-white shadow-md"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            동물 ({speciesData.filter((s) => s.category === "동물").length})
          </button>
          <button
            onClick={() => setFilter("어류")}
            className={`px-4 py-2 rounded-full font-semibold text-sm transition-all flex-shrink-0 ${
              filter === "어류"
                ? "bg-primary text-white shadow-md"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            어류 ({speciesData.filter((s) => s.category === "어류").length})
          </button>
        </div>

        {/* Species Grid */}
        <div className="grid grid-cols-2 gap-4">
          {filteredSpecies.map((species) => {
            const isCollected = currentUser.collected_species.includes(
              species.id
            );

            return (
              <button
                key={species.id}
                onClick={() => setSelectedSpecies(species.id)}
                className={`relative aspect-square rounded-xl border-2 overflow-hidden transition-all hover:scale-105 ${
                  isCollected
                    ? "border-primary bg-gradient-to-br from-emerald-50 to-emerald-100"
                    : "border-gray-200 bg-gray-100"
                }`}
              >
                {isCollected ? (
                  <div className="p-4 h-full flex flex-col items-center justify-center">
                    <div className="text-4xl mb-2">
                      {species.category === "식물"
                        ? "🌿"
                        : species.category === "동물"
                        ? "🐾"
                        : "🐟"}
                    </div>
                    <p className="font-bold text-gray-900 text-sm text-center">
                      {species.name_ko}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {species.name_en}
                    </p>
                    <div className="absolute top-2 right-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                ) : (
                  <div className="p-4 h-full flex flex-col items-center justify-center">
                    <Lock className="h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-sm font-semibold text-gray-500">미발견</p>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            도감 수집 팁
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 생태교란종을 신고하면 도감에 자동 등록됩니다</li>
            <li>• 모든 종을 수집하면 특별 배지를 획득합니다</li>
            <li>• 미션을 완료하면 수집이 더 빨라집니다</li>
          </ul>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedSpeciesData && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end"
          onClick={() => setSelectedSpecies(null)}
        >
          <div
            className="bg-white rounded-t-3xl w-full max-w-lg mx-auto p-6 space-y-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedSpeciesData.name_ko}
                </h2>
                <p className="text-gray-600 italic">
                  {selectedSpeciesData.name_en}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedSpeciesData.scientific_name}
                </p>
              </div>
              <button
                onClick={() => setSelectedSpecies(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                ×
              </button>
            </div>

            {/* Status Badges */}
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full">
                {selectedSpeciesData.category}
              </span>
              <span
                className={`px-3 py-1 text-white text-sm font-semibold rounded-full ${
                  threatLevelColors[selectedSpeciesData.threat_level]
                }`}
              >
                위협도: {threatLevelLabels[selectedSpeciesData.threat_level]}
              </span>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="font-bold text-gray-900">설명</h3>
              <p className="text-gray-700 leading-relaxed">
                {selectedSpeciesData.description}
              </p>
            </div>

            {/* Origin */}
            <div className="space-y-2">
              <h3 className="font-bold text-gray-900">원산지</h3>
              <p className="text-gray-700">{selectedSpeciesData.origin}</p>
            </div>

            {/* Collection Status */}
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
              {currentUser.collected_species.includes(
                selectedSpeciesData.id
              ) ? (
                <div className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-semibold">수집 완료!</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-600">
                  <Lock className="h-5 w-5" />
                  <span className="font-semibold">
                    신고하면 도감에 등록됩니다
                  </span>
                </div>
              )}
            </div>

            {/* Action Button */}
            <Link
              href="/report"
              className="block w-full py-3 bg-primary text-white rounded-xl font-semibold text-center hover:bg-primary-dark transition-all shadow-md hover:shadow-lg"
              onClick={() => setSelectedSpecies(null)}
            >
              이 종 신고하기
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
