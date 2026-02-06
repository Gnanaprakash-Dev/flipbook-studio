import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import type { Magazine, MagazineConfig } from '@/services/api'

/**
 * Export Utils
 *
 * Generate downloadable flipbook packages using turn.js for flip animation
 * with the EditorPage UI design.
 */

/**
 * Generate single HTML file package with embedded base64 images.
 */
export async function generateHTMLPackage(
  project: Magazine,
  onProgress?: (progress: number) => void
): Promise<void> {
  onProgress?.(5)

  const { config, pages, name } = project

  onProgress?.(10)
  const pageImages: string[] = []

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i]
    try {
      const response = await fetch(page.imageUrl)
      const blob = await response.blob()
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.readAsDataURL(blob)
      })
      pageImages.push(base64)
    } catch (error) {
      console.error(`Failed to fetch page ${i + 1}:`, error)
      pageImages.push('')
    }

    onProgress?.(10 + (i / pages.length) * 60)
  }

  onProgress?.(70)

  const htmlContent = generateFlipbookHTML(name, config, pageImages)

  onProgress?.(90)

  const blob = new Blob([htmlContent], { type: 'text/html' })
  saveAs(blob, `${sanitizeFilename(name)}_flipbook.html`)

  onProgress?.(100)
}

/**
 * Generate ZIP package with separate files.
 */
export async function generateZipPackage(
  project: Magazine,
  onProgress?: (progress: number) => void
): Promise<void> {
  const zip = new JSZip()
  const { config, pages, name } = project

  onProgress?.(5)

  const imagesFolder = zip.folder('images')!
  const imageNames: string[] = []

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i]
    try {
      const response = await fetch(page.imageUrl, { mode: 'cors' })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const arrayBuffer = await response.arrayBuffer()

      // Detect extension from content-type or URL
      const contentType = response.headers.get('content-type') || ''
      let ext = 'jpg'
      if (contentType.includes('png')) ext = 'png'
      else if (contentType.includes('webp')) ext = 'webp'

      const imageName = `page_${(i + 1).toString().padStart(3, '0')}.${ext}`
      imageNames.push(imageName)
      imagesFolder.file(imageName, arrayBuffer, { binary: true })
    } catch (error) {
      console.error(`Failed to fetch page ${i + 1}:`, error)
      // Add a placeholder so page count stays consistent
      imageNames.push('')
    }

    onProgress?.(5 + (i / pages.length) * 50)
  }

  onProgress?.(55)

  // Filter out failed images and build HTML with working ones
  const validImages = imageNames
    .filter((n) => n !== '')
    .map((n) => `images/${n}`)

  const htmlContent = generateFlipbookHTML(
    name,
    config,
    validImages
  )
  zip.file('index.html', htmlContent)

  onProgress?.(85)

  const content = await zip.generateAsync({ type: 'blob' })
  saveAs(content, `${sanitizeFilename(name)}_flipbook.zip`)

  onProgress?.(100)
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-z0-9]/gi, '_').toLowerCase()
}

/**
 * Generate full HTML with turn.js flip animation + EditorPage UI.
 */
function generateFlipbookHTML(
  title: string,
  config: MagazineConfig,
  images: string[]
): string {
  const pageWidth = 450
  const pageHeight = 632
  const bookWidth = pageWidth * 2
  const bookHeight = pageHeight

  const pageElements = images
    .map(
      (img, i) => `
        <div class="page">
          <img src="${img}" alt="Page ${i + 1}" />
        </div>`
    )
    .join('\n')

  const dotElements = images
    .map(
      (_, i) => `<div class="dot${i === 0 ? ' active' : ''}" data-dot="${i}"></div>`
    )
    .join('\n')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Flipbook</title>
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"><\/script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/turn.js/3/turn.min.js"><\/script>
  <style>
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { overflow: hidden; height: 100vh; }

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* === Scene layout === */
.scene {
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

/* Scenic background */
.bg-image {
  position: absolute;
  inset: 0;
  background-image: url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80');
  background-size: cover;
  background-position: center;
}
.bg-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.3);
}

/* === Header — frosted glass === */
.header {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  flex-shrink: 0;
  position: relative;
  z-index: 20;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255,255,255,0.1);
}
.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}
.header-title {
  font-size: 14px;
  font-weight: 500;
  color: white;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
}
.header-pages {
  font-size: 12px;
  color: rgba(255,255,255,0.6);
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
}

/* === Main content === */
.main {
  flex: 1;
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Book wrapper — holds arrows + book + edges */
.book-wrapper {
  position: relative;
  transition: margin-left 0.6s ease;
}

/* === Navigation arrows === */
.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 20;
  padding: 4px;
  background: none;
  border: none;
  color: rgba(255,255,255,0.6);
  cursor: pointer;
  transition: opacity 0.3s, color 0.2s;
}
.arrow:hover { color: white; }
.arrow.hidden { opacity: 0; pointer-events: none; }
.arrow-left { left: -64px; }
.arrow-right { right: -64px; }

/* === Book container === */
.book-container {
  position: relative;
}

/* turn.js flipbook */
#flipbook {
  width: ${bookWidth}px;
  height: ${bookHeight}px;
  ${config.showShadow ? `box-shadow: 0 20px 60px rgba(0,0,0,${config.shadowOpacity || 0.3});` : ''}
}
#flipbook .page {
  background: #fff;
  overflow: hidden;
}
#flipbook .page img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* === 3D Page edges === */
.edge {
  position: absolute;
  top: 0;
  height: 100%;
  pointer-events: none;
  z-index: -1;
  transition: width 0.5s ease;
}
.edge-right {
  right: 0;
  transform: translateX(100%);
}
.edge-left {
  left: 0;
  transform: translateX(-100%);
}
.edge-bg {
  position: absolute;
  inset: 0;
  border-radius: 0 3px 3px 0;
  box-shadow: 3px 2px 8px rgba(0,0,0,0.18), 1px 0 2px rgba(0,0,0,0.08);
  background: linear-gradient(to right, #e8e5e0, #f0ede8 40%, #ebe8e3);
}
.edge-left .edge-bg {
  border-radius: 3px 0 0 3px;
  box-shadow: -3px 2px 8px rgba(0,0,0,0.18), -1px 0 2px rgba(0,0,0,0.08);
  background: linear-gradient(to left, #e8e5e0, #f0ede8 40%, #ebe8e3);
}

/* Edge page lines */
.edge-line {
  position: absolute;
  top: 1px;
  bottom: 1px;
  width: 1px;
}
.edge-line-dark { background: rgba(0,0,0,0.06); }
.edge-line-light { background: rgba(255,255,255,0.5); }
.edge-highlight-right {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to right, transparent, rgba(255,255,255,0.25) 50%, rgba(0,0,0,0.06));
  border-radius: 0 3px 3px 0;
}
.edge-highlight-left {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  background: linear-gradient(to left, transparent, rgba(255,255,255,0.25) 50%, rgba(0,0,0,0.06));
  border-radius: 3px 0 0 3px;
}

/* === Bottom bar === */
.bottom-bar {
  position: relative;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 24px;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
.page-counter {
  position: absolute;
  left: 24px;
  font-size: 14px;
  color: rgba(255,255,255,0.8);
  font-weight: 500;
  letter-spacing: 0.05em;
}
.dots {
  display: flex;
  align-items: center;
  gap: 6px;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  background: rgba(255,255,255,0.3);
  transition: all 0.3s;
  cursor: pointer;
}
.dot:hover { background: rgba(255,255,255,0.5); }
.dot.active {
  width: 24px;
  height: 8px;
  background: white;
}

@media (max-width: 950px) {
  .arrow-left { left: -40px; }
  .arrow-right { right: -40px; }
  .arrow svg { width: 32px; height: 32px; }
  #flipbook {
    width: 90vw !important;
    height: auto !important;
  }
}
  </style>
</head>
<body>
  <div class="scene">
    <div class="bg-image"></div>
    <div class="bg-overlay"></div>

    <!-- Header -->
    <header class="header">
      <div class="header-left">
        <span class="header-title">${title}</span>
        <span class="header-pages">${images.length} pages</span>
      </div>
    </header>

    <!-- Main content -->
    <div class="main">
      <div class="book-wrapper" id="bookWrapper">
        <!-- Left arrow -->
        <button class="arrow arrow-left hidden" id="prevBtn">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M15 18l-6-6 6-6"/></svg>
        </button>

        <div class="book-container">
          <div id="flipbook">
            ${pageElements}
          </div>

          <!-- 3D page edge — left -->
          <div class="edge edge-left" id="edgeLeft" style="display:none;">
            <div class="edge-bg"></div>
          </div>

          <!-- 3D page edge — right -->
          <div class="edge edge-right" id="edgeRight">
            <div class="edge-bg"></div>
          </div>
        </div>

        <!-- Right arrow -->
        <button class="arrow arrow-right" id="nextBtn">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="bottom-bar">
      <span class="page-counter" id="pageCounter">1 / ${images.length}</span>
      <div class="dots" id="dots">
        ${dotElements}
      </div>
    </div>
  </div>

  <script>
  (function() {
    var totalPages = ${images.length};
    var pageWidth = ${pageWidth};
    var bookWrapper = document.getElementById('bookWrapper');
    var prevBtn = document.getElementById('prevBtn');
    var nextBtn = document.getElementById('nextBtn');
    var pageCounter = document.getElementById('pageCounter');
    var edgeLeft = document.getElementById('edgeLeft');
    var edgeRight = document.getElementById('edgeRight');
    var dots = document.querySelectorAll('.dot');

    function updateUI(page) {
      var currentPage = page;

      /* Arrows */
      if (currentPage <= 1) {
        prevBtn.className = 'arrow arrow-left hidden';
      } else {
        prevBtn.className = 'arrow arrow-left';
      }
      if (currentPage >= totalPages) {
        nextBtn.className = 'arrow arrow-right hidden';
      } else {
        nextBtn.className = 'arrow arrow-right';
      }

      /* Page counter — spread display */
      var spread;
      if (currentPage <= 1) {
        spread = '1';
      } else if (currentPage >= totalPages) {
        spread = '' + totalPages;
      } else {
        var left = currentPage;
        var right = currentPage + 1;
        if (right > totalPages) {
          spread = '' + currentPage;
        } else {
          spread = left + '-' + right;
        }
      }
      pageCounter.textContent = spread + ' / ' + totalPages;

      /* Dots — highlight based on turn.js page (1-indexed) */
      var dotIndex = Math.max(0, currentPage - 1);
      for (var i = 0; i < dots.length; i++) {
        dots[i].className = i === dotIndex ? 'dot active' : 'dot';
      }

      /* 3D page edges */
      updateEdges(currentPage);

      /* Cover centering */
      if (currentPage <= 1) {
        bookWrapper.style.marginLeft = '-' + pageWidth + 'px';
      } else if (currentPage >= totalPages) {
        bookWrapper.style.marginLeft = pageWidth + 'px';
      } else {
        bookWrapper.style.marginLeft = '0px';
      }
    }

    function updateEdges(page) {
      var pagesOnLeft = Math.max(0, page - 1);
      var pagesOnRight = Math.max(0, totalPages - page);
      var maxEdge = 14;
      var minEdge = 2;

      if (pagesOnLeft > 0 && totalPages > 1) {
        var leftW = Math.round(minEdge + (pagesOnLeft / (totalPages - 1)) * (maxEdge - minEdge));
        edgeLeft.style.width = leftW + 'px';
        edgeLeft.style.display = 'block';
      } else {
        edgeLeft.style.display = 'none';
      }

      if (pagesOnRight > 0 && totalPages > 1) {
        var rightW = Math.round(minEdge + (pagesOnRight / (totalPages - 1)) * (maxEdge - minEdge));
        edgeRight.style.width = rightW + 'px';
        edgeRight.style.display = 'block';
      } else {
        edgeRight.style.display = 'none';
      }
    }

    /* Initialize turn.js */
    $(document).ready(function() {
      $('#flipbook').turn({
        width: ${bookWidth},
        height: ${bookHeight},
        autoCenter: true,
        display: 'double',
        acceleration: true,
        gradients: true,
        elevation: 50,
        when: {
          turned: function(event, page) {
            updateUI(page);
          }
        }
      });

      /* Initial UI state */
      updateUI(1);

      /* Arrow click handlers */
      prevBtn.addEventListener('click', function() {
        $('#flipbook').turn('previous');
      });
      nextBtn.addEventListener('click', function() {
        $('#flipbook').turn('next');
      });

      /* Dot click to jump to page */
      for (var i = 0; i < dots.length; i++) {
        (function(index) {
          dots[index].addEventListener('click', function() {
            $('#flipbook').turn('page', index + 1);
          });
        })(i);
      }

      /* Keyboard navigation */
      $(document).keydown(function(e) {
        if (e.keyCode === 37) {
          $('#flipbook').turn('previous');
        } else if (e.keyCode === 39) {
          $('#flipbook').turn('next');
        }
      });

      /* Edge click to turn pages */
      $('#flipbook').on('click', function(e) {
        var offset = $(this).offset();
        var clickX = e.pageX - offset.left;
        var width = $(this).width();
        if (clickX < width * 0.3) {
          $('#flipbook').turn('previous');
        } else if (clickX > width * 0.7) {
          $('#flipbook').turn('next');
        }
      });
    });
  })();
  <\/script>
</body>
</html>`
}
