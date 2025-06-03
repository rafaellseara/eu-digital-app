"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, ImageIcon, Activity, GraduationCap, Calendar, MessageSquare, Upload, Download } from "lucide-react"
import type { TimelineItem } from "@/lib/api"
import { ImportModal } from "@/components/import-modal"
import { useToast } from "@/app/hooks/use-toast"

interface BackofficeSidebarProps {
  items: TimelineItem[]
  onDataImported?: () => void
}

export function BackofficeSidebar({ items, onDataImported }: BackofficeSidebarProps) {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const { toast } = useToast()

  const countByType = items.reduce(
    (acc, item) => {
      const type = item.type
      acc[type] = (acc[type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const publicItems = items.filter((item) => item.visibility === "public").length
  const privateItems = items.filter((item) => item.visibility !== "public").length

  const handleImportSuccess = (ingestedIds: string[]) => {
    toast({
      title: "Importação concluída",
      description: `${ingestedIds.length} ${ingestedIds.length === 1 ? "item foi" : "itens foram"} importados com sucesso.`,
    })

    if (onDataImported) {
      onDataImported()
    }
  }

  return (
    <aside className="w-80 bg-white border-r border-slate-200 p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start" onClick={() => setIsImportModalOpen(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Importar Dados
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Download className="w-4 h-4 mr-2" />
            Exportar Dados
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Atividade Recente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-600">Itens públicos</span>
              <Badge>{publicItems}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Itens privados</span>
              <Badge variant="secondary">{privateItems}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={handleImportSuccess}
      />
    </aside>
  )
}
