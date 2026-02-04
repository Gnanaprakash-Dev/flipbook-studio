import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'

export interface PageData {
  pageNumber: number
  imageData: string | null
  width: number
  height: number
  isLoading: boolean
  isRendered: boolean
}

export interface FlipbookConfig {
  width: number
  height: number
  flipAnimation: 'hard' | 'soft' | 'fade' | 'vertical'
  flipSpeed: number
  showShadow: boolean
  shadowOpacity: number
  layout: 'single' | 'double'
  backgroundColor: string
  showPageNumbers: boolean
  navigationStyle: 'arrows' | 'thumbnails' | 'both' | 'none'
  autoPlay: boolean
  autoPlayInterval: number
  enableSound: boolean
}

export interface FlipbookProject {
  id: string
  name: string
  pdfFile: File | null
  pdfUrl: string | null
  pages: PageData[]
  totalPages: number
  config: FlipbookConfig
  createdAt: Date
  updatedAt: Date
}

interface FlipbookState {
  currentProject: FlipbookProject | null
  currentPage: number
  isFlipping: boolean
  isFullscreen: boolean
  isUploading: boolean
  uploadProgress: number
  uploadError: string | null
  isProcessing: boolean
  processingProgress: number

  // Actions
  createNewProject: (name: string, pdfFile: File) => void
  setCurrentProject: (project: FlipbookProject | null) => void
  setPages: (pages: PageData[]) => void
  updatePage: (pageNumber: number, data: Partial<PageData>) => void
  setCurrentPage: (page: number) => void
  setIsFlipping: (isFlipping: boolean) => void
  setIsFullscreen: (isFullscreen: boolean) => void
  setIsUploading: (isUploading: boolean) => void
  setUploadProgress: (progress: number) => void
  setUploadError: (error: string | null) => void
  setIsProcessing: (isProcessing: boolean) => void
  setProcessingProgress: (progress: number) => void
  updateConfig: (config: Partial<FlipbookConfig>) => void
  resetProject: () => void
}

const defaultConfig: FlipbookConfig = {
  width: 400,
  height: 500,
  flipAnimation: 'soft',
  flipSpeed: 1000,
  showShadow: true,
  shadowOpacity: 0.3,
  layout: 'double',
  backgroundColor: '#1a1a2e',
  showPageNumbers: true,
  navigationStyle: 'both',
  autoPlay: false,
  autoPlayInterval: 3000,
  enableSound: false,
}

export const useFlipbookStore = create<FlipbookState>()(
  persist(
    (set) => ({
      currentProject: null,
      currentPage: 0,
      isFlipping: false,
      isFullscreen: false,
      isUploading: false,
      uploadProgress: 0,
      uploadError: null,
      isProcessing: false,
      processingProgress: 0,

      createNewProject: (name, pdfFile) => {
        const project: FlipbookProject = {
          id: uuidv4(),
          name,
          pdfFile,
          pdfUrl: URL.createObjectURL(pdfFile),
          pages: [],
          totalPages: 0,
          config: { ...defaultConfig },
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        set({ currentProject: project, currentPage: 0 })
      },

      setCurrentProject: (project) => set({ currentProject: project }),

      setPages: (pages) =>
        set((state) => ({
          currentProject: state.currentProject
            ? {
                ...state.currentProject,
                pages,
                totalPages: pages.length,
                updatedAt: new Date(),
              }
            : null,
        })),

      updatePage: (pageNumber, data) =>
        set((state) => ({
          currentProject: state.currentProject
            ? {
                ...state.currentProject,
                pages: state.currentProject.pages.map((page) =>
                  page.pageNumber === pageNumber ? { ...page, ...data } : page
                ),
                updatedAt: new Date(),
              }
            : null,
        })),

      setCurrentPage: (page) => set({ currentPage: page }),
      setIsFlipping: (isFlipping) => set({ isFlipping }),
      setIsFullscreen: (isFullscreen) => set({ isFullscreen }),
      setIsUploading: (isUploading) => set({ isUploading }),
      setUploadProgress: (progress) => set({ uploadProgress: progress }),
      setUploadError: (error) => set({ uploadError: error }),
      setIsProcessing: (isProcessing) => set({ isProcessing }),
      setProcessingProgress: (progress) => set({ processingProgress: progress }),

      updateConfig: (config) =>
        set((state) => ({
          currentProject: state.currentProject
            ? {
                ...state.currentProject,
                config: { ...state.currentProject.config, ...config },
                updatedAt: new Date(),
              }
            : null,
        })),

      resetProject: () =>
        set({
          currentProject: null,
          currentPage: 0,
          isFlipping: false,
          isFullscreen: false,
          isUploading: false,
          uploadProgress: 0,
          uploadError: null,
          isProcessing: false,
          processingProgress: 0,
        }),
    }),
    {
      name: 'flipbook-storage',
      partialize: (state) => ({
        // Don't persist large files/blobs
        currentProject: state.currentProject
          ? {
              ...state.currentProject,
              pdfFile: null,
              pdfUrl: null,
            }
          : null,
      }),
    }
  )
)
