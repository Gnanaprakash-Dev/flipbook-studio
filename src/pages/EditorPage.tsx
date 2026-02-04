import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Download,
  Share2,
  Trash2,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UploadZone } from '@/components/UploadZone'
import { useFlipbookStore } from '@/store/flipbook-store'
import { ShareModal } from '@/components/ShareModal'
import { DownloadModal } from '@/components/DownloadModal'
import MagazineBook, { Page } from 'react-magazine'

/**
 * EditorPage Component
 *
 * Main flipbook viewer/editor page.
 * Handles two scenarios:
 * 1. /editor - Upload new PDF or view current project
 * 2. /view/:id - View shared flipbook by shareId
 */
export function EditorPage() {
  const navigate = useNavigate()
  const { id: shareId } = useParams() // For /view/:id route
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [localName, setLocalName] = useState('')

  const {
    currentProject,
    resetProject,
    updateName,
    deleteMagazine,
    loadMagazineByShareId,
    isProcessing,
    uploadError,
  } = useFlipbookStore()

  // Load shared magazine if we have a shareId
  useEffect(() => {
    if (shareId && !currentProject) {
      loadMagazineByShareId(shareId).catch(() => {
        // Error is set in store
      })
    }
  }, [shareId, currentProject, loadMagazineByShareId])

  // Sync local name with project name
  useEffect(() => {
    if (currentProject) {
      setLocalName(currentProject.name)
    }
  }, [currentProject?.name])

  const handleNewProject = () => {
    resetProject()
  }

  const handleGoBack = () => {
    navigate('/')
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalName(e.target.value)
  }

  const handleNameBlur = () => {
    if (currentProject && localName !== currentProject.name) {
      updateName(localName)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this flipbook?')) return

    setIsDeleting(true)
    try {
      await deleteMagazine()
      navigate('/')
    } catch (error) {
      console.error('Delete failed:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  // Is this a view-only mode (shared link)?
  const isViewMode = !!shareId

  // Loading state for shared links
  if (shareId && isProcessing) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#0a0a0f]">
        <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
        <p className="mt-4 text-white">Loading flipbook...</p>
      </div>
    )
  }

  // Error state for shared links
  if (shareId && uploadError && !currentProject) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#0a0a0f]">
        <p className="text-red-400 text-lg">Flipbook not found</p>
        <p className="text-blue-200/60 mt-2">{uploadError}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate('/')}
        >
          Go Home
        </Button>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#0a0a0f] relative">
      {/* Background Effects */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(ellipse at 50% 100%, rgba(139, 92, 246, 0.08) 0%, transparent 50%)'
        }}
      />

      {/* Subtle Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Header */}
      <header className="h-14 border-b border-blue-500/20 bg-[#0a0a0f]/80 backdrop-blur-xl flex items-center justify-between px-4 flex-shrink-0 relative z-10">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleGoBack}
            className="text-white/70 hover:text-white hover:bg-blue-500/10"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="h-6 w-px bg-blue-500/20" />

          {currentProject && (
            <div className="flex items-center gap-2">
              {!isViewMode ? (
                <Input
                  value={localName}
                  onChange={handleNameChange}
                  onBlur={handleNameBlur}
                  className="h-8 w-48 text-sm font-medium bg-white/5 border-blue-500/20 text-white placeholder:text-white/30 focus:border-blue-500/50 focus:ring-blue-500/20"
                />
              ) : (
                <span className="text-sm font-medium text-white">
                  {currentProject.name}
                </span>
              )}
              <span className="text-xs text-blue-200/50">
                {currentProject.totalPages} pages
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {currentProject && (
            <>
              {!isViewMode && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="text-white/70 hover:text-white hover:bg-red-500/10"
                  >
                    {isDeleting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4 mr-2" />
                    )}
                    Delete
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleNewProject}
                    className="text-white/70 hover:text-white hover:bg-blue-500/10"
                  >
                    New
                  </Button>
                  <div className="h-6 w-px bg-blue-500/20" />
                </>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsShareModalOpen(true)}
                className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10 hover:border-blue-500/50 hover:text-blue-200"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDownloadModalOpen(true)}
                className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:border-purple-500/50 hover:text-purple-200"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 relative z-10">
        <main className="h-full transition-all duration-300">
          {currentProject ? (
            <div className="h-full flex items-center justify-center p-8">
              <div className="relative">
                {/* Glow effect behind the book */}
                <div
                  className="absolute inset-0 -m-8 rounded-3xl blur-3xl opacity-30"
                  style={{
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4), rgba(139, 92, 246, 0.2), transparent)'
                  }}
                />

                {/* Flipbook using real page images from API */}
                <MagazineBook
                  width={currentProject.config?.width || 400}
                  height={currentProject.config?.height || 500}
                  showCover={true}
                >
                  {currentProject.pages.map((page) => (
                    <Page key={page.pageNumber} number={page.pageNumber}>
                      <img
                        src={page.imageUrl}
                        alt={`Page ${page.pageNumber}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          backgroundColor: '#fff',
                        }}
                        loading={page.pageNumber <= 4 ? 'eager' : 'lazy'}
                      />
                    </Page>
                  ))}
                </MagazineBook>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-8">
              <UploadZone onUploadComplete={() => {}} />
            </div>
          )}
        </main>
      </div>

      {/* Corner Accents */}
      <div className="absolute top-20 left-4 w-16 h-16 border-l-2 border-t-2 border-blue-500/20 pointer-events-none" />
      <div className="absolute top-20 right-4 w-16 h-16 border-r-2 border-t-2 border-blue-500/20 pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-purple-500/20 pointer-events-none" />
      <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-purple-500/20 pointer-events-none" />

      {/* Floating Orbs */}
      <div
        className="absolute w-48 h-48 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.8), transparent)',
          top: '20%',
          left: '5%',
        }}
      />
      <div
        className="absolute w-36 h-36 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.8), transparent)',
          bottom: '15%',
          right: '8%',
        }}
      />

      {/* Modals */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />
    </div>
  )
}
