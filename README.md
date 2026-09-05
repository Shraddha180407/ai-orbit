# AI Orbit — AI Ecosystem Leaderboard

## Overview
The AI Ecosystem Leaderboard is a production-ready module designed and developed end-to-end for [AI Orbit](https://aiorbit.club/). It provides live, standardized benchmark rankings, LMSYS Chatbot Arena Elo ratings, throughput speeds, and enterprise pricing across frontier foundation models, reasoning engines, and developer AI tools.

---

## Features
- **Instant Search & Filtering**: Real-time keyword search across model names, research labs, and capabilities.
- **Category Tabs**: Full category filtering (`Chatbot`, `Code Assistant`, `Image Generation`, `Audio & Voice`, `Video Editing`, `Productivity`, `Search & Answer`, `UI/UX Design`, `Data Analysis`, `Copywriting`, `Translation`).
- **Multi-Factor Sorting**: Sort by Arena Elo Rank, Monthly Visits, Growth Rate, or Newest Releases.
- **Full Flow & Detail Pages**:
  - Listing page (`/leaderboard`)
  - Detail page (`/leaderboard/:slug`) with standardized benchmark matrix, key telemetry, and runnable API code snippets.
  - Head-to-Head Comparison (`/leaderboard/compare`) with side-by-side metric matrix.
- **Responsive Mobile Optimization**:
  - Dedicated mobile card representation on 375px–768px screens to eliminate horizontal table squishing.
  - Clean desktop tabular view on 1440px displays.
- **Complete UI States**:
  - **Loading State**: Content-shaped skeleton loader mirroring the table and card structure.
  - **Empty State**: Clear search feedback with a functional "Clear filters" action.
  - **Error State**: Graceful error boundary state with working "Retry" button.
- **Interactive Micro-Interactions**:
  - Head-to-head comparison tray (compare up to 3 models simultaneously).
  - Saved models bookmarking with persistent `localStorage` support.
  - Global `⌘K` command palette search.

---

## Design
Built strictly to honor the existing **AI Orbit** visual identity:
- **Palette**: Pure black `#000000` background, elevated `#131316` card surfaces, subtle `#1C1C1F` / `#232326` borders, and signature `#6E56CF` purple accent.
- **Logo**: Uses the official AI Orbit logo asset (`/logo-full.png`) in both header and footer.
- **Typography & Spacing**: Clean geometric typography (`Inter` and `JetBrains Mono`) with consistent padding, heights, and border radius tokens.
- **Restrained Motion**: Subtle hover transitions, border brightness shifts, and arrow movements without disruptive animations.

---

## Tech Stack
- **Framework**: React 19 + Vite 8
- **Routing**: React Router v7 (`/`, `/leaderboard`, `/leaderboard/:slug`, `/leaderboard/compare`)
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React
- **Persistence**: Browser `localStorage` for bookmarks and compare states

---

## Data
Realistic, structured benchmark data modeled after live LMSYS Chatbot Arena rankings, SWE-bench Verified coding scores, MMLU Pro reasoning scores, and official API pricing sheets.

---

## Key UX Decisions
1. **Adaptive Mobile Presentation**: Rather than forcing a wide desktop table into an unreadable mobile view, the module switches to compact, information-dense mobile cards on screens under 640px.
2. **Direct Flow & Hierarchy**: The page layout follows an intuitive reading order: Hero context → High-level summary metrics → Category pill carousel → Search and sorting controls → Ranked listing → Functional pagination.
3. **Frictionless Comparison**: Users can select up to 3 models directly from the listing table and launch an instant comparison modal or navigate to the dedicated `/leaderboard/compare` page.
4. **Resilient Feedback States**: Implemented skeleton loaders, empty filter reset actions, and error retry handlers so users never encounter dead-ends or abrupt layout shifts.

---

## Future Improvements
- Integration with real-time LMSYS Arena API webhooks for automated hourly ranking recalculation.
- Historical Elo timeline graphs comparing model progression over time.
- Interactive latency benchmarks streamed from multiple global cloud inference regions.

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Production build
npm run build
```
