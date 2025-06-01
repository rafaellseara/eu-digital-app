"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, Calendar, Tag, Home } from "lucide-react"
import { Input } from "@/components/ui/input"

interface PublicHeaderProps {
  currentAuthor?: string
}

export function PublicHeader({ currentAuthor }: PublicHeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-xl font-bold text-slate-800">
              📖 Eu Digital
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="flex items-center space-x-1 text-slate-600 hover:text-slate-800">
                <Home className="w-4 h-4" />
                <span>Início</span>
              </Link>
              {currentAuthor && (
                <>
                  <Link
                    href={`/author/${encodeURIComponent(currentAuthor)}`}
                    className="flex items-center space-x-1 text-slate-600 hover:text-slate-800"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Timeline</span>
                  </Link>
                  <Link
                    href={`/author/${encodeURIComponent(currentAuthor)}/categories`}
                    className="flex items-center space-x-1 text-slate-600 hover:text-slate-800"
                  >
                    <Tag className="w-4 h-4" />
                    <span>Categorias</span>
                  </Link>
                </>
              )}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input placeholder="Pesquisar..." className="pl-10 w-64" />
              </div>
            </div>

            <Link href="/admin">
              <Button variant="outline" size="sm">
                Admin
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
