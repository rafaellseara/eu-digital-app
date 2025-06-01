import { Suspense } from "react"
import { fetchTimelineItems } from "@/lib/api"
import { AdminHeader } from "@/components/admin-header"
import { TimelineView } from "@/components/timeline-view"
import { ContentCreator } from "@/components/content-creator"
import { AdminSidebar } from "@/components/admin-sidebar"

// Usuário padrão para o admin (em uma aplicação real, isso viria da autenticação)
const DEFAULT_ADMIN_USER = "admin"

export default async function AdminPage() {
  // Buscar todos os itens do usuário admin (públicos e privados)
  const items = await fetchTimelineItems(DEFAULT_ADMIN_USER)

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader />

      <div className="flex">
        <AdminSidebar items={items} />

        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Eu Digital</h1>
            <p className="text-slate-600">Gerencie seu conteúdo pessoal e configure a visibilidade.</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-1">
              {/* TODO: Use authenticated user name */}
              <ContentCreator author={DEFAULT_ADMIN_USER} />
            </div>

            <div className="xl:col-span-2">
              <Suspense fallback={<div className="text-center py-8">Carregando...</div>}>
                <TimelineView items={items} isPublic={false} />
              </Suspense>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
