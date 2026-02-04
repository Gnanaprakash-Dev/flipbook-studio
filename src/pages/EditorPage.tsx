import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Download,
  Save,
  Share2,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UploadZone } from '@/components/UploadZone'
import { useFlipbookStore } from '@/store/flipbook-store'
import { ShareModal } from '@/components/ShareModal'
import { DownloadModal } from '@/components/DownloadModal'
import MagazineBook, { Page } from 'react-magazine'

export function EditorPage() {
  const navigate = useNavigate()
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false)

  const { currentProject, resetProject } = useFlipbookStore()

  const handleNewProject = () => {
    resetProject()
  }

  const handleGoBack = () => {
    navigate('/')
  }

  const images = [
    "https://picsum.photos/id/1/400/500",
    "https://picsum.photos/id/2/400/500",
    "https://picsum.photos/id/3/400/500",
    "https://picsum.photos/id/4/400/500",
    "https://picsum.photos/id/5/400/500",
    "https://picsum.photos/id/6/400/500",
    "https://picsum.photos/id/7/400/500",
    "https://picsum.photos/id/8/400/500",
    "https://picsum.photos/id/9/400/500",
    "https://picsum.photos/id/10/400/500",
  ]

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
              <Input
                value={currentProject.name}
                onChange={(e) =>
                  useFlipbookStore.setState((state) => ({
                    currentProject: state.currentProject
                      ? { ...state.currentProject, name: e.target.value }
                      : null,
                  }))
                }
                className="h-8 w-48 text-sm font-medium bg-white/5 border-blue-500/20 text-white placeholder:text-white/30 focus:border-blue-500/50 focus:ring-blue-500/20"
              />
              <span className="text-xs text-blue-200/50">
                {currentProject.totalPages} pages
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {currentProject && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNewProject}
                className="text-white/70 hover:text-white hover:bg-red-500/10"
              >
                <X className="w-4 h-4 mr-2" />
                New
              </Button>
              <div className="h-6 w-px bg-blue-500/20" />
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
              <Button
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
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
                <MagazineBook width={400} height={500} showCover={true} >
                  {images.map((img, index) => (
                    <Page key={index} number={index + 1}>
                      <img
                        src={img}
                        alt={`Page ${index + 1}`}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </Page>
                  ))}
                </MagazineBook>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-8">
              <UploadZone />
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
