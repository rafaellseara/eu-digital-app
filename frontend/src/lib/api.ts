export interface BaseItem {
  id: string
  createdAt: string
  author: string
  type: string
  visibility: "public" | "friends" | "private"
  tags: string[]
}

export interface Photo extends BaseItem {
  format: string
  resolution?: {
    width: number
    height: number
  }
  location?: {
    lat: number
    lon: number
    description: string
  }
  caption?: string
}

export interface Text extends BaseItem {
  title: string
  content: string
  summary?: string
}

export interface AcademicResult extends BaseItem {
  institution: string
  course: string
  grade: string
  scale: string
  evaluationDate: string
}

export interface SportResult extends BaseItem {
  activity: string
  value: number | string
  unit: string
  location?: string
  activityDate: string
}

export interface FileItem extends BaseItem {
  originalName: string
  size: number
  format: string
  description?: string
}

export interface Event extends BaseItem {
  title: string
  startDate: string
  endDate?: string
  location?: string
  participants?: string[]
  description?: string
  eventType?: string
}

// Tipo unificado para timeline
export type TimelineItem = Photo | Text | AcademicResult | SportResult | FileItem | Event

// Função para determinar o tipo específico de item
export function getItemType(item: TimelineItem): string {
  if ("caption" in item) return "photo"
  if ("content" in item) return "text"
  if ("grade" in item) return "academic"
  if ("activity" in item) return "sport"
  if ("originalName" in item) return "file"
  if ("startDate" in item) return "event"
  return "unknown"
}

// Funções para buscar dados da API
const API_BASE = "http://localhost:3000/api"

export async function fetchTimelineItems(author?: string, visibility?: string, tag?: string): Promise<TimelineItem[]> {
  // Buscar todos os tipos de conteúdo e combinar em uma única timeline
  const [photos, texts, academicResults, sportResults, files, events] = await Promise.all([
    fetchPhotos(author, tag),
    fetchTexts(author, tag),
    fetchAcademicResults(author),
    fetchSportResults(author),
    fetchFiles(author),
    fetchEvents(author),
  ])

  console.log(files)

  // Combinar todos os itens em uma única array
  const allItems: TimelineItem[] = [...photos, ...texts, ...academicResults, ...sportResults, ...files, ...events]

  // Filtrar por visibilidade se necessário
  const filteredItems = visibility ? allItems.filter((item) => item.visibility === visibility) : allItems

  // Ordenar por data de criação (mais recente primeiro)
  return filteredItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function fetchPhotos(author?: string, tag?: string): Promise<Photo[]> {
  let url = `${API_BASE}/photos?`
  if (author) url += `author=${encodeURIComponent(author)}&`
  if (tag) url += `tag=${encodeURIComponent(tag)}&`

  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error("Failed to fetch photos")
    return await response.json()
  } catch (error) {
    console.error("Error fetching photos:", error)
    return []
  }
}

export async function fetchTexts(author?: string, tag?: string): Promise<Text[]> {
  let url = `${API_BASE}/texts?`
  if (author) url += `author=${encodeURIComponent(author)}&`
  if (tag) url += `tag=${encodeURIComponent(tag)}&`

  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error("Failed to fetch texts")
    return await response.json()
  } catch (error) {
    console.error("Error fetching texts:", error)
    return []
  }
}

export async function fetchAcademicResults(author?: string): Promise<AcademicResult[]> {
  let url = `${API_BASE}/academicResults?`
  if (author) url += `author=${encodeURIComponent(author)}&`

  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error("Failed to fetch academic results")
    return await response.json()
  } catch (error) {
    console.error("Error fetching academic results:", error)
    return []
  }
}

export async function fetchSportResults(author?: string): Promise<SportResult[]> {
  let url = `${API_BASE}/sportResults?`
  if (author) url += `author=${encodeURIComponent(author)}&`

  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error("Failed to fetch sport results")
    return await response.json()
  } catch (error) {
    console.error("Error fetching sport results:", error)
    return []
  }
}

export async function fetchFiles(author?: string): Promise<FileItem[]> {
  let url = `${API_BASE}/files?`
  if (author) url += `author=${encodeURIComponent(author)}&`

  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error("Failed to fetch files")
    return await response.json()
  } catch (error) {
    console.error("Error fetching files:", error)
    return []
  }
}

export async function fetchEvents(author?: string): Promise<Event[]> {
  let url = `${API_BASE}/events?`
  if (author) url += `author=${encodeURIComponent(author)}&`

  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error("Failed to fetch events")
    return await response.json()
  } catch (error) {
    console.error("Error fetching events:", error)
    return []
  }
}

// Função para buscar todos os autores disponíveis (simulada, já que a API não tem um endpoint específico para isso)
export async function fetchAuthors(): Promise<string[]> {
  try {
    // Buscar alguns itens e extrair autores únicos
    const [photos, texts] = await Promise.all([fetchPhotos(), fetchTexts()])

    const authors = new Set<string>()
    ;[...photos, ...texts].forEach((item) => {
      if (item.author) authors.add(item.author)
    })

    return Array.from(authors)
  } catch (error) {
    console.error("Error fetching authors:", error)
    return []
  }
}

// Funções para criar novos itens
export async function createItem(itemType: string, data: any): Promise<TimelineItem | null> {
  const endpoint = getEndpointForType(itemType)
  if (!endpoint) return null

  try {
    const response = await fetch(`${API_BASE}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) throw new Error(`Failed to create ${itemType}`)
    return await response.json()
  } catch (error) {
    console.error(`Error creating ${itemType}:`, error)
    return null
  }
}

// Função auxiliar para obter o endpoint correto com base no tipo
function getEndpointForType(itemType: string): string | null {
  switch (itemType) {
    case "photo":
      return "photos"
    case "text":
      return "texts"
    case "academic":
      return "academicResults"
    case "sport":
      return "sportResults"
    case "file":
      return "files"
    case "event":
      return "events"
    default:
      return null
  }
}
