"use client";

import { useState } from "react";
import { Camera, MapPin, Sparkles, ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import speciesData from "@/data/species.json";

type Step = "upload" | "analyzing" | "result" | "confirm" | "success";

export default function ReportPage() {
  const [step, setStep] = useState<Step>("upload");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<{
    species_name: string;
    confidence: number;
  } | null>(null);
  const [location] = useState({
    lat: 36.5040,
    lng: 127.2621,
    address: "충청남도 서천군 마서면 금강로 1210",
  });
  const [description, setDescription] = useState("");

  // 이미지 선택 시뮬레이션
  const handleImageSelect = () => {
    // 실제로는 파일 입력을 받지만, 여기서는 시뮬레이션
    const demoImage = "/images/species/gasibak.jpg";
    setSelectedImage(demoImage);
    setStep("analyzing");

    // AI 분석 시뮬레이션 (2초 후)
    setTimeout(() => {
      setAiResult({
        species_name: "가시박",
        confidence: 0.95,
      });
      setStep("result");
    }, 2000);
  };

  // AI 결과 확인
  const handleConfirmAI = () => {
    setStep("confirm");
  };

  // 최종 제출
  const handleSubmit = () => {
    setStep("success");
    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
  };

  // 다시 선택
  const handleReselect = () => {
    setSelectedImage(null);
    setAiResult(null);
    setStep("upload");
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white border-b sticky top-16 z-30">
        <div className="flex items-center gap-3 px-4 py-4 max-w-lg mx-auto">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-bold">생태교란종 신고하기</h1>
        </div>
      </div>

      <div className="px-4 py-6 max-w-lg mx-auto">
        {/* Step 1: 이미지 업로드 */}
        {step === "upload" && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-bold">사진을 촬영하거나 선택하세요</h2>
              <p className="text-sm text-gray-600">
                AI가 자동으로 생태교란종을 식별해드립니다
              </p>
            </div>

            <button
              onClick={handleImageSelect}
              className="w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center gap-4 hover:border-primary transition-all hover:bg-gradient-to-br hover:from-emerald-50 hover:to-emerald-100"
            >
              <div className="p-4 bg-primary/10 rounded-full">
                <Camera className="h-12 w-12 text-primary" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-700">사진 선택</p>
                <p className="text-sm text-gray-500">또는 카메라 실행</p>
              </div>
            </button>

            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">촬영 팁</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• 생물 전체가 보이도록 촬영하세요</li>
                <li>• 밝은 곳에서 선명하게 찍어주세요</li>
                <li>• 가까이에서 찍을수록 정확합니다</li>
              </ul>
            </div>
          </div>
        )}

        {/* Step 2: AI 분석 중 */}
        {step === "analyzing" && (
          <div className="space-y-6">
            <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
              {selectedImage && (
                <div className="w-full h-full bg-emerald-100 flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="h-24 w-24 text-emerald-600 mx-auto mb-4" />
                    <p className="text-gray-600">선택된 이미지</p>
                  </div>
                </div>
              )}
            </div>

            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                <span className="font-semibold text-primary">AI 분석 중...</span>
              </div>
              <p className="text-sm text-gray-600">
                생태교란종 여부를 확인하고 있습니다
              </p>
            </div>
          </div>
        )}

        {/* Step 3: AI 결과 */}
        {step === "result" && aiResult && (
          <div className="space-y-6">
            <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
              <div className="w-full h-full bg-emerald-100 flex items-center justify-center">
                <div className="text-center">
                  <Camera className="h-24 w-24 text-emerald-600 mx-auto mb-4" />
                  <p className="text-gray-600">선택된 이미지</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border-2 border-primary shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-lg">AI 분석 결과</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">식별된 종</p>
                  <p className="text-2xl font-bold text-primary">
                    {aiResult.species_name}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600">신뢰도</p>
                    <p className="font-bold text-primary">
                      {Math.round(aiResult.confidence * 100)}%
                    </p>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${aiResult.confidence * 100}%` }}
                    />
                  </div>
                </div>

                {speciesData
                  .filter((s) => s.name_ko === aiResult.species_name)
                  .map((species) => (
                    <div
                      key={species.id}
                      className="pt-4 border-t border-gray-200"
                    >
                      <p className="text-sm text-gray-600 mb-2">설명</p>
                      <p className="text-sm text-gray-800">
                        {species.description}
                      </p>
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleReselect}
                className="flex-1 py-3 px-4 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all"
              >
                다시 선택
              </button>
              <button
                onClick={handleConfirmAI}
                className="flex-1 py-3 px-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl"
              >
                맞아요, 계속
              </button>
            </div>
          </div>
        )}

        {/* Step 4: 최종 확인 */}
        {step === "confirm" && aiResult && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-bold">신고 정보 확인</h2>
              <p className="text-sm text-gray-600">마지막으로 확인해주세요</p>
            </div>

            {/* 식별된 종 */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">식별된 종</p>
              <p className="text-lg font-bold text-primary">
                {aiResult.species_name}
              </p>
            </div>

            {/* 발견 위치 */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">발견 위치</p>
                  <p className="text-sm font-medium text-gray-800">
                    {location.address}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    위도: {location.lat}, 경도: {location.lng}
                  </p>
                </div>
              </div>
            </div>

            {/* 메모 (선택) */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <label className="text-sm text-gray-600 mb-2 block">
                메모 (선택사항)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="추가로 전달하고 싶은 내용이 있다면 작성해주세요"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                rows={3}
              />
            </div>

            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
              <p className="text-sm text-amber-800">
                <strong className="font-semibold">예상 보상:</strong> 신고가
                승인되면 <strong className="text-amber-600">50 포인트</strong>를
                받게 됩니다!
              </p>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-4 bg-gradient-to-r from-primary to-emerald-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              신고 제출하기
            </button>
          </div>
        )}

        {/* Step 5: 성공 */}
        {step === "success" && (
          <div className="py-12 text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full">
              <Check className="h-12 w-12 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">신고가 접수되었습니다!</h2>
              <p className="text-gray-600">
                전문가 검토 후 포인트가 지급됩니다
              </p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
              <p className="text-sm text-emerald-800">
                생태계 보전에 참여해주셔서 감사합니다! 🌱
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
