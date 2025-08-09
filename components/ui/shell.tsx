"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import {
  Activity,
  AlertTriangle,
  Bell,
  Eye,
  Search,
  Target,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./theme-toggle";

type NavItem = {
  title: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const NAV_ITEMS: NavItem[] = [
  { title: "Dashboard", href: "/", icon: Activity },
  { title: "Early Warnings", href: "/early-warnings", icon: AlertTriangle },
  { title: "Keywords", href: "/keyword-manager", icon: Target },
  { title: "Media Monitor", href: "/media-mentions", icon: Eye },
];

export function NexusShell({
  children,
  title = "Dashboard",
}: {
  children: React.ReactNode;
  title?: string;
}) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [alertsToday] = useState(47); // This could be dynamic from props

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <SidebarProvider>
      {/* Sidebar */}
      <Sidebar
        className="border-r border-gray-200 dark:border-gray-700 w-[16rem] bg-white dark:bg-gray-900"
        collapsible="offcanvas"
      >
        <SidebarHeader className="px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center space-x-3">
              <img
                src="/images/JataNegaraMOH.png"
                alt="Ministry of Health Malaysia"
                className="w-10 h-10 object-contain"
              />
              <div>
                <span className="text-xl font-bold text-blue-800 dark:text-white">
                  MySihat
                </span>
                <div className="text-xs text-nexus-text-muted">
                  AI-Powered Outbreak Detection
                </div>
              </div>
            </div>
          </div>
        </SidebarHeader>

        <SidebarSeparator className="border-gray-200 dark:border-gray-700" />

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <nav className="p-2 space-y-1" aria-label="Primary">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/" && pathname?.startsWith(item.href));
                  return (
                    <Link
                      key={item.title}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        "hover:bg-gray-100 hover:text-blue-800 dark:hover:bg-gray-800 dark:hover:text-blue-800",
                        isActive
                          ? "bg-gray-100 text-blue-800 dark:bg-gray-900 dark:text-blue-800"
                          : "text-gray-700 dark:text-gray-300"
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <Icon className="w-5 h-5" aria-hidden />
                      <span>{item.title}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* AI Status */}
              <div className="p-4 mt-6">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                  System Status
                </h3>

                <div className="space-y-3">
                  {/* Live System Time */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-800 dark:text-gray-200">
                      System Time
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <div className="text-xs font-mono text-gray-600 dark:text-gray-400">
                          {formatDate(currentTime)}
                        </div>
                        <div className="text-sm font-mono font-medium text-gray-800 dark:text-gray-200">
                          {formatTime(currentTime)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Alerts Today */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-800 dark:text-gray-200">
                      Alerts Today
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="px-2 py-1 bg-orange-100 dark:bg-orange-900/20 rounded-md">
                        <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                          {alertsToday}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* AI Status */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-800 dark:text-gray-200">
                      AI Status
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">
                        Active
                      </span>
                      <div className="relative">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping opacity-75"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarRail />
      </Sidebar>

      {/* Header + Main */}
      <div className="flex min-h-svh w-full flex-col bg-gray-50 dark:bg-gray-950">
        <header
          className={cn(
            "sticky top-0 z-20 border-b border-gray-200 dark:border-gray-700",
            "px-4 py-3 sm:px-6 bg-sidebar"
          )}
          role="banner"
        >
          <div className="flex items-center gap-3">
            {/* Sidebar toggle */}
            <SidebarTrigger className="md:hidden" />
            <div className="hidden md:block">
              <SidebarTrigger />
            </div>

            <h1 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h1>

            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <div className="relative flex items-center rounded-full bg-gray-100 dark:bg-gray-800 shadow-md">
                <Search
                  className="absolute left-2 size-4 text-gray-500 dark:text-gray-400"
                  aria-hidden
                />
                <Input
                  className="pl-8 h-9 w-44 md:w-64 rounded-full bg-transparent border-none text-gray-900 dark:text-white"
                  placeholder="Search..."
                  aria-label="Search"
                />
              </div>

              {/* Theme toggle */}
              <ThemeToggle />

              <Button variant="ghost" size="icon" aria-label="Notifications">
                <Bell className="size-5 text-gray-600 dark:text-gray-300" />
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </SidebarProvider>
  );
}
