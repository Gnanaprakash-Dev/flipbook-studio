import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useFlipbookStore } from '@/store/flipbook-store'
import { getPDFProcessor } from '@/lib/pdf-processor'
import { PageThumbnails } from './PageThumbnails'
import { MagazineBook, Page, PageFlipInstance, FlipEvent, StateEvent } from 'react-magazine'
import 'react-magazine/styles.css'

interface FlipbookViewerProps {
  className?: string
}

export function FlipbookViewer({ className }: FlipbookViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const flipBookRef = useRef<PageFlipInstance>(null)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const {
    currentProject,
    currentPage,
    isFlipping,
    isFullscreen,
    setCurrentPage,
    setIsFlipping,
    setIsFullscreen,
    updatePage,
  } = useFlipbookStore()

  const config = currentProject?.config
  const pages = currentProject?.pages ?? []
  const totalPages = currentProject?.totalPages ?? 0

  // Preload adjacent pages
  useEffect(() => {
    const preloadPages = async () => {
      if (!currentProject) return

      const processor = getPDFProcessor()
      const pagesToPreload = [
        currentPage - 2,
        currentPage - 1,
        currentPage,
        currentPage + 1,
        currentPage + 2,
        currentPage + 3,
      ].filter((p) => p >= 0 && p < totalPages)

      for (const pageNum of pagesToPreload) {
        const page = pages.find((p) => p.pageNumber === pageNum + 1)
        if (page && !page.isRendered && !page.isLoading) {
          updatePage(pageNum + 1, { isLoading: true })
          try {
            const imageData = await processor.renderPage(pageNum + 1)
            updatePage(pageNum + 1, { imageData, isLoading: false, isRendered: true })
          } catch (error) {
            updatePage(pageNum + 1, { isLoading: false })
          }
        }
      }
    }

    preloadPages()
  }, [currentPage, currentProject, pages, totalPages, updatePage])

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && config?.autoPlay) {
      autoPlayRef.current = setInterval(() => {
        if (flipBookRef.current) {
          const currentIdx = flipBookRef.current.getCurrentPageIndex()
          const pageCount = flipBookRef.current.getPageCount()
          if (currentIdx < pageCount - 1) {
            flipBookRef.current.flipNext()
          } else {
            setIsAutoPlaying(false)
          }
        }
      }, config.autoPlayInterval)
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [isAutoPlaying, config])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        flipBookRef.current?.flipNext()
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        flipBookRef.current?.flipPrev()
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen, setIsFullscreen])

  // Fullscreen handling
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [setIsFullscreen])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [setIsFullscreen])

  const handleFlip = useCallback((e: FlipEvent) => {
    setCurrentPage(e.data)
    setIsFlipping(false)
  }, [setCurrentPage, setIsFlipping])

  const handleChangeState = useCallback((e: StateEvent) => {
    setIsFlipping(e.data === 'flipping')
  }, [setIsFlipping])

  const handlePrevClick = useCallback(() => {
    if (!isFlipping) {
      flipBookRef.current?.flipPrev()
    }
  }, [isFlipping])

  const handleNextClick = useCallback(() => {
    if (!isFlipping) {
      flipBookRef.current?.flipNext()
    }
  }, [isFlipping])

  if (!currentProject) {
    return (
      <div className={cn('flex items-center justify-center h-96', className)}>
        <p className="text-muted-foreground">No flipbook loaded</p>
      </div>
    )
  }

  const isDoubleLayout = config?.pageLayout === 'double'
  const canGoPrev = currentPage > 0
  const canGoNext = currentPage < totalPages - 1

  // Get rendered pages for flipbook
  const renderedPages = pages.filter(p => p.isRendered && p.imageData)

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative flex flex-col items-center',
        isFullscreen && 'fixed inset-0 z-50 bg-black',
        className
      )}
      style={{ backgroundColor: config?.backgroundColor }}
    >
      {/* Main Viewer */}
      <div className="flex-1 flex items-center justify-center w-full p-4">
        <div
          className="relative flipbook-container"
          style={{
            maxWidth: '100%',
            maxHeight: isFullscreen ? '80vh' : '70vh',
          }}
        >
          {/* Book Shadow */}
          {config?.showShadow && (
            <div
              className="absolute inset-0 rounded-lg pointer-events-none"
              style={{
                boxShadow: `0 20px 60px rgba(0,0,0,${config.shadowOpacity})`,
              }}
            />
          )}

          {/* MagazineBook from react-magazine package */}
          {renderedPages.length > 0 ? (
            <MagazineBook
              ref={flipBookRef}
              width={config?.width ?? 400}
              height={config?.height ?? 600}
              minWidth={300}
              maxWidth={1000}
              minHeight={400}
              maxHeight={1200}
              showCover={true}
              mobileScrollSupport={true}
              swipeDistance={30}
              clickEventForward={true}
              useMouseEvents={true}
              flippingTime={config?.flipSpeed ?? 600}
              startPage={currentPage}
              drawShadow={config?.showShadow ?? true}
              maxShadowOpacity={config?.shadowOpacity ?? 0.3}
              onFlip={handleFlip}
              onChangeState={handleChangeState}
              className="flipbook-viewer"
              style={{
                margin: '0 auto',
              }}
            >
              {pages.map((page) => (
                <div
                  key={page.pageNumber}
                  className="page"
                  style={{
                    backgroundColor: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {page.imageData ? (
                    <img
                      src={page.imageData}
                      alt={`Page ${page.pageNumber}`}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                      }}
                      draggable={false}
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gray-100">
                      <span className="text-gray-400">Loading page {page.pageNumber}...</span>
                    </div>
                  )}
                  {config?.showPageNumbers && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-gray-500">
                      {page.pageNumber}
                    </div>
                  )}
                </div>
              ))}
            </MagazineBook>
          ) : (
            <div className="flex items-center justify-center w-full h-96 bg-gray-100 rounded-lg">
              <span className="text-gray-400">Loading pages...</span>
            </div>
          )}

          {/* Navigation Arrows */}
          {(config?.navigationStyle === 'arrows' || config?.navigationStyle === 'both') && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full mx-2 bg-background/80 backdrop-blur',
                  !canGoPrev && 'opacity-50 cursor-not-allowed'
                )}
                onClick={handlePrevClick}
                disabled={!canGoPrev || isFlipping}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'absolute right-0 top-1/2 -translate-y-1/2 translate-x-full mx-2 bg-background/80 backdrop-blur',
                  !canGoNext && 'opacity-50 cursor-not-allowed'
                )}
                onClick={handleNextClick}
                disabled={!canGoNext || isFlipping}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="w-full px-4 pb-4">
        {/* Thumbnails */}
        {(config?.navigationStyle === 'thumbnails' || config?.navigationStyle === 'both') && (
          <PageThumbnails
            pages={pages}
            currentPage={currentPage}
            onPageSelect={(page) => {
              flipBookRef.current?.turnToPage(page)
              setCurrentPage(page)
            }}
            isDoubleLayout={isDoubleLayout}
          />
        )}

        {/* Control Bar */}
        <div className="flex items-center justify-between mt-4 px-4 py-2 bg-background/80 backdrop-blur rounded-lg">
          <div className="flex items-center gap-2">
            {config?.autoPlay !== undefined && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              >
                {isAutoPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
            )}
            {config?.enableSound !== undefined && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => useFlipbookStore.getState().updateConfig({ enableSound: !config.enableSound })}
              >
                {config.enableSound ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>

          <div className="text-sm text-muted-foreground">
            Page {currentPage + 1} of {totalPages}
          </div>

          <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
