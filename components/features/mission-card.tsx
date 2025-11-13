"use client";

import { Target, Trophy, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface MissionCardProps {
  title: string;
  description: string;
  progress: number;
  goal: number;
  reward: number;
  difficulty: "easy" | "medium" | "hard";
  endDate: string;
}

const difficultyColors = {
  easy: "bg-sky-100 text-sky-700 border-sky-200",
  medium: "bg-orange-100 text-orange-700 border-orange-200",
  hard: "bg-purple-100 text-purple-700 border-purple-200",
};

const difficultyLabels = {
  easy: "쉬움",
  medium: "보통",
  hard: "어려움",
};

export function MissionCard({
  title,
  description,
  progress,
  goal,
  reward,
  difficulty,
  endDate,
}: MissionCardProps) {
  const progressPercent = Math.min((progress / goal) * 100, 100);

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Target className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
        <span
          className={cn(
            "text-xs px-2 py-1 rounded-full border font-medium whitespace-nowrap",
            difficultyColors[difficulty]
          )}
        >
          {difficultyLabels[difficulty]}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-gray-600">
            진행률: {progress}/{goal}
          </span>
          <span className="font-semibold text-primary">{Math.round(progressPercent)}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1 text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>~ {new Date(endDate).toLocaleDateString("ko-KR", { month: "short", day: "numeric" })}</span>
        </div>
        <div className="flex items-center gap-1 text-accent font-semibold">
          <Trophy className="h-4 w-4" />
          <span>{reward}pt</span>
        </div>
      </div>
    </div>
  );
}
