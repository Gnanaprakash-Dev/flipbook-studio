# Flipbook Studio

A modern web application that converts PDF documents into interactive, shareable flipbooks with realistic page-turning animations.

![Flipbook Studio](https://img.shields.io/badge/React-18.3-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue) ![Node.js](https://img.shields.io/badge/Node.js-Express-green) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green) ![Cloudinary](https://img.shields.io/badge/Cloudinary-Images-purple)

## Features

- **PDF Upload** - Drag & drop or click to upload PDF files (up to 50MB)
- **Interactive Flipbook Viewer** - Realistic page-turning animations using react-magazine
- **Instant Sharing** - Generate shareable links with unique short IDs
- **Embed Support** - Copy iframe code to embed flipbooks on any website
- **Download Options** - Export as single HTML file or ZIP package
- **Responsive Design** - Works on desktop and mobile devices
- **Dark Theme UI** - Modern glassmorphism design with animated backgrounds

## Demo

| Landing Page | Flipbook Viewer |
|--------------|-----------------|
| Animated starfield with radial marquee | Interactive page-turning with controls |

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool & dev server |
| Tailwind CSS | Styling |
| Zustand | State management |
| Framer Motion | Animations |
| react-magazine | Flipbook component |
| pdfjs-dist | PDF parsing (client-side) |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express.js | Web framework |
| MongoDB Atlas | Database |
| Mongoose | ODM |
| Cloudinary | PDF storage & image transformation |
| Multer | File upload handling |
| pdf-parse | PDF page count extraction |
| nanoid | Short unique ID generation |

## Project Structure

```
flip/
├── src/                          # Frontend source
│   ├── components/
│   │   ├── ui/                   # Reusable UI components (Button, Input, etc.)
│   │   ├── UploadZone/           # PDF upload with drag & drop
│   │   ├── ShareModal.tsx        # Share link & embed code dialog
│   │   └── DownloadModal.tsx     # Export options dialog
│   ├── pages/
│   │   ├── LandingPage.tsx       # Home page with upload
│   │   └── EditorPage.tsx        # Flipbook viewer/editor
│   ├── store/
│   │   └── flipbook-store.ts     # Zustand global state
│   ├── services/
│   │   └── api.ts                # Backend API client
│   ├── lib/
│   │   ├── pdf-processor.ts      # Client-side PDF utilities
│   │   ├── export-utils.ts       # HTML/ZIP export generation
│   │   └── utils.ts              # Helper functions
│   ├── styles/
│   │   └── landing-animations.css # Radial marquee animations
│   ├── App.tsx                   # Router setup
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Global styles & Tailwind
│
├── backend/                      # Backend source
│   ├── config/
│   │   ├── db.js                 # MongoDB connection
│   │   └── cloudinary.js         # Cloudinary setup
│   ├── models/
│   │   └── Magazine.js           # Mongoose schema
│   ├── controllers/
│   │   └── magazineController.js # Request handlers
│   ├── routes/
│   │   └── magazineRoutes.js     # API routes
│   ├── services/
│   │   ├── cloudinaryService.js  # Cloudinary operations
│   │   └── pdfService.js         # PDF utilities
│   ├── middleware/
│   │   └── upload.js             # Multer file handling
│   ├── utils/
│   │   └── helpers.js            # Utility functions
│   └── server.js                 # Express app entry
│
├── public/                       # Static assets
├── index.html                    # HTML template
├── vite.config.ts                # Vite configuration
├── tailwind.config.js            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
├── netlify.toml                  # Netlify deployment config
└── package.json                  # Frontend dependencies
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Cloudinary account

### 1. Clone the repository

```bash
git clone <repository-url>
cd flip
```

### 2. Install dependencies

```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

### 3. Environment Setup

**Frontend** - Create `.env` in root:
```env
VITE_API_URL=http://localhost:5000/api
```

**Backend** - Create `.env` in `backend/`:
```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB Atlas
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/flipbook

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### 4. Run the application

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

Open http://localhost:5173 in your browser.

## API Reference

Base URL: `/api`

### Magazines

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/magazines` | List all magazines (paginated) |
| `POST` | `/magazines/upload` | Upload PDF and create magazine |
| `GET` | `/magazines/:id` | Get magazine by MongoDB ID |
| `GET` | `/magazines/share/:shareId` | Get magazine by share ID (public) |
| `GET` | `/magazines/:id/status` | Check processing status |
| `PUT` | `/magazines/:id` | Update magazine name/config |
| `DELETE` | `/magazines/:id` | Delete magazine and files |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Server health status |

### Request/Response Examples

**Upload PDF**
```bash
curl -X POST http://localhost:5000/api/magazines/upload \
  -F "pdf=@document.pdf"
```

**Response**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "document",
    "shareId": "V1StGXR8_Z",
    "totalPages": 10,
    "status": "ready",
    "pages": [
      {
        "pageNumber": 1,
        "imageUrl": "https://res.cloudinary.com/...",
        "width": 1200,
        "height": 1600
      }
    ],
    "config": {
      "width": 400,
      "height": 500,
      "flipAnimation": "soft",
      "pageLayout": "double"
    },
    "shareUrl": "http://localhost:5173/view/V1StGXR8_Z",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## How It Works

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Frontend   │────▶│   Backend    │────▶│  Cloudinary  │
│  (React)     │     │  (Express)   │     │              │
└──────────────┘     └──────────────┘     └──────────────┘
       │                    │                    │
       │  1. Upload PDF     │                    │
       │───────────────────▶│  2. Upload PDF     │
       │                    │───────────────────▶│
       │                    │                    │
       │                    │  3. Get page count │
       │                    │    (pdf-parse)     │
       │                    │                    │
       │                    │  4. Generate URLs  │
       │                    │    with pg_N       │
       │                    │    transformation  │
       │                    │                    │
       │  5. Return magazine│                    │
       │◀───────────────────│                    │
       │                    │                    │
       │  6. Display flipbook                    │
       │     (images loaded │                    │
       │      from CDN)     │◀───────────────────│
       │                    │    On-demand       │
       │                    │    conversion      │
```

**Key Insight:** Cloudinary converts PDF pages to images on-the-fly using URL transformations:
```
https://res.cloudinary.com/{cloud}/image/upload/pg_{page},w_{width},h_{height}/{pdf_id}.jpg
```

## Deployment

### Frontend (Netlify)

1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`

The `netlify.toml` is already configured for SPA routing.

### Backend (Render)

1. Create a new Web Service on Render
2. Connect your repository
3. Set root directory: `backend`
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variables (MongoDB URI, Cloudinary credentials, Frontend URL)

## Configuration Options

### Flipbook Config (stored per magazine)

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `width` | number | 400 | Page width in pixels |
| `height` | number | 500 | Page height in pixels |
| `flipAnimation` | string | "soft" | Animation type: hard, soft, fade, vertical |
| `flipSpeed` | number | 1000 | Animation duration in ms |
| `showShadow` | boolean | true | Show page shadow |
| `shadowOpacity` | number | 0.3 | Shadow opacity (0-1) |
| `pageLayout` | string | "double" | Layout: single, double |
| `backgroundColor` | string | "#1a1a2e" | Viewer background color |
| `showPageNumbers` | boolean | true | Display page numbers |
| `navigationStyle` | string | "both" | Navigation: arrows, thumbnails, both, none |
| `autoPlay` | boolean | false | Auto-advance pages |
| `autoPlayInterval` | number | 3000 | Auto-advance interval in ms |

## Scripts

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend
```bash
npm start        # Start production server
npm run dev      # Start with file watching
```

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgments

- [react-magazine](https://www.npmjs.com/package/react-magazine) - Flipbook component
- [Cloudinary](https://cloudinary.com) - PDF transformation magic
- [shadcn/ui](https://ui.shadcn.com) - UI component patterns
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS
