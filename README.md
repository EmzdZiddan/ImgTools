# Image to WebP (ImgTools)

A fast, lightweight, and private browser-based developer utility to convert images (**PNG, JPG/JPEG, HEIC/HEIF, AVIF, GIF, WebP**) to high-efficiency **WebP** format directly on your device.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React 19](https://img.shields.io/badge/React-19-61dafb.svg?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178c6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8.svg?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646cff.svg?logo=vite&logoColor=white)](https://vite.dev/)

---

## 📌 Overview

**Image to WebP** is designed with a clean, developer-focused aesthetic inspired by modern tools like Linear, GitHub, and Vercel. Unlike traditional converters that require backend servers or subscription plans, all image decoding, resizing, and encoding occur **strictly inside your web browser**.

---

## ✨ Key Features & Functions

- **⚡ 100% In-Browser Processing**: Images never leave your device. Zero server uploads, zero network latency, and complete privacy.
- **🖼️ Broad Format Compatibility**:
  - **PNG** (`.png`) — with full alpha transparency preservation.
  - **JPG / JPEG** (`.jpg`, `.jpeg`) — with high-efficiency WebP compression.
  - **HEIC / HEIF** (`.heic`, `.heif`) — converted client-side via WebAssembly/JS decoder.
  - **AVIF** (`.avif`) — native decoding supported.
  - **GIF** (`.gif`) & **WebP** (`.webp`).
- **🎛️ Configurable Conversion Settings**:
  - **WebP Quality Slider**: Adjust compression quality from 10% to 100% (default: 80% balanced).
  - **Max Output Width**: Optional custom pixel width with automatic aspect ratio maintenance.
- **📦 Batch Processing & ZIP Export**:
  - Drag & drop multiple images or entire folders.
  - Clipboard paste support (`Cmd/Ctrl + V`) to quickly convert screenshots.
  - Individual WebP downloads or one-click **Download All (.zip)**.
- **📊 Real-time Metrics**:
  - Displays original file size, compressed WebP size, and exact percentage reduction (e.g., `-65%`).
  - Image dimensions preview (`width × height`).
- **🚀 Ultra-Fast & Code-Split**:
  - Heavy decoders (such as HEIC libraries) are dynamically code-split and loaded on-demand, keeping the initial JavaScript bundle minimal (~106 KB gzipped).

---

## 📋 Supported Formats

| Input Format | Extension | Decoding Method | Alpha / Transparency |
| :--- | :--- | :--- | :---: |
| **PNG** | `.png` | Native Canvas / ImageBitmap | ✅ Supported |
| **JPEG** | `.jpg`, `.jpeg` | Native Canvas / ImageBitmap | N/A |
| **HEIC / HEIF** | `.heic`, `.heif` | Dynamic client-side decoder (`heic2any`) | ✅ Supported |
| **AVIF** | `.avif` | Native Browser Decoder | ✅ Supported |
| **GIF** | `.gif` | Native Canvas Frame Extractor | ✅ Supported |
| **WebP** | `.webp` | Native Re-encoder / Resizer | ✅ Supported |

---

## 💻 Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **[React 19](https://react.dev/)** | Reactive UI framework |
| **[TypeScript 6](https://www.typescriptlang.org/)** | Type safety and robust codebase |
| **[Tailwind CSS v4](https://tailwindcss.com/)** | Modern utility-first styling |
| **[Vite 8](https://vite.dev/)** | Fast developer server and optimized bundler |
| **[Lucide React](https://lucide.dev/)** | Clean, developer-oriented icons |
| **[heic2any](https://github.com/alexcorvi/heic2any)** | In-browser HEIC/HEIF decoding |
| **[JSZip](https://stuk.github.io/jszip/)** | In-browser ZIP archive generator |

---

## 📁 Project Structure

```text
ImgTools/
├── public/                 # Static assets (favicons, SVGs)
├── src/
│   ├── components/         # Modular UI components
│   │   ├── Header.tsx             # Application header & branding
│   │   ├── ImageUploader.tsx      # Drag & drop zone + clipboard handler
│   │   ├── ImageList.tsx          # Uploaded image queue list
│   │   ├── ConversionSettings.tsx # Quality, dimension & aspect ratio controls
│   │   └── ConversionResults.tsx  # Converted WebP list & batch ZIP download
│   ├── types/              # TypeScript interface definitions
│   │   ├── index.ts               # Core data models
│   │   └── heic2any.d.ts          # Ambient module declarations
│   ├── utils/              # Conversion & utility helpers
│   │   ├── formatters.ts          # Byte sizes, percentage formatting, validation
│   │   ├── imageConverter.ts      # Canvas WebP encoder & HEIC pipeline
│   │   └── zipHelper.ts           # Individual file & ZIP archive downloads
│   ├── App.tsx             # Main conversion workflow orchestrator
│   ├── index.css           # Tailwind CSS v4 imports & custom styles
│   └── main.tsx            # Application entry point
├── index.html              # HTML shell & font imports (Plus Jakarta Sans)
├── package.json            # Scripts & dependencies
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite build configuration
```

---

## 🚀 Quickstart & Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18.0 or higher recommended)
- `npm` or `pnpm` / `yarn`

### 1. Clone the Repository

```bash
git clone https://github.com/EmzdZiddan/ImgTools.git
cd ImgTools
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Local Development Server

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173/` (or the port shown in your terminal).

---

## 🛠️ Available Scripts

- `npm run dev`: Starts the local development server with hot-module replacement (HMR).
- `npm run build`: Runs TypeScript type-checking (`tsc -b`) and generates optimized production assets in `dist/`.
- `npm run preview`: Locally previews the production build output.

---

## 🔒 Privacy & Security

- **No Remote Processing**: All conversion logic is executed on the client machine using native Web APIs (`HTMLCanvasElement`, `Blob`, `URL.createObjectURL`).
- **No Telemetry / Tracking**: No analytic scripts, trackers, or remote loggers are included.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
