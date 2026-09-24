# Image to WebP

A fast, lightweight, and private browser-based developer utility to convert images (PNG, JPG/JPEG, HEIC/HEIF, AVIF, GIF) to WebP format directly on your device.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![100% Client Side](https://img.shields.io/badge/processing-100%25%20client--side-emerald)
![React 19](https://img.shields.io/badge/react-19-61dafb.svg)
![TypeScript](https://img.shields.io/badge/typescript-6.0-blue.svg)
![Tailwind CSS](https://img.shields.io/badge/tailwindcss-4.0-38bdf8.svg)

---

## ✨ Features

- **100% Client-Side Processing**: No images are uploaded to any server. All conversions happen entirely in your browser via native Canvas APIs and WebAssembly/JS decoders.
- **Broad Format Support**:
  - PNG (`.png`)
  - JPG / JPEG (`.jpg`, `.jpeg`)
  - HEIC / HEIF (`.heic`, `.heif`) via client-side `heic2any` decoding
  - AVIF (`.avif`)
  - GIF (`.gif`)
  - WebP (`.webp`)
- **Conversion Settings**:
  - Quality adjustment slider (10% - 100%, default 80%)
  - Custom output width (optional pixel resizing with aspect ratio preservation)
- **Batch Processing**:
  - Select multiple files or drag & drop a batch of images
  - Paste images directly from clipboard (`Cmd/Ctrl + V`)
  - Real-time conversion progress indicator
  - Download individual WebP files or click **Download All (.zip)**
- **Developer-First Aesthetic**:
  - Clean, minimal, neutral UI inspired by Linear, Vercel, and GitHub utilities.
  - Zero bloated marketing sections, animations, or unnecessary dependencies.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/image-to-webp.git
cd image-to-webp

# Install dependencies
npm install

# Start local development server
npm run dev
```

### Building for Production

```bash
# Type check and build static bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler**: [Vite 8](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Image Decoding & Packaging**:
  - HTML5 Canvas & `createImageBitmap` for native formats
  - `heic2any` for HEIC / HEIF format conversion (code-split on demand)
  - `JSZip` for batch archive generation

---

## 📄 License

MIT License. Free and open-source for personal and commercial use.
