import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import type { FlipbookProject } from '@/store/flipbook-store'

export async function generateHTMLPackage(
  project: FlipbookProject,
  onProgress?: (progress: number) => void
): Promise<void> {
  onProgress?.(10)

  const { config, pages, name } = project

  // Generate page images as base64
  const pageImages = pages
    .filter((p) => p.imageData)
    .map((p) => p.imageData as string)

  onProgress?.(30)

  const htmlContent = generateFlipbookHTML(name, config, pageImages)

  onProgress?.(80)

  // Create and download the HTML file
  const blob = new Blob([htmlContent], { type: 'text/html' })
  saveAs(blob, `${name.replace(/[^a-z0-9]/gi, '_')}_flipbook.html`)

  onProgress?.(100)
}

export async function generateZipPackage(
  project: FlipbookProject,
  onProgress?: (progress: number) => void
): Promise<void> {
  const zip = new JSZip()
  const { config, pages, name } = project

  onProgress?.(10)

  // Create images folder and add images
  const imagesFolder = zip.folder('images')
  const imageNames: string[] = []

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i]
    if (page.imageData) {
      // Convert base64 to blob
      const base64Data = page.imageData.split(',')[1]
      const imageName = `page_${(i + 1).toString().padStart(3, '0')}.jpg`
      imageNames.push(imageName)
      imagesFolder?.file(imageName, base64Data, { base64: true })
    }
    onProgress?.(10 + (i / pages.length) * 40)
  }

  onProgress?.(50)

  // Generate HTML with relative image paths
  const htmlContent = generateFlipbookHTML(
    name,
    config,
    imageNames.map((n) => `images/${n}`),
    false
  )

  zip.file('index.html', htmlContent)

  onProgress?.(70)

  // Generate CSS
  const cssContent = generateFlipbookCSS(config)
  zip.file('styles.css', cssContent)

  // Generate JS
  const jsContent = generateFlipbookJS(config, imageNames.length)
  zip.file('script.js', jsContent)

  onProgress?.(90)

  // Generate and download ZIP
  const content = await zip.generateAsync({ type: 'blob' })
  saveAs(content, `${name.replace(/[^a-z0-9]/gi, '_')}_flipbook.zip`)

  onProgress?.(100)
}

function generateFlipbookHTML(
  title: string,
  config: FlipbookProject['config'],
  images: string[],
  embedded: boolean = true
): string {
  const styles = embedded ? `<style>${generateFlipbookCSS(config)}</style>` : '<link rel="stylesheet" href="styles.css">'
  const scripts = embedded ? `<script>${generateFlipbookJS(config, images.length)}</script>` : '<script src="script.js"></script>'

  const pageElements = images
    .map(
      (img, i) => `
      <div class="page" data-page="${i + 1}">
        <img src="${img}" alt="Page ${i + 1}" loading="lazy" />
        ${config.showPageNumbers ? `<span class="page-number">${i + 1}</span>` : ''}
      </div>
    `
    )
    .join('\n')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Flipbook</title>
  ${styles}
</head>
<body>
  <div class="flipbook-container" style="background-color: ${config.backgroundColor}">
    <div class="flipbook" id="flipbook">
      ${pageElements}
    </div>

    <div class="navigation">
      <button class="nav-btn prev" onclick="prevPage()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>
      <span class="page-info" id="pageInfo">1 / ${images.length}</span>
      <button class="nav-btn next" onclick="nextPage()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>
    </div>
  </div>

  ${scripts}
</body>
</html>`
}

function generateFlipbookCSS(config: FlipbookProject['config']): string {
  return `
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.flipbook-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.flipbook {
  position: relative;
  width: ${config.pageLayout === 'double' ? config.width * 2 : config.width}px;
  height: ${config.height}px;
  max-width: 100%;
  perspective: 2000px;
  display: flex;
  ${config.showShadow ? `box-shadow: 0 20px 60px rgba(0,0,0,${config.shadowOpacity});` : ''}
  border-radius: 4px;
  overflow: hidden;
}

.page {
  position: absolute;
  width: ${config.pageLayout === 'double' ? '50%' : '100%'};
  height: 100%;
  background: white;
  display: none;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transform-style: preserve-3d;
  transition: transform ${config.flipSpeed}ms cubic-bezier(0.4, 0, 0.2, 1);
}

.page.active {
  display: flex;
}

.page.left {
  left: 0;
  transform-origin: right center;
}

.page.right {
  right: 0;
  transform-origin: left center;
}

.page img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.page-number {
  position: absolute;
  bottom: 10px;
  font-size: 12px;
  color: #666;
}

.page.left .page-number {
  left: 15px;
}

.page.right .page-number {
  right: 15px;
}

.navigation {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
  padding: 10px 20px;
  background: rgba(255,255,255,0.9);
  border-radius: 50px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.nav-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.2s;
}

.nav-btn:hover {
  background: rgba(0,0,0,0.05);
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: #666;
  min-width: 80px;
  text-align: center;
}

@media (max-width: 768px) {
  .flipbook {
    width: 100%;
    height: auto;
    aspect-ratio: ${config.pageLayout === 'double' ? config.width * 2 : config.width} / ${config.height};
  }
}
`
}

function generateFlipbookJS(
  config: FlipbookProject['config'],
  totalPages: number
): string {
  return `
let currentPage = 0;
const totalPages = ${totalPages};
const isDoubleLayout = ${config.pageLayout === 'double'};
const flipSpeed = ${config.flipSpeed};

function updateDisplay() {
  const pages = document.querySelectorAll('.page');
  const pageInfo = document.getElementById('pageInfo');

  pages.forEach((page, index) => {
    page.classList.remove('active', 'left', 'right');

    if (isDoubleLayout) {
      if (index === currentPage) {
        page.classList.add('active', 'left');
      } else if (index === currentPage + 1) {
        page.classList.add('active', 'right');
      }
    } else {
      if (index === currentPage) {
        page.classList.add('active');
      }
    }
  });

  if (isDoubleLayout) {
    const endPage = Math.min(currentPage + 2, totalPages);
    pageInfo.textContent = (currentPage + 1) + '-' + endPage + ' / ' + totalPages;
  } else {
    pageInfo.textContent = (currentPage + 1) + ' / ' + totalPages;
  }

  // Update button states
  document.querySelector('.prev').disabled = currentPage === 0;
  document.querySelector('.next').disabled = currentPage >= totalPages - (isDoubleLayout ? 2 : 1);
}

function nextPage() {
  const increment = isDoubleLayout ? 2 : 1;
  if (currentPage < totalPages - increment) {
    currentPage += increment;
    updateDisplay();
  }
}

function prevPage() {
  const decrement = isDoubleLayout ? 2 : 1;
  if (currentPage >= decrement) {
    currentPage -= decrement;
    updateDisplay();
  }
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'PageDown') nextPage();
  if (e.key === 'ArrowLeft' || e.key === 'PageUp') prevPage();
});

// Initialize
document.addEventListener('DOMContentLoaded', updateDisplay);
`
}
