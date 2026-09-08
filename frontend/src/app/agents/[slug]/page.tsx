import AgentDetailClient from "../../../components/AgentDetailClient";

interface AgentPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function AgentPage({ params }: AgentPageProps) {
  const { slug } = await params;

  return <AgentDetailClient slug={slug} />;
}