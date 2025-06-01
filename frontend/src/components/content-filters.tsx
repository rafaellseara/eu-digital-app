"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Filter, Tag } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

interface ContentFiltersProps {
  author?: string
  selectedTag?: string
}

export function ContentFilters({ author, selectedTag }: ContentFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()

  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>(selectedTag ? [selectedTag] : [])

  // Tipos de conteúdo disponíveis
  const contentTypes = [
    { id: "photo", label: "Fotografias", icon: "📸", count: 45 },
    { id: "text", label: "Textos", icon: "💭", count: 67 },
    { id: "academic", label: "Académico", icon: "🎓", count: 12 },
    { id: "sport", label: "Desporto", icon: "🏃", count: 23 },
    { id: "file", label: "Ficheiros", icon: "📄", count: 18 },
    { id: "event", label: "Eventos", icon: "📅", count: 34 },
  ]

  // Tags populares (em uma aplicação real, isso seria buscado da API)
  const popularTags = [
    "reflexão",
    "natureza",
    "viagem",
    "saúde",
    "família",
    "trabalho",
    "fotografia",
    "corrida",
    "leitura",
    "música",
  ]

  const toggleType = (typeId: string) => {
    setSelectedTypes((prev) => (prev.includes(typeId) ? prev.filter((id) => id !== typeId) : [...prev, typeId]))
  }

  const toggleTag = (tag: string) => {
    // Se já estiver selecionada, remover
    if (selectedTags.includes(tag)) {
      setSelectedTags((prev) => prev.filter((t) => t !== tag))

      // Se estamos em uma página de autor e esta era a tag selecionada, atualizar a URL
      if (author && selectedTag === tag) {
        router.push(`/author/${encodeURIComponent(author)}`)
      }
    }
    // Caso contrário, adicionar e atualizar URL se estivermos em uma página de autor
    else {
      setSelectedTags([tag]) // Permitir apenas uma tag selecionada por vez

      if (author) {
        router.push(`/author/${encodeURIComponent(author)}?tag=${encodeURIComponent(tag)}`)
      }
    }
  }

  const clearFilters = () => {
    setSelectedTypes([])
    setSelectedTags([])

    // Se estamos em uma página de autor e há uma tag selecionada, limpar a URL
    if (author && selectedTag) {
      router.push(`/author/${encodeURIComponent(author)}`)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filtros</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" size="sm" className="w-full" onClick={clearFilters}>
            Limpar Filtros
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tipos de Conteúdo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {contentTypes.map((type) => (
            <Button
              key={type.id}
              variant={selectedTypes.includes(type.id) ? "default" : "ghost"}
              className="w-full justify-between h-auto p-3"
              onClick={() => toggleType(type.id)}
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">{type.icon}</span>
                <span className="text-sm">{type.label}</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {type.count}
              </Badge>
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Tag className="w-5 h-5" />
            <span>Tags Populares</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer hover:bg-slate-100"
                onClick={() => toggleTag(tag)}
              >
                #{tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Navegação Temporal</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="ghost" className="w-full justify-start">
            Este mês
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            Últimos 3 meses
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            Este ano
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            Arquivo completo
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
