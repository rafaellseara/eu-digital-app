"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Settings, LogOut, Home, BarChart3 } from "lucide-react"

export function AdminHeader() {
  return (
    <header className="bg-slate-800 text-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="text-xl font-bold">
              📖 Backoffice
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/admin" className="flex items-center space-x-1 text-slate-300 hover:text-white">
                <Home className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                Ver Site Público
              </Button>
            </Link>

            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
              <LogOut className="w-4 h-4 mr-1" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
