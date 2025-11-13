"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Camera, Target, Map, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    name: "홈",
    href: "/",
    icon: Home,
  },
  {
    name: "신고",
    href: "/report",
    icon: Camera,
  },
  {
    name: "미션",
    href: "/missions",
    icon: Target,
  },
  {
    name: "지도",
    href: "/map",
    icon: Map,
  },
  {
    name: "프로필",
    href: "/profile",
    icon: User,
  },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200",
                "min-w-[60px] min-h-[60px]",
                isActive
                  ? "text-primary font-semibold"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              <Icon
                className={cn(
                  "h-6 w-6 transition-transform duration-200",
                  isActive && "scale-110"
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="text-xs">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
