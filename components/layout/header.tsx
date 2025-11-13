"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, Menu, X, CheckCircle, XCircle, Trophy, Target } from "lucide-react";
import notificationsData from "@/data/notifications.json";

interface HeaderProps {
  title?: string;
  showNotification?: boolean;
  showMenu?: boolean;
}

export function Header({
  title = "NIE 에코-챌린지",
  showNotification = true,
  showMenu = false,
}: HeaderProps) {
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);

  // Mock: 읽지 않은 알림 개수
  const unreadCount = notificationsData.filter((n) => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "report_approved":
        return <CheckCircle className="h-5 w-5 text-emerald-600" />;
      case "report_rejected":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "mission_completed":
        return <Target className="h-5 w-5 text-blue-600" />;
      case "badge_earned":
        return <Trophy className="h-5 w-5 text-amber-600" />;
      case "new_mission":
        return <Target className="h-5 w-5 text-purple-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "방금 전";
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;
    return date.toLocaleDateString("ko-KR");
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="flex h-16 items-center justify-between px-4 max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            {showMenu && (
              <button
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="메뉴"
              >
                <Menu className="h-6 w-6" />
              </button>
            )}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">NIE</span>
              </div>
              <h1 className="text-lg font-bold text-foreground">{title}</h1>
            </Link>
          </div>

          {showNotification && (
            <button
              onClick={() => setShowNotificationPanel(!showNotificationPanel)}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="알림"
            >
              <Bell className="h-6 w-6" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-danger rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {unreadCount}
                </span>
              )}
            </button>
          )}
        </div>
      </header>

      {/* Notification Panel */}
      {showNotificationPanel && (
        <div
          className="fixed inset-0 bg-black/50 z-50"
          onClick={() => setShowNotificationPanel(false)}
        >
          <div
            className="absolute top-16 right-0 w-full max-w-md bg-white shadow-2xl border-l h-[calc(100vh-4rem)] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-bold">알림</h2>
              <button
                onClick={() => setShowNotificationPanel(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Notification List */}
            <div className="divide-y">
              {notificationsData.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">알림이 없습니다</p>
                  <p className="text-sm text-gray-500 mt-1">
                    새로운 알림이 도착하면 여기에 표시됩니다
                  </p>
                </div>
              ) : (
                notificationsData.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                      !notification.read ? "bg-blue-50/50" : ""
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 text-sm">
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatTime(notification.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notificationsData.length > 0 && (
              <div className="sticky bottom-0 bg-white border-t p-4">
                <button className="w-full py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                  모두 읽음으로 표시
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
