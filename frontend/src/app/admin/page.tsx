"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Users,
  FileText,
  Camera,
  BookOpen,
  Trophy,
  Calendar,
  TrendingUp,
  Download,
  Upload,
  Eye,
  BarChart3,
  Home,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"
import { ImportModal } from "@/components/import-modal"
import { toast } from "../hooks/use-toast"
import { useAuth } from "@/lib/auth"

export default function AdminDashboard() {
  const { logout } = useAuth()
  const stats = {
    totalPosts: 156,
    postsByType: {
      photos: 45,
      texts: 38,
      academic: 28,
      sports: 25,
      events: 20,
    },
    totalUsers: 1247,
    activeUsers: 892,
    recentActivity: {
      publishedItems: 12,
      privateItems: 8,
      totalViews: 2456,
    },
  }

  const [isImportModalOpen, setIsImportModalOpen] = useState(false)

  const postTypeStats = [
    { name: "Fotografias", count: stats.postsByType.photos, icon: Camera, color: "bg-green-500" },
    { name: "Textos", count: stats.postsByType.texts, icon: FileText, color: "bg-blue-500" },
    { name: "Académico", count: stats.postsByType.academic, icon: BookOpen, color: "bg-purple-500" },
    { name: "Desporto", count: stats.postsByType.sports, icon: Trophy, color: "bg-orange-500" },
    { name: "Eventos", count: stats.postsByType.events, icon: Calendar, color: "bg-red-500" },
  ]

  const handleImportSuccess = (ingestedIds: string[]) => {
    toast({
      title: "Importação concluída",
      description: `${ingestedIds.length} ${ingestedIds.length === 1 ? "item foi" : "itens foram"} importados com sucesso.`,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-slate-800 text-white sticky top-0 z-50">
        <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
                <Link href="/" className="text-xl font-bold">
                📖 Eu Digital | Admin
                </Link>
            </div>

            <div className="flex items-center space-x-4">
                <Link href="/">
                <Button variant="ghost" size="sm" className="text-slate-300 cursor-pointer">
                    <Home className="w-4 h-4 mr-1" />
                    Início
                </Button>
                </Link>

                <Button variant="ghost" size="sm" className="text-slate-300 cursor-pointer" onClick={() => logout()}>
                <LogOut className="w-4 h-4 mr-1" />
                Sair
                </Button>
            </div>
            </div>
        </div>
        </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Statistics Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Total Items */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">Itens</span>
                  </div>
                  <Badge variant="secondary">{stats.totalPosts}</Badge>
                </div>

                <Separator />

                {/* Post Types */}
                {postTypeStats.map((type) => (
                  <div key={type.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <type.icon
                        className="w-4 h-4"
                        style={{ color: type.color.replace("bg-", "").replace("-500", "") }}
                      />
                      <span className="text-sm">{type.name}</span>
                    </div>
                    <Badge variant="outline">{type.count}</Badge>
                  </div>
                ))}

                <Separator />

                {/* Users */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Utilizadores</span>
                  </div>
                  <Badge variant="secondary">{stats.totalUsers}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" size="sm" onClick={() => setIsImportModalOpen(true)}>
                  <Upload className="w-4 h-4 mr-2" />
                  Importar Dados
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Dados
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Atividade Recente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Itens públicos</span>
                  <Badge>{stats.recentActivity.publishedItems}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Itens privados</span>
                  <Badge variant="outline">{stats.recentActivity.privateItems}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Visualizações hoje</span>
                  <Badge variant="secondary">{stats.recentActivity.totalViews}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Número Total de Posts</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalPosts}</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="inline w-3 h-3 mr-1" />
                    +12% desde o mês passado
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Número Total de Utilizadores</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="inline w-3 h-3 mr-1" />
                    +8% desde o mês passado
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Utilizadores Ativos</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    {Math.round((stats.activeUsers / stats.totalUsers) * 100)}% do total
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Posts by Type Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Distribuição de Posts por Tipo
                </CardTitle>
                <CardDescription>Visualização detalhada dos tipos de conteúdo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {postTypeStats.map((type) => {
                    const percentage = Math.round((type.count / stats.totalPosts) * 100)
                    return (
                      <div key={type.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <type.icon className="w-4 h-4" />
                            <span className="text-sm font-medium">{type.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{type.count}</span>
                            <Badge variant="outline">{percentage}%</Badge>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className={`h-2 rounded-full ${type.color}`} style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity Details */}
            <Card>
              <CardHeader>
                <CardTitle>Atividade Detalhada</CardTitle>
                <CardDescription>Resumo das atividades recentes na plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium">Conteúdo</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Posts publicados hoje</span>
                        <span className="font-medium">{stats.recentActivity.publishedItems}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rascunhos guardados</span>
                        <span className="font-medium">{stats.recentActivity.privateItems}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Número total de visualizações</span>
                        <span className="font-medium">{stats.recentActivity.totalViews}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium">Utilizadores</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Novos registos hoje</span>
                        <span className="font-medium">23</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Utilizadores online agora</span>
                        <span className="font-medium">156</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Taxa de engajamento</span>
                        <span className="font-medium">72%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <ImportModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onSuccess={handleImportSuccess}
            />
          </div>
        </div>
      </div>
    </div>
  )
}