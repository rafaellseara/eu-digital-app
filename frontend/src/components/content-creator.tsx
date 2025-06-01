"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X, MapPin, Tag } from "lucide-react"
import { createItem } from "@/lib/api"

interface ContentCreatorProps {
  author: string
}

export function ContentCreator({ author }: ContentCreatorProps) {
  const [contentType, setContentType] = useState("")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [location, setLocation] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [isPublic, setIsPublic] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const contentTypes = [
    { value: "photo", label: "Fotografia", icon: "📸" },
    { value: "text", label: "Texto", icon: "💭" },
    { value: "academic", label: "Resultado Académico", icon: "🎓" },
    { value: "sport", label: "Registo Desportivo", icon: "🏃" },
    { value: "file", label: "Ficheiro", icon: "📄" },
    { value: "event", label: "Evento", icon: "📅" },
  ]

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage(null)

    try {
      // Preparar dados comuns para todos os tipos
      const baseData = {
        id: crypto.randomUUID(), // Gerar um UUID para o novo item
        author,
        type: contentType,
        visibility: isPublic ? "public" : "private",
        tags,
        createdAt: new Date().toISOString(),
      }

      // Adicionar dados específicos com base no tipo
      let specificData = {}

      switch (contentType) {
        case "text":
          specificData = {
            title,
            content,
            summary: "", // Opcional
          }
          break

        case "photo":
          specificData = {
            caption: title,
            format: "jpg",
            resolution: {
              width: 1200,
              height: 800,
            },
            location: location
              ? {
                  lat: 0,
                  lon: 0,
                  description: location,
                }
              : undefined,
          }
          break

        case "sport":
          specificData = {
            activity: title,
            value: content,
            unit: "km", // Padrão, poderia ser um campo no formulário
            location,
            activityDate: new Date().toISOString(),
          }
          break

        case "academic":
          specificData = {
            institution: location || "Universidade",
            course: title,
            grade: content,
            scale: "20", // Padrão, poderia ser um campo no formulário
            evaluationDate: new Date().toISOString(),
          }
          break

        case "event":
          specificData = {
            title,
            description: content,
            location,
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 86400000).toISOString(), // +1 dia
          }
          break

        case "file":
          specificData = {
            originalName: title,
            description: content,
            size: 1024, // Tamanho fictício
            format: "pdf", // Formato fictício
          }
          break
      }

      // Combinar dados base com específicos
      const itemData = {
        ...baseData,
        ...specificData,
      }

      // Enviar para a API
      const result = await createItem(contentType, itemData)

      if (result) {
        setSubmitMessage({
          type: "success",
          text: "Conteúdo criado com sucesso!",
        })

        // Limpar formulário
        setTitle("")
        setContent("")
        setLocation("")
        setTags([])
        setIsPublic(false)
      } else {
        throw new Error("Falha ao criar conteúdo")
      }
    } catch (error) {
      console.error("Erro ao criar conteúdo:", error)
      setSubmitMessage({
        type: "error",
        text: "Erro ao criar conteúdo. Tente novamente.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Novo Conteúdo</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {submitMessage && (
          <div
            className={`p-3 mb-4 rounded-md ${
              submitMessage.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
            }`}
          >
            {submitMessage.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Conteúdo</Label>
            <Select value={contentType} onValueChange={setContentType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {contentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center space-x-2">
                      <span>{type.icon}</span>
                      <span>{type.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">
              {contentType === "text" || contentType === "event"
                ? "Título"
                : contentType === "photo"
                  ? "Legenda"
                  : contentType === "sport"
                    ? "Atividade"
                    : contentType === "academic"
                      ? "Curso"
                      : contentType === "file"
                        ? "Nome do Arquivo"
                        : "Título"}
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite aqui..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">
              {contentType === "text" || contentType === "event"
                ? "Conteúdo"
                : contentType === "sport"
                  ? "Valor"
                  : contentType === "academic"
                    ? "Nota"
                    : contentType === "file"
                      ? "Descrição"
                      : "Conteúdo"}
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escreva aqui..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{contentType === "academic" ? "Instituição" : "Localização"} (opcional)</span>
            </Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={contentType === "academic" ? "Nome da instituição" : "Onde aconteceu?"}
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center space-x-1">
              <Tag className="w-4 h-4" />
              <span>Tags</span>
            </Label>
            <div className="flex space-x-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Nova tag..."
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                    <span>#{tag}</span>
                    <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="public" className="text-sm font-medium">
              Tornar público
            </Label>
            <Switch id="public" checked={isPublic} onCheckedChange={setIsPublic} />
          </div>

          <Button type="submit" className="w-full" disabled={!contentType || !title || !content || isSubmitting}>
            {isSubmitting ? "Publicando..." : "Publicar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
