import { Suspense } from "react"
import { fetchAuthors } from "@/lib/api"
import { PublicHeader } from "@/components/public-header"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, ArrowRight } from "lucide-react"

// Página principal que lista os autores disponíveis
export default async function HomePage() {
  const authors = await fetchAuthors()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <PublicHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Eu Digital</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Uma plataforma para registrar e explorar a jornada cronológica de momentos, pensamentos e experiências.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-slate-800 mb-6">Escolha um perfil para explorar</h2>

          <Suspense fallback={<div className="text-center py-8">Carregando autores...</div>}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {authors.length > 0 ? (
                authors.map((author) => (
                  <Card key={author} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center space-x-2">
                        <User className="w-5 h-5" />
                        <span>{author}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600 mb-4">
                        Explore a linha do tempo e conteúdos compartilhados por {author}.
                      </p>
                      <Link href={`/author/${encodeURIComponent(author)}`}>
                        <Button className="w-full">
                          Ver perfil <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-2 text-center py-8 text-slate-500">
                  <p>Nenhum autor encontrado. Comece adicionando conteúdo no painel de administração.</p>
                  <Link href="/admin">
                    <Button variant="outline" className="mt-4">
                      Ir para o Admin
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </Suspense>
        </div>
      </main>
    </div>
  )
}
