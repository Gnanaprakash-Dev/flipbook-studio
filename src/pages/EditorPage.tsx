import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import {
  ArrowLeft,
  Download,
  Share2,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useFlipbookStore } from '@/store/flipbook-store'
import { ShareModal } from '@/components/ShareModal'
import { DownloadModal } from '@/components/DownloadModal'
import MagazineBook, { Page, useFlipBook } from 'react-magazine'
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
  const { id } = useParams()
  const location = useLocation()
  const isViewRoute = location.pathname.startsWith('/view/')
  const isEditorRoute = location.pathname.startsWith('/editor/')
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [localName, setLocalName] = useState('')
  const { bookRef, state, flipNext, flipPrev, handlers } = useFlipBook()

  // Page flip sound effect using actual paper flip audio
  const flipAudioRef = useRef<HTMLAudioElement | null>(null)
  const playFlipSound = useCallback(() => {
    try {
      if (!flipAudioRef.current) {
        flipAudioRef.current = new Audio('/sound2.mp3')
      }
      const audio = flipAudioRef.current
      audio.currentTime = 0
      audio.volume = 0.5
      audio.play()
    } catch {
      // Audio not supported — silently ignore
    }
  }, [])

  // Wrap onFlip handler to add sound
  const handlersWithSound = {
    ...handlers,
    onFlip: (e: import('react-magazine').FlipEvent) => {
      playFlipSound()
      handlers.onFlip(e)
    },
  }

  const {
    currentProject,
    updateName,
    deleteMagazine,
    loadMagazine,
    loadMagazineByShareId,
    isProcessing,
    uploadError,
  } = useFlipbookStore()

  // Load magazine by ID on mount/refresh
  useEffect(() => {
    if (id && !currentProject) {
      if (isViewRoute) {
        loadMagazineByShareId(id).catch(() => {})
      } else if (isEditorRoute) {
        loadMagazine(id).catch(() => {})
      }
    }
  }, [id, currentProject, isViewRoute, isEditorRoute, loadMagazine, loadMagazineByShareId])

  // Sync local name with project name
  useEffect(() => {
    setLocalName(currentProject?.name || '')
  }, [currentProject?.name])

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
  const isViewMode = isViewRoute

  // Loading state
  if (id && isProcessing) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#0a0a0f]">
        <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
        <p className="mt-4 text-white">Loading flipbook...</p>
      </div>
    )
  }

  // Error state
  if (id && uploadError && !currentProject) {
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

  // Safe state values (before book init, state values may not be numbers)
  const pageNum = typeof state.currentPage === 'number' ? state.currentPage : 0
  const totalPages = typeof state.pageCount === 'number' ? state.pageCount : (currentProject?.totalPages || 0)
  // Cover page centering: first cover shifts right, last cover shifts left
  const isFirstCover = pageNum === 0
  const isLastCover = pageNum >= totalPages - 1
  const coverMargin = isFirstCover ? '-400px' : isLastCover ? '400px' : '0px'

  // Dynamic page edge thickness: pages flipped to left vs remaining on right
  const pagesOnLeft = pageNum
  const pagesOnRight = totalPages - 1 - pageNum
  const maxEdgeWidth = 14
  const minEdgeWidth = 2
  const leftEdgeWidth = totalPages > 1
    ? Math.round(minEdgeWidth + (pagesOnLeft / (totalPages - 1)) * (maxEdgeWidth - minEdgeWidth))
    : 0
  const rightEdgeWidth = totalPages > 1
    ? Math.round(minEdgeWidth + (pagesOnRight / (totalPages - 1)) * (maxEdgeWidth - minEdgeWidth))
    : 0
  const leftLineCount = Math.max(1, Math.round((leftEdgeWidth / maxEdgeWidth) * 8))
  const rightLineCount = Math.max(1, Math.round((rightEdgeWidth / maxEdgeWidth) * 8))

  // Calculate page display: show spread like "18-19 / 22"
  const currentSpread = (() => {
    if (pageNum === 0) return '1'
    const left = pageNum
    const right = pageNum + 1
    if (right >= totalPages) return `${totalPages}`
    return `${left}-${right}`
  })()

  return (
    <div className="h-screen flex flex-col overflow-hidden relative">
      {/* Scenic Background Image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Header — frosted glass */}
      <header className="h-12 flex items-center justify-between px-4 flex-shrink-0 relative z-20 bg-white/10 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleGoBack}
            className="text-white/80 hover:text-white hover:bg-white/10 h-8 w-8"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="h-5 w-px bg-white/20" />

          <div className="flex items-center gap-2">
            {!isViewMode ? (
              <Input
                value={localName}
                onChange={handleNameChange}
                onBlur={handleNameBlur}
               className="h-8 w-44 text-xs font-medium bg-black/30 border border-white/20 text-white placeholder:text-white/30 backdrop-blur-sm rounded outline-none ring-0 focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-white/20 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            ) : (
              <span className="text-sm font-medium text-white drop-shadow">
                {currentProject?.name}
              </span>
            )}
            <span className="text-xs text-white/60 drop-shadow">
              {currentProject?.totalPages} pages
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentProject && (
            <>
              {!isViewMode && (
                <>
                  <Button
                    size="sm"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="h-8 px-3 text-sm bg-red-600/40 text-white hover:bg-red-600/60 border border-red-500/50 backdrop-blur-sm"
                  >
                    {isDeleting ? (
                      <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                    )}
                    Delete
                  </Button>
                  <div className="h-5 w-px bg-white/20" />
                </>
              )}

              <Button
                size="sm"
                onClick={() => setIsShareModalOpen(true)}
                className="h-8 px-3 text-sm bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 hover:brightness-110"
              >
                <Share2 className="w-3.5 h-3.5 mr-1.5" />
                Share
              </Button>
              <Button
                size="sm"
                onClick={() => setIsDownloadModalOpen(true)}
                className="h-8 px-3 text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-md shadow-purple-500/25 hover:shadow-purple-500/40 hover:brightness-110"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Download
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Main Content — Book with side arrows */}
      <div className="flex-1 relative z-10 flex items-center justify-center">
        {/* Book wrapper — centers on cover, arrows positioned relative to this */}
        <div
          className="relative"
          style={{
            marginLeft: coverMargin,
            transition: 'margin-left 0.6s ease',
          }}
        >
          {/* Left Arrow — absolute, hugs left edge of magazine */}
          <button
            onClick={() => flipPrev()}
            className={`absolute top-1/2 -translate-y-1/2 -left-16 z-20 p-1 transition-opacity duration-300 ${pageNum > 0 ? 'opacity-100 text-white/60 hover:text-white cursor-pointer' : 'opacity-0 pointer-events-none'}`}
          >
            <ChevronLeft className="w-12 h-12" strokeWidth={1.5} />
          </button>

          {/* Book + 3D page edge layer */}
          <div className="relative">
            <MagazineBook
              ref={bookRef as React.Ref<import('react-magazine').PageFlipInstance>}
              width={450}
              height={632}
              showCover={true}
              {...handlersWithSound}
            >
              {(currentProject?.pages || []).map((page) => (
                <Page key={page.pageNumber} number={page.pageNumber}>
                  <img
                    src={page.imageUrl}
                    alt={`Page ${page.pageNumber}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: '#fff',
                    }}
                    loading={page.pageNumber <= 4 ? 'eager' : 'lazy'}
                  />
                </Page>
              ))}
            </MagazineBook>

            {/* 3D Page Edge — right side (hidden on last page) */}
            {pagesOnRight > 0 && (
              <div
                className="absolute top-0 right-0 pointer-events-none"
                style={{
                  width: `${rightEdgeWidth}px`,
                  height: '100%',
                  transform: 'translateX(100%)',
                  transition: 'width 0.5s ease',
                  zIndex: -1,
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(to right, #e8e5e0, #f0ede8 40%, #ebe8e3)',
                    borderRadius: '0 3px 3px 0',
                    boxShadow: '3px 2px 8px rgba(0,0,0,0.18), 1px 0 2px rgba(0,0,0,0.08)',
                  }}
                />
                {Array.from({ length: rightLineCount }, (_, i) => (
                  <div
                    key={i}
                    className="absolute"
                    style={{
                      left: `${i * (rightEdgeWidth / (rightLineCount + 1)) + 1}px`,
                      top: '1px',
                      bottom: '1px',
                      width: '1px',
                      background: i % 2 === 0
                        ? 'rgba(0,0,0,0.06)'
                        : 'rgba(255,255,255,0.5)',
                      borderRadius: '0 1px 1px 0',
                    }}
                  />
                ))}
                <div
                  className="absolute top-0 right-0 bottom-0"
                  style={{
                    width: `${Math.max(2, rightEdgeWidth * 0.3)}px`,
                    background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.25) 50%, rgba(0,0,0,0.06))',
                    borderRadius: '0 3px 3px 0',
                  }}
                />
              </div>
            )}

            {/* 3D Page Edge — left side (hidden on first page) */}
            {pagesOnLeft > 0 && (
              <div
                className="absolute top-0 left-0 pointer-events-none"
                style={{
                  width: `${leftEdgeWidth}px`,
                  height: '100%',
                  transform: 'translateX(-100%)',
                  transition: 'width 0.5s ease',
                  zIndex: -1,
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(to left, #e8e5e0, #f0ede8 40%, #ebe8e3)',
                    borderRadius: '3px 0 0 3px',
                    boxShadow: '-3px 2px 8px rgba(0,0,0,0.18), -1px 0 2px rgba(0,0,0,0.08)',
                  }}
                />
                {Array.from({ length: leftLineCount }, (_, i) => (
                  <div
                    key={i}
                    className="absolute"
                    style={{
                      right: `${i * (leftEdgeWidth / (leftLineCount + 1)) + 1}px`,
                      top: '1px',
                      bottom: '1px',
                      width: '1px',
                      background: i % 2 === 0
                        ? 'rgba(0,0,0,0.06)'
                        : 'rgba(255,255,255,0.5)',
                      borderRadius: '1px 0 0 1px',
                    }}
                  />
                ))}
                <div
                  className="absolute top-0 left-0 bottom-0"
                  style={{
                    width: `${Math.max(2, leftEdgeWidth * 0.3)}px`,
                    background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.25) 50%, rgba(0,0,0,0.06))',
                    borderRadius: '3px 0 0 3px',
                  }}
                />
              </div>
            )}
          </div>

          {/* Right Arrow — absolute, hugs right edge of magazine */}
          <button
            onClick={() => flipNext()}
            className={`absolute top-1/2 -translate-y-1/2 -right-16 z-20 p-1 transition-opacity duration-300 ${pageNum < totalPages - 1 ? 'opacity-100 text-white/60 hover:text-white cursor-pointer' : 'opacity-0 pointer-events-none'}`}
          >
            <ChevronRight className="w-12 h-12" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="relative z-20 flex items-center justify-center px-6 py-2 bg-black/60 backdrop-blur-md">
        {/* Page counter — left */}
        <span className="absolute left-6 text-sm text-white/80 font-medium tracking-wide">
          {currentSpread} / {totalPages}
        </span>

        {/* Progress dots — center */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalPages }, (_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i === pageNum
                  ? 'w-6 h-2 bg-white'
                  : 'w-2 h-2 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

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
