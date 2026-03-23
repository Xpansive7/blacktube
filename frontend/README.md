# BlackTube Frontend

A premium dark cinematic studio dashboard for narrative mining and AI-powered content creation.

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom dark theme
- **State Management**: Zustand
- **UI Components**: Custom Radix UI-based components
- **HTTP Client**: Axios with JWT interceptor
- **Icons**: Lucide React
- **Font**: Inter (Google Fonts)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm run start
```

## Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   ├── page.tsx                 # Dashboard
│   ├── login/                   # Login page
│   ├── projects/                # Projects management
│   │   ├── page.tsx            # Projects list
│   │   ├── new/                # New project creation
│   │   └── [id]/               # Project details
│   ├── mining/                  # Opportunity mining
│   ├── presets/                 # Visual presets
│   ├── voice/[id]/              # Voice studio
│   ├── timeline/[id]/           # Timeline view
│   ├── export/[id]/             # Export options
│   ├── settings/                # API settings
│   ├── media/                   # Media library
│   ├── narrative/               # Narrative engine
│   └── scripts/                 # Script editor
├── components/
│   ├── ui/                      # Reusable UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── tabs.tsx
│   │   ├── badge.tsx
│   │   ├── slider.tsx
│   │   └── ...
│   └── layout/                  # Layout components
│       ├── sidebar.tsx
│       ├── header.tsx
│       └── app-layout.tsx
└── lib/
    ├── utils.ts                 # Helper functions
    ├── api.ts                   # Axios instance & interceptors
    └── store.ts                 # Zustand stores
```

## Custom Theme Colors

The project uses a premium dark cinema aesthetic:

- **Background**: `#020204` (near-black)
- **Surface**: `#0A0C10`, `#12141A`, `#1A1D26` (shades)
- **Border**: `#1E2130` (default), `#2A6FA8` (active)
- **Text**: `#E8ECF4` (primary), `#8B92A8` (secondary), `#4A5068` (muted)
- **Accent**: `#2A6FA8` (cyan-blue), `#38BDF8` (glow)
- **Status**: Success `#22C55E`, Warning `#F59E0B`, Danger `#EF4444`

## Key Features Implemented

### Core Pages
- **Dashboard**: Stats, quick actions, recent projects, activity summary
- **Login**: Email/password authentication with animated background
- **Projects**: Full CRUD with filtering, search, and status badges
- **New Project**: 3-step creation wizard with narrative modes and visual presets
- **Project Details**: Comprehensive overview with tabs for script, assets, voice, timeline, export

### Production Tools
- **Mining**: Opportunity discovery with YouTube stats and opportunity scoring
- **Narrative Engine**: Mode selection with 9 narrative styles
- **Voice Studio**: Chapter-based voice generation with model selection
- **Timeline**: Visual horizontal timeline with drag handles
- **Export**: Multiple format export (JSON, TXT, PDF) with history

### Assets & Personalization
- **Visual Presets**: 6 pre-designed color palettes with intensity indicators
- **API Settings**: Service integration with test connection features
- **Media Library**: Placeholder for asset management

## UI Components

All custom-built with dark theme consistency:

- **Button**: Default, ghost, danger, accent variants
- **Input/Textarea**: With error states
- **Card**: Interactive and static variants
- **Tabs**: Custom implementation with active states
- **Badge**: Multiple color variants
- **Progress**: With variant colors
- **Slider**: Interactive with visual feedback
- **Tooltip**: Hover tooltips
- **Separator**: Horizontal/vertical dividers

## State Management

### Zustand Stores
- `useAuthStore`: User authentication state
- `useProjectStore`: Current and cached projects
- `useUIStore`: Sidebar/tab state

## API Integration

Axios instance at `src/lib/api.ts` with:
- Base URL: `http://localhost:8000/api`
- JWT interceptor from cookies
- 401 handling with redirect to login

## Styling System

- Tailwind CSS with extended color palette
- Custom border radius (4px, 6px, 8px)
- Custom animations (fadeIn, slideIn, glowPulse)
- Thin dark scrollbars
- No rounded corners larger than 8px
- Monospace fonts for data/stats

## Development Guidelines

### Adding New Pages
1. Create file in `src/app/path/page.tsx`
2. Wrap with `<AppLayout>` for sidebar/header
3. Use `"use client"` for client-side interactivity
4. Import components from `@/components`

### Creating UI Components
1. Use custom components in `src/components/ui/`
2. Forward refs for proper accessibility
3. Support className prop for customization
4. Include proper TypeScript types

### Styling Components
- Use Tailwind classes with `cn()` helper
- Reference custom theme colors
- Keep animations subtle and professional
- Test hover/focus states

## Performance Optimizations

- Server components by default
- Client components only where needed
- Image optimization ready
- CSS-in-JS minimized
- Efficient re-renders with Zustand

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## License

Private - XPansive777
