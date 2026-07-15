# ☕ Java Master Interview Notes — PWA

An interactive, offline-capable **Progressive Web App** built with Next.js that turns the Java Master Notes PDF into a fully searchable, annotatable study experience.

## ✨ Features

| Feature | Description |
|---|---|
| 📚 **20 Sections** | All Java topics from Core Java to DevOps |
| 🔍 **Smart Search** | Fuzzy search across all 339 terms (⌘K) |
| 🖊 **Text Highlighting** | Select any text → highlight in 4 colors |
| 📝 **Inline Notes** | Add/edit/delete notes per term |
| ⭐ **Bookmarks** | Star important terms |
| ✓ **Progress Tracking** | Mark terms read, track per-section % |
| 🃏 **Flashcard Mode** | Pass/fail/skip card study mode |
| 📊 **Progress Dashboard** | Study streak + section breakdown |
| 🌙 **Dark / Light Theme** | Smooth toggle, persists across sessions |
| 📱 **Fully Responsive** | Mobile, tablet, desktop layouts |
| 📥 **Export Notes** | Download all notes as Markdown |
| 🔌 **PWA / Offline** | Installable, works offline after first load |

## 🏗 Tech Stack

- **Next.js 15** (App Router, Static Export)
- **TypeScript**
- **Vanilla CSS** (Living Textbook design system)
- **Fuse.js** (fuzzy search)
- **Framer Motion** (animations)
- **LocalStorage** (all user data — no backend needed)

## 🚀 GitHub Pages Deployment

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### 2. Configure GitHub Pages
- Go to your repo → **Settings** → **Pages**
- Source: **GitHub Actions**

### 3. Set Base Path (if using a project repo)
If your site URL is `https://username.github.io/REPO_NAME/`:
- Go to **Settings** → **Variables and secrets** → **Variables**
- Add variable: `BASE_PATH` = `/REPO_NAME`

If it's a user repo (`username.github.io`), skip this step.

### 4. Auto-deploy
Every push to `main` auto-deploys via GitHub Actions.

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm run dev

# Production build
npm run build
```

## 📊 Data

The app loads JSON files from `/public/data/`:
- `index.json` — lightweight section index
- `section-01-core-java.json` through `section-20-devops.json`

Re-extract from PDF (if PDF is updated):
```bash
python scripts/extract_pdf.py
xcopy src\data\* public\data\ /E /Y
```

## 💾 Local Storage Keys

| Key | Contains |
|---|---|
| `java-notes-theme` | `light` or `dark` |
| `java-notes-progress` | Read terms, bookmarks, streak |
| `java-notes-highlights` | Text highlights by termId |
| `java-notes-user-notes` | User notes by termId |

All data is 100% local — no account, no server, no tracking.

## 📱 PWA Install

- **Chrome/Edge**: Click install icon in address bar
- **iOS Safari**: Share → Add to Home Screen
- Works fully offline after first load
