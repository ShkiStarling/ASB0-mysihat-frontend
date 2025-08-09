"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Activity, MessageSquare, AlertTriangle, Shield } from 'lucide-react'

const navigationItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: Activity,
  },
  {
    name: "Social Heatmap",
    href: "/social-heatmap",
    icon: MessageSquare,
  },
  {
    name: "Early Warnings",
    href: "/early-warnings",
    icon: AlertTriangle,
  },
  {
    name: "Misinformation",
    href: "/misinformation",
    icon: Shield,
  },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center space-x-1">
      {navigationItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href

        return (
          <Link key={item.href} href={item.href}>
            <Button variant={isActive ? "default" : "ghost"} size="sm" className="flex items-center gap-2">
              <Icon className="w-4 h-4" />
              <span className="hidden md:inline">{item.name}</span>
            </Button>
          </Link>
        )
      })}
    </nav>
  )
}
