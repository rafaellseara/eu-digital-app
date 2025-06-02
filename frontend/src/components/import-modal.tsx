"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Upload, FileArchive, X, Check, AlertCircle, Info } from "lucide-react"
import { ingestData } from "@/lib/api"

interface ImportModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (ingestedIds: string[]) => void
}

export function ImportModal({ isOpen, onClose, onSuccess }: ImportModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<{ count: number; ids: string[] } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    validateAndSetFile(droppedFile)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0])
    }
  }

  const validateAndSetFile = (file: File) => {
    setError(null)
    setSuccess(null)

    if (file.type !== "application/zip" && !file.name.endsWith(".zip")) {
      setError("Apenas arquivos .zip são aceitos. O arquivo deve ser um pacote SIP válido.")
      return
    }

    setFile(file)
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)
    setError(null)
    setSuccess(null)

    const formData = new FormData()
    formData.append("package", file)

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + Math.random() * 15
          return newProgress >= 90 ? 90 : newProgress
        })
      }, 300)

      const response = await ingestData(sessionStorage.getItem("auth-token") || "", formData);

      clearInterval(progressInterval)
      setUploadProgress(100)

      setSuccess({
        count: response.ingested.length,
        ids: response.ingested,
      })

      if (onSuccess) {
        onSuccess(response.ingested)
        location.reload()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido durante a importação")
    } finally {
      setIsUploading(false)
    }
  }

  const resetForm = () => {
    setFile(null)
    setError(null)
    setSuccess(null)
    setUploadProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Importar Pacote SIP</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Alert variant="default" className="bg-blue-50 border-blue-200 text-blue-50 fill-blue-500">
            <AlertDescription className="text-blue-700 text-sm">
              <p className="font-medium">Especificações do pacote SIP:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Arquivo .zip contendo:</li>
                <li className="ml-4">manifest-sip.json - Arquivo de manifesto</li>
                <li className="ml-4">data/ - Pasta com os arquivos de conteúdo</li>
              </ul>
            </AlertDescription>
          </Alert>

          {!file && !isUploading && !success && (
            <div
              className={`border-2 ${
                isDragging ? "border-blue-400 bg-blue-50" : "border-dashed border-slate-300"
              } rounded-lg p-8 text-center cursor-pointer transition-colors`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".zip"
                className="hidden"
                data-testid="file-input"
              />
              <FileArchive className="h-10 w-10 text-slate-400 mx-auto mb-4" />
              <p className="text-sm font-medium text-slate-700 mb-1">
                {isDragging ? "Solte o arquivo aqui" : "Arraste e solte seu arquivo .zip aqui"}
              </p>
            </div>
          )}

          {file && !isUploading && !success && (
            <div className="bg-slate-50 p-4 rounded-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-slate-200 p-2 rounded">
                    <FileArchive className="h-6 w-6 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{file.name}</p>
                    <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    setFile(null)
                    if (fileInputRef.current) fileInputRef.current.value = ""
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {isUploading && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>A processar pacote SIP...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Mensagem de sucesso */}
          {success && (
            <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
              <Check className="h-4 w-4 text-green-600" />
              <AlertDescription>
                <p>
                  Importação concluída com sucesso! {success.count}{" "}
                  {success.count === 1 ? "item foi importado" : "itens foram importados"}.
                </p>
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          {file && !isUploading && !success && (
            <Button onClick={handleUpload} disabled={isUploading}>
              <Upload className="h-4 w-4 mr-2" />
              Importar
            </Button>
          )}
          {success && (
            <Button onClick={resetForm} variant="default">
              Importar outro
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
