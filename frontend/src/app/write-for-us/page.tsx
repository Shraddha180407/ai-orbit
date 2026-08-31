import type { Metadata } from 'next';
import { WriteForUsClient } from '@/components/write-for-us-client';

export const metadata: Metadata = {
  title: 'Write for AI Orbit — Share Your AI Expertise',
  description: 'Pitch original, practical AI stories to the AI Orbit editorial team and reach a global technology audience.',
};

export default function WriteForUsPage() {
  return <WriteForUsClient />;
}
