# Installation & Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
cd /sessions/sleepy-nice-shannon/mnt/XPansive777/blacktube/frontend
npm install
```

This will install:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Radix UI components
- Lucide React icons
- Zustand (state management)
- Axios (HTTP client)
- Additional utilities

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Update `.env.local` with your API configuration:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=BlackTube
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### 3. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Available Routes

### Authentication
- `/login` - Login page

### Dashboard & Projects
- `/` - Main dashboard
- `/projects` - Projects list
- `/projects/new` - Create new project
- `/projects/[id]` - Project details with tabs

### Production Tools
- `/mining` - Opportunity mining
- `/narrative` - Narrative engine (coming soon)
- `/scripts` - Script editor
- `/voice/[id]` - Voice studio
- `/timeline/[id]` - Visual timeline
- `/export/[id]` - Export options

### Assets & Settings
- `/presets` - Visual presets
- `/media` - Media library
- `/settings` - API configuration

## Project Configuration

### Tailwind CSS
The project includes custom color configuration in `tailwind.config.ts`:
- 15 custom color tokens
- Custom animations
- Responsive border radius
- Dark mode optimizations

### TypeScript
Configured for strict mode with proper type definitions for:
- React components
- Next.js pages
- API responses
- Zustand stores

### Styling System
- Global styles in `src/app/globals.css`
- Custom scrollbars
- Smooth animations
- Consistent spacing

## Build for Production

```bash
npm run build
npm run start
```

## Development Tips

### Adding New Pages
1. Create file: `src/app/route/page.tsx`
2. Import AppLayout: `import { AppLayout } from "@/components/layout/app-layout"`
3. Wrap content: `<AppLayout>Your content</AppLayout>`

### Creating Components
1. Place in `src/components/ui/` or `src/components/layout/`
2. Use TypeScript for type safety
3. Support className prop
4. Use `cn()` helper for Tailwind merging

### Using UI Components
```tsx
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Title</CardTitle>
      </CardHeader>
      <Input placeholder="Enter text" />
      <Button variant="accent">Submit</Button>
    </Card>
  )
}
```

### State Management with Zustand
```tsx
import { useAuthStore, useProjectStore, useUIStore } from "@/lib/store"

export function MyComponent() {
  const { user, logout } = useAuthStore()
  const { currentProject } = useProjectStore()
  const { sidebarOpen, setSidebarOpen } = useUIStore()
}
```

### API Calls
```tsx
import api from "@/lib/api"

async function fetchData() {
  try {
    const response = await api.get("/endpoint")
    return response.data
  } catch (error) {
    console.error("API Error:", error)
  }
}
```

## Troubleshooting

### Port 3000 Already in Use
```bash
npm run dev -- -p 3001
```

### Clear Cache & Reinstall
```bash
rm -rf node_modules package-lock.json
npm install
```

### Reset Environment
```bash
rm -rf .next
npm run dev
```

## Performance Optimization

### Enable Fast Refresh
Already enabled in development mode - hot reload on file changes

### Use Server Components
By default, components are server components. Only use `"use client"` when needed.

### Image Optimization
Prepare for Next.js Image component:
```tsx
import Image from "next/image"

export function MyImage() {
  return (
    <Image
      src="/image.png"
      alt="Description"
      width={400}
      height={300}
    />
  )
}
```

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers supported

## Next Steps

1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Open http://localhost:3000
4. Log in with test credentials (if backend ready)
5. Explore all pages with mock data
6. Customize as needed

## Support

For issues or questions:
1. Check README.md for overview
2. Review PROJECT_STRUCTURE.md for file organization
3. Check component examples in existing pages
4. Verify environment variables in .env.local
