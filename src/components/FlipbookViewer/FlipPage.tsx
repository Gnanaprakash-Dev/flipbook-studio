import { motion, type Variants } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PDFPage, FlipAnimation } from '@/store/flipbook-store'

interface FlipPageProps {
  page: PDFPage | undefined
  pageNumber: number
  position: 'left' | 'right'
  isFlipping: boolean
  flipAnimation: FlipAnimation
  flipSpeed: number
  showPageNumber?: boolean
  totalPages: number
}

export function FlipPage({
  page,
  pageNumber,
  position,
  isFlipping,
  flipAnimation,
  flipSpeed,
  showPageNumber,
  totalPages,
}: FlipPageProps) {
  const isLoading = page?.isLoading || (!page?.imageData && page !== undefined)
  const imageData = page?.imageData

  const getFlipVariants = (): Variants => {
    switch (flipAnimation) {
      case 'hard':
        return {
          initial: { rotateY: 0 },
          flip: {
            rotateY: position === 'left' ? -180 : 180,
            transition: { duration: flipSpeed / 1000, ease: 'easeInOut' },
          },
        }
      case 'soft':
        return {
          initial: { rotateY: 0, scale: 1 },
          flip: {
            rotateY: position === 'left' ? -180 : 180,
            scale: [1, 1.02, 1],
            transition: {
              duration: flipSpeed / 1000,
              ease: [0.4, 0, 0.2, 1],
            },
          },
        }
      case 'fade':
        return {
          initial: { opacity: 1 },
          flip: {
            opacity: [1, 0, 1],
            transition: { duration: flipSpeed / 1000 },
          },
        }
      case 'vertical':
        return {
          initial: { rotateX: 0 },
          flip: {
            rotateX: 180,
            transition: { duration: flipSpeed / 1000, ease: 'easeInOut' },
          },
        }
      default:
        return {
          initial: { rotateY: 0 },
          flip: {
            rotateY: position === 'left' ? -180 : 180,
            transition: { duration: flipSpeed / 1000, ease: 'easeInOut' },
          },
        }
    }
  }

  const variants = getFlipVariants()

  return (
    <motion.div
      className={cn(
        'relative flex-1 h-full bg-white overflow-hidden',
        position === 'left' ? 'origin-right' : 'origin-left'
      )}
      style={{
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
      }}
      initial="initial"
      animate={isFlipping ? 'flip' : 'initial'}
      variants={variants}
    >
      {/* Page Content */}
      <div className="absolute inset-0 flex items-center justify-center bg-white">
        {isLoading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Loading page {pageNumber}...</span>
          </div>
        ) : imageData ? (
          <img
            src={imageData}
            alt={`Page ${pageNumber}`}
            className="max-w-full max-h-full object-contain"
            draggable={false}
          />
        ) : pageNumber > totalPages ? (
          <div className="flex items-center justify-center h-full bg-gray-50">
            <span className="text-muted-foreground">End of document</span>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-muted-foreground">Page {pageNumber}</span>
          </div>
        )}
      </div>

      {/* Page Number */}
      {showPageNumber && pageNumber <= totalPages && (
        <div
          className={cn(
            'absolute bottom-4 text-xs text-muted-foreground',
            position === 'left' ? 'left-4' : 'right-4'
          )}
        >
          {pageNumber}
        </div>
      )}

      {/* Page Edge Effect */}
      <div
        className={cn(
          'absolute inset-y-0 w-[2px] bg-gradient-to-r from-black/5 to-transparent',
          position === 'left' ? 'right-0' : 'left-0'
        )}
      />

      {/* Inner Shadow (for realism) */}
      <div
        className={cn(
          'absolute inset-0 pointer-events-none',
          position === 'left'
            ? 'bg-gradient-to-r from-transparent via-transparent to-black/[0.02]'
            : 'bg-gradient-to-l from-transparent via-transparent to-black/[0.02]'
        )}
      />
    </motion.div>
  )
}
