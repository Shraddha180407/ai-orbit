import Code2 from 'lucide-react/dist/esm/icons/code-2';
import FileText from 'lucide-react/dist/esm/icons/file-text';
import Search from 'lucide-react/dist/esm/icons/search';
import Megaphone from 'lucide-react/dist/esm/icons/megaphone';
import Briefcase from 'lucide-react/dist/esm/icons/briefcase';
import Headset from 'lucide-react/dist/esm/icons/headset';
import ImageIcon from 'lucide-react/dist/esm/icons/image';
import Video from 'lucide-react/dist/esm/icons/video';
import Music from 'lucide-react/dist/esm/icons/music';
import Languages from 'lucide-react/dist/esm/icons/languages';
import Presentation from 'lucide-react/dist/esm/icons/presentation';
import Lightbulb from 'lucide-react/dist/esm/icons/lightbulb';
import Terminal from 'lucide-react/dist/esm/icons/terminal';
import Globe from 'lucide-react/dist/esm/icons/globe';
import BarChart3 from 'lucide-react/dist/esm/icons/bar-chart-3';
import Sparkles from 'lucide-react/dist/esm/icons/sparkles';
import type { LucideIcon } from "lucide-react";

// Keyed to the real task category slugs (see TASK_CATEGORIES in tasks-client.tsx)
const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  "content-creation": FileText,
  "image-creation": ImageIcon,
  "video-creation": Video,
  audio: Music,
  coding: Code2,
  "data-analysis": BarChart3,
  research: Search,
  productivity: Briefcase,
  marketing: Megaphone,
  "customer-support": Headset,
  translation: Languages,
  presentation: Presentation,
  brainstorming: Lightbulb,
  prompting: Terminal,
  "website-building": Globe,
};

export function getCategoryIcon(categorySlug: string | undefined | null): LucideIcon {
  if (!categorySlug) return Sparkles;
  return CATEGORY_ICON_MAP[categorySlug] ?? Sparkles;
}