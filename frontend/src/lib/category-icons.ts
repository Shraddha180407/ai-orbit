import Code2 from 'lucide-react/dist/esm/icons/code-2';
import FileText from 'lucide-react/dist/esm/icons/file-text';
import Search from 'lucide-react/dist/esm/icons/search';
import Palette from 'lucide-react/dist/esm/icons/palette';
import Megaphone from 'lucide-react/dist/esm/icons/megaphone';
import Briefcase from 'lucide-react/dist/esm/icons/briefcase';
import Headset from 'lucide-react/dist/esm/icons/headset';
import ImageIcon from 'lucide-react/dist/esm/icons/image';
import Video from 'lucide-react/dist/esm/icons/video';
import Music from 'lucide-react/dist/esm/icons/music';
import SearchCheck from 'lucide-react/dist/esm/icons/search-check';
import MessageSquare from 'lucide-react/dist/esm/icons/message-square';
import Sparkles from 'lucide-react/dist/esm/icons/sparkles';
import type { LucideIcon } from "lucide-react";

const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  coding: Code2,
  writing: FileText,
  research: Search,
  design: Palette,
  marketing: Megaphone,
  productivity: Briefcase,
  "customer-support": Headset,
  "image-generation": ImageIcon,
  video: Video,
  audio: Music,
  seo: SearchCheck,
  chatbots: MessageSquare,
};

export function getCategoryIcon(categorySlug: string | undefined | null): LucideIcon {
  if (!categorySlug) return Sparkles;
  return CATEGORY_ICON_MAP[categorySlug] ?? Sparkles;
}