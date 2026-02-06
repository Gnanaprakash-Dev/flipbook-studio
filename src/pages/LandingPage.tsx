import { useNavigate } from 'react-router-dom'
import { UploadZone } from '@/components/UploadZone'
import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring as useFramerSpring, useScroll, useTransform, useSpring, useInView } from 'framer-motion'
import {
  Upload,
  Zap,
  Share2,
  Download,
  Lock,
  Smartphone,
  Globe,
  Sparkles,
  CheckCircle,
  ArrowRight,
  BookOpen,
  Play,
  Github,
  Linkedin,
  Twitter,
  Mail,
  FileText,
  GraduationCap,
  Image,
  ShoppingBag,
  Palette,
  Building2,
  Newspaper,
  Heart,
} from 'lucide-react'
import '@/styles/landing-animations.css'

// Features data
const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Convert PDFs in seconds with our optimized cloud processing.',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Share2,
    title: 'Instant Sharing',
    description: 'Get shareable links immediately. No waiting, no hassle.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Smartphone,
    title: 'Any Device',
    description: 'Perfect viewing experience on desktop, tablet, and mobile.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Download,
    title: 'Export Options',
    description: 'Download as HTML or ZIP. Host anywhere you want.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Lock,
    title: 'No Account Needed',
    description: 'Start instantly. No sign-up, no credit card required.',
    color: 'from-red-500 to-rose-500',
  },
  {
    icon: Globe,
    title: 'Global CDN',
    description: 'Fast loading worldwide with enterprise-grade hosting.',
    color: 'from-indigo-500 to-violet-500',
  },
]

// How it works
const steps = [
  { step: 1, title: 'Upload', description: 'Drag & drop your PDF file', icon: Upload, preview: 'https://cdni.iconscout.com/illustration/premium/thumb/upload-document-illustration-svg-download-png-8273219.png' },
  { step: 2, title: 'Convert', description: 'We process it instantly', icon: Sparkles, preview: 'https://images.paperturn.com/f/f1/PDF-to-Flipbook.png' },
  { step: 3, title: 'Share', description: 'Get your flipbook link', icon: Share2, preview: 'https://images.paperturn.com/f/f1/Flipbook-real-estate.png' },
]

// Marquee cards for upload section
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

// Flipbook preview books data
const previewBooks = [
  {
    title: 'Magazine',
    subtitle: 'Fashion & Lifestyle',
    icon: Newspaper,
    cover: 'https://picsum.photos/seed/magazine-cover/440/560',
    spineColor: 'from-rose-600 to-pink-700',
    badgeColor: 'bg-rose-500/30 text-rose-300 border border-rose-500/30',
    badgeText: 'Popular',
    pageColors: ['#fef2f2', '#fff1f2', '#fce7f3'],
    pageImages: [
      'https://picsum.photos/seed/mag-page1/440/560',
      'https://picsum.photos/seed/mag-page2/440/560',
      'https://picsum.photos/seed/mag-page3/440/560',
    ],
    delay: 0,
  },
  {
    title: 'Product Catalog',
    subtitle: 'E-Commerce Ready',
    icon: ShoppingBag,
    cover: 'https://picsum.photos/seed/catalog-cover/440/560',
    spineColor: 'from-blue-600 to-indigo-700',
    badgeColor: 'bg-blue-500/30 text-blue-300 border border-blue-500/30',
    badgeText: 'Business',
    pageColors: ['#eff6ff', '#e0f2fe', '#dbeafe'],
    pageImages: [
      'https://picsum.photos/seed/cat-page1/440/560',
      'https://picsum.photos/seed/cat-page2/440/560',
      'https://picsum.photos/seed/cat-page3/440/560',
    ],
    delay: 0.15,
  },
  {
    title: 'Portfolio',
    subtitle: 'Creative Showcase',
    icon: Palette,
    cover: 'https://picsum.photos/seed/portfolio-cover/440/560',
    spineColor: 'from-purple-600 to-violet-700',
    badgeColor: 'bg-purple-500/30 text-purple-300 border border-purple-500/30',
    badgeText: 'Creative',
    pageColors: ['#faf5ff', '#f3e8ff', '#ede9fe'],
    pageImages: [
      'https://picsum.photos/seed/port-page1/440/560',
      'https://picsum.photos/seed/port-page2/440/560',
      'https://picsum.photos/seed/port-page3/440/560',
    ],
    delay: 0.3,
  },
  {
    title: 'Annual Report',
    subtitle: 'Corporate & Finance',
    icon: Building2,
    cover: 'https://picsum.photos/seed/report-cover/440/560',
    spineColor: 'from-emerald-600 to-teal-700',
    badgeColor: 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/30',
    badgeText: 'Corporate',
    pageColors: ['#ecfdf5', '#d1fae5', '#a7f3d0'],
    pageImages: [
      'https://picsum.photos/seed/rep-page1/440/560',
      'https://picsum.photos/seed/rep-page2/440/560',
      'https://picsum.photos/seed/rep-page3/440/560',
    ],
    delay: 0.45,
  },
]

// 3D Animated Book Preview Component
function PreviewBook({ book, index }: { book: typeof previewBooks[0]; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, rotateY: 30 }}
      animate={isInView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
      transition={{ duration: 0.8, delay: book.delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col items-center"
    >
      <div className="preview-book-scene">
        <div className="preview-book">
          {/* Back cover */}
          <div className="preview-book-back" />

          {/* Spine */}
          <div className={`preview-book-spine bg-gradient-to-b ${book.spineColor}`} />

          {/* Animated flipping pages with full images */}
          <div className="preview-book-pages">
            <div
              className="preview-book-page preview-page-flip-3"
              style={{ animationDelay: `${index * 1.2}s` }}
            >
              <img src={book.pageImages[2]} alt={`${book.title} page 3`} className="preview-page-img" loading="lazy" />
            </div>
            <div
              className="preview-book-page preview-page-flip-2"
              style={{ animationDelay: `${index * 1.2}s` }}
            >
              <img src={book.pageImages[1]} alt={`${book.title} page 2`} className="preview-page-img" loading="lazy" />
            </div>
            <div
              className="preview-book-page preview-page-flip-1"
              style={{ animationDelay: `${index * 1.2}s` }}
            >
              <img src={book.pageImages[0]} alt={`${book.title} page 1`} className="preview-page-img" loading="lazy" />
            </div>
          </div>

          {/* Front cover — flips open to reveal pages */}
          <div className="preview-book-cover preview-cover-flip" style={{ animationDelay: `${index * 1.2}s` }}>
            <img src={book.cover} alt={book.title} loading="lazy" />
            <div className="preview-book-cover-overlay" />

            {/* Badge */}
            <div className={`preview-book-badge ${book.badgeColor}`}>
              {book.badgeText}
            </div>

            {/* Label at bottom of cover */}
            <div className="preview-book-label">
              <div className="flex items-center gap-2">
                <book.icon className="w-4 h-4 text-white/80" />
                <span className="text-white font-bold text-sm">{book.title}</span>
              </div>
              <p className="text-white/60 text-xs mt-0.5">{book.subtitle}</p>
            </div>
          </div>

          {/* Shadow */}
          <div className="preview-book-shadow" />
        </div>
      </div>

      {/* Title below book */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: book.delay + 0.4, duration: 0.5 }}
        className="mt-8 text-center"
      >
        <h3 className="text-lg font-bold mb-1">{book.title}</h3>
        <p className="text-gray-500 text-sm">{book.subtitle}</p>
      </motion.div>
    </motion.div>
  )
}

// Custom Circle Cursor
function CustomCursor() {
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const springConfig = { stiffness: 300, damping: 25, mass: 0.5 }
  const smoothX = useFramerSpring(cursorX, springConfig)
  const smoothY = useFramerSpring(cursorY, springConfig)

  const outerSpringConfig = { stiffness: 150, damping: 20, mass: 0.8 }
  const outerX = useFramerSpring(cursorX, outerSpringConfig)
  const outerY = useFramerSpring(cursorY, outerSpringConfig)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)
    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseEnter = () => setIsVisible(true)

    const handleHoverStart = () => setIsHovering(true)
    const handleHoverEnd = () => setIsHovering(false)

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    document.documentElement.addEventListener('mouseleave', handleMouseLeave)
    document.documentElement.addEventListener('mouseenter', handleMouseEnter)

    const interactiveEls = document.querySelectorAll('a, button, [role="button"], input, textarea, select, .feature-flip-card')
    interactiveEls.forEach((el) => {
      el.addEventListener('mouseenter', handleHoverStart)
      el.addEventListener('mouseleave', handleHoverEnd)
    })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave)
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter)
      interactiveEls.forEach((el) => {
        el.removeEventListener('mouseenter', handleHoverStart)
        el.removeEventListener('mouseleave', handleHoverEnd)
      })
    }
  }, [cursorX, cursorY, isVisible])

  // Hide on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null
  }

  return (
    <>
      {/* Inner dot */}
      <motion.div
        className="custom-cursor-dot"
        style={{
          x: smoothX,
          y: smoothY,
          opacity: isVisible ? 1 : 0,
          scale: isClicking ? 0.5 : 1,
        }}
      />
      {/* Outer ring */}
      <motion.div
        className="custom-cursor-ring"
        style={{
          x: outerX,
          y: outerY,
          opacity: isVisible ? 1 : 0,
        }}
        animate={{
          width: isHovering ? 50 : 36,
          height: isHovering ? 50 : 36,
          borderColor: isHovering
            ? 'rgba(255, 255, 255, 0.8)'
            : 'rgba(255, 255, 255, 0.5)',
          backgroundColor: isHovering
            ? 'rgba(255, 255, 255, 0.08)'
            : 'rgba(255, 255, 255, 0)',
        }}
        transition={{ duration: 0.2 }}
      />
      {/* Trail glow */}
      <motion.div
        className="custom-cursor-glow"
        style={{
          x: outerX,
          y: outerY,
          opacity: isVisible ? (isHovering ? 0.3 : 0.15) : 0,
        }}
        animate={{
          width: isHovering ? 80 : 60,
          height: isHovering ? 80 : 60,
        }}
        transition={{ duration: 0.3 }}
      />
    </>
  )
}

// Global Snow Effect Component
function SnowEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

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

    // Track cursor position
    const mouse = { x: -9999, y: -9999 }
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    window.addEventListener('mousemove', handleMouseMove)

    const CURSOR_RADIUS = 120
    const REPEL_STRENGTH = 1.8

    // Snow particles
    const stars: { x: number; y: number; size: number; speed: number; opacity: number; vx: number; vy: number }[] = []
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random(),
        vx: 0,
        vy: 0,
      })
    }

    let animationId: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      stars.forEach((star) => {
        // Cursor repulsion
        const dx = star.x - mouse.x
        const dy = star.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < CURSOR_RADIUS && dist > 0) {
          const force = (1 - dist / CURSOR_RADIUS) * REPEL_STRENGTH
          star.vx += (dx / dist) * force
          star.vy += (dy / dist) * force
        }

        // Apply velocity with friction
        star.x += star.vx
        star.y += star.vy
        star.vx *= 0.92
        star.vy *= 0.92

        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
        ctx.fill()

        // Twinkle effect
        star.opacity += (Math.random() - 0.5) * 0.05
        star.opacity = Math.max(0.1, Math.min(1, star.opacity))

        // Slow drift downward
        star.y += star.speed
        if (star.y > canvas.height) {
          star.y = 0
          star.x = Math.random() * canvas.width
          star.vx = 0
          star.vy = 0
        }
        if (star.x < 0) star.x = canvas.width
        if (star.x > canvas.width) star.x = 0
      })

      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1]"
    />
  )
}

// Animated text component
function AnimatedText({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: i * 0.03 }}
          className="inline-block "
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  )
}

// Parallax section component
function ParallaxSection({ children, offset = 50 }: { children: React.ReactNode; offset?: number }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset])

  return (
    <motion.div ref={ref} style={{ y }}>
      {children}
    </motion.div>
  )
}

// Feature card with 3D flip on hover
function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, rotateX: -15 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
      className="feature-flip-container"
    >
      <div className="feature-flip-card group">
        {/* Front */}
        <div className="feature-flip-front glass-card p-6 relative overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
          <motion.div
            className="feature-icon mb-4 relative z-10"
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ type: 'spring', delay: index * 0.1 + 0.3 }}
          >
            <feature.icon className="w-7 h-7 text-blue-400" />
          </motion.div>
          <h3 className="text-xl font-bold mb-2 relative z-10">{feature.title}</h3>
          <p className="text-gray-400 relative z-10 text-sm">{feature.description}</p>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/0 to-transparent group-hover:via-blue-500/30 transition-all duration-500" />
        </div>
        {/* Back */}
        <div className={`feature-flip-back p-6 flex flex-col items-center justify-center text-center bg-gradient-to-br ${feature.color} rounded-3xl`}>
          <feature.icon className="w-10 h-10 text-white mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
          <p className="text-white/80 text-sm">{feature.description}</p>
        </div>
      </div>
    </motion.div>
  )
}

// Step card with animation and preview
function StepCard({ step, index, total }: { step: typeof steps[0]; index: number; total: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className="relative flex flex-col items-center text-center"
    >
      {index < total - 1 && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: index * 0.2 + 0.3 }}
          className="hidden md:block absolute top-12 left-[57%] w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 origin-left"
        />
      )}
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-2 border-blue-500/50 flex items-center justify-center mb-6 relative"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border-2 border-dashed border-purple-500/30"
        />
        <span className="text-3xl font-bold gradient-text">{step.step}</span>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: index * 0.2 + 0.2 }}
      >
        <div className="feature-icon mx-auto mb-4">
          <step.icon className="w-6 h-6 text-purple-400" />
        </div>
        <h3 className="text-xl font-bold mb-2">{step.title}</h3>
        <p className="text-gray-400 mb-4">{step.description}</p>
      </motion.div>

      {/* Preview image with 3D tilt */}
      <motion.div
        initial={{ opacity: 0, y: 30, rotateY: -15 }}
        animate={isInView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
        transition={{ duration: 0.7, delay: index * 0.2 + 0.4, ease: 'easeOut' }}
        whileHover={{ scale: 1.05, rotateY: 8, rotateX: -5 }}
        className="step-preview-card mt-2"
      >
        <img
          src={step.preview}
          alt={`${step.title} preview`}
          className="step-preview-img"
          loading="lazy"
        />
        <div className="step-preview-shine" />
      </motion.div>
    </motion.div>
  )
}

// Upload Section with Radial Marquee
function UploadSection({ onUploadComplete }: { onUploadComplete: (id: string) => void }) {
  return (
    <section id="upload-section" className="relative min-h-screen overflow-hidden">
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
        className="absolute w-64 h-64 rounded-full opacity-20 blur-3xl animate-float"
        style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.8), transparent)', top: '10%', left: '10%' }}
      />
      <div
        className="absolute w-48 h-48 rounded-full opacity-20 blur-3xl animate-float-reverse"
        style={{ background: 'radial-gradient(circle, rgba(139, 92, 246, 0.8), transparent)', bottom: '20%', right: '15%' }}
      />

      {/* Scan Lines Effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)' }}
      />

      {/* Radial Marquee - TOP */}
      <div className="absolute top-0 left-0 right-0 h-[350px] overflow-hidden pointer-events-none">
        <div className="radial-marquee-wheel-top">
          <div className="radial-marquee-spinner-top">
            {[...topMarqueeCards, ...topMarqueeCards].map((card, index) => {
              const totalCards = topMarqueeCards.length * 2
              const angle = (index / totalCards) * 360
              return (
                <div key={`top-${card.id}-${index}`} className="radial-card-slot-top" style={{ transform: `rotate(${angle}deg)` }}>
                  <div className="radial-card-holder-top">
                    <div className="radial-marquee-card-inner">
                      <div className="radial-marquee-card-visual">
                        <img src={card.image} alt={card.title} className="radial-marquee-card-img" loading="lazy" />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Radial Marquee - BOTTOM */}
      <div className="absolute bottom-0 left-0 right-0 h-[350px] overflow-hidden pointer-events-none">
        <div className="radial-marquee-wheel-bottom">
          <div className="radial-marquee-spinner-bottom">
            {[...bottomMarqueeCards, ...bottomMarqueeCards].map((card, index) => {
              const totalCards = bottomMarqueeCards.length * 2
              const angle = (index / totalCards) * 360
              return (
                <div key={`bottom-${card.id}-${index}`} className="radial-card-slot-bottom" style={{ transform: `rotate(${angle}deg)` }}>
                  <div className="radial-card-holder-bottom">
                    <div className="radial-marquee-card-inner">
                      <div className="radial-marquee-card-visual">
                        <img src={card.image} alt={card.title} className="radial-marquee-card-img" loading="lazy" />
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
          <UploadZone onUploadComplete={onUploadComplete} />
        </div>
      </div>

    </section>
  )
}

export function LandingPage() {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll()
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const heroScale = useTransform(heroProgress, [0, 1], [1, 0.8])
  const heroOpacity = useTransform(heroProgress, [0, 0.5], [1, 0])
  const heroY = useTransform(heroProgress, [0, 1], [0, 200])
  const heroRotate = useTransform(heroProgress, [0, 1], [0, -5])

  const bgY1 = useTransform(scrollYProgress, [0, 1], [0, -300])
  const bgY2 = useTransform(scrollYProgress, [0, 1], [0, -500])
  const bgY3 = useTransform(scrollYProgress, [0, 1], [0, -200])

  const handleUploadComplete = (id: string) => {
    navigate(`/editor/${id}`)
  }

  const scrollToUpload = () => {
    document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-[#050508] text-white overflow-x-hidden cursor-none">
      {/* Custom Cursor */}
      <CustomCursor />

      {/* Global Snow Effect */}
      <SnowEffect />

      {/* Scroll Progress Bar */}
      <motion.div className="scroll-progress" style={{ scaleX: smoothProgress }} />

      {/* Noise Overlay */}
      <div className="noise-overlay" />

      {/* Fixed Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div style={{ y: bgY1 }} className="absolute w-[800px] h-[800px] rounded-full opacity-20 blur-[120px] bg-blue-600 -top-96 -left-96" />
        <motion.div style={{ y: bgY2 }} className="absolute w-[600px] h-[600px] rounded-full opacity-15 blur-[120px] bg-purple-600 top-1/2 -right-48" />
        <motion.div style={{ y: bgY3 }} className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-[120px] bg-pink-600 -bottom-48 left-1/4" />
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-10">
        <motion.div
          style={{ scale: heroScale, opacity: heroOpacity, y: heroY, rotateX: heroRotate }}
          className="relative z-10 text-center px-6 max-w-6xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 mb-8"
          >
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
              <Sparkles className="w-5 h-5 text-green-400" />
            </motion.div>
            <span className="text-green-400 font-semibold">Completely Free - Forever</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-[1.1]">
            <AnimatedText text="Turn PDFs into" className="block" />
            <span className="gradient-text-animated block mt-2">
              <AnimatedText text="Magic Flipbooks" className='h-[112px]'/>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-xl md:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto !leading-relaxed"
          >
            Create stunning interactive flipbooks with realistic page-turning effects.
            <span className="text-white font-medium"> No sign-up. No watermarks. No limits.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <motion.button
              onClick={scrollToUpload}
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(59, 130, 246, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              className="group px-10 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl font-bold text-xl shadow-2xl shadow-blue-500/25 flex items-center gap-3"
            >
              <Play className="w-6 h-6" />
              Start Free - No Sign Up
              <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <ArrowRight className="w-6 h-6" />
              </motion.div>
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-8"
          >
            {['No Credit Card', 'No Watermarks', 'Unlimited Use'].map((text, i) => (
              <motion.div
                key={text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + i * 0.1 }}
                className="flex items-center gap-2 text-gray-400"
              >
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>{text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>





      {/* How It Works Section */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <ParallaxSection offset={30}>
            <div className="text-center mb-16">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-sm font-medium mb-4"
              >
                Super Simple
              </motion.span>
              <h2 className="text-4xl md:text-6xl font-black">
                <AnimatedText text="Three Steps to " />
                <span className="gradient-text">Magic</span>
              </h2>
            </div>
          </ParallaxSection>
          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((step, i) => (
              <StepCard key={step.step} step={step} index={i} total={steps.length} />
            ))}
          </div>

          {/* Floating 3D showcase */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-20 relative flex justify-center items-center"
          >
          </motion.div>
        </div>
      </section>

      {/* Flipbook Preview Results Section */}
      <section className="py-28 px-6 relative z-10 overflow-hidden" style={{ perspective: '1200px' }}>
        {/* Background ambient effects */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.15, 0.08] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-purple-600 blur-[150px] pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.06, 0.12, 0.06] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-blue-600 blur-[120px] pointer-events-none"
        />

        {/* Floating book page particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`book-particle-${i}`}
              className="absolute w-5 h-7 rounded-sm border border-white/[0.06] bg-white/[0.02]"
              style={{
                left: `${10 + (i * 12) % 80}%`,
                top: `${15 + (i * 17) % 70}%`,
              }}
              animate={{
                y: [0, -30 - i * 5, 0],
                rotate: [0, (i % 2 === 0 ? 15 : -15), 0],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 5 + i * 0.7,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.6,
              }}
            />
          ))}
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Section heading */}
          <ParallaxSection offset={30}>
            <div className="text-center mb-20">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-sm font-medium mb-4"
              >
                <BookOpen className="w-4 h-4" />
                Preview Results
              </motion.span>
              <h2 className="text-4xl md:text-6xl font-black mb-4">
                <AnimatedText text="Beautiful " />
                <span className="gradient-text">Flipbooks</span>
              </h2>
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-xl text-gray-400 max-w-2xl mx-auto"
              >
                See what your PDFs become — interactive 3D flipbooks with realistic page-turning effects.
              </motion.p>
            </div>
          </ParallaxSection>

          {/* Books grid */}
          <div className="preview-books-scroll">
            {previewBooks.map((book, i) => (
              <PreviewBook key={book.title} book={book} index={i} />
            ))}
          </div>

          {/* Bottom info row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-6 md:gap-10"
          >
            {[
              { icon: FileText, text: 'Any PDF Format' },
              { icon: Image, text: 'High-Res Renders' },
              { icon: GraduationCap, text: 'Academic Papers' },
              { icon: Heart, text: 'Wedding Albums' },
            ].map((item, i) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 + i * 0.1, type: 'spring' }}
                className="flex items-center gap-2 text-gray-400 text-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  <item.icon className="w-4 h-4 text-blue-400" />
                </div>
                <span>{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Upload Section with Radial Marquee */}
      <UploadSection onUploadComplete={handleUploadComplete} />


      {/* Flipbook Studio Showcase Section */}
      <section className="py-24 px-6 relative z-10 overflow-hidden pb-0">
        <div className="max-w-6xl mx-auto">
          <div className="digi-mag-grid">
            {/* Left - Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="flex flex-col justify-center"
            >
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block w-fit px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-medium mb-6"
              >
                Beyond Static Pages
              </motion.span>

              <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                <AnimatedText text="Your PDFs, " />
                <span className="gradient-text">Now Interactive</span>
              </h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-lg text-gray-400 leading-relaxed mb-8"
              >
                Stop sending boring PDF attachments that nobody opens. Turn them into stunning, page-flipping experiences that captivate your audience from the first click. Whether it's a product catalog, company report, or creative portfolio — your content deserves to be more than a static file sitting in someone's downloads folder.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.35 }}
                className="flex flex-wrap gap-3"
              >
                {['3D Page-Turn Effect', 'One-Click Share Links', 'Zero Watermarks'].map((tag, i) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.08 }}
                    className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 font-medium"
                  >
                    {tag}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>

            {/* Right - Video */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            >
              <div className="digi-mag-video-inner">
                <img
                  src="https://d1qwl4ymp6qhug.cloudfront.net/Release/R10180/images/presentation-examples/features/branding_2x.png"
                  alt="Flipbook Studio showcase"
                  className="digi-mag-img"
                  loading="lazy"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

       {/* Comparison Section */}
      <section className="py-24 px-6 relative overflow-hidden z-10" style={{ perspective: '1200px' }}>
        {/* Floating dollar coins rising upward — money you save */}
        <div className="absolute inset-0 pointer-events-none hidden md:block overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={`coin-${i}`}
              className="absolute"
              style={{ left: `${6 + i * 9}%`, bottom: '-40px' }}
              animate={{
                y: [0, -(600 + i * 80)],
                x: [(i % 2 === 0 ? -20 : 20), (i % 2 === 0 ? 20 : -20)],
                rotateY: [0, 360],
                opacity: [0, 0.7, 0.7, 0],
              }}
              transition={{
                duration: 8 + i * 1.2,
                repeat: Infinity,
                delay: i * 0.9,
                ease: 'easeOut',
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black"
                style={{
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)',
                  boxShadow: '0 0 12px rgba(251,191,36,0.4), inset 0 -2px 4px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.3)',
                  color: '#78350f',
                  transformStyle: 'preserve-3d',
                }}
              >
                $
              </div>
            </motion.div>
          ))}

          {/* Orbiting ellipse rings around the section center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ perspective: '800px' }}>
            <motion.div
              animate={{ rotateZ: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              className="w-[700px] h-[700px] rounded-full border border-dashed border-green-500/15"
              style={{ transform: 'rotateX(70deg)', transformStyle: 'preserve-3d' }}
            >
              {/* Orbiting dot */}
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-green-400 shadow-[0_0_12px_rgba(74,222,128,0.8)]" />
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]" />
            </motion.div>

            <motion.div
              animate={{ rotateZ: -360 }}
              transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-dotted border-blue-500/10"
              style={{ transform: 'rotateX(65deg) rotateY(15deg)', transformStyle: 'preserve-3d' }}
            >
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.7)]" />
            </motion.div>
          </div>

          {/* Floating savings badges — left side */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 80, delay: 0.3 }}
            className="absolute left-[3%] top-[18%]"
          >
            <motion.div
              animate={{ y: [0, -14, 0], rotate: [0, -3, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-sm"
            >
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-3.5 h-3.5 text-green-400" />
              </div>
              <span className="text-xs font-semibold text-gray-300">Save $588/yr</span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 80, delay: 0.6 }}
            className="absolute left-[5%] bottom-[22%]"
          >
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, 2, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-sm"
            >
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-3.5 h-3.5 text-green-400" />
              </div>
              <span className="text-xs font-semibold text-gray-300">No hidden fees</span>
            </motion.div>
          </motion.div>

          {/* Floating savings badges — right side */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 80, delay: 0.5 }}
            className="absolute right-[3%] top-[20%]"
          >
            <motion.div
              animate={{ y: [0, -12, 0], rotate: [0, 3, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-sm"
            >
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-3.5 h-3.5 text-green-400" />
              </div>
              <span className="text-xs font-semibold text-gray-300">No credit card</span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 80, delay: 0.8 }}
            className="absolute right-[4%] bottom-[20%]"
          >
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, -2, 0] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-sm"
            >
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-3.5 h-3.5 text-green-400" />
              </div>
              <span className="text-xs font-semibold text-gray-300">Cancel nothing</span>
            </motion.div>
          </motion.div>

          {/* Floating "crossed-out" mini invoices */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', delay: 0.4 }}
            className="absolute left-[2%] top-[44%]"
          >
            <motion.div
              animate={{ y: [0, -18, 0], rotateZ: [-4, -8, -4] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="w-20 h-24 rounded-lg bg-white/[0.04] border border-white/10 p-2 relative overflow-hidden">
                <div className="space-y-1.5">
                  <div className="h-1 w-10 rounded bg-white/10" />
                  <div className="h-1 w-14 rounded bg-white/10" />
                  <div className="h-1 w-8 rounded bg-white/10" />
                  <div className="h-px w-full bg-white/10 my-1" />
                  <div className="h-1.5 w-12 rounded bg-red-400/20" />
                </div>
                {/* Red X stamp */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-red-500/40 text-3xl font-black rotate-[-12deg]">X</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', delay: 1.0 }}
            className="absolute right-[2%] top-[42%]"
          >
            <motion.div
              animate={{ y: [0, -14, 0], rotateZ: [5, 9, 5] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            >
              <div className="w-20 h-24 rounded-lg bg-white/[0.04] border border-white/10 p-2 relative overflow-hidden">
                <div className="space-y-1.5">
                  <div className="h-1 w-12 rounded bg-white/10" />
                  <div className="h-1 w-9 rounded bg-white/10" />
                  <div className="h-1 w-14 rounded bg-white/10" />
                  <div className="h-px w-full bg-white/10 my-1" />
                  <div className="h-1.5 w-10 rounded bg-red-400/20" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-red-500/40 text-3xl font-black rotate-[15deg]">X</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <div className="max-w-4xl mx-auto">
          <ParallaxSection offset={30}>
            <motion.div
              initial={{ opacity: 0, y: 60, rotateX: 8 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
              whileHover={{ rotateX: -2, rotateY: 1, scale: 1.01 }}
              className="glass-card p-10 md:p-16 text-center relative overflow-hidden"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Animated gradient border */}
              <div className="absolute -inset-0 rounded-3xl">
                <motion.div
                  animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                  className="absolute -inset-0 rounded-3xl border-2 border-transparent opacity-50"
                  style={{
                    backgroundImage: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #10b981, #3b82f6)',
                    backgroundSize: '300% 100%',
                    padding: '2px',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                  }}
                />
              </div>

              {/* Floating orbs */}
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.3, 1] }}
                transition={{ rotate: { duration: 20, repeat: Infinity, ease: 'linear' }, scale: { duration: 6, repeat: Infinity, ease: 'easeInOut' } }}
                className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full blur-3xl"
              />
              <motion.div
                animate={{ rotate: -360, scale: [1, 1.2, 1] }}
                transition={{ rotate: { duration: 25, repeat: Infinity, ease: 'linear' }, scale: { duration: 8, repeat: Infinity, ease: 'easeInOut' } }}
                className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-br from-blue-500/15 to-purple-500/15 rounded-full blur-3xl"
              />

              {/* Badge */}
              <motion.span
                initial={{ scale: 0, rotate: -10 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                className="inline-block px-6 py-2 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 font-bold text-lg mb-6"
              >
                <motion.span
                  animate={{ opacity: [1, 0.6, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block"
                >
                  Forever Free
                </motion.span>
              </motion.span>

              {/* Heading with 3D stagger */}
              <motion.h2
                initial={{ opacity: 0, y: 30, rotateX: 15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="text-4xl md:text-5xl font-black mb-6"
                style={{ transformStyle: 'preserve-3d' }}
              >
                Why Pay <motion.span
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="line-through text-gray-600 inline-block"
                >$50/month</motion.span>
                <br />
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', delay: 0.6 }}
                  className="block mt-6"
                >
                  When It's <motion.span
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="text-green-400 inline-block"
                  >$0</motion.span>?
                </motion.span>
              </motion.h2>

              {/* Feature grid with 3D flip-in */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
                {['Unlimited PDFs', 'No Watermarks', 'Instant Links', 'Fast CDN', 'Mobile Ready', 'Export Options', 'No Sign Up', 'No Limits'].map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, rotateY: -90, scale: 0.8 }}
                    whileInView={{ opacity: 1, rotateY: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.07, ease: 'easeOut' }}
                    whileHover={{ scale: 1.08, y: -3, rotateY: 5 }}
                    className="flex items-center gap-2 text-sm p-2 rounded-lg hover:bg-white/5 transition-colors cursor-default"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: 'spring', delay: 0.5 + i * 0.07 }}
                    >
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    </motion.div>
                    <span>{item}</span>
                  </motion.div>
                ))}
              </div>

              {/* CTA Button */}
              <motion.button
                onClick={scrollToUpload}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(16, 185, 129, 0.4)', y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="relative z-20 mt-10 px-10 py-5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl font-bold text-xl inline-flex items-center gap-3"
              >
                Start Creating Free
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-6 h-6" />
                </motion.div>
              </motion.button>
            </motion.div>
          </ParallaxSection>
        </div>
      </section>



      {/* Features Section */}
      <section className="py-24 px-6 relative z-10 overflow-hidden">
        {/* Ambient glow orbs */}
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 -left-32 w-72 h-72 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"
        />
        <motion.div
          animate={{ x: [0, -25, 0], y: [0, 25, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          className="absolute -bottom-32 -right-32 w-64 h-64 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"
        />

        <div className="max-w-7xl mx-auto">
          <ParallaxSection offset={30}>
            <div className="text-center mb-16">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-medium mb-4"
              >
                All-In-One Toolkit
              </motion.span>
              <h2 className="text-4xl md:text-6xl font-black mb-4">
                <AnimatedText text="Pro Features, " />
                <span className="gradient-text">Zero Price Tag</span>
              </h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-xl text-gray-400 max-w-2xl mx-auto"
              >
                Every tool you need to create, customize, and share — completely free, forever.
              </motion.p>
            </div>
          </ParallaxSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <FeatureCard key={feature.title} feature={feature} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Author / About Section */}
      <section className="py-24 px-6 relative z-10 overflow-hidden">
        {/* Floating code snippets */}
        <div className="absolute inset-0 pointer-events-none">
          {[
            { text: '<React />', left: '5%', top: '15%', size: 'text-xs' },
            { text: 'npm start', left: '88%', top: '20%', size: 'text-xs' },
            { text: '{ }', left: '10%', top: '75%', size: 'text-lg' },
            { text: 'async/await', left: '82%', top: '70%', size: 'text-xs' },
            { text: 'const dev =', left: '3%', top: '45%', size: 'text-xs' },
            { text: '</>', left: '92%', top: '45%', size: 'text-sm' },
            { text: 'git push', left: '15%', top: '90%', size: 'text-xs' },
            { text: '=>', left: '78%', top: '88%', size: 'text-sm' },
          ].map((snippet, i) => (
            <motion.span
              key={`code-${i}`}
              className={`absolute font-mono ${snippet.size} text-purple-500/20 select-none`}
              style={{ left: snippet.left, top: snippet.top }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.1, 0.3, 0.1],
                rotate: [0, (i % 2 === 0 ? 5 : -5), 0],
              }}
              transition={{
                duration: 5 + i * 0.8,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.5,
              }}
            >
              {snippet.text}
            </motion.span>
          ))}

          {/* Floating terminal windows */}
          <motion.div
            className="absolute left-[2%] top-[30%] w-32 h-20 rounded-lg border border-green-500/10 bg-green-500/[0.03] hidden md:block"
            animate={{ y: [0, -15, 0], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="flex items-center gap-1 px-2 py-1 border-b border-green-500/10">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500/40" />
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/40" />
              <div className="w-1.5 h-1.5 rounded-full bg-green-500/40" />
            </div>
            <div className="px-2 py-1 font-mono text-[8px] text-green-500/30 space-y-0.5">
              <div>$ node server.js</div>
              <div>listening on :3000</div>
              <div className="animate-pulse">_</div>
            </div>
          </motion.div>

          <motion.div
            className="absolute right-[3%] top-[55%] w-36 h-20 rounded-lg border border-blue-500/10 bg-blue-500/[0.03] hidden md:block"
            animate={{ y: [0, -12, 0], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          >
            <div className="flex items-center gap-1 px-2 py-1 border-b border-blue-500/10">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500/40" />
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/40" />
              <div className="w-1.5 h-1.5 rounded-full bg-green-500/40" />
            </div>
            <div className="px-2 py-1 font-mono text-[8px] text-blue-500/30 space-y-0.5">
              <div>{'const app = express()'}</div>
              <div>{'app.use(cors())'}</div>
              <div>{'app.listen(PORT)'}</div>
            </div>
          </motion.div>

          {/* Circuit lines */}
          <svg className="absolute inset-0 w-full h-full hidden md:block" xmlns="http://www.w3.org/2000/svg">
            <motion.line
              x1="0%" y1="50%" x2="12%" y2="50%"
              stroke="rgba(139,92,246,0.1)" strokeWidth="1"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.5 }}
            />
            <motion.line
              x1="88%" y1="50%" x2="100%" y2="50%"
              stroke="rgba(139,92,246,0.1)" strokeWidth="1"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.7 }}
            />
            <motion.circle
              cx="12%" cy="50%" r="3"
              fill="rgba(139,92,246,0.2)"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 2 }}
            />
            <motion.circle
              cx="88%" cy="50%" r="3"
              fill="rgba(139,92,246,0.2)"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 2.2 }}
            />
          </svg>

          {/* Floating tech stack icons */}
          {[
            { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', alt: 'React', left: '2%', top: '8%', size: 36 },
            { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', alt: 'Node.js', right: '3%', top: '12%', size: 32 },
            { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', alt: 'MongoDB', left: '5%', bottom: '10%', size: 34 },
            { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', alt: 'TypeScript', right: '6%', bottom: '15%', size: 30 },
            { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', alt: 'JavaScript', left: '8%', top: '55%', size: 28 },
            { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg', alt: 'Express', right: '7%', top: '50%', size: 28 },
            { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg', alt: 'Tailwind', left: '3%', top: '32%', size: 30 },
            { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', alt: 'Git', right: '2%', top: '35%', size: 28 },
            { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', alt: 'GitHub', right: '5%', bottom: '40%', size: 26 },
            { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', alt: 'HTML5', left: '6%', bottom: '38%', size: 28 },
            { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg', alt: 'CSS3', left: '1%', bottom: '55%', size: 26 },
            { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', alt: 'Python', right: '1%', bottom: '58%', size: 28 },
          ].map((icon, i) => (
            <motion.div
              key={icon.alt}
              className="absolute hidden md:block"
              style={{
                left: icon.left,
                right: icon.right,
                top: icon.top,
                bottom: icon.bottom,
              }}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', delay: 0.3 + i * 0.1 }}
              animate={{
                y: [0, (i % 2 === 0 ? -18 : -12), 0],
                x: [0, (i % 3 === 0 ? 8 : -6), 0],
                rotate: [0, (i % 2 === 0 ? 10 : -10), 0],
              }}
            >
              <motion.div
                animate={{
                  y: [0, (i % 2 === 0 ? -18 : -12), 0],
                  x: [0, (i % 3 === 0 ? 8 : -6), 0],
                  rotate: [0, (i % 2 === 0 ? 10 : -10), 0],
                }}
                transition={{
                  duration: 5 + i * 0.4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.3,
                }}
                className="tech-icon-float"
              >
                <img
                  src={icon.src}
                  alt={icon.alt}
                  width={icon.size}
                  height={icon.size}
                  loading="lazy"
                  className="opacity-70 hover:opacity-100 transition-opacity duration-300 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                />
              </motion.div>
            </motion.div>
          ))}
        </div>

        <div className="max-w-5xl mx-auto">
          <ParallaxSection offset={30}>
            <div className="text-center mb-16">
              <motion.span
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="inline-block px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-sm font-medium mb-4"
              >
                Meet the Creator
              </motion.span>
              <h2 className="text-4xl md:text-6xl font-black">
                <AnimatedText text="Built with " />
                <span className="gradient-text-animated">Passion</span>
              </h2>
            </div>
          </ParallaxSection>

          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="glass-card p-8 md:p-12 relative overflow-hidden"
          >
            {/* Animated gradient border */}
            <div className="absolute -inset-0 rounded-3xl">
              <motion.div
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-0 rounded-3xl border-2 border-transparent opacity-50"
                style={{
                  backgroundImage: 'linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6, #8b5cf6, #ec4899)',
                  backgroundSize: '300% 100%',
                  padding: '2px',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                }}
              />
            </div>

            {/* Floating accents */}
            <motion.div
              animate={{ rotate: -360, scale: [1, 1.2, 1] }}
              transition={{ rotate: { duration: 25, repeat: Infinity, ease: 'linear' }, scale: { duration: 8, repeat: Infinity, ease: 'easeInOut' } }}
              className="absolute -bottom-20 -left-20 w-48 h-48 bg-gradient-to-br from-pink-500/15 to-purple-500/15 rounded-full blur-3xl"
            />
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.3, 1] }}
              transition={{ rotate: { duration: 30, repeat: Infinity, ease: 'linear' }, scale: { duration: 10, repeat: Infinity, ease: 'easeInOut' } }}
              className="absolute -top-20 -right-20 w-56 h-56 bg-gradient-to-br from-blue-500/15 to-cyan-500/15 rounded-full blur-3xl"
            />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
              {/* Author Avatar & Social Links */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex-shrink-0 flex flex-col items-center"
              >
                <div className="relative">
                  {/* Rotating outer ring */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                    className="absolute -inset-3 rounded-full border-2 border-dashed border-purple-500/30"
                  />
                  {/* Pulsing glow behind avatar */}
                  <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -inset-4 rounded-full bg-gradient-to-br from-blue-600/30 via-purple-600/30 to-pink-600/30 blur-xl"
                  />
                  <motion.div
                    whileHover={{ scale: 1.08, rotate: 3 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-[3px] relative"
                  >
                    <div className="w-full h-full rounded-full bg-[#0a0a1a] flex items-center justify-center overflow-hidden">
                      <img src="https://media.licdn.com/dms/image/v2/D5603AQFkrM8u_wLYCQ/profile-displayphoto-scale_200_200/B56ZwIi7fsKkAY-/0/1769669901331?e=1772064000&v=beta&t=1UsBw5LMcgYSf7lX_y0n7C_TrMwqmz_sCIw8Fq11DWk" alt="Gnanaprakash G" />
                    </div>
                  </motion.div>

                  {/* Online indicator */}
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute bottom-2 right-5 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0a0a1a]"
                  />
                </div>

                {/* Social links */}
                <div className="flex items-center gap-3 mt-8">
                  {[
                    { icon: Github, label: 'GitHub', href: 'https://github.com/Gnanaprakash-Dev', color: 'hover:border-gray-400 hover:bg-gray-400/10' },
                    { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/gnanaprakash-dev/', color: 'hover:border-blue-400 hover:bg-blue-400/10' },
                    { icon: Twitter, label: 'Twitter', href: 'https://x.com/Lifting_Otherss', color: 'hover:border-sky-400 hover:bg-sky-400/10' },
                    { icon: Mail, label: 'Email', href: 'mailto:prakashpriyaa921@gmail.com', color: 'hover:border-pink-400 hover:bg-pink-400/10' },
                  ].map((social, i) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0, rotate: -180 }}
                      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ type: 'spring', stiffness: 200, delay: 0.4 + i * 0.1 }}
                      whileHover={{ scale: 1.2, y: -4 }}
                      whileTap={{ scale: 0.9 }}
                      className={`w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors ${social.color}`}
                    >
                      <social.icon className="w-4 h-4" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>

              {/* Author Info */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex-1 text-center md:text-left"
              >
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.35 }}
                  className="text-2xl md:text-3xl font-black mb-1"
                >
                  Gnanaprakash G
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="text-purple-400 font-semibold mb-4"
                >
                  Associate – R&D at Kovaion Consulting | Software Engineer | AI-Powered Applications
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.45 }}
                  className="text-gray-400 leading-relaxed mb-6"
                >
                  MERN Stack Developer with 4+ years of professional experience building AI-enabled software solutions for both web and mobile platforms. Hands-on experience working on enterprise and product platforms such as Delveant CRM, Zinger Jewellery CRM, Rocketship AI, Sportzia, and Kovaion AI, contributing to scalable and maintainable system architectures. Actively involved in integrating AI-driven features, including intelligent assistants, automation workflows, and prompt-based interfaces to enhance productivity and usability.
                </motion.p>

                {/* Tech tags */}
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
                  {['MongoDB', 'Express.js', 'React.js', 'Node.js', 'TypeScript', 'Tailwind CSS', 'REST APIs', 'Git & GitHub', 'AI Integration'].map((tech, i) => (
                    <motion.span
                      key={tech}
                      initial={{ opacity: 0, scale: 0.5, y: 20 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ type: 'spring', stiffness: 200, delay: 0.5 + i * 0.06 }}
                      whileHover={{ scale: 1.1, y: -2 }}
                      className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 font-medium cursor-default"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>

                {/* Experience stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 }}
                  className="flex flex-wrap justify-center md:justify-start gap-6"
                >
                  {[
                    { value: '3+', label: 'Years Exp' },
                    { value: '5+', label: 'Products' },
                    { value: 'AI', label: 'Focused' },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: 'spring', delay: 0.75 + i * 0.1 }}
                      whileHover={{ scale: 1.1 }}
                      className="text-center"
                    >
                      <div className="text-xl font-black gradient-text">{stat.value}</div>
                      <div className="text-xs text-gray-500">{stat.label}</div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA - 3D Immersive */}
      <section className="py-32 px-6 relative z-10 overflow-hidden cta-3d-scene">
        {/* Dot grid background with radial mask */}
        <div className="cta-hex-grid" />

        {/* Floating colorful 3D mini books */}
        {[
          { top: '5%', left: '6%', color: 'from-rose-500 to-pink-600', spine: 'bg-rose-700', rotate: -12, size: 'w-16 h-20', delay: 0 },
          { top: '8%', right: '8%', color: 'from-blue-500 to-indigo-600', spine: 'bg-indigo-700', rotate: 10, size: 'w-14 h-[70px]', delay: 0.5 },
          { bottom: '12%', left: '10%', color: 'from-emerald-500 to-teal-600', spine: 'bg-teal-700', rotate: -8, size: 'w-[52px] h-[66px]', delay: 1.2 },
          { bottom: '8%', right: '6%', color: 'from-amber-500 to-orange-600', spine: 'bg-orange-700', rotate: 15, size: 'w-16 h-20', delay: 0.8 },
          { top: '40%', left: '3%', color: 'from-violet-500 to-purple-600', spine: 'bg-purple-700', rotate: -18, size: 'w-12 h-[60px]', delay: 1.5 },
          { top: '35%', right: '4%', color: 'from-cyan-500 to-blue-600', spine: 'bg-blue-700', rotate: 8, size: 'w-14 h-[68px]', delay: 0.3 },
          { top: '70%', left: '5%', color: 'from-pink-500 to-fuchsia-600', spine: 'bg-fuchsia-700', rotate: 12, size: 'w-[50px] h-[62px]', delay: 2 },
          { top: '65%', right: '9%', color: 'from-lime-500 to-green-600', spine: 'bg-green-700', rotate: -14, size: 'w-[54px] h-[68px]', delay: 1.8 },
        ].map((book, i) => (
          <motion.div
            key={`cta-book-${i}`}
            className="absolute pointer-events-none hidden md:block"
            style={{
              top: book.top,
              bottom: book.bottom,
              left: book.left,
              right: book.right,
              perspective: '600px',
            }}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', delay: book.delay, stiffness: 120 }}
          >
            <motion.div
              animate={{
                y: [0, -(15 + i * 3), 0],
                rotateY: [book.rotate, book.rotate + (i % 2 === 0 ? 20 : -20), book.rotate],
                rotateX: [0, (i % 2 === 0 ? 8 : -5), 0],
                rotateZ: [0, (i % 2 === 0 ? 3 : -3), 0],
              }}
              transition={{ duration: 5 + i * 0.6, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Book body */}
              <div className={`${book.size} rounded-r-md rounded-l-sm relative`} style={{ transformStyle: 'preserve-3d' }}>
                {/* Front cover */}
                <div className={`absolute inset-0 rounded-r-md rounded-l-sm bg-gradient-to-br ${book.color} shadow-lg`}>
                  {/* Faux cover lines */}
                  <div className="absolute top-[20%] left-[15%] right-[15%] h-[2px] bg-white/20 rounded" />
                  <div className="absolute top-[32%] left-[20%] right-[25%] h-[1.5px] bg-white/15 rounded" />
                  <div className="absolute bottom-[18%] left-[15%] right-[15%] h-[1.5px] bg-white/10 rounded" />
                  {/* Shine */}
                  <div className="absolute inset-0 rounded-r-md rounded-l-sm bg-gradient-to-br from-white/20 via-transparent to-transparent" />
                </div>
                {/* Spine */}
                <div
                  className={`absolute top-0 left-0 w-[6px] h-full ${book.spine} rounded-l-sm`}
                  style={{ transform: 'translateZ(-3px)' }}
                />
                {/* Pages edge */}
                <div
                  className="absolute top-[3px] right-0 w-[3px] rounded-r-sm"
                  style={{
                    height: 'calc(100% - 6px)',
                    background: 'repeating-linear-gradient(180deg, #f5f5f0 0px, #f5f5f0 1px, #e8e6df 1px, #e8e6df 2px)',
                    transform: 'translateX(1px)',
                  }}
                />
                {/* Bottom pages edge */}
                <div
                  className="absolute bottom-0 left-[6px] h-[3px] rounded-b-sm"
                  style={{
                    width: 'calc(100% - 8px)',
                    background: 'repeating-linear-gradient(90deg, #f5f5f0 0px, #f5f5f0 2px, #e8e6df 2px, #e8e6df 3px)',
                    transform: 'translateY(1px)',
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        ))}

        {/* Floating PDF file icons */}
        {[
          { top: '15%', left: '18%', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', delay: 0.4 },
          { top: '20%', right: '16%', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', delay: 1.0 },
          { bottom: '18%', left: '16%', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20', delay: 1.6 },
          { bottom: '22%', right: '14%', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', delay: 0.7 },
        ].map((pdf, i) => (
          <motion.div
            key={`cta-pdf-${i}`}
            className="absolute pointer-events-none hidden md:block"
            style={{ top: pdf.top, bottom: pdf.bottom, left: pdf.left, right: pdf.right }}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', delay: pdf.delay }}
          >
            <motion.div
              animate={{
                y: [0, -18, 0],
                rotate: [0, (i % 2 === 0 ? 8 : -8), 0],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{ duration: 4 + i * 0.8, repeat: Infinity, ease: 'easeInOut' }}
              className={`w-10 h-10 rounded-lg ${pdf.bg} border backdrop-blur-sm flex items-center justify-center`}
            >
              <FileText className={`w-5 h-5 ${pdf.color}`} />
            </motion.div>
          </motion.div>
        ))}

        {/* Ambient glow orbs */}
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.25, 0.1] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-purple-600/20 blur-[100px] pointer-events-none"
        />

        {/* Sparkle particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="cta-sparkle"
            style={{
              left: `${15 + Math.random() * 70}%`,
              top: `${10 + Math.random() * 80}%`,
              background: i % 3 === 0
                ? 'rgba(59, 130, 246, 0.8)'
                : i % 3 === 1
                  ? 'rgba(139, 92, 246, 0.8)'
                  : 'rgba(236, 72, 153, 0.8)',
              boxShadow: i % 3 === 0
                ? '0 0 6px rgba(59,130,246,0.6)'
                : i % 3 === 1
                  ? '0 0 6px rgba(139,92,246,0.6)'
                  : '0 0 6px rgba(236,72,153,0.6)',
            }}
            animate={{
              y: [0, -(40 + Math.random() * 60)],
              x: [(Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30],
              scale: [0, 1, 0],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: i * 0.4,
              ease: 'easeOut',
            }}
          />
        ))}

        <div className="max-w-4xl mx-auto text-center relative">
          {/* Main 3D card container */}
          <motion.div
            initial={{ opacity: 0, y: 80, rotateX: 15, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            whileHover={{ rotateX: -3, rotateY: 2, scale: 1.02 }}
            className="cta-3d-card glass-card p-12 md:p-16 relative overflow-hidden"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Animated gradient border */}
            <div className="absolute -inset-0 rounded-3xl">
              <motion.div
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-0 rounded-3xl"
                style={{
                  backgroundImage: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #10b981, #3b82f6)',
                  backgroundSize: '300% 100%',
                  padding: '2px',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                }}
              />
            </div>

            {/* 3D shine layer */}
            <div className="cta-3d-shine" />

            {/* Corner brackets */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, type: 'spring' }}
            >
              <div className="cta-corner-bracket cta-corner-tl absolute -top-1 -left-1" />
              <div className="cta-corner-bracket cta-corner-tr absolute -top-1 -right-1" />
              <div className="cta-corner-bracket cta-corner-bl absolute -bottom-1 -left-1" />
              <div className="cta-corner-bracket cta-corner-br absolute -bottom-1 -right-1" />
            </motion.div>

            {/* Inner floating orbs */}
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.3, 1] }}
              transition={{ rotate: { duration: 20, repeat: Infinity, ease: 'linear' }, scale: { duration: 6, repeat: Infinity, ease: 'easeInOut' } }}
              className="absolute -top-20 -right-20 w-48 h-48 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"
            />
            <motion.div
              animate={{ rotate: -360, scale: [1, 1.2, 1] }}
              transition={{ rotate: { duration: 25, repeat: Infinity, ease: 'linear' }, scale: { duration: 8, repeat: Infinity, ease: 'easeInOut' } }}
              className="absolute -bottom-16 -left-16 w-40 h-40 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-3xl"
            />

            {/* 3D floating BookOpen icon */}
            <motion.div
              initial={{ opacity: 0, rotateY: -90, scale: 0 }}
              whileInView={{ opacity: 1, rotateY: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 150, damping: 12, delay: 0.2 }}
              className="relative z-10 mb-8"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <motion.div
                animate={{ y: [0, -12, 0], rotateY: [0, 15, 0], rotateX: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="inline-block"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="relative">
                  <BookOpen className="w-16 h-16 mx-auto text-blue-500 relative z-10" />
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute inset-0 w-16 h-16 mx-auto bg-blue-500/30 rounded-full blur-xl"
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Heading with 3D stagger */}
            <motion.div
              initial={{ opacity: 0, y: 30, rotateX: 20 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative z-10"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <h2 className="text-4xl md:text-6xl font-black mb-6">
                <motion.span
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="block"
                >
                  Ready to Create
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, scale: 0.5, rotateX: 45 }}
                  whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 120, delay: 0.6 }}
                  className="gradient-text-animated mt-3 block h-[70px]"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  Something Amazing?
                </motion.span>
              </h2>
            </motion.div>

            {/* Subtitle with entrance */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-xl text-gray-400 mb-10 relative z-10"
            >
              Join thousands creating beautiful flipbooks every day.
            </motion.p>

            {/* 3D CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 30, rotateX: 20 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.9, type: 'spring', stiffness: 120 }}
              className="relative z-10"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <motion.button
                onClick={scrollToUpload}
                whileHover={{
                  scale: 1.08,
                  rotateX: -5,
                  rotateY: 3,
                  boxShadow: '0 20px 60px rgba(59, 130, 246, 0.5), 0 0 80px rgba(139, 92, 246, 0.3)',
                }}
                whileTap={{ scale: 0.95, rotateX: 0, rotateY: 0 }}
                className="px-12 py-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl font-bold text-2xl animate-pulse-glow relative overflow-hidden"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Button shimmer */}
                <motion.div
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut' }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                />
                <span className="relative z-10 flex items-center gap-3">
                  Upload Your PDF - It's Free
                  <motion.div
                    animate={{ x: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-6 h-6" />
                  </motion.div>
                </span>
              </motion.button>
            </motion.div>

            {/* Floating mini stats under button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1.1, duration: 0.6 }}
              className="flex items-center justify-center gap-6 mt-8 relative z-10"
            >
              {['Free Forever', 'No Watermarks', 'Instant'].map((text, i) => (
                <motion.span
                  key={text}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.2 + i * 0.1, type: 'spring' }}
                  className="flex items-center gap-1.5 text-sm text-gray-500"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                  {text}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-500" />
            <span className="font-bold">Flipbook Studio</span>
          </div>
          <p className="text-gray-500 text-sm">100% Free PDF to Flipbook Converter</p>
        </div>
      </footer>
    </div>
  )
}
