import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RobotDetailClient } from "@/components/detail/RobotDetailClient";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const title = id
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: `${title} — Robots — The AI Signal`,
    description: `Details and specifications for ${title}.`,
  };
}

export default async function RobotDetailPage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-white selection:bg-neutral-800 selection:text-white">
      <Header />
      <RobotDetailClient id={id} />
      <Footer />
    </div>
  );
}
