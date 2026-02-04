import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { magazineApi, Magazine, MagazineConfig, PageData } from '@/services/api';

/**
 * Flipbook Store
 *
 * Global state management using Zustand.
 * Now integrates with backend API instead of client-side processing.
 */

// Re-export types for convenience
export type { Magazine, MagazineConfig, PageData };

// Legacy type alias for compatibility
export interface FlipbookProject extends Magazine {}
export interface FlipbookConfig extends MagazineConfig {}
export interface PDFPage extends PageData {
  isLoading?: boolean;
  isRendered?: boolean;
  imageData?: string | null;
}

interface FlipbookState {
  // Current magazine being viewed/edited
  currentProject: Magazine | null;

  // Navigation state
  currentPage: number;
  isFlipping: boolean;
  isFullscreen: boolean;

  // Upload/processing state
  isUploading: boolean;
  uploadProgress: number;
  uploadError: string | null;
  isProcessing: boolean;
  processingProgress: number;

  // Actions
  uploadPdf: (file: File) => Promise<Magazine>;
  loadMagazine: (id: string) => Promise<void>;
  loadMagazineByShareId: (shareId: string) => Promise<void>;
  setCurrentProject: (project: Magazine | null) => void;
  setCurrentPage: (page: number) => void;
  setIsFlipping: (isFlipping: boolean) => void;
  setIsFullscreen: (isFullscreen: boolean) => void;
  setIsUploading: (isUploading: boolean) => void;
  setUploadProgress: (progress: number) => void;
  setUploadError: (error: string | null) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setProcessingProgress: (progress: number) => void;
  updateConfig: (config: Partial<MagazineConfig>) => Promise<void>;
  updateName: (name: string) => Promise<void>;
  resetProject: () => void;
  deleteMagazine: () => Promise<void>;

  // Legacy compatibility methods
  createNewProject: (name: string, pdfFile: File) => void;
  setPages: (pages: PDFPage[]) => void;
  updatePage: (pageNumber: number, data: Partial<PDFPage>) => void;
}

const defaultConfig: MagazineConfig = {
  width: 400,
  height: 500,
  flipAnimation: 'soft',
  flipSpeed: 1000,
  showShadow: true,
  shadowOpacity: 0.3,
  pageLayout: 'double',
  backgroundColor: '#1a1a2e',
  showPageNumbers: true,
  navigationStyle: 'both',
  autoPlay: false,
  autoPlayInterval: 3000,
};

export const useFlipbookStore = create<FlipbookState>()(
  persist(
    (set, get) => ({
      currentProject: null,
      currentPage: 0,
      isFlipping: false,
      isFullscreen: false,
      isUploading: false,
      uploadProgress: 0,
      uploadError: null,
      isProcessing: false,
      processingProgress: 0,

      /**
       * Upload PDF to backend
       */
      uploadPdf: async (file: File) => {
        set({
          isUploading: true,
          uploadProgress: 0,
          uploadError: null,
          isProcessing: false,
        });

        try {
          // Upload with progress tracking
          const magazine = await magazineApi.upload(file, (progress) => {
            set({ uploadProgress: progress });
          });

          set({
            isUploading: false,
            uploadProgress: 100,
            currentProject: magazine,
            currentPage: 0,
          });

          return magazine;
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Upload failed';
          set({
            isUploading: false,
            uploadError: message,
          });
          throw error;
        }
      },

      /**
       * Load magazine by MongoDB ID
       */
      loadMagazine: async (id: string) => {
        set({ isProcessing: true, uploadError: null });

        try {
          const magazine = await magazineApi.getById(id);
          set({
            currentProject: magazine,
            currentPage: 0,
            isProcessing: false,
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to load magazine';
          set({
            uploadError: message,
            isProcessing: false,
          });
          throw error;
        }
      },

      /**
       * Load magazine by share ID (for /view/:shareId route)
       */
      loadMagazineByShareId: async (shareId: string) => {
        set({ isProcessing: true, uploadError: null });

        try {
          const magazine = await magazineApi.getByShareId(shareId);
          set({
            currentProject: magazine,
            currentPage: 0,
            isProcessing: false,
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Magazine not found';
          set({
            uploadError: message,
            isProcessing: false,
          });
          throw error;
        }
      },

      setCurrentProject: (project) => set({ currentProject: project }),

      setCurrentPage: (page) => set({ currentPage: page }),

      setIsFlipping: (isFlipping) => set({ isFlipping }),

      setIsFullscreen: (isFullscreen) => set({ isFullscreen }),

      setIsUploading: (isUploading) => set({ isUploading }),

      setUploadProgress: (progress) => set({ uploadProgress: progress }),

      setUploadError: (error) => set({ uploadError: error }),

      setIsProcessing: (isProcessing) => set({ isProcessing }),

      setProcessingProgress: (progress) => set({ processingProgress: progress }),

      /**
       * Update magazine config on backend
       */
      updateConfig: async (config) => {
        const { currentProject } = get();
        if (!currentProject) return;

        try {
          const updated = await magazineApi.update(currentProject.id || currentProject._id, {
            config,
          });
          set({ currentProject: updated });
        } catch (error) {
          console.error('Failed to update config:', error);
        }
      },

      /**
       * Update magazine name on backend
       */
      updateName: async (name) => {
        const { currentProject } = get();
        if (!currentProject) return;

        try {
          const updated = await magazineApi.update(currentProject.id || currentProject._id, {
            name,
          });
          set({ currentProject: updated });
        } catch (error) {
          console.error('Failed to update name:', error);
        }
      },

      /**
       * Reset current project
       */
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

      /**
       * Delete current magazine
       */
      deleteMagazine: async () => {
        const { currentProject, resetProject } = get();
        if (!currentProject) return;

        try {
          await magazineApi.delete(currentProject.id || currentProject._id);
          resetProject();
        } catch (error) {
          console.error('Failed to delete magazine:', error);
          throw error;
        }
      },

      // ========== Legacy Methods (for backward compatibility) ==========

      createNewProject: (name: string, _pdfFile: File) => {
        // This is now handled by uploadPdf
        // Keeping for compatibility but it won't be used
        console.warn('createNewProject is deprecated, use uploadPdf instead');
      },

      setPages: (_pages: PDFPage[]) => {
        // Pages come from backend now
        console.warn('setPages is deprecated, pages come from API');
      },

      updatePage: (_pageNumber: number, _data: Partial<PDFPage>) => {
        // Pages are immutable from backend
        console.warn('updatePage is deprecated');
      },
    }),
    {
      name: 'flipbook-storage',
      partialize: (state) => ({
        // Only persist minimal data
        // Don't persist currentProject as it may be stale
      }),
    }
  )
);
