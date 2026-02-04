import * as pdfjsLib from 'pdfjs-dist'
import type { PDFDocumentProxy } from 'pdfjs-dist'

// Local page type for client-side processing (legacy)
export interface LocalPDFPage {
  pageNumber: number;
  imageData: string | null;
  width: number;
  height: number;
  isLoading: boolean;
  isRendered: boolean;
}

// Set up the worker - use local file copied from node_modules
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

export interface PDFProcessorOptions {
  scale?: number
  maxWidth?: number
  maxHeight?: number
  onProgress?: (progress: number) => void
  onPageRendered?: (pageNumber: number, imageData: string) => void
}

export class PDFProcessor {
  private document: PDFDocumentProxy | null = null
  private pageCache: Map<number, string> = new Map()
  private renderQueue: Set<number> = new Set()
  private options: PDFProcessorOptions

  constructor(options: PDFProcessorOptions = {}) {
    this.options = {
      scale: 2,
      maxWidth: 1200,
      maxHeight: 1600,
      ...options,
    }
  }

  async loadDocument(source: string | ArrayBuffer): Promise<{ totalPages: number; pages: LocalPDFPage[] }> {
    try {
      const loadingTask = pdfjsLib.getDocument(source)
      this.document = await loadingTask.promise

      const totalPages = this.document.numPages
      const pages: LocalPDFPage[] = []

      // Get page dimensions for all pages
      for (let i = 1; i <= totalPages; i++) {
        const page = await this.document.getPage(i)
        const viewport = page.getViewport({ scale: 1 })

        pages.push({
          pageNumber: i,
          imageData: null,
          width: viewport.width,
          height: viewport.height,
          isLoading: false,
          isRendered: false,
        })

        this.options.onProgress?.((i / totalPages) * 50) // First 50% is loading
      }

      return { totalPages, pages }
    } catch (error) {
      console.error('Error loading PDF:', error)
      throw new Error('Failed to load PDF document')
    }
  }

  async renderPage(pageNumber: number): Promise<string> {
    // Return cached version if available
    if (this.pageCache.has(pageNumber)) {
      return this.pageCache.get(pageNumber)!
    }

    // Prevent duplicate renders
    if (this.renderQueue.has(pageNumber)) {
      return new Promise((resolve) => {
        const checkCache = setInterval(() => {
          if (this.pageCache.has(pageNumber)) {
            clearInterval(checkCache)
            resolve(this.pageCache.get(pageNumber)!)
          }
        }, 100)
      })
    }

    this.renderQueue.add(pageNumber)

    if (!this.document) {
      throw new Error('PDF document not loaded')
    }

    try {
      const page = await this.document.getPage(pageNumber)
      const viewport = page.getViewport({ scale: this.options.scale! })

      // Calculate scale to fit within max dimensions
      let finalScale = this.options.scale!
      if (viewport.width > this.options.maxWidth!) {
        finalScale = (this.options.maxWidth! / viewport.width) * this.options.scale!
      }
      if (viewport.height > this.options.maxHeight!) {
        finalScale = Math.min(finalScale, (this.options.maxHeight! / viewport.height) * this.options.scale!)
      }

      const scaledViewport = page.getViewport({ scale: finalScale })

      // Create canvas
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      if (!context) {
        throw new Error('Failed to get canvas 2D context')
      }
      canvas.width = scaledViewport.width
      canvas.height = scaledViewport.height

      // Render page
      await page.render({
        canvasContext: context,
        viewport: scaledViewport,
      }).promise

      // Convert to data URL
      const imageData = canvas.toDataURL('image/jpeg', 0.9)

      // Cache the result
      this.pageCache.set(pageNumber, imageData)
      this.renderQueue.delete(pageNumber)

      this.options.onPageRendered?.(pageNumber, imageData)

      return imageData
    } catch (error) {
      this.renderQueue.delete(pageNumber)
      console.error(`Error rendering page ${pageNumber}:`, error)
      throw error
    }
  }

  async renderPages(pageNumbers: number[]): Promise<Map<number, string>> {
    const results = new Map<number, string>()

    await Promise.all(
      pageNumbers.map(async (pageNumber) => {
        const imageData = await this.renderPage(pageNumber)
        results.set(pageNumber, imageData)
      })
    )

    return results
  }

  async renderAllPages(onProgress?: (current: number, total: number) => void): Promise<string[]> {
    if (!this.document) {
      throw new Error('PDF document not loaded')
    }

    const totalPages = this.document.numPages
    const images: string[] = []

    for (let i = 1; i <= totalPages; i++) {
      const imageData = await this.renderPage(i)
      images.push(imageData)
      onProgress?.(i, totalPages)
      this.options.onProgress?.(50 + (i / totalPages) * 50) // Second 50% is rendering
    }

    return images
  }

  getPageFromCache(pageNumber: number): string | null {
    return this.pageCache.get(pageNumber) ?? null
  }

  clearCache(): void {
    this.pageCache.clear()
  }

  destroy(): void {
    this.clearCache()
    this.document?.destroy()
    this.document = null
  }
}

// Singleton instance for the app
let processorInstance: PDFProcessor | null = null

export function getPDFProcessor(options?: PDFProcessorOptions): PDFProcessor {
  if (!processorInstance) {
    processorInstance = new PDFProcessor(options)
  }
  return processorInstance
}

export function resetPDFProcessor(): void {
  processorInstance?.destroy()
  processorInstance = null
}
