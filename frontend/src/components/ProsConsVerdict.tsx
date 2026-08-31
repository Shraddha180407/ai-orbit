import Check from 'lucide-react/dist/esm/icons/check';
import X from 'lucide-react/dist/esm/icons/x';
import Sparkles from 'lucide-react/dist/esm/icons/sparkles';

type ProsConsVerdictProps = {
  name: string;
  description: string;
  features: string[];
  categories: { category: { slug: string; name: string } }[];
  pros?: string[];
  cons?: string[];
};

export function ProsConsVerdict({ name, categories, pros: dbPros, cons: dbCons }: ProsConsVerdictProps) {
  const categorySlug = categories[0]?.category.slug ?? "";
  
  // Use DB pros/cons if available, otherwise fall back to category defaults
  let pros = (dbPros && dbPros.length > 0) ? dbPros : ["Boosts daily productivity and output", "Intuitive user interface and smooth onboarding", "Highly responsive support and active community"];
  let cons = (dbCons && dbCons.length > 0) ? dbCons : ["Requires internet connection for full functionality", "Higher pricing plans can be steep for individuals", "Advanced customization has a small learning curve"];
  let verdict = `An excellent option in its category. ${name} offers a reliable set of features that can save your team hours of manual work every week.`;

  if (categorySlug.includes("coding")) {
    pros = [
      "Incredible context-aware code suggestions",
      "Automates tedious boilerplate and refactoring",
      "Supports all major programming languages and frameworks",
      "Saves hours of troubleshooting syntax errors"
    ];
    cons = [
      "Can occasionally suggest legacy or deprecated syntax",
      "Requires high network bandwidth for remote model queries",
      "Requires caution with sensitive enterprise codebases"
    ];
    verdict = `${name} is an indispensable tool for developers looking to double their coding velocity. The speed and quality of its real-time code generation easily offset any subscription cost.`;
  } else if (categorySlug.includes("chatbots") || categorySlug.includes("research")) {
    pros = [
      "Advanced multi-turn reasoning and logic processing",
      "Can ingest large text files and documents for summaries",
      "Highly adaptable to coding, writing, and analysis tasks",
      "Clean, distraction-free chat interface"
    ];
    cons = [
      "Rate limits on advanced models can be restrictive",
      "Occasional confident hallucinations on niche topics",
      "Requires clear prompt phrasing for best results"
    ];
    verdict = `The gold standard for conversational intelligence. Whether you are coding, researching, or writing, ${name} acts as a force multiplier for knowledge workers.`;
  } else if (categorySlug.includes("image-generation") || categorySlug.includes("design")) {
    pros = [
      "Industry-leading image fidelity and artistic style detail",
      "Very fast iteration and rendering speeds",
      "Deep control over lighting, aspect ratios, and prompt weightings",
      "Excellent resolution scaling and upscaling features"
    ];
    cons = [
      "Complex prompt syntax has a steep initial learning curve",
      "Rendering fine text inside images can still be inconsistent",
      "Pricing can scale up quickly for heavy commercial generation"
    ];
    verdict = `An absolute powerhouse for digital artists, marketers, and web designers. ${name} unlocks rapid prototyping of concepts and cuts stock-photo costs to zero.`;
  } else if (categorySlug.includes("writing") || categorySlug.includes("marketing") || categorySlug.includes("seo")) {
    pros = [
      "Effectively eliminates writer's block for blog and social copy",
      "Accurately matches brand voice, tone guidelines, and style rules",
      "Integrated SEO optimization and keywords suggestions",
      "Supports quick translations and multi-language creation"
    ];
    cons = [
      "AI-generated drafts can occasionally feel formulaic",
      "Requires human editing to add personal anecdotes and unique insights",
      "Higher plans are priced premium compared to entry editors"
    ];
    verdict = `Ideal for content marketing teams and copywriters who need to scale quality text. It works best as an editorial partner that drafts outlines and polishes copy in real-time.`;
  } else if (categorySlug.includes("video") || categorySlug.includes("audio")) {
    pros = [
      "Ultra-realistic voice synthesis and avatar animation",
      "Allows creating high-quality tutorials without recording equipment",
      "Support for dozens of natural-sounding accents and languages",
      "Saves thousands of dollars in video production costs"
    ];
    cons = [
      "Rendering credits can be consumed very quickly for long projects",
      "Minor lip-sync or inflection anomalies on faster speeches",
      "Voice cloning requires high-quality source audio"
    ];
    verdict = `A game changer for course creators, educators, and content developers. ${name} makes video production accessible and quick, allowing you to update videos by simply editing text scripts.`;
  } else if (categorySlug.includes("productivity")) {
    pros = [
      "Centralizes search across multiple connected tools",
      "Accurate meeting notes, action items, and voice transcription",
      "Saves hours spent finding shared documents and files",
      "Smooth collaborative features for remote teams"
    ];
    cons = [
      "Requires connecting multiple workspaces to unlock full value",
      "Parsing speech in loud rooms or with overlapping audio can be messy",
      "Requires security compliance reviews for corporate integrations"
    ];
    verdict = `Essential for modern teams seeking to automate meetings and centralize knowledge. ${name} minimizes organizational friction and keeps everyone aligned effortlessly.`;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pros Card */}
        <div className="rounded-xl border border-success/10 bg-success/5 p-4 xs:p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-success uppercase tracking-wider mb-4">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success/15">
              <Check size={12} className="text-success" />
            </span>
            Pros
          </h3>
          <ul className="space-y-3">
            {pros.map((pro, index) => (
              <li key={index} className="flex items-start gap-2.5 text-sm text-foreground-muted">
                <Check size={14} className="text-success shrink-0 mt-0.5" />
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cons Card */}
        <div className="rounded-xl border border-danger/10 bg-danger/5 p-4 xs:p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-danger uppercase tracking-wider mb-4">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-danger/15">
              <X size={12} className="text-danger" />
            </span>
            Cons
          </h3>
          <ul className="space-y-3">
            {cons.map((con, index) => (
              <li key={index} className="flex items-start gap-2.5 text-sm text-foreground-muted">
                <X size={14} className="text-danger shrink-0 mt-0.5" />
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Antigravity Verdict Card */}
      <div className="relative overflow-hidden rounded-xl border border-accent/20 bg-gradient-to-br from-accent/5 to-transparent p-4 xs:p-6 shadow-xl shadow-black/20">
        <div className="absolute right-0 top-0 -mr-6 -mt-6 h-24 w-24 rounded-full bg-accent/10 blur-xl"></div>
        <div className="flex items-center gap-2.5 mb-3">
          <Sparkles className="text-accent h-4 w-4" />
          <h4 className="text-sm font-bold text-foreground uppercase tracking-wide">
            AI Verdict
          </h4>
        </div>
        <p className="text-sm leading-relaxed text-foreground-muted">
          {verdict}
        </p>
      </div>
    </div>
  );
}
