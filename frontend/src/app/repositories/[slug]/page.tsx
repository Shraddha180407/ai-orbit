import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RepositoryDetailPage } from "@/components/repository-detail/RepositoryDetailPage";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-white">
      <Header />
      <main className="mx-auto max-w-[1440px] px-8 pt-0 pb-12 flex-1 w-full">
        <RepositoryDetailPage slug={slug} />
      </main>
      <Footer />
    </div>
  );
}