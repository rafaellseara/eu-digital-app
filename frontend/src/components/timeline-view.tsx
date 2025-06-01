"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  MapPin,
  Heart,
  MessageCircle,
  Eye,
  EyeOff,
  GraduationCap,
  Activity,
  FileText,
  Download,
} from "lucide-react"
import { type TimelineItem, getItemType } from "@/lib/api"
import { ShareModal } from "@/components/share-modal"
import { PhotoModal } from "@/components/photo-modal"

interface TimelineViewProps {
  items: TimelineItem[]
  isPublic: boolean
}

export function TimelineView({ items, isPublic }: TimelineViewProps) {
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set())
  const [modalOpen, setModalOpen] = useState(false)
  const [modalSrc, setModalSrc] = useState("")
  const [modalAlt, setModalAlt] = useState("")

  const toggleLike = (id: string) => {
    setLikedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "photo":
        return "📸"
      case "text":
        return "💭"
      case "academic":
        return "🎓"
      case "sport":
        return "🏃"
      case "file":
        return "📄"
      case "event":
        return "📅"
      default:
        return "📝"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "photo":
        return "bg-blue-100 text-blue-800"
      case "text":
        return "bg-purple-100 text-purple-800"
      case "academic":
        return "bg-orange-100 text-orange-800"
      case "sport":
        return "bg-green-100 text-green-800"
      case "file":
        return "bg-gray-100 text-gray-800"
      case "event":
        return "bg-red-100 text-red-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  const handleFileDownload = (file: any) => {
    const a = document.createElement("a")
    a.href = "http://localhost:3000/api/files/" + file.id + "/download"
    a.download = file.originalName
  
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }
  
  // Renderizar conteúdo específico com base no tipo de item
  const renderItemContent = (item: TimelineItem) => {
    const itemType = getItemType(item)

    switch (itemType) {
      case "photo":
        const photo = item as any
        const photoUrl = `https://picsum.photos/${photo.resolution.width}/${photo.resolution.height}`
        return (
          <>
            {photo.caption && <p className="text-slate-700 mb-4">{photo.caption}</p>}
            <div
              className="w-full h-48 bg-slate-200 rounded-lg overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform"
              onClick={() => {
                setModalSrc(photoUrl)
                setModalAlt(photo.caption || "Photo")
                setModalOpen(true)
              }}
            >
              <img
                src={photoUrl}
                alt={photo.caption || "Photo"}
                className="w-full h-full object-cover"
              />
            </div>
            {photo.location && (
              <div className="mt-2 text-sm text-slate-500 flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{photo.location.description}</span>
              </div>
            )}
          </>
        )


      case "text":
        const text = item as any
        return (
          <>
            {text.title && <h3 className="font-medium text-lg mb-2">{text.title}</h3>}
            <p className="text-slate-700 whitespace-pre-line">{text.content}</p>
            {text.summary && <p className="text-sm text-slate-500 mt-2 italic">{text.summary}</p>}
          </>
        )

      case "academic":
        const academic = item as any
        return (
          <>
            <div className="flex items-center mb-3">
              <GraduationCap className="w-5 h-5 mr-2 " />
              <h3 className="font-medium text-lg">{academic.course}</h3>
            </div>
            <div className="space-y-2">
              <p className="text-slate-700">
                <strong>Instituição:</strong> {academic.institution}
              </p>
              <p className="text-slate-700">
                <strong>Nota:</strong> {academic.grade}/{academic.scale}
              </p>
              <p className="text-sm text-slate-500">
                Data de avaliação: {new Date(academic.evaluationDate).toLocaleDateString()}
              </p>
            </div>
          </>
        )

      case "sport":
        const sport = item as any
        return (
          <>
            <div className="flex items-center mb-3">
              <Activity className="w-5 h-5 mr-2" />
              <h3 className="font-medium text-lg">{sport.activity}</h3>
            </div>
            <div className="space-y-2">
              <p className="text-xl font-bold text-slate-800">
                {sport.value} {sport.unit}
              </p>
              {sport.location && (
                <p className="text-slate-700 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {sport.location}
                </p>
              )}
              <p className="text-sm text-slate-500">Data: {new Date(sport.activityDate).toLocaleDateString()}</p>
            </div>
          </>
        )

      case "file":
        const file = item as any
        return (
          <>
            <div className="flex items-center mb-3 w-min rounded-3xl py-1 cursor-pointer hover:scale-105 transition-transform" onClick={() => handleFileDownload(file)}
            >
              <FileText className="w-5 h-5 mr-2" />
              <h3 className="font-medium text-lg">{file.originalName}</h3>
            </div>
            <div className="space-y-2">
              <p className="text-slate-700">
                <strong>Formato:</strong> {file.format}
              </p>
              <p className="text-slate-700">
                <strong>Tamanho:</strong> {(file.size / 1024).toFixed(2)} KB
              </p>
              {file.description && <p className="text-slate-600 mt-2">{file.description}</p>}
            </div>
          </>
        )

      case "event":
        const event = item as any
        return (
          <>
            <h3 className="font-medium text-lg mb-2">{event.title}</h3>
            <div className="space-y-2">
              <p className="text-slate-700">
                <strong>Data:</strong> {new Date(event.startDate).toLocaleDateString()}
                {event.endDate && ` até ${new Date(event.endDate).toLocaleDateString()}`}
              </p>
              {event.location && (
                <p className="text-slate-700 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {event.location}
                </p>
              )}
              {event.description && <p className="text-slate-600 mt-2">{event.description}</p>}
              {event.participants && event.participants.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-slate-500">Participantes:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {event.participants.map((participant: string) => (
                      <Badge key={participant} variant="outline" className="text-xs">
                        {participant}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )

      default:
        return <p className="text-slate-700">{JSON.stringify(item)}</p>
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border shadow-sm">
        <h3 className="text-xl font-medium text-slate-800 mb-2">Nenhum conteúdo encontrado</h3>
        <p className="text-slate-600">
          {isPublic
            ? "Este usuário ainda não compartilhou nenhum conteúdo público."
            : "Comece adicionando seu primeiro conteúdo usando o formulário ao lado."}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-800">
          {isPublic ? "Timeline Pública" : "Minha Timeline Completa"}
        </h2>
        <div className="text-sm text-slate-500">
          {items.length} {items.length === 1 ? "item" : "itens"}
        </div>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200"></div>

        <div className="space-y-8">
          {items.map((item) => {
            const itemType = getItemType(item)

            return (
              <div key={item.id} className="relative flex items-start space-x-4">
                {/* Timeline dot */}
                <div className="flex-shrink-0 w-16 h-16 bg-white border-4 border-slate-200 rounded-full flex items-center justify-center text-2xl shadow-sm select-none">
                  {getTypeIcon(itemType)}
                </div>

                {/* Content card */}
                <Card className="flex-1 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Badge className={getTypeColor(itemType) + " select-none"}>{itemType}</Badge>
                          {!isPublic && (
                            <Badge variant={item.visibility === "public" ? "default" : "secondary"}>
                              {item.visibility === "public" ? (
                                <Eye className="w-3 h-3 mr-1" />
                              ) : (
                                <EyeOff className="w-3 h-3 mr-1" />
                              )}
                              {item.visibility === "public" ? "Público" : "Privado"}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-slate-500">
                          <div className="flex items-center space-x-1 select-none">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {renderItemContent(item)}

                    <div className="flex flex-wrap gap-2 select-none">
                      {item.tags &&
                        item.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                    </div>

                    {isPublic && (
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center space-x-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={likedItems.has(item.id) ? "text-red-500" : "text-slate-500"}
                            onClick={() => toggleLike(item.id)}
                          >
                            <Heart className={`w-4 h-4 mr-1 ${likedItems.has(item.id) ? "fill-current" : ""}`} />
                            {likedItems.has(item.id) ? 1 : 0}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-slate-500">
                            <MessageCircle className="w-4 h-4 mr-1" />0
                          </Button>
                        </div>
                        <ShareModal item={item} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>
      </div>
      <PhotoModal open={modalOpen} onClose={() => setModalOpen(false)} src={modalSrc} alt={modalAlt} />
    </div>
  )
}
