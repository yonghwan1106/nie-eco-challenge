"use client";

import Link from "next/link";
import { Bell, Menu } from "lucide-react";

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
  return (
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
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="알림"
          >
            <Bell className="h-6 w-6" />
            {/* Notification badge */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>
          </button>
        )}
      </div>
    </header>
  );
}
