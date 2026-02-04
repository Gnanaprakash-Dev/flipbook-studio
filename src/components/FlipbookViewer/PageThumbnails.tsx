import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { PDFPage } from '@/store/flipbook-store'

interface PageThumbnailsProps {
  pages: PDFPage[]
  currentPage: number
  onPageSelect: (page: number) => void
  isDoubleLayout: boolean
}

export function PageThumbnails({
  pages,
  currentPage,
  onPageSelect,
  isDoubleLayout,
}: PageThumbnailsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const activeThumbRef = useRef<HTMLButtonElement>(null)

  // Scroll to active thumbnail
  useEffect(() => {
    if (activeThumbRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const thumb = activeThumbRef.current

      const scrollLeft =
        thumb.offsetLeft - container.offsetWidth / 2 + thumb.offsetWidth / 2

      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth',
      })
    }
  }, [currentPage])

  return (
    <div className="relative">
      <div
        ref={scrollContainerRef}
        className="flex gap-2 overflow-x-auto py-2 px-4 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
        style={{ scrollbarWidth: 'thin' }}
      >
        {pages.map((page, index) => {
          const isActive = isDoubleLayout
            ? index === currentPage || index === currentPage + 1
            : index === currentPage

          return (
            <motion.button
              key={page.pageNumber}
              ref={isActive ? activeThumbRef : undefined}
              className={cn(
                'relative flex-shrink-0 w-16 h-20 rounded-md overflow-hidden border-2 transition-all',
                isActive
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-transparent hover:border-muted-foreground/30'
              )}
              onClick={() => {
                const targetPage = isDoubleLayout ? Math.floor(index / 2) * 2 : index
                onPageSelect(targetPage)
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {page.imageData ? (
                <img
                  src={page.imageData}
                  alt={`Page ${page.pageNumber}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">
                    {page.pageNumber}
                  </span>
                </div>
              )}

              {/* Page number overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center py-0.5">
                {page.pageNumber}
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Gradient Fades */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none" />
    </div>
  )
}
