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
import { Plus, X, MapPin, Tag, Calendar, Upload, ImageIcon, Activity, FileText, Users } from "lucide-react"
import { createItem } from "@/lib/api"
import { useAuth } from "@/lib/auth"

interface ContentCreatorProps {
  author: string
}

export function ContentCreator({ author }: ContentCreatorProps) {
  const { user } = useAuth()
  const [contentType, setContentType] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    location: "",
    caption: "",
    summary: "",
    institution: "",
    course: "",
    grade: "",
    scale: "20",
    activity: "",
    value: "",
    unit: "km",
    originalName: "",
    format: "pdf",
    fileSize: 1024,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    participants: "",
    activityDate: new Date().toISOString().split("T")[0],
    evaluationDate: new Date().toISOString().split("T")[0],
  })

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      location: "",
      caption: "",
      summary: "",
      institution: "",
      course: "",
      grade: "",
      scale: "20",
      activity: "",
      value: "",
      unit: "km",
      originalName: "",
      format: "pdf",
      fileSize: 1024,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      participants: "",
      activityDate: new Date().toISOString().split("T")[0],
      evaluationDate: new Date().toISOString().split("T")[0],
    })
    setTags([])
    setIsPublic(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage(null)

    try {
      // Usar o username do usuário autenticado se disponível
      const actualAuthor = user?.username || author

      // Preparar dados comuns para todos os tipos
      const baseData = {
        id: crypto.randomUUID(), // Gerar um UUID para o novo item
        author: actualAuthor,
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
            title: formData.title,
            content: formData.content,
            summary: formData.summary,
          }
          break

        case "photo":
          specificData = {
            caption: formData.caption,
            format: "jpg",
            resolution: {
              width: 1200,
              height: 800,
            },
            location: formData.location
              ? {
                  lat: 0,
                  lon: 0,
                  description: formData.location,
                }
              : undefined,
          }
          break

        case "sport":
          specificData = {
            activity: formData.activity,
            value: formData.value,
            unit: formData.unit,
            location: formData.location,
            activityDate: new Date(formData.activityDate).toISOString(),
          }
          break

        case "academic":
          specificData = {
            institution: formData.institution,
            course: formData.course,
            grade: formData.grade,
            scale: formData.scale,
            evaluationDate: new Date(formData.evaluationDate).toISOString(),
          }
          break

        case "event":
          specificData = {
            title: formData.title,
            description: formData.content,
            location: formData.location,
            startDate: new Date(formData.startDate).toISOString(),
            endDate: new Date(formData.endDate).toISOString(),
            participants: formData.participants ? formData.participants.split(",").map((p) => p.trim()) : [],
          }
          break

        case "file":
          specificData = {
            originalName: formData.originalName,
            description: formData.content,
            size: formData.fileSize,
            format: formData.format,
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
        resetForm()
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

  // Renderizar campos específicos com base no tipo de conteúdo
  const renderContentTypeFields = () => {
    if (!contentType) return null

    switch (contentType) {
      case "photo":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="caption" className="flex items-center space-x-2">
                <ImageIcon className="w-4 h-4" />
                <span>Legenda</span>
              </Label>
              <Input
                id="caption"
                name="caption"
                value={formData.caption}
                onChange={handleInputChange}
                placeholder="Descreva esta foto..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="photoUpload" className="flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>Carregar Imagem</span>
              </Label>
              <div className="border-2 border-dashed border-slate-200 rounded-md p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                <p className="text-sm text-slate-500">Clique para selecionar ou arraste uma imagem</p>
                <p className="text-xs text-slate-400 mt-1">JPG, PNG ou GIF até 5MB</p>
                <Input id="photoUpload" type="file" accept="image/*" className="hidden" onChange={() => {}} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Localização (opcional)</span>
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Onde esta foto foi tirada?"
              />
            </div>
          </>
        )

      case "text":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="title" className="flex items-center space-x-2">
                <span>Título</span>
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Título do texto"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="flex items-center space-x-2">
                <span>Conteúdo</span>
              </Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Escreva o seu texto aqui..."
                rows={6}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary" className="flex items-center space-x-2">
                <span>Resumo (opcional)</span>
              </Label>
              <Input
                id="summary"
                name="summary"
                value={formData.summary}
                onChange={handleInputChange}
                placeholder="Breve resumo do texto"
              />
            </div>
          </>
        )

      case "academic":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="course" className="flex items-center space-x-2">
                <ImageIcon className="w-4 h-4" />
                <span>Curso</span>
              </Label>
              <Input
                id="course"
                name="course"
                value={formData.course}
                onChange={handleInputChange}
                placeholder="Nome do curso"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="institution" className="flex items-center space-x-2">
                <span>Instituição</span>
              </Label>
              <Input
                id="institution"
                name="institution"
                value={formData.institution}
                onChange={handleInputChange}
                placeholder="Nome da instituição"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="grade" className="flex items-center space-x-2">
                  <span>Nota</span>
                </Label>
                <Input
                  id="grade"
                  name="grade"
                  value={formData.grade}
                  onChange={handleInputChange}
                  placeholder="Sua nota"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scale" className="flex items-center space-x-2">
                  <span>Escala</span>
                </Label>
                <Select
                  name="scale"
                  value={formData.scale}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, scale: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Escala" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20">0-20</SelectItem>
                    <SelectItem value="10">0-10</SelectItem>
                    <SelectItem value="5">0-5</SelectItem>
                    <SelectItem value="100">0-100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="evaluationDate" className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Data de Avaliação</span>
              </Label>
              <Input
                id="evaluationDate"
                name="evaluationDate"
                type="date"
                value={formData.evaluationDate}
                onChange={handleInputChange}
                required
              />
            </div>
          </>
        )

      case "sport":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="activity" className="flex items-center space-x-2">
                <Activity className="w-4 h-4" />
                <span>Atividade</span>
              </Label>
              <Input
                id="activity"
                name="activity"
                value={formData.activity}
                onChange={handleInputChange}
                placeholder="Tipo de atividade (ex: Corrida)"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="value" className="flex items-center space-x-2">
                  <span>Valor</span>
                </Label>
                <Input
                  id="value"
                  name="value"
                  value={formData.value}
                  onChange={handleInputChange}
                  placeholder="Distância, tempo, etc."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit" className="flex items-center space-x-2">
                  <span>Unidade</span>
                </Label>
                <Select
                  name="unit"
                  value={formData.unit}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, unit: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Unidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="km">Quilômetros (km)</SelectItem>
                    <SelectItem value="m">Metros (m)</SelectItem>
                    <SelectItem value="min">Minutos (min)</SelectItem>
                    <SelectItem value="h">Horas (h)</SelectItem>
                    <SelectItem value="kcal">Calorias (kcal)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Localização (opcional)</span>
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Onde realizou a atividade?"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="activityDate" className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Data da Atividade</span>
              </Label>
              <Input
                id="activityDate"
                name="activityDate"
                type="date"
                value={formData.activityDate}
                onChange={handleInputChange}
                required
              />
            </div>
          </>
        )

      case "file":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="originalName" className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Nome do Arquivo</span>
              </Label>
              <Input
                id="originalName"
                name="originalName"
                value={formData.originalName}
                onChange={handleInputChange}
                placeholder="Nome do arquivo"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fileUpload" className="flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>Carregar Arquivo</span>
              </Label>
              <div className="border-2 border-dashed border-slate-200 rounded-md p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                <p className="text-sm text-slate-500">Clique para selecionar ou arraste um arquivo</p>
                <p className="text-xs text-slate-400 mt-1">PDF, DOC, XLS, etc. até 10MB</p>
                <Input id="fileUpload" type="file" className="hidden" onChange={() => {}} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="flex items-center space-x-2">
                <span>Descrição (opcional)</span>
              </Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Descreva o conteúdo deste arquivo..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="format" className="flex items-center space-x-2">
                  <span>Formato</span>
                </Label>
                <Select
                  name="format"
                  value={formData.format}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, format: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="doc">DOC</SelectItem>
                    <SelectItem value="xls">XLS</SelectItem>
                    <SelectItem value="txt">TXT</SelectItem>
                    <SelectItem value="zip">ZIP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        )

      case "event":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="title" className="flex items-center space-x-2">
                <span>Título do Evento</span>
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Nome do evento"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="flex items-center space-x-2">
                <span>Descrição</span>
              </Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Descreva o evento..."
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Localização</span>
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Onde ocorrerá o evento?"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Data de Início</span>
                </Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate" className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Data de Fim</span>
                </Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="participants" className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Participantes (opcional)</span>
              </Label>
              <Input
                id="participants"
                name="participants"
                value={formData.participants}
                onChange={handleInputChange}
                placeholder="Nomes separados por vírgula"
              />
              <p className="text-xs text-slate-500">Separe os nomes com vírgulas (ex: João, Maria, Carlos)</p>
            </div>
          </>
        )

      default:
        return null
    }
  }

  // Verificar se o formulário está válido com base no tipo de conteúdo
  const isFormValid = () => {
    if (!contentType) return false

    switch (contentType) {
      case "photo":
        return !!formData.caption
      case "text":
        return !!formData.title && !!formData.content
      case "academic":
        return !!formData.course && !!formData.institution && !!formData.grade
      case "sport":
        return !!formData.activity && !!formData.value && !!formData.unit
      case "file":
        return !!formData.originalName
      case "event":
        return !!formData.title && !!formData.content && !!formData.location && !!formData.startDate
      default:
        return false
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

          {/* Campos específicos para o tipo de conteúdo selecionado */}
          {renderContentTypeFields()}

          {/* Campos comuns para todos os tipos de conteúdo */}
          {contentType && (
            <>
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

              <Button type="submit" className="w-full" disabled={!isFormValid() || isSubmitting}>
                {isSubmitting ? "A publicar..." : "Publicar"}
              </Button>
            </>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
