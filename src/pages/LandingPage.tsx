import { useNavigate } from 'react-router-dom'
import { UploadZone } from '@/components/UploadZone'
import { useEffect, useRef } from 'react'

// Top marquee - Flipbook related images
const topMarqueeCards = [
  { id: 1, title: 'PDF Flipbook Cover', image: 'https://picsum.photos/seed/flipcover/400/300' },
  { id: 2, title: 'Magazine Flip Pages', image: 'https://picsum.photos/seed/magazine/400/300' },
  { id: 3, title: 'Digital Catalog', image: 'https://picsum.photos/seed/catalog/400/300' },
  { id: 4, title: 'E-Book Reader', image: 'https://picsum.photos/seed/ebook/400/300' },
  { id: 5, title: 'Interactive PDF Viewer', image: 'https://picsum.photos/seed/pdfviewer/400/300' },
  { id: 6, title: 'Brochure Flipbook', image: 'https://picsum.photos/seed/brochure/400/300' },
  { id: 7, title: 'Portfolio Flipbook', image: 'https://picsum.photos/seed/portfolio/400/300' },
  { id: 8, title: 'Annual Report Book', image: 'https://picsum.photos/seed/report/400/300' },
  { id: 9, title: 'Product Lookbook', image: 'https://picsum.photos/seed/lookbook/400/300' },
]

// Bottom marquee - Different creative images
const bottomMarqueeCards = [
  { id: 1, title: 'Photo Album', image: 'https://picsum.photos/seed/album/400/300' },
  { id: 2, title: 'Travel Guide', image: 'https://picsum.photos/seed/travel/400/300' },
  { id: 3, title: 'Recipe Book', image: 'https://picsum.photos/seed/recipe/400/300' },
  { id: 4, title: 'Wedding Catalog', image: 'https://picsum.photos/seed/wedding/400/300' },
  { id: 5, title: 'Fashion Lookbook', image: 'https://picsum.photos/seed/fashion/400/300' },
  { id: 6, title: 'Real Estate Brochure', image: 'https://picsum.photos/seed/realestate/400/300' },
  { id: 7, title: 'Event Program', image: 'https://picsum.photos/seed/event/400/300' },
  { id: 8, title: 'Company Profile', image: 'https://picsum.photos/seed/company/400/300' },
  { id: 9, title: 'Menu Design', image: 'https://picsum.photos/seed/menu/400/300' },
]


export function LandingPage() {
  const navigate = useNavigate()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleUploadComplete = () => {
    navigate('/editor')
  }

  // Starfield animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Stars
    const stars: { x: number; y: number; size: number; speed: number; opacity: number }[] = []
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random()
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw stars
      stars.forEach(star => {
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
        ctx.fill()

        // Twinkle effect
        star.opacity += (Math.random() - 0.5) * 0.05
        star.opacity = Math.max(0.1, Math.min(1, star.opacity))

        // Slow drift
        star.y += star.speed
        if (star.y > canvas.height) {
          star.y = 0
          star.x = Math.random() * canvas.width
        }
      })

      requestAnimationFrame(animate)
    }
    animate()

    return () => window.removeEventListener('resize', resizeCanvas)
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0a0a0f]">
      {/* Starfield Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 50% 100%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)'
        }}
      />

      {/* Perspective Grid Floor */}
      <div className="absolute inset-0" style={{ perspective: '500px' }}>
        <div
          className="absolute w-full h-full"
          style={{
            transform: 'rotateX(60deg) translateY(50%)',
            transformOrigin: 'center top',
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)'
          }}
        />
      </div>

      {/* Horizontal Glow Line */}
      <div
        className="absolute left-0 right-0 h-px top-1/2"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), rgba(139, 92, 246, 0.5), transparent)',
          boxShadow: '0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(139, 92, 246, 0.3)'
        }}
      />

      {/* Corner Accents */}
      <div className="absolute top-8 left-8 w-20 h-20 border-l-2 border-t-2 border-blue-500/30" />
      <div className="absolute top-8 right-8 w-20 h-20 border-r-2 border-t-2 border-blue-500/30" />
      <div className="absolute bottom-8 left-8 w-20 h-20 border-l-2 border-b-2 border-purple-500/30" />
      <div className="absolute bottom-8 right-8 w-20 h-20 border-r-2 border-b-2 border-purple-500/30" />

      {/* Floating Orbs */}
      <div
        className="absolute w-64 h-64 rounded-full opacity-20 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.8), transparent)',
          top: '10%',
          left: '10%',
          animation: 'float 8s ease-in-out infinite'
        }}
      />
      <div
        className="absolute w-48 h-48 rounded-full opacity-20 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.8), transparent)',
          bottom: '20%',
          right: '15%',
          animation: 'float 6s ease-in-out infinite reverse'
        }}
      />

      {/* Scan Lines Effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)'
        }}
      />

      {/* Radial Marquee Section - TOP Arc (curves down into page) */}
      <div className="absolute top-0 left-0 right-0 h-[350px] overflow-hidden pointer-events-none">
        <div className="radial-marquee-wheel-top">
          <div className="radial-marquee-spinner-top">
            {[...topMarqueeCards, ...topMarqueeCards].map((card, index) => {
              const totalCards = topMarqueeCards.length * 2
              const angle = (index / totalCards) * 360

              return (
                <div
                  key={`top-${card.id}-${index}`}
                  className="radial-card-slot-top"
                  style={{ transform: `rotate(${angle}deg)` }}
                >
                  <div className="radial-card-holder-top">
                    <div className="radial-marquee-card-inner">
                      <div className="radial-marquee-card-visual">
                        <img
                          src={card.image}
                          alt={card.title}
                          className="radial-marquee-card-img"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Radial Marquee Section - BOTTOM Arc (curves up into page) */}
      <div className="absolute bottom-0 left-0 right-0 h-[350px] overflow-hidden pointer-events-none">
        <div className="radial-marquee-wheel-bottom">
          <div className="radial-marquee-spinner-bottom">
            {[...bottomMarqueeCards, ...bottomMarqueeCards].map((card, index) => {
              const totalCards = bottomMarqueeCards.length * 2
              const angle = (index / totalCards) * 360
              return (
                <div
                  key={`bottom-${card.id}-${index}`}
                  className="radial-card-slot-bottom"
                  style={{ transform: `rotate(${angle}deg)` }}
                >
                  <div className="radial-card-holder-bottom">
                    <div className="radial-marquee-card-inner">
                      <div className="radial-marquee-card-visual">
                        <img
                          src={card.image}
                          alt={card.title}
                          className="radial-marquee-card-img"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      {/* Center Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-2xl">
          <UploadZone onUploadComplete={handleUploadComplete} />
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-10px) translateX(-10px); }
          75% { transform: translateY(-30px) translateX(5px); }
        }

        @keyframes spinClockwise {
          from { transform: translate(-50%, 0) rotate(0deg); }
          to { transform: translate(-50%, 0) rotate(360deg); }
        }

        @keyframes spinCounterClockwise {
          from { transform: translate(-50%, 0) rotate(0deg); }
          to { transform: translate(-50%, 0) rotate(-360deg); }
        }

        /* ========== TOP MARQUEE - Cards fan DOWN from top ========== */
        .radial-marquee-wheel-top {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        .radial-marquee-spinner-top {
          position: absolute;
          left: 50%;
          top: -600px;
          width: 0;
          height: 0;
          animation: spinClockwise 80s linear infinite;
        }

        .radial-card-slot-top {
          position: absolute;
          left: 0;
          top: 0;
          width: 0;
          height: 0;
          transform-origin: center center;
        }

        .radial-card-holder-top {
          position: absolute;
           width: 240px;
          height: 190px;
          left: -140px;
          top: 628px;
          transform: rotate(180deg);
        }

        /* ========== BOTTOM MARQUEE - Cards fan UP from bottom ========== */
        .radial-marquee-wheel-bottom {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        .radial-marquee-spinner-bottom {
          position: absolute;
          left: 50%;
          bottom: -600px;
          width: 0;
          height: 0;
          animation: spinCounterClockwise 80s linear infinite;
        }

        .radial-card-slot-bottom {
          position: absolute;
          left: 0;
          top: 0;
          width: 0;
          height: 0;
          transform-origin: center center;
        }

        .radial-card-holder-bottom {
          position: absolute;
          width: 240px;
          height: 190px;
          left: -120px;
          bottom: 620px;
        }

        /* ========== SHARED CARD STYLES ========== */
        .radial-marquee-card-inner {
          width: 100%;
          height: 100%;
          background: linear-gradient(160deg, rgba(45, 45, 55, 0.98), rgba(25, 25, 32, 0.99));
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow:
            0 25px 50px rgba(0, 0, 0, 0.5),
            0 10px 20px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          display: flex;
          flex-direction: column;
        }

        .radial-marquee-card-visual {
          position: relative;
          width: 100%;
          flex: 1;
          overflow: hidden;
          background: #1a1a1a;
        }

        .radial-marquee-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .radial-marquee-card-info {
          padding: 12px 16px;
          background: rgba(20, 20, 28, 0.95);
        }

        .radial-marquee-card-title {
          font-size: 13px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.85);
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* ========== RESPONSIVE ========== */
        @media (max-width: 1200px) {
          .radial-card-holder-top,
          .radial-card-holder-bottom {
            width: 240px;
            height: 165px;
            left: -120px;
          }
          .radial-card-holder-top { top: 580px; }
          .radial-card-holder-bottom { bottom: 580px; }
        }

        @media (max-width: 768px) {
          .radial-card-holder-top,
          .radial-card-holder-bottom {
            width: 180px;
            height: 130px;
            left: -90px;
          }
          .radial-card-holder-top { top: 590px; }
          .radial-card-holder-bottom { bottom: 590px; }
          .radial-marquee-spinner-top { top: -620px; }
          .radial-marquee-spinner-bottom { bottom: -620px; }
          .radial-marquee-card-title {
            font-size: 11px;
          }
          .radial-marquee-card-info {
            padding: 8px 12px;
          }
        }
      `}</style>
    </div>
  )
}
