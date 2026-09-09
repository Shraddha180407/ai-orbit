export const COMPANY_CATEGORIES = [
  "All",
  "Foundation Models",
  "AI Infrastructure",
  "AI Code & DevTools",
  "AI Search & Assistants",
  "Voice & Multimodal",
  "Enterprise & Productivity",
  "Creative & Video AI"
];

export const COMPANY_PERSPECTIVES = [
  { id: "overall", label: "Overall", icon: "Trophy", description: "Composite ecosystem prominence and market strength" },
  { id: "funding", label: "Funding", icon: "DollarSign", description: "Disclosed venture and private capital raised" },
  { id: "valuation", label: "Valuation", icon: "Gem", description: "Estimated enterprise valuation or market capitalization" },
  { id: "growth", label: "Growth", icon: "TrendingUp", description: "Headcount velocity, web momentum, and adoption trajectory" }
];

export const COMPANIES_DATA = [
  {
    "id": "openai",
    "slug": "openai",
    "name": "OpenAI",
    "org": "OpenAI Inc.",
    "logoColor": "#10A37F",
    "logoText": "OpenAI",
    "category": "Foundation Models",
    "rank": 1,
    "rankDelta": "0",
    "valuation": "$157B",
    "valuationNum": 157000,
    "funding": "$17.9B",
    "fundingNum": 17900,
    "growthRate": "+38.4%",
    "growthNum": 38.4,
    "marketSignal": "Strong",
    "marketSignalDetail": "Ecosystem Anchor • Massive Enterprise Scale",
    "headquarters": "San Francisco, CA",
    "foundedYear": 2015,
    "teamSize": "2,000+",
    "hiringVelocity": "High (+42 open roles)",
    "webVisits": "220M / mo",
    "website": "https://openai.com",
    "shortDescription": "Frontier research laboratory developing safe, beneficial artificial general intelligence and industry-standard LLMs.",
    "fullDescription": "OpenAI pioneered consumer generative AI with ChatGPT and the GPT series of foundation models. Today, it serves over 200M weekly active users and millions of developers worldwide, pushing the frontier of reasoning architectures with the o-series models.",
    "leadership": [
      {
        "name": "Sam Altman",
        "role": "CEO & Co-Founder"
      },
      {
        "name": "Greg Brockman",
        "role": "President & Co-Founder"
      },
      {
        "name": "Mark Chen",
        "role": "SVP of Research"
      }
    ],
    "latestRound": {
      "round": "Series Secondary / Growth",
      "amount": "$6.6B",
      "date": "October 2024",
      "source": "Company Press Release"
    },
    "majorInvestors": [
      "Microsoft",
      "Thrive Capital",
      "SoftBank",
      "Khosla Ventures",
      "Fidelity"
    ],
    "signals": [
      {
        "type": "Funding",
        "text": "Raised $6.6B at $157B post-money valuation"
      },
      {
        "type": "Product",
        "text": "Shipped o3-mini STEM reasoning model & Operator agent preview"
      },
      {
        "type": "Scale",
        "text": "Surpassed 1M business paying business users"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "anthropic",
    "slug": "anthropic",
    "name": "Anthropic",
    "org": "Anthropic PBC",
    "logoColor": "#D97706",
    "logoText": "Claude",
    "category": "Foundation Models",
    "rank": 2,
    "rankDelta": "+1",
    "valuation": "$60B",
    "valuationNum": 60000,
    "funding": "$9.7B",
    "fundingNum": 9700,
    "growthRate": "+54.2%",
    "growthNum": 54.2,
    "marketSignal": "Strong",
    "marketSignalDetail": "Coding Standard • Leading Enterprise Growth",
    "headquarters": "San Francisco, CA",
    "foundedYear": 2021,
    "teamSize": "1,200+",
    "hiringVelocity": "Very High (+65 open roles)",
    "webVisits": "148M / mo",
    "website": "https://www.anthropic.com",
    "shortDescription": "AI safety and research public benefit corporation creators of the Claude foundation model family.",
    "fullDescription": "Anthropic builds reliable, interpretable, and steerable AI systems with Constitutional AI. Its Claude 3.7 Sonnet hybrid reasoning architecture currently holds the global benchmark in coding and full-stack software development.",
    "leadership": [
      {
        "name": "Dario Amodei",
        "role": "CEO & Co-Founder"
      },
      {
        "name": "Daniela Amodei",
        "role": "President & Co-Founder"
      },
      {
        "name": "Jared Kaplan",
        "role": "Chief Science Officer"
      }
    ],
    "latestRound": {
      "round": "Strategic Venture Round",
      "amount": "$4.0B",
      "date": "November 2024",
      "source": "Amazon Regulatory Filing"
    },
    "majorInvestors": [
      "Amazon",
      "Google",
      "Spark Capital",
      "Salesforce Ventures",
      "Menlo Ventures"
    ],
    "signals": [
      {
        "type": "Product",
        "text": "Launched Claude 3.7 Sonnet with hybrid thinking budget tokens"
      },
      {
        "type": "Infrastructure",
        "text": "Expanded AWS Trainium2 and Google TPU v5e superclusters"
      },
      {
        "type": "Market",
        "text": "Ranked #1 Coding Model across SWE-bench Verified"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "deepseek",
    "slug": "deepseek",
    "name": "DeepSeek AI",
    "org": "Hangzhou DeepSeek AI Ltd.",
    "logoColor": "#3B82F6",
    "logoText": "DeepSeek",
    "category": "Foundation Models",
    "rank": 3,
    "rankDelta": "+4",
    "valuation": "$15B (Est.)",
    "valuationNum": 15000,
    "funding": "Undisclosed",
    "fundingNum": 500,
    "growthRate": "+142.0%",
    "growthNum": 142,
    "marketSignal": "Strong",
    "marketSignalDetail": "Disruption Leader • Explosive Developer Adoption",
    "headquarters": "Hangzhou, China",
    "foundedYear": 2023,
    "teamSize": "200+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "190M / mo",
    "website": "https://deepseek.com",
    "shortDescription": "Open-weights artificial intelligence research lab pioneering ultra-cost-efficient pure RL models.",
    "fullDescription": "DeepSeek shocked global markets by demonstrating that pure large-scale reinforcement learning (DeepSeek-R1) and multi-head latent attention (MLA) can match frontier proprietary reasoning models at a fraction of inference costs.",
    "leadership": [
      {
        "name": "Liang Wenfeng",
        "role": "Founder & Lead Researcher"
      }
    ],
    "latestRound": {
      "round": "Hedge Fund Capital Allocation",
      "amount": "Proprietary",
      "date": "2024",
      "source": "High-Flyer Capital"
    },
    "majorInvestors": [
      "High-Flyer Quant",
      "Private Internal Capital"
    ],
    "signals": [
      {
        "type": "Open Source",
        "text": "DeepSeek-R1 released under permissive MIT License"
      },
      {
        "type": "Architecture",
        "text": "Multi-Head Latent Attention reduced KV cache by 93%"
      },
      {
        "type": "Viral",
        "text": "Surpassed 100M downloads across Hugging Face & Ollama"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Estimated / Private"
  },
  {
    "id": "databricks",
    "slug": "databricks",
    "name": "Databricks",
    "org": "Databricks Inc.",
    "logoColor": "#FF3621",
    "logoText": "Databricks",
    "category": "AI Infrastructure",
    "rank": 4,
    "rankDelta": "0",
    "valuation": "$55B",
    "valuationNum": 55000,
    "funding": "$4.2B",
    "fundingNum": 4200,
    "growthRate": "+22.1%",
    "growthNum": 22.1,
    "marketSignal": "Strong",
    "marketSignalDetail": "Enterprise Moat • Lakehouse AI Dominance",
    "headquarters": "San Francisco, CA",
    "foundedYear": 2013,
    "teamSize": "7,000+",
    "hiringVelocity": "High (+120 open roles)",
    "webVisits": "28M / mo",
    "website": "https://databricks.com",
    "shortDescription": "Data and AI company providing the unified Lakehouse Platform and open source DBRX models.",
    "fullDescription": "Databricks combines data warehouses and data lakes into a unified lakehouse architecture. With MosaicML integration, Databricks enables Fortune 500 enterprises to train, fine-tune, and deploy private custom generative AI models securely on their own enterprise data.",
    "leadership": [
      {
        "name": "Ali Ghodsi",
        "role": "CEO & Co-Founder"
      },
      {
        "name": "Matei Zaharia",
        "role": "CTO & Co-Founder"
      },
      {
        "name": "Patrick Wendell",
        "role": "VP Engineering & Co-Founder"
      }
    ],
    "latestRound": {
      "round": "Series I",
      "amount": "$500M+",
      "date": "September 2023",
      "source": "SEC Filing"
    },
    "majorInvestors": [
      "Andreessen Horowitz",
      "Baillie Gifford",
      "Counterpoint Global",
      "T. Rowe Price",
      "NVIDIA"
    ],
    "signals": [
      {
        "type": "Financial",
        "text": "Annualized revenue run-rate surpassed $2.4B"
      },
      {
        "type": "Acquisition",
        "text": "Integrated MosaicML & Tabular for Apache Iceberg"
      },
      {
        "type": "Ecosystem",
        "text": "Over 10,000 enterprise organizations on Lakehouse platform"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "perplexity",
    "slug": "perplexity",
    "name": "Perplexity AI",
    "org": "Perplexity AI Inc.",
    "logoColor": "#00E5FF",
    "logoText": "Perplexity",
    "category": "AI Search & Assistants",
    "rank": 5,
    "rankDelta": "+2",
    "valuation": "$9.0B",
    "valuationNum": 9000,
    "funding": "$1.0B",
    "fundingNum": 1000,
    "growthRate": "+34.5%",
    "growthNum": 34.5,
    "marketSignal": "Strong",
    "marketSignalDetail": "Breakout Conversational Search Disrupter",
    "headquarters": "San Francisco, CA",
    "foundedYear": 2022,
    "teamSize": "180+",
    "hiringVelocity": "High (+30 open roles)",
    "webVisits": "115M / mo",
    "website": "https://perplexity.ai",
    "shortDescription": "Conversational answer engine combining real-time web indexation with cited multi-source synthesis.",
    "fullDescription": "Perplexity transforms information discovery by answering user queries with synthesized paragraphs cited with verified inline links. Its enterprise Pro Search handles complex multi-step research queries across financial data, academic papers, and live news.",
    "leadership": [
      {
        "name": "Aravind Srinivas",
        "role": "CEO & Co-Founder"
      },
      {
        "name": "Denis Yarats",
        "role": "CTO & Co-Founder"
      },
      {
        "name": "Johnny Ho",
        "role": "Chief Strategy Officer"
      }
    ],
    "latestRound": {
      "round": "Series D",
      "amount": "$500M",
      "date": "December 2024",
      "source": "Bloomberg / Company PR"
    },
    "majorInvestors": [
      "Institutional Venture Partners (IVP)",
      "NEA",
      "Jeff Bezos",
      "NVIDIA",
      "Elad Gil"
    ],
    "signals": [
      {
        "type": "Traffic",
        "text": "Exceeded 115M monthly queries and rapid enterprise tier uptake"
      },
      {
        "type": "Commercial",
        "text": "Launched Perplexity Enterprise Pro with single sign-on"
      },
      {
        "type": "Funding",
        "text": "Valuation surged from $520M to $9B in under 18 months"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "anysphere",
    "slug": "anysphere",
    "name": "Anysphere (Cursor)",
    "org": "Anysphere Inc.",
    "logoColor": "#8B5CF6",
    "logoText": "Cursor",
    "category": "AI Code & DevTools",
    "rank": 6,
    "rankDelta": "+3",
    "valuation": "$2.5B",
    "valuationNum": 2500,
    "funding": "$75M",
    "fundingNum": 75,
    "growthRate": "+62.1%",
    "growthNum": 62.1,
    "marketSignal": "Emerging",
    "marketSignalDetail": "Hypergrowth Developer Standard • Strong Love",
    "headquarters": "San Francisco, CA",
    "foundedYear": 2022,
    "teamSize": "45+",
    "hiringVelocity": "High (+20 open roles)",
    "webVisits": "42M / mo",
    "website": "https://cursor.com",
    "shortDescription": "Creators of Cursor, the AI code editor with deep repository semantic indexing and multi-file agentic diffs.",
    "fullDescription": "Anysphere builds Cursor, a fork of VS Code engineered from the ground up for agentic development. Cursor indices whole git repositories into local embeddings, enabling multi-file refactors, autonomous terminal debugging, and multi-model code synthesis.",
    "leadership": [
      {
        "name": "Michael Truell",
        "role": "CEO & Co-Founder"
      },
      {
        "name": "Sualeh Asif",
        "role": "Co-Founder"
      },
      {
        "name": "Aman Sanger",
        "role": "Co-Founder"
      }
    ],
    "latestRound": {
      "round": "Series A Extension",
      "amount": "$60M",
      "date": "August 2024",
      "source": "TechCrunch"
    },
    "majorInvestors": [
      "Andreessen Horowitz",
      "OpenAI Startup Fund",
      "Patrick Collison",
      "Nat Friedman"
    ],
    "signals": [
      {
        "type": "Adoption",
        "text": "Over 30,000 engineering teams migrated to Cursor in 2024–2025"
      },
      {
        "type": "Product",
        "text": "Composer introduced full multi-file background agents"
      },
      {
        "type": "Revenue",
        "text": "Surpassed $100M estimated ARR velocity"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "scale-ai",
    "slug": "scale-ai",
    "name": "Scale AI",
    "org": "Scale AI Inc.",
    "logoColor": "#FFFFFF",
    "logoText": "Scale",
    "category": "AI Infrastructure",
    "rank": 7,
    "rankDelta": "-1",
    "valuation": "$14B",
    "valuationNum": 14000,
    "funding": "$1.6B",
    "fundingNum": 1600,
    "growthRate": "+28.4%",
    "growthNum": 28.4,
    "marketSignal": "Strong",
    "marketSignalDetail": "Foundational RLHF & Data Partner for Frontier Labs",
    "headquarters": "San Francisco, CA",
    "foundedYear": 2016,
    "teamSize": "1,500+",
    "hiringVelocity": "Moderate (+40 open roles)",
    "webVisits": "6M / mo",
    "website": "https://scale.com",
    "shortDescription": "Data engine delivering human-in-the-loop RLHF, synthetic data, and frontier evaluation for generative AI.",
    "fullDescription": "Scale AI provides data infrastructure for foundation model builders and national defense agencies. Its platform powers high-quality data annotation, Red Teaming, RLHF fine-tuning, and evaluation benchmarks for OpenAI, Meta, Microsoft, and the US Department of Defense.",
    "leadership": [
      {
        "name": "Alexandr Wang",
        "role": "CEO & Founder"
      },
      {
        "name": "Jason Wheeler",
        "role": "CFO"
      }
    ],
    "latestRound": {
      "round": "Series F",
      "amount": "$1.0B",
      "date": "May 2024",
      "source": "Company PR"
    },
    "majorInvestors": [
      "Accel",
      "Founders Fund",
      "Index Ventures",
      "Amazon",
      "Meta",
      "NVIDIA"
    ],
    "signals": [
      {
        "type": "Defense",
        "text": "Awarded multi-million dollar contracts with DoD for defense LLMs"
      },
      {
        "type": "Ecosystem",
        "text": "SEAL leaderboards recognized as benchmark authority"
      },
      {
        "type": "Valuation",
        "text": "Doubled valuation from $7.3B to $14B in Series F"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "midjourney",
    "slug": "midjourney",
    "name": "Midjourney",
    "org": "Midjourney Inc.",
    "logoColor": "#EC4899",
    "logoText": "Midjourney",
    "category": "Creative & Video AI",
    "rank": 8,
    "rankDelta": "0",
    "valuation": "$10B (Est.)",
    "valuationNum": 10000,
    "funding": "$0 (Bootstrapped)",
    "fundingNum": 0,
    "growthRate": "+14.8%",
    "growthNum": 14.8,
    "marketSignal": "Strong",
    "marketSignalDetail": "Legendary Bootstrapped Profitability • Creative Standard",
    "headquarters": "San Francisco, CA",
    "foundedYear": 2021,
    "teamSize": "100+",
    "hiringVelocity": "Selective (+8 open roles)",
    "webVisits": "85M / mo",
    "website": "https://midjourney.com",
    "shortDescription": "Independent research lab exploring new mediums of thought and expanding creative imaginative powers.",
    "fullDescription": "Midjourney is famously 100% bootstrapped without venture capital, generating hundreds of millions in profit. Its v6 image models set the global standard in cinematic photorealism, multi-modal inpainting, and text typography rendering.",
    "leadership": [
      {
        "name": "David Holz",
        "role": "Founder & CEO"
      }
    ],
    "latestRound": {
      "round": "Bootstrapped / Self-Funded",
      "amount": "$0",
      "date": "Continuous",
      "source": "Founder Disclosures"
    },
    "majorInvestors": [
      "None (Self-Funded by David Holz)"
    ],
    "signals": [
      {
        "type": "Financial",
        "text": "Generates estimated $300M+ ARR with ~100 staff"
      },
      {
        "type": "Hardware",
        "text": "Developing custom hardware & spatial computing lab"
      },
      {
        "type": "Web",
        "text": "Full web canvas editor rolled out to all users"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Estimated Bootstrapped"
  },
  {
    "id": "elevenlabs",
    "slug": "elevenlabs",
    "name": "ElevenLabs",
    "org": "ElevenLabs Inc.",
    "logoColor": "#6366F1",
    "logoText": "ElevenLabs",
    "category": "Voice & Multimodal",
    "rank": 9,
    "rankDelta": "+2",
    "valuation": "$3.3B",
    "valuationNum": 3300,
    "funding": "$180M",
    "fundingNum": 180,
    "growthRate": "+22.4%",
    "growthNum": 22.4,
    "marketSignal": "Strong",
    "marketSignalDetail": "Global Voice AI Benchmark • Conversational Streaming",
    "headquarters": "New York & London",
    "foundedYear": 2022,
    "teamSize": "160+",
    "hiringVelocity": "High (+35 open roles)",
    "webVisits": "34M / mo",
    "website": "https://elevenlabs.io",
    "shortDescription": "AI voice technology research company creating natural human voice synthesis, cloning, and conversational agents.",
    "fullDescription": "ElevenLabs develops human-quality generative voice audio across 29 languages. Its conversational WebSocket API enables sub-150ms real-time voice agents for customer care, audiobook production, and gaming NPCs.",
    "leadership": [
      {
        "name": "Mati Staniszewski",
        "role": "CEO & Co-Founder"
      },
      {
        "name": "Piotr Dabkowski",
        "role": "CTO & Co-Founder"
      }
    ],
    "latestRound": {
      "round": "Series B Extension",
      "amount": "$80M",
      "date": "January 2024",
      "source": "a16z & Company PR"
    },
    "majorInvestors": [
      "Andreessen Horowitz",
      "Nat Friedman",
      "Daniel Gross",
      "Sequoia Capital",
      "SV Angel"
    ],
    "signals": [
      {
        "type": "Product",
        "text": "Launched Conversational AI agent platform with ultra-low latency"
      },
      {
        "type": "Ecosystem",
        "text": "Over 40% of Fortune 500 publishing media use ElevenLabs voices"
      },
      {
        "type": "Valuation",
        "text": "Valuation expanded to $3.3B in recent secondary rounds"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "cohere",
    "slug": "cohere",
    "name": "Cohere",
    "org": "Cohere Inc.",
    "logoColor": "#39594C",
    "logoText": "Cohere",
    "category": "Foundation Models",
    "rank": 10,
    "rankDelta": "-1",
    "valuation": "$5.5B",
    "valuationNum": 5500,
    "funding": "$970M",
    "fundingNum": 970,
    "growthRate": "+19.5%",
    "growthNum": 19.5,
    "marketSignal": "Watch",
    "marketSignalDetail": "Enterprise RAG & Privacy-Centric Cloud Neutrality",
    "headquarters": "Toronto, Canada & San Francisco",
    "foundedYear": 2019,
    "teamSize": "400+",
    "hiringVelocity": "Moderate (+25 open roles)",
    "webVisits": "8M / mo",
    "website": "https://cohere.com",
    "shortDescription": "Enterprise AI platform building multilingual LLMs, advanced RAG, and retrieval embeddings for private clouds.",
    "fullDescription": "Cohere specializes in enterprise-grade LLMs that can be deployed securely across multi-cloud environments (AWS, GCP, Azure, Oracle) or on-premises. Its Command R+ models are purpose-built for enterprise Retrieval-Augmented Generation (RAG) and tool-calling.",
    "leadership": [
      {
        "name": "Aidan Gomez",
        "role": "CEO & Co-Founder (Transformer Paper Author)"
      },
      {
        "name": "Nick Frosst",
        "role": "Co-Founder"
      },
      {
        "name": "Ivan Zhang",
        "role": "Co-Founder"
      }
    ],
    "latestRound": {
      "round": "Series D",
      "amount": "$500M",
      "date": "July 2024",
      "source": "Company PR / Reuters"
    },
    "majorInvestors": [
      "Cisco",
      "AMD Ventures",
      "NVIDIA",
      "EDBI",
      "Salesforce Ventures",
      "Inovia Capital"
    ],
    "signals": [
      {
        "type": "Product",
        "text": "Command R+ released with state-of-the-art multilingual RAG"
      },
      {
        "type": "Enterprise",
        "text": "Partnerships signed with Oracle Cloud, Fujitsu, and Bell Canada"
      },
      {
        "type": "Security",
        "text": "First enterprise LLM with private sovereign cloud residency"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "mistral",
    "slug": "mistral",
    "name": "Mistral AI",
    "org": "Mistral AI SAS",
    "logoColor": "#F54E00",
    "logoText": "Mistral",
    "category": "Foundation Models",
    "rank": 11,
    "rankDelta": "0",
    "valuation": "$6.0B",
    "valuationNum": 6000,
    "funding": "$1.1B",
    "fundingNum": 1100,
    "growthRate": "+24.0%",
    "growthNum": 24,
    "marketSignal": "Strong",
    "marketSignalDetail": "European Champion • Open & Commercial Dual Track",
    "headquarters": "Paris, France",
    "foundedYear": 2023,
    "teamSize": "120+",
    "hiringVelocity": "High (+30 open roles)",
    "webVisits": "18M / mo",
    "website": "https://mistral.ai",
    "shortDescription": "European open-weight and commercial AI lab building frontier models with unmatched parameter efficiency.",
    "fullDescription": "Mistral AI produces state-of-the-art foundation models with high performance per parameter. Renowned for open-weights releases like Mistral 7B and Mixtral 8x22B, as well as commercial frontier APIs like Mistral Large 2.",
    "leadership": [
      {
        "name": "Arthur Mensch",
        "role": "CEO & Co-Founder"
      },
      {
        "name": "Guillaume Lample",
        "role": "Chief Scientist & Co-Founder"
      },
      {
        "name": "Timothée Lacroix",
        "role": "CTO & Co-Founder"
      }
    ],
    "latestRound": {
      "round": "Series B",
      "amount": "$640M (€600M)",
      "date": "June 2024",
      "source": "Financial Times"
    },
    "majorInvestors": [
      "General Catalyst",
      "Lightspeed Venture Partners",
      "Andreessen Horowitz",
      "Bpifrance",
      "NVIDIA"
    ],
    "signals": [
      {
        "type": "Product",
        "text": "Released Mistral Large 2 with 128k context and native code reasoning"
      },
      {
        "type": "Commercial",
        "text": "Integrated natively into Microsoft Azure AI & Snowflake"
      },
      {
        "type": "Open Source",
        "text": "Codestral and Devstral established strong developer mindshare"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "runway",
    "slug": "runway",
    "name": "Runway",
    "org": "Runway AI Inc.",
    "logoColor": "#14B8A6",
    "logoText": "Runway",
    "category": "Creative & Video AI",
    "rank": 12,
    "rankDelta": "-1",
    "valuation": "$4.0B",
    "valuationNum": 4000,
    "funding": "$240M",
    "fundingNum": 240,
    "growthRate": "+31.0%",
    "growthNum": 31,
    "marketSignal": "Watch",
    "marketSignalDetail": "Hollywood Standard • Leading Generative Cinema Lab",
    "headquarters": "New York, NY",
    "foundedYear": 2018,
    "teamSize": "140+",
    "hiringVelocity": "Moderate (+20 open roles)",
    "webVisits": "28M / mo",
    "website": "https://runwayml.com",
    "shortDescription": "Applied AI research company pioneering generative world models, video synthesis, and cinematic creative suites.",
    "fullDescription": "Runway builds tools for human imagination. Its Gen-3 Alpha Turbo model powers video production across major motion picture studios, advertising agencies, and independent creators, featuring camera trajectory control and physical simulation.",
    "leadership": [
      {
        "name": "Cristóbal Valenzuela",
        "role": "CEO & Co-Founder"
      },
      {
        "name": "Alejandro Matamala",
        "role": "Chief Design Officer & Co-Founder"
      },
      {
        "name": "Anastasis Germanidis",
        "role": "CTO & Co-Founder"
      }
    ],
    "latestRound": {
      "round": "Series C Extension",
      "amount": "$141M",
      "date": "June 2023",
      "source": "Company Announcement"
    },
    "majorInvestors": [
      "Google",
      "NVIDIA",
      "Salesforce Ventures",
      "Felicis",
      "Amplify Partners"
    ],
    "signals": [
      {
        "type": "Hollywood",
        "text": "Announced strategic production partnership with Lionsgate"
      },
      {
        "type": "Product",
        "text": "Gen-3 Alpha Turbo introduced sub-15-second high-fidelity video renders"
      },
      {
        "type": "Film Festival",
        "text": "Annual AI Film Festival drew over 3,000 international submissions"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "together-ai",
    "slug": "together-ai",
    "name": "Together AI",
    "org": "Together AI Inc.",
    "logoColor": "#3B82F6",
    "logoText": "Together",
    "category": "AI Infrastructure",
    "rank": 13,
    "rankDelta": "+3",
    "valuation": "$3.0B",
    "valuationNum": 3000,
    "funding": "$230M",
    "fundingNum": 230,
    "growthRate": "+45.8%",
    "growthNum": 45.8,
    "marketSignal": "Emerging",
    "marketSignalDetail": "Fastest Open Source Inference Engine • GPU Cloud",
    "headquarters": "San Francisco, CA",
    "foundedYear": 2022,
    "teamSize": "130+",
    "hiringVelocity": "High (+30 open roles)",
    "webVisits": "12M / mo",
    "website": "https://together.ai",
    "shortDescription": "Cloud platform for building, training, and running open source AI models at maximum inference speed.",
    "fullDescription": "Together AI delivers high-performance cloud compute for open-source AI. Their Together Inference Engine processes tokens at unprecedented throughput, serving as the foundational inference layer for thousands of modern AI applications.",
    "leadership": [
      {
        "name": "Vipul Ved Prakash",
        "role": "CEO & Co-Founder"
      },
      {
        "name": "Ce Zhang",
        "role": "CTO & Co-Founder"
      },
      {
        "name": "Percy Liang",
        "role": "Co-Founder (Stanford CRFM Director)"
      }
    ],
    "latestRound": {
      "round": "Series A Extension",
      "amount": "$106M",
      "date": "March 2024",
      "source": "Salesforce Ventures / PR"
    },
    "majorInvestors": [
      "Salesforce Ventures",
      "Coatue",
      "Lux Capital",
      "Emergence Capital",
      "KPCB"
    ],
    "signals": [
      {
        "type": "Speed",
        "text": "Inference engine clocked world record speeds on Llama 3 70B"
      },
      {
        "type": "Compute",
        "text": "Expanded GPU cluster deployment to tens of thousands of H100s"
      },
      {
        "type": "Funding",
        "text": "Valuation tripled to $3B within 12 months"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "notion-labs",
    "slug": "notion-labs",
    "name": "Notion Labs",
    "org": "Notion Labs Inc.",
    "logoColor": "#FFFFFF",
    "logoText": "Notion",
    "category": "Enterprise & Productivity",
    "rank": 14,
    "rankDelta": "0",
    "valuation": "$10B+",
    "valuationNum": 10000,
    "funding": "$340M",
    "fundingNum": 340,
    "growthRate": "+18.2%",
    "growthNum": 18.2,
    "marketSignal": "Strong",
    "marketSignalDetail": "Connected Workspace Intelligence Standard",
    "headquarters": "San Francisco, CA",
    "foundedYear": 2013,
    "teamSize": "800+",
    "hiringVelocity": "Moderate (+35 open roles)",
    "webVisits": "160M / mo",
    "website": "https://notion.so",
    "shortDescription": "Connected workspace for docs, wikis, and projects integrated with enterprise AI universal search.",
    "fullDescription": "Notion pioneered modern productivity documents. Its Notion AI engine unifies organizational memory, enabling knowledge workers to search across Slack, Google Drive, and internal Notion databases seamlessly in natural language.",
    "leadership": [
      {
        "name": "Ivan Zhao",
        "role": "CEO & Co-Founder"
      },
      {
        "name": "Simon Last",
        "role": "Co-Founder"
      },
      {
        "name": "Akshay Kothari",
        "role": "Co-Founder"
      }
    ],
    "latestRound": {
      "round": "Secondary Tender Offer",
      "amount": "Private",
      "date": "2024",
      "source": "Forbes"
    },
    "majorInvestors": [
      "Index Ventures",
      "Sequoia Capital",
      "Coatue",
      "First Round Capital"
    ],
    "signals": [
      {
        "type": "Product",
        "text": "Rolled out Notion AI Universal Search across external cloud drives"
      },
      {
        "type": "Adoption",
        "text": "Over 100 million registered users globally"
      },
      {
        "type": "Marketplace",
        "text": "Notion template economy surpassed $100M ecosystem volume"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "vercel",
    "slug": "vercel",
    "name": "Vercel (v0)",
    "org": "Vercel Inc.",
    "logoColor": "#FFFFFF",
    "logoText": "Vercel",
    "category": "AI Code & DevTools",
    "rank": 15,
    "rankDelta": "+2",
    "valuation": "$3.25B",
    "valuationNum": 3250,
    "funding": "$563M",
    "fundingNum": 563,
    "growthRate": "+26.5%",
    "growthNum": 26.5,
    "marketSignal": "Strong",
    "marketSignalDetail": "Frontend AI Standard • v0 Generative UI Explosion",
    "headquarters": "San Francisco, CA",
    "foundedYear": 2015,
    "teamSize": "600+",
    "hiringVelocity": "High (+45 open roles)",
    "webVisits": "38M / mo",
    "website": "https://vercel.com",
    "shortDescription": "Frontend cloud platform for Next.js and creators of v0, the generative developer for production React UI.",
    "fullDescription": "Vercel empowers teams to design, iterate, and deploy frontend applications without infrastructure friction. Its v0 tool generates full production-ready React components with Tailwind CSS in seconds, transforming web design workflows.",
    "leadership": [
      {
        "name": "Guillermo Rauch",
        "role": "CEO & Founder"
      },
      {
        "name": "Malte Ubl",
        "role": "CTO"
      }
    ],
    "latestRound": {
      "round": "Series E",
      "amount": "$250M",
      "date": "May 2024",
      "source": "Vercel Press Release"
    },
    "majorInvestors": [
      "Accel",
      "CRV",
      "GV (Google Ventures)",
      "Greenoaks",
      "Bedrock"
    ],
    "signals": [
      {
        "type": "Product",
        "text": "v0 crossed millions of active component generations per week"
      },
      {
        "type": "SDK",
        "text": "Vercel AI SDK became the standard framework for TypeScript AI apps"
      },
      {
        "type": "Scale",
        "text": "Powers web infrastructure for ChatGPT, Notion, and Scale AI"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "hugging-face",
    "slug": "hugging-face",
    "name": "Hugging Face",
    "org": "Hugging Face Inc.",
    "logoColor": "#EC4899",
    "logoText": "HUG",
    "category": "AI Infrastructure",
    "rank": 16,
    "rankDelta": "0",
    "valuation": "$4.5B",
    "valuationNum": 4500,
    "funding": "$395M",
    "fundingNum": 395,
    "growthRate": "+33.2%",
    "growthNum": 33.2,
    "marketSignal": "Strong",
    "marketSignalDetail": "Open Source Model Hub Standard",
    "headquarters": "New York, NY",
    "foundedYear": 2016,
    "teamSize": "250+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "35M / mo",
    "website": "https://huggingface.co",
    "shortDescription": "The open-source AI platform hosting over 1 million models, datasets, and Spaces.",
    "fullDescription": "Hugging Face is a high-growth AI enterprise operating in the AI Infrastructure sector. Recognized across industry benchmarks for open source model hub standard, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Clément Delangue",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$395M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Salesforce Ventures",
      "Google",
      "Amazon",
      "NVIDIA",
      "AMD"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Open Source Model Hub Standard with +33.2% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in New York, NY with 250+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "groq",
    "slug": "groq",
    "name": "Groq",
    "org": "Groq Inc.",
    "logoColor": "#14B8A6",
    "logoText": "GRO",
    "category": "AI Infrastructure",
    "rank": 17,
    "rankDelta": "0",
    "valuation": "$2.8B",
    "valuationNum": 2800,
    "funding": "$1.0B",
    "fundingNum": 1000,
    "growthRate": "+78.5%",
    "growthNum": 78.5,
    "marketSignal": "Strong",
    "marketSignalDetail": "LPU Inference Silicon Pioneer",
    "headquarters": "Mountain View, CA",
    "foundedYear": 2016,
    "teamSize": "300+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "18M / mo",
    "website": "https://groq.com",
    "shortDescription": "Pioneers of the Language Processing Unit (LPU) architecture for sub-second real-time LLM inference.",
    "fullDescription": "Groq is a high-growth AI enterprise operating in the AI Infrastructure sector. Recognized across industry benchmarks for lpu inference silicon pioneer, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Jonathan Ross",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$1.0B",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "BlackRock",
      "Neuberger Berman",
      "Type One Ventures",
      "Cisco"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "LPU Inference Silicon Pioneer with +78.5% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in Mountain View, CA with 300+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "cerebras-systems",
    "slug": "cerebras-systems",
    "name": "Cerebras Systems",
    "org": "Cerebras Systems Inc.",
    "logoColor": "#6E56CF",
    "logoText": "CER",
    "category": "AI Infrastructure",
    "rank": 18,
    "rankDelta": "0",
    "valuation": "$8.0B",
    "valuationNum": 8000,
    "funding": "$750M",
    "fundingNum": 750,
    "growthRate": "+42.0%",
    "growthNum": 42,
    "marketSignal": "Strong",
    "marketSignalDetail": "Wafer-Scale AI Engine • S-1 Filing",
    "headquarters": "Sunnyvale, CA",
    "foundedYear": 2015,
    "teamSize": "450+",
    "hiringVelocity": "High (+35 open roles)",
    "webVisits": "5M / mo",
    "website": "https://cerebras.ai",
    "shortDescription": "Builders of the Wafer Scale Engine (WSE-3), the world largest monolithic AI compute chip.",
    "fullDescription": "Cerebras Systems is a high-growth AI enterprise operating in the AI Infrastructure sector. Recognized across industry benchmarks for wafer-scale ai engine • s-1 filing, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Andrew Feldman",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$750M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Foundation Capital",
      "Benchmark",
      "Eclipse",
      "G42"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Wafer-Scale AI Engine • S-1 Filing with +42.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in Sunnyvale, CA with 450+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "xai",
    "slug": "xai",
    "name": "xAI",
    "org": "xAI Inc.",
    "logoColor": "#3B82F6",
    "logoText": "XAI",
    "category": "Foundation Models",
    "rank": 19,
    "rankDelta": "0",
    "valuation": "$50B",
    "valuationNum": 50000,
    "funding": "$12.0B",
    "fundingNum": 12000,
    "growthRate": "+110.0%",
    "growthNum": 110,
    "marketSignal": "Strong",
    "marketSignalDetail": "Colossus 100k H100 Cluster • Grok",
    "headquarters": "Memphis, TN & Burlingame, CA",
    "foundedYear": 2023,
    "teamSize": "150+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "65M / mo",
    "website": "https://x.ai",
    "shortDescription": "Frontier AI research company operating the 100k GPU Colossus cluster and training Grok 3.",
    "fullDescription": "xAI is a high-growth AI enterprise operating in the Foundation Models sector. Recognized across industry benchmarks for colossus 100k h100 cluster • grok, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Elon Musk",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$12.0B",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Valor Equity",
      "Vy Capital",
      "a16z",
      "Sequoia",
      "Fidelity"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Colossus 100k H100 Cluster • Grok with +110.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in Memphis, TN & Burlingame, CA with 150+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "figure-ai",
    "slug": "figure-ai",
    "name": "Figure AI",
    "org": "Figure AI Inc.",
    "logoColor": "#10A37F",
    "logoText": "FIG",
    "category": "AI Infrastructure",
    "rank": 20,
    "rankDelta": "+2",
    "valuation": "$2.6B",
    "valuationNum": 2600,
    "funding": "$754M",
    "fundingNum": 754,
    "growthRate": "+48.0%",
    "growthNum": 48,
    "marketSignal": "Strong",
    "marketSignalDetail": "Autonomous Humanoid Fleet Scale",
    "headquarters": "Sunnyvale, CA",
    "foundedYear": 2022,
    "teamSize": "150+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "3M / mo",
    "website": "https://figure.ai",
    "shortDescription": "Autonomous humanoid robotics company creating worker androids powered by speech-to-speech AI.",
    "fullDescription": "Figure AI is a high-growth AI enterprise operating in the AI Infrastructure sector. Recognized across industry benchmarks for autonomous humanoid fleet scale, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Brett Adcock",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$754M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "OpenAI Startup Fund",
      "Microsoft",
      "NVIDIA",
      "Jeff Bezos"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Autonomous Humanoid Fleet Scale with +48.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in Sunnyvale, CA with 150+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "coreweave",
    "slug": "coreweave",
    "name": "CoreWeave",
    "org": "CoreWeave Inc.",
    "logoColor": "#F59E0B",
    "logoText": "COR",
    "category": "AI Infrastructure",
    "rank": 21,
    "rankDelta": "-1",
    "valuation": "$23B",
    "valuationNum": 23000,
    "funding": "$12.0B",
    "fundingNum": 12000,
    "growthRate": "+135.0%",
    "growthNum": 135,
    "marketSignal": "Strong",
    "marketSignalDetail": "Premier Specialized AI Hyperscaler",
    "headquarters": "Roseland, NJ",
    "foundedYear": 2017,
    "teamSize": "800+",
    "hiringVelocity": "High (+35 open roles)",
    "webVisits": "10M / mo",
    "website": "https://coreweave.com",
    "shortDescription": "Specialized GPU cloud provider engineered for large-scale AI model training and low-latency inference.",
    "fullDescription": "CoreWeave is a high-growth AI enterprise operating in the AI Infrastructure sector. Recognized across industry benchmarks for premier specialized ai hyperscaler, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Michael Intrator",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$12.0B",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Magnetar Capital",
      "Blackstone",
      "Coatue",
      "NVIDIA",
      "Fidelity"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Premier Specialized AI Hyperscaler with +135.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in Roseland, NJ with 800+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "lambda-labs",
    "slug": "lambda-labs",
    "name": "Lambda Labs",
    "org": "Lambda Labs Inc.",
    "logoColor": "#EC4899",
    "logoText": "LAM",
    "category": "AI Infrastructure",
    "rank": 22,
    "rankDelta": "+3",
    "valuation": "$1.5B",
    "valuationNum": 1500,
    "funding": "$800M",
    "fundingNum": 800,
    "growthRate": "+56.0%",
    "growthNum": 56,
    "marketSignal": "Emerging",
    "marketSignalDetail": "Developer GPU Cloud Standard",
    "headquarters": "San Jose, CA",
    "foundedYear": 2012,
    "teamSize": "300+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "6M / mo",
    "website": "https://lambdalabs.com",
    "shortDescription": "AI compute cloud and workstation hardware builder powering deep learning researchers worldwide.",
    "fullDescription": "Lambda Labs is a high-growth AI enterprise operating in the AI Infrastructure sector. Recognized across industry benchmarks for developer gpu cloud standard, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Stephen Balaban",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$800M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "US Innovative Technology Fund",
      "Braidwell",
      "Premji Invest"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Developer GPU Cloud Standard with +56.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in San Jose, CA with 300+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "stability-ai",
    "slug": "stability-ai",
    "name": "Stability AI",
    "org": "Stability AI Inc.",
    "logoColor": "#14B8A6",
    "logoText": "STA",
    "category": "Creative & Video AI",
    "rank": 23,
    "rankDelta": "0",
    "valuation": "$1.0B",
    "valuationNum": 1000,
    "funding": "$230M",
    "fundingNum": 230,
    "growthRate": "+15.0%",
    "growthNum": 15,
    "marketSignal": "Watch",
    "marketSignalDetail": "Stable Diffusion Foundation Lab",
    "headquarters": "London, UK",
    "foundedYear": 2019,
    "teamSize": "180+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "22M / mo",
    "website": "https://stability.ai",
    "shortDescription": "Open research lab creating Stable Diffusion, Stable Audio, and generative media models.",
    "fullDescription": "Stability AI is a high-growth AI enterprise operating in the Creative & Video AI sector. Recognized across industry benchmarks for stable diffusion foundation lab, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Prem Akkaraju",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$230M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Lightspeed Venture Partners",
      "Coatue",
      "Greycroft",
      "Osho"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Stable Diffusion Foundation Lab with +15.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in London, UK with 180+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "glean",
    "slug": "glean",
    "name": "Glean",
    "org": "Glean Inc.",
    "logoColor": "#6E56CF",
    "logoText": "GLE",
    "category": "Enterprise & Productivity",
    "rank": 24,
    "rankDelta": "0",
    "valuation": "$4.6B",
    "valuationNum": 4600,
    "funding": "$610M",
    "fundingNum": 610,
    "growthRate": "+64.0%",
    "growthNum": 64,
    "marketSignal": "Strong",
    "marketSignalDetail": "Enterprise Work Assistant & Knowledge Search",
    "headquarters": "Palo Alto, CA",
    "foundedYear": 2019,
    "teamSize": "500+",
    "hiringVelocity": "High (+35 open roles)",
    "webVisits": "7M / mo",
    "website": "https://glean.com",
    "shortDescription": "Work AI platform connecting enterprise search and generative knowledge agents across company databases.",
    "fullDescription": "Glean is a high-growth AI enterprise operating in the Enterprise & Productivity sector. Recognized across industry benchmarks for enterprise work assistant & knowledge search, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Arvind Jain",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$610M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Sequoia Capital",
      "General Catalyst",
      "Kleiner Perkins",
      "Lightspeed"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Enterprise Work Assistant & Knowledge Search with +64.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in Palo Alto, CA with 500+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "writer",
    "slug": "writer",
    "name": "Writer",
    "org": "Writer Inc.",
    "logoColor": "#3B82F6",
    "logoText": "WRI",
    "category": "Enterprise & Productivity",
    "rank": 25,
    "rankDelta": "+2",
    "valuation": "$1.9B",
    "valuationNum": 1900,
    "funding": "$326M",
    "fundingNum": 326,
    "growthRate": "+45.0%",
    "growthNum": 45,
    "marketSignal": "Strong",
    "marketSignalDetail": "Palmyra Enterprise Model Suite",
    "headquarters": "San Francisco, CA",
    "foundedYear": 2020,
    "teamSize": "250+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "5M / mo",
    "website": "https://writer.com",
    "shortDescription": "Full-stack generative AI platform for enterprise workflow automation and proprietary Palmyra models.",
    "fullDescription": "Writer is a high-growth AI enterprise operating in the Enterprise & Productivity sector. Recognized across industry benchmarks for palmyra enterprise model suite, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "May Habib",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$326M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "ICONIQ Growth",
      "Premji Invest",
      "Insight Partners",
      "Balderton"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Palmyra Enterprise Model Suite with +45.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in San Francisco, CA with 250+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "harvey-ai",
    "slug": "harvey-ai",
    "name": "Harvey AI",
    "org": "Harvey AI Inc.",
    "logoColor": "#10A37F",
    "logoText": "HAR",
    "category": "Enterprise & Productivity",
    "rank": 26,
    "rankDelta": "0",
    "valuation": "$1.5B",
    "valuationNum": 1500,
    "funding": "$206M",
    "fundingNum": 206,
    "growthRate": "+85.0%",
    "growthNum": 85,
    "marketSignal": "Strong",
    "marketSignalDetail": "Legal AI Standard for Global Law Firms",
    "headquarters": "San Francisco, CA",
    "foundedYear": 2022,
    "teamSize": "120+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "4M / mo",
    "website": "https://harvey.ai",
    "shortDescription": "Professional generative AI platform for legal contract analysis, litigation research, and M&A diligence.",
    "fullDescription": "Harvey AI is a high-growth AI enterprise operating in the Enterprise & Productivity sector. Recognized across industry benchmarks for legal ai standard for global law firms, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Gabriel Pereyra",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$206M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Kleiner Perkins",
      "Sequoia Capital",
      "OpenAI Startup Fund",
      "EQT"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Legal AI Standard for Global Law Firms with +85.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in San Francisco, CA with 120+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "suno-ai",
    "slug": "suno-ai",
    "name": "Suno AI",
    "org": "Suno AI Inc.",
    "logoColor": "#F59E0B",
    "logoText": "SUN",
    "category": "Voice & Multimodal",
    "rank": 27,
    "rankDelta": "0",
    "valuation": "$500M",
    "valuationNum": 500,
    "funding": "$125M",
    "fundingNum": 125,
    "growthRate": "+95.0%",
    "growthNum": 95,
    "marketSignal": "Strong",
    "marketSignalDetail": "Full-Song Audio Synthesis Explosion",
    "headquarters": "Cambridge, MA",
    "foundedYear": 2023,
    "teamSize": "40+",
    "hiringVelocity": "High (+35 open roles)",
    "webVisits": "32M / mo",
    "website": "https://suno.com",
    "shortDescription": "Generative AI music engine turning text ideas and lyrics into studio-quality vocal tracks and instrumentals.",
    "fullDescription": "Suno AI is a high-growth AI enterprise operating in the Voice & Multimodal sector. Recognized across industry benchmarks for full-song audio synthesis explosion, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Mikey Shulman",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$125M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Founder Collective",
      "Lightspeed",
      "Matrix Partners"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Full-Song Audio Synthesis Explosion with +95.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in Cambridge, MA with 40+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "udio",
    "slug": "udio",
    "name": "Udio",
    "org": "Udio Inc.",
    "logoColor": "#EC4899",
    "logoText": "UDI",
    "category": "Voice & Multimodal",
    "rank": 28,
    "rankDelta": "-1",
    "valuation": "$300M",
    "valuationNum": 300,
    "funding": "$10M",
    "fundingNum": 10,
    "growthRate": "+72.0%",
    "growthNum": 72,
    "marketSignal": "Emerging",
    "marketSignalDetail": "Fidelity Music Synthesis Pioneer",
    "headquarters": "New York, NY",
    "foundedYear": 2023,
    "teamSize": "30+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "15M / mo",
    "website": "https://udio.com",
    "shortDescription": "High-fidelity AI music generation platform created by former Google DeepMind researchers.",
    "fullDescription": "Udio is a high-growth AI enterprise operating in the Voice & Multimodal sector. Recognized across industry benchmarks for fidelity music synthesis pioneer, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "David Ding",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$10M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Andreessen Horowitz",
      "will.i.am",
      "Mike Krieger"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Fidelity Music Synthesis Pioneer with +72.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in New York, NY with 30+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "luma-ai",
    "slug": "luma-ai",
    "name": "Luma AI",
    "org": "Luma AI Inc.",
    "logoColor": "#14B8A6",
    "logoText": "LUM",
    "category": "Creative & Video AI",
    "rank": 29,
    "rankDelta": "0",
    "valuation": "$1.2B",
    "valuationNum": 1200,
    "funding": "$140M",
    "fundingNum": 140,
    "growthRate": "+88.0%",
    "growthNum": 88,
    "marketSignal": "Strong",
    "marketSignalDetail": "Dream Machine Generative Video Engine",
    "headquarters": "San Francisco, CA",
    "foundedYear": 2021,
    "teamSize": "60+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "18M / mo",
    "website": "https://lumalabs.ai",
    "shortDescription": "Creators of Dream Machine, generating realistic 3D scenes, camera trajectories, and video clips.",
    "fullDescription": "Luma AI is a high-growth AI enterprise operating in the Creative & Video AI sector. Recognized across industry benchmarks for dream machine generative video engine, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Amit Jain",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$140M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Andreessen Horowitz",
      "Matrix Partners",
      "Amplify"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Dream Machine Generative Video Engine with +88.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in San Francisco, CA with 60+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "pika-labs",
    "slug": "pika-labs",
    "name": "Pika Labs",
    "org": "Pika Labs Inc.",
    "logoColor": "#6E56CF",
    "logoText": "PIK",
    "category": "Creative & Video AI",
    "rank": 30,
    "rankDelta": "+2",
    "valuation": "$470M",
    "valuationNum": 470,
    "funding": "$135M",
    "fundingNum": 135,
    "growthRate": "+52.0%",
    "growthNum": 52,
    "marketSignal": "Emerging",
    "marketSignalDetail": "Pika 2.0 Real-time Video FX",
    "headquarters": "Palo Alto, CA",
    "foundedYear": 2023,
    "teamSize": "35+",
    "hiringVelocity": "High (+35 open roles)",
    "webVisits": "12M / mo",
    "website": "https://pika.art",
    "shortDescription": "Idea-to-video platform enabling interactive video generation with physics-based dynamic effects.",
    "fullDescription": "Pika Labs is a high-growth AI enterprise operating in the Creative & Video AI sector. Recognized across industry benchmarks for pika 2.0 real-time video fx, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Demi Guo",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$135M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Lightspeed Venture Partners",
      "Homebrew",
      "Conviction"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Pika 2.0 Real-time Video FX with +52.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in Palo Alto, CA with 35+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "cognition-devin-",
    "slug": "cognition-devin-",
    "name": "Cognition (Devin)",
    "org": "Cognition (Devin) Inc.",
    "logoColor": "#3B82F6",
    "logoText": "COG",
    "category": "AI Code & DevTools",
    "rank": 31,
    "rankDelta": "0",
    "valuation": "$2.0B",
    "valuationNum": 2000,
    "funding": "$175M",
    "fundingNum": 175,
    "growthRate": "+98.0%",
    "growthNum": 98,
    "marketSignal": "Strong",
    "marketSignalDetail": "World First Autonomous Software Engineer",
    "headquarters": "New York, NY",
    "foundedYear": 2023,
    "teamSize": "30+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "8M / mo",
    "website": "https://cognition.ai",
    "shortDescription": "Applied AI lab building Devin, an autonomous software engineer that plans, writes, debugs, and deploys code.",
    "fullDescription": "Cognition (Devin) is a high-growth AI enterprise operating in the AI Code & DevTools sector. Recognized across industry benchmarks for world first autonomous software engineer, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Scott Wu",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$175M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Founders Fund",
      "Elad Gil",
      "Patrick Collison"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "World First Autonomous Software Engineer with +98.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in New York, NY with 30+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "poolside",
    "slug": "poolside",
    "name": "Poolside",
    "org": "Poolside Inc.",
    "logoColor": "#10A37F",
    "logoText": "POO",
    "category": "AI Code & DevTools",
    "rank": 32,
    "rankDelta": "0",
    "valuation": "$3.0B",
    "valuationNum": 3000,
    "funding": "$626M",
    "fundingNum": 626,
    "growthRate": "+115.0%",
    "growthNum": 115,
    "marketSignal": "Strong",
    "marketSignalDetail": "Software-Writing Foundation Model Lab",
    "headquarters": "Paris, France",
    "foundedYear": 2023,
    "teamSize": "50+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "2M / mo",
    "website": "https://poolside.ai",
    "shortDescription": "Building foundation models designed exclusively for software creation and artificial general intelligence for coding.",
    "fullDescription": "Poolside is a high-growth AI enterprise operating in the AI Code & DevTools sector. Recognized across industry benchmarks for software-writing foundation model lab, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Jason Warner",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$626M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Bain Capital Ventures",
      "DST Global",
      "StepStone"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Software-Writing Foundation Model Lab with +115.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in Paris, France with 50+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "magic-ai",
    "slug": "magic-ai",
    "name": "Magic AI",
    "org": "Magic AI Inc.",
    "logoColor": "#F59E0B",
    "logoText": "MAG",
    "category": "AI Code & DevTools",
    "rank": 33,
    "rankDelta": "+3",
    "valuation": "$1.5B",
    "valuationNum": 1500,
    "funding": "$465M",
    "fundingNum": 465,
    "growthRate": "+80.0%",
    "growthNum": 80,
    "marketSignal": "Strong",
    "marketSignalDetail": "Ultra-Long 100M Token Context Architecture",
    "headquarters": "San Francisco, CA",
    "foundedYear": 2022,
    "teamSize": "45+",
    "hiringVelocity": "High (+35 open roles)",
    "webVisits": "1.5M / mo",
    "website": "https://magic.dev",
    "shortDescription": "AI research lab developing ultra-long context models (LTM-2-mini) for automated software development.",
    "fullDescription": "Magic AI is a high-growth AI enterprise operating in the AI Code & DevTools sector. Recognized across industry benchmarks for ultra-long 100m token context architecture, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Eric Steinberger",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$465M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "NVIDIA",
      "Jane Street",
      "Nat Friedman",
      "Daniel Gross"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Ultra-Long 100M Token Context Architecture with +80.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in San Francisco, CA with 45+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "adept-ai",
    "slug": "adept-ai",
    "name": "Adept AI",
    "org": "Adept AI Inc.",
    "logoColor": "#EC4899",
    "logoText": "ADE",
    "category": "AI Code & DevTools",
    "rank": 34,
    "rankDelta": "0",
    "valuation": "$1.0B",
    "valuationNum": 1000,
    "funding": "$415M",
    "fundingNum": 415,
    "growthRate": "+10.0%",
    "growthNum": 10,
    "marketSignal": "Watch",
    "marketSignalDetail": "Action Transformers • Amazon Licensing",
    "headquarters": "San Francisco, CA",
    "foundedYear": 2022,
    "teamSize": "80+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "1M / mo",
    "website": "https://adept.ai",
    "shortDescription": "Research lab pioneering Action Transformers (ACT-1) that interact with desktop software and browsers.",
    "fullDescription": "Adept AI is a high-growth AI enterprise operating in the AI Code & DevTools sector. Recognized across industry benchmarks for action transformers • amazon licensing, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "David Luan",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$415M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "General Catalyst",
      "Greylock",
      "Addition",
      "Amazon"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Action Transformers • Amazon Licensing with +10.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in San Francisco, CA with 80+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "hebbia",
    "slug": "hebbia",
    "name": "Hebbia",
    "org": "Hebbia Inc.",
    "logoColor": "#14B8A6",
    "logoText": "HEB",
    "category": "Enterprise & Productivity",
    "rank": 35,
    "rankDelta": "+2",
    "valuation": "$700M",
    "valuationNum": 700,
    "funding": "$160M",
    "fundingNum": 160,
    "growthRate": "+75.0%",
    "growthNum": 75,
    "marketSignal": "Strong",
    "marketSignalDetail": "Matrix AI for Private Equity & Finance",
    "headquarters": "New York, NY",
    "foundedYear": 2020,
    "teamSize": "65+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "2M / mo",
    "website": "https://hebbia.ai",
    "shortDescription": "AI platform enabling financial analysts and asset managers to query unstructured documents through Matrix.",
    "fullDescription": "Hebbia is a high-growth AI enterprise operating in the Enterprise & Productivity sector. Recognized across industry benchmarks for matrix ai for private equity & finance, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "George Sivulka",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$160M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Andreessen Horowitz",
      "Index Ventures",
      "Peter Thiel"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Matrix AI for Private Equity & Finance with +75.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in New York, NY with 65+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "sierra",
    "slug": "sierra",
    "name": "Sierra",
    "org": "Sierra Inc.",
    "logoColor": "#6E56CF",
    "logoText": "SIE",
    "category": "Enterprise & Productivity",
    "rank": 36,
    "rankDelta": "0",
    "valuation": "$4.5B",
    "valuationNum": 4500,
    "funding": "$285M",
    "fundingNum": 285,
    "growthRate": "+90.0%",
    "growthNum": 90,
    "marketSignal": "Strong",
    "marketSignalDetail": "Enterprise Conversational Agents",
    "headquarters": "San Francisco, CA",
    "foundedYear": 2023,
    "teamSize": "90+",
    "hiringVelocity": "High (+35 open roles)",
    "webVisits": "3M / mo",
    "website": "https://sierra.ai",
    "shortDescription": "Enterprise conversational AI platform founded by former Salesforce Co-CEO Bret Taylor and Clay Bavor.",
    "fullDescription": "Sierra is a high-growth AI enterprise operating in the Enterprise & Productivity sector. Recognized across industry benchmarks for enterprise conversational agents, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Bret Taylor",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$285M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Greenoaks Capital",
      "Iconiq",
      "Sequoia Capital"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Enterprise Conversational Agents with +90.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in San Francisco, CA with 90+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "decagon",
    "slug": "decagon",
    "name": "Decagon",
    "org": "Decagon Inc.",
    "logoColor": "#3B82F6",
    "logoText": "DEC",
    "category": "Enterprise & Productivity",
    "rank": 37,
    "rankDelta": "0",
    "valuation": "$650M",
    "valuationNum": 650,
    "funding": "$100M",
    "fundingNum": 100,
    "growthRate": "+82.0%",
    "growthNum": 82,
    "marketSignal": "Emerging",
    "marketSignalDetail": "AI Customer Experience Agents",
    "headquarters": "San Francisco, CA",
    "foundedYear": 2023,
    "teamSize": "60+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "2M / mo",
    "website": "https://decagon.ai",
    "shortDescription": "Autonomous customer experience platform providing human-level multi-modal support agents for enterprises.",
    "fullDescription": "Decagon is a high-growth AI enterprise operating in the Enterprise & Productivity sector. Recognized across industry benchmarks for ai customer experience agents, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Jesse Zhang",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$100M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Bain Capital Ventures",
      "Accel",
      "Elad Gil"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "AI Customer Experience Agents with +82.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in San Francisco, CA with 60+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "braintrust",
    "slug": "braintrust",
    "name": "Braintrust",
    "org": "Braintrust Inc.",
    "logoColor": "#10A37F",
    "logoText": "BRA",
    "category": "AI Infrastructure",
    "rank": 38,
    "rankDelta": "0",
    "valuation": "$400M",
    "valuationNum": 400,
    "funding": "$43M",
    "fundingNum": 43,
    "growthRate": "+65.0%",
    "growthNum": 65,
    "marketSignal": "Emerging",
    "marketSignalDetail": "Enterprise AI Evaluation & Observability",
    "headquarters": "San Francisco, CA",
    "foundedYear": 2023,
    "teamSize": "40+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "1.8M / mo",
    "website": "https://braintrust.dev",
    "shortDescription": "Enterprise evaluations, tracing, and prompt playground platform for mission-critical generative AI apps.",
    "fullDescription": "Braintrust is a high-growth AI enterprise operating in the AI Infrastructure sector. Recognized across industry benchmarks for enterprise ai evaluation & observability, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Ankur Goyal",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$43M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Andreessen Horowitz",
      "Elad Gil",
      "Greylock"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Enterprise AI Evaluation & Observability with +65.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in San Francisco, CA with 40+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "langchain",
    "slug": "langchain",
    "name": "LangChain",
    "org": "LangChain Inc.",
    "logoColor": "#F59E0B",
    "logoText": "LAN",
    "category": "AI Infrastructure",
    "rank": 39,
    "rankDelta": "0",
    "valuation": "$500M",
    "valuationNum": 500,
    "funding": "$35M",
    "fundingNum": 35,
    "growthRate": "+40.0%",
    "growthNum": 40,
    "marketSignal": "Strong",
    "marketSignalDetail": "Agent Orchestration Framework Standard",
    "headquarters": "San Francisco, CA",
    "foundedYear": 2022,
    "teamSize": "50+",
    "hiringVelocity": "High (+35 open roles)",
    "webVisits": "12M / mo",
    "website": "https://langchain.com",
    "shortDescription": "Open framework and LangSmith platform for building context-aware reasoning applications and agents.",
    "fullDescription": "LangChain is a high-growth AI enterprise operating in the AI Infrastructure sector. Recognized across industry benchmarks for agent orchestration framework standard, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Harrison Chase",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$35M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Sequoia Capital",
      "Benchmark",
      "Amplify Partners"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Agent Orchestration Framework Standard with +40.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in San Francisco, CA with 50+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "weights-biases",
    "slug": "weights-biases",
    "name": "Weights & Biases",
    "org": "Weights & Biases Inc.",
    "logoColor": "#EC4899",
    "logoText": "WEI",
    "category": "AI Infrastructure",
    "rank": 40,
    "rankDelta": "+2",
    "valuation": "$1.25B",
    "valuationNum": 1250,
    "funding": "$250M",
    "fundingNum": 250,
    "growthRate": "+28.0%",
    "growthNum": 28,
    "marketSignal": "Strong",
    "marketSignalDetail": "MLOps & LLM Fine-Tuning Tracking",
    "headquarters": "San Francisco, CA",
    "foundedYear": 2017,
    "teamSize": "300+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "4M / mo",
    "website": "https://wandb.ai",
    "shortDescription": "The AI developer platform for model training tracking, dataset versioning, and LLM evaluation.",
    "fullDescription": "Weights & Biases is a high-growth AI enterprise operating in the AI Infrastructure sector. Recognized across industry benchmarks for mlops & llm fine-tuning tracking, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Lukas Biewald",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$250M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Coatue",
      "Insight Partners",
      "Felicis",
      "Bloomberg Beta"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "MLOps & LLM Fine-Tuning Tracking with +28.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in San Francisco, CA with 300+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "pinecone",
    "slug": "pinecone",
    "name": "Pinecone",
    "org": "Pinecone Inc.",
    "logoColor": "#14B8A6",
    "logoText": "PIN",
    "category": "AI Infrastructure",
    "rank": 41,
    "rankDelta": "0",
    "valuation": "$750M",
    "valuationNum": 750,
    "funding": "$138M",
    "fundingNum": 138,
    "growthRate": "+32.0%",
    "growthNum": 32,
    "marketSignal": "Strong",
    "marketSignalDetail": "Serverless Vector Database Standard",
    "headquarters": "New York, NY",
    "foundedYear": 2019,
    "teamSize": "160+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "5M / mo",
    "website": "https://pinecone.io",
    "shortDescription": "Managed serverless vector database providing low-latency similarity search for semantic RAG applications.",
    "fullDescription": "Pinecone is a high-growth AI enterprise operating in the AI Infrastructure sector. Recognized across industry benchmarks for serverless vector database standard, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Edo Liberty",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$138M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Andreessen Horowitz",
      "Menlo Ventures",
      "Tiger Global"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Serverless Vector Database Standard with +32.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in New York, NY with 160+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "weaviate",
    "slug": "weaviate",
    "name": "Weaviate",
    "org": "Weaviate Inc.",
    "logoColor": "#6E56CF",
    "logoText": "WEA",
    "category": "AI Infrastructure",
    "rank": 42,
    "rankDelta": "-1",
    "valuation": "$400M",
    "valuationNum": 400,
    "funding": "$67M",
    "fundingNum": 67,
    "growthRate": "+38.0%",
    "growthNum": 38,
    "marketSignal": "Emerging",
    "marketSignalDetail": "Open Source Hybrid Vector Search",
    "headquarters": "Amsterdam & San Francisco",
    "foundedYear": 2019,
    "teamSize": "90+",
    "hiringVelocity": "High (+35 open roles)",
    "webVisits": "3M / mo",
    "website": "https://weaviate.io",
    "shortDescription": "Open-source AI-native vector database with hybrid keyword and vector semantic search.",
    "fullDescription": "Weaviate is a high-growth AI enterprise operating in the AI Infrastructure sector. Recognized across industry benchmarks for open source hybrid vector search, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Bob van Luijt",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$67M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Index Ventures",
      "Battery Ventures",
      "Cortical Ventures"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Open Source Hybrid Vector Search with +38.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in Amsterdam & San Francisco with 90+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "qdrant",
    "slug": "qdrant",
    "name": "Qdrant",
    "org": "Qdrant Inc.",
    "logoColor": "#3B82F6",
    "logoText": "QDR",
    "category": "AI Infrastructure",
    "rank": 43,
    "rankDelta": "0",
    "valuation": "$250M",
    "valuationNum": 250,
    "funding": "$38M",
    "fundingNum": 38,
    "growthRate": "+55.0%",
    "growthNum": 55,
    "marketSignal": "Emerging",
    "marketSignalDetail": "Rust-Engineered Vector Search Engine",
    "headquarters": "Berlin, Germany",
    "foundedYear": 2021,
    "teamSize": "60+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "2.5M / mo",
    "website": "https://qdrant.tech",
    "shortDescription": "High-performance vector database and similarity search engine written in Rust for production AI apps.",
    "fullDescription": "Qdrant is a high-growth AI enterprise operating in the AI Infrastructure sector. Recognized across industry benchmarks for rust-engineered vector search engine, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Andre Zayarni",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$38M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Spark Capital",
      "Unusual Ventures",
      "42CAP"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Rust-Engineered Vector Search Engine with +55.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in Berlin, Germany with 60+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "chroma",
    "slug": "chroma",
    "name": "Chroma",
    "org": "Chroma Inc.",
    "logoColor": "#10A37F",
    "logoText": "CHR",
    "category": "AI Infrastructure",
    "rank": 44,
    "rankDelta": "+3",
    "valuation": "$200M",
    "valuationNum": 200,
    "funding": "$20M",
    "fundingNum": 20,
    "growthRate": "+60.0%",
    "growthNum": 60,
    "marketSignal": "Emerging",
    "marketSignalDetail": "AI-Native Open Embedding Database",
    "headquarters": "San Francisco, CA",
    "foundedYear": 2022,
    "teamSize": "30+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "3.5M / mo",
    "website": "https://trychroma.com",
    "shortDescription": "Open-source embedding database making it simple to build LLM apps with memory and document retrieval.",
    "fullDescription": "Chroma is a high-growth AI enterprise operating in the AI Infrastructure sector. Recognized across industry benchmarks for ai-native open embedding database, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Jeff Huber",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$20M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Quiet Capital",
      "Astasia",
      "Y Combinator"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "AI-Native Open Embedding Database with +60.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in San Francisco, CA with 30+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "modal-labs",
    "slug": "modal-labs",
    "name": "Modal Labs",
    "org": "Modal Labs Inc.",
    "logoColor": "#F59E0B",
    "logoText": "MOD",
    "category": "AI Infrastructure",
    "rank": 45,
    "rankDelta": "+2",
    "valuation": "$350M",
    "valuationNum": 350,
    "funding": "$41M",
    "fundingNum": 41,
    "growthRate": "+85.0%",
    "growthNum": 85,
    "marketSignal": "Strong",
    "marketSignalDetail": "Serverless Cloud for AI & GPU Workloads",
    "headquarters": "New York, NY",
    "foundedYear": 2021,
    "teamSize": "35+",
    "hiringVelocity": "High (+35 open roles)",
    "webVisits": "4M / mo",
    "website": "https://modal.com",
    "shortDescription": "Serverless cloud platform allowing Python developers to run GPU compute, web endpoints, and batch ML jobs.",
    "fullDescription": "Modal Labs is a high-growth AI enterprise operating in the AI Infrastructure sector. Recognized across industry benchmarks for serverless cloud for ai & gpu workloads, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Erik Bernhardsson",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$41M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Redpoint Ventures",
      "Amplify Partners",
      "Lux Capital"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Serverless Cloud for AI & GPU Workloads with +85.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in New York, NY with 35+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "boston-dynamics",
    "slug": "boston-dynamics",
    "name": "Boston Dynamics",
    "org": "Boston Dynamics Inc.",
    "logoColor": "#EC4899",
    "logoText": "BOS",
    "category": "AI Infrastructure",
    "rank": 46,
    "rankDelta": "0",
    "valuation": "$1.1B",
    "valuationNum": 1100,
    "funding": "$1.2B",
    "fundingNum": 1200,
    "growthRate": "+18.0%",
    "growthNum": 18,
    "marketSignal": "Strong",
    "marketSignalDetail": "Atlas Electric Humanoid Pioneer",
    "headquarters": "Waltham, MA",
    "foundedYear": 1992,
    "teamSize": "600+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "4M / mo",
    "website": "https://bostondynamics.com",
    "shortDescription": "Global pioneer in mobile robotics developing the all-electric Atlas humanoid and Spot quadruped robot.",
    "fullDescription": "Boston Dynamics is a high-growth AI enterprise operating in the AI Infrastructure sector. Recognized across industry benchmarks for atlas electric humanoid pioneer, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Marc Raibert",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$1.2B",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Hyundai Motor Group",
      "SoftBank"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Atlas Electric Humanoid Pioneer with +18.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in Waltham, MA with 600+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "physical-intelligence-pi-",
    "slug": "physical-intelligence-pi-",
    "name": "Physical Intelligence (Pi)",
    "org": "Physical Intelligence (Pi) Inc.",
    "logoColor": "#14B8A6",
    "logoText": "PHY",
    "category": "Foundation Models",
    "rank": 47,
    "rankDelta": "0",
    "valuation": "$2.4B",
    "valuationNum": 2400,
    "funding": "$470M",
    "fundingNum": 470,
    "growthRate": "+120.0%",
    "growthNum": 120,
    "marketSignal": "Strong",
    "marketSignalDetail": "General Physical Foundation Models (π0)",
    "headquarters": "San Francisco, CA",
    "foundedYear": 2024,
    "teamSize": "40+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "1M / mo",
    "website": "https://physicalintelligence.company",
    "shortDescription": "Research lab creating general-purpose foundation models that bring intelligence to physical robotics.",
    "fullDescription": "Physical Intelligence (Pi) is a high-growth AI enterprise operating in the Foundation Models sector. Recognized across industry benchmarks for general physical foundation models (π0), serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Karol Hausman",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$470M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Jeff Bezos",
      "Thrive Capital",
      "Lux Capital",
      "OpenAI"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "General Physical Foundation Models (π0) with +120.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in San Francisco, CA with 40+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "1x-technologies",
    "slug": "1x-technologies",
    "name": "1X Technologies",
    "org": "1X Technologies Inc.",
    "logoColor": "#6E56CF",
    "logoText": "1X ",
    "category": "AI Infrastructure",
    "rank": 48,
    "rankDelta": "0",
    "valuation": "$400M",
    "valuationNum": 400,
    "funding": "$135M",
    "fundingNum": 135,
    "growthRate": "+45.0%",
    "growthNum": 45,
    "marketSignal": "Emerging",
    "marketSignalDetail": "Biomimetic Bipedal Domestic Androids",
    "headquarters": "Moss, Norway & Sunnyvale, CA",
    "foundedYear": 2014,
    "teamSize": "110+",
    "hiringVelocity": "High (+35 open roles)",
    "webVisits": "2M / mo",
    "website": "https://1x.tech",
    "shortDescription": "Designing biomimetic humanoid robots with soft actuation for human collaboration in homes and clinics.",
    "fullDescription": "1X Technologies is a high-growth AI enterprise operating in the AI Infrastructure sector. Recognized across industry benchmarks for biomimetic bipedal domestic androids, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Bernt Børnich",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$135M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "OpenAI Startup Fund",
      "Tiger Global",
      "EQT Ventures"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Biomimetic Bipedal Domestic Androids with +45.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in Moss, Norway & Sunnyvale, CA with 110+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "unitree-robotics",
    "slug": "unitree-robotics",
    "name": "Unitree Robotics",
    "org": "Unitree Robotics Inc.",
    "logoColor": "#3B82F6",
    "logoText": "UNI",
    "category": "AI Infrastructure",
    "rank": 49,
    "rankDelta": "-1",
    "valuation": "$1.2B",
    "valuationNum": 1200,
    "funding": "$140M",
    "fundingNum": 140,
    "growthRate": "+62.0%",
    "growthNum": 62,
    "marketSignal": "Strong",
    "marketSignalDetail": "High Volume Humanoid & Quadruped Hardware",
    "headquarters": "Hangzhou, China",
    "foundedYear": 2016,
    "teamSize": "450+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "4.5M / mo",
    "website": "https://unitree.com",
    "shortDescription": "High-volume manufacturer of quadruped robots and bipedal humanoid platforms with high torque density.",
    "fullDescription": "Unitree Robotics is a high-growth AI enterprise operating in the AI Infrastructure sector. Recognized across industry benchmarks for high volume humanoid & quadruped hardware, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Xingxing Wang",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$140M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Sequoia China",
      "Matrix Partners",
      "Source Code"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "High Volume Humanoid & Quadruped Hardware with +62.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in Hangzhou, China with 450+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "agility-robotics",
    "slug": "agility-robotics",
    "name": "Agility Robotics",
    "org": "Agility Robotics Inc.",
    "logoColor": "#10A37F",
    "logoText": "AGI",
    "category": "AI Infrastructure",
    "rank": 50,
    "rankDelta": "+2",
    "valuation": "$1.0B",
    "valuationNum": 1000,
    "funding": "$180M",
    "fundingNum": 180,
    "growthRate": "+34.0%",
    "growthNum": 34,
    "marketSignal": "Strong",
    "marketSignalDetail": "Digit Logistics Humanoid Fleets",
    "headquarters": "Tangv, OR",
    "foundedYear": 2015,
    "teamSize": "250+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "1.2M / mo",
    "website": "https://agilityrobotics.com",
    "shortDescription": "Creators of Digit, a commercial bipedal humanoid deployed in logistics warehouses alongside workforce.",
    "fullDescription": "Agility Robotics is a high-growth AI enterprise operating in the AI Infrastructure sector. Recognized across industry benchmarks for digit logistics humanoid fleets, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Damion Shelton",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$180M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Amazon Industrial Fund",
      "DCVC",
      "Playground Global"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Digit Logistics Humanoid Fleets with +34.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in Tangv, OR with 250+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "covariant",
    "slug": "covariant",
    "name": "Covariant",
    "org": "Covariant Inc.",
    "logoColor": "#F59E0B",
    "logoText": "COV",
    "category": "AI Infrastructure",
    "rank": 51,
    "rankDelta": "0",
    "valuation": "$700M",
    "valuationNum": 700,
    "funding": "$222M",
    "fundingNum": 222,
    "growthRate": "+25.0%",
    "growthNum": 25,
    "marketSignal": "Watch",
    "marketSignalDetail": "Universal AI Robotics Brain (RFM-1)",
    "headquarters": "Berkeley, CA",
    "foundedYear": 2017,
    "teamSize": "140+",
    "hiringVelocity": "High (+35 open roles)",
    "webVisits": "1M / mo",
    "website": "https://covariant.ai",
    "shortDescription": "Robotics foundation model developer creating physical AI systems for automated picking and logistics.",
    "fullDescription": "Covariant is a high-growth AI enterprise operating in the AI Infrastructure sector. Recognized across industry benchmarks for universal ai robotics brain (rfm-1), serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Peter Chen",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$222M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Index Ventures",
      "Amplify Partners",
      "Radical Ventures",
      "Amazon"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Universal AI Robotics Brain (RFM-1) with +25.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in Berkeley, CA with 140+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "skild-ai",
    "slug": "skild-ai",
    "name": "Skild AI",
    "org": "Skild AI Inc.",
    "logoColor": "#EC4899",
    "logoText": "SKI",
    "category": "Foundation Models",
    "rank": 52,
    "rankDelta": "0",
    "valuation": "$1.5B",
    "valuationNum": 1500,
    "funding": "$300M",
    "fundingNum": 300,
    "growthRate": "+105.0%",
    "growthNum": 105,
    "marketSignal": "Strong",
    "marketSignalDetail": "Universal Brain for Any Physical Embodiment",
    "headquarters": "Pittsburgh, PA",
    "foundedYear": 2023,
    "teamSize": "40+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "800k / mo",
    "website": "https://skild.ai",
    "shortDescription": "Building a general-purpose AI foundation model that powers arbitrary robotic forms across manipulation and locomotion.",
    "fullDescription": "Skild AI is a high-growth AI enterprise operating in the Foundation Models sector. Recognized across industry benchmarks for universal brain for any physical embodiment, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Deepak Pathak",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$300M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Lightspeed",
      "SoftBank",
      "Coatue",
      "Jeff Bezos",
      "Felicis"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Universal Brain for Any Physical Embodiment with +105.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in Pittsburgh, PA with 40+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "black-forest-labs",
    "slug": "black-forest-labs",
    "name": "Black Forest Labs",
    "org": "Black Forest Labs Inc.",
    "logoColor": "#14B8A6",
    "logoText": "BLA",
    "category": "Creative & Video AI",
    "rank": 53,
    "rankDelta": "0",
    "valuation": "$1.0B",
    "valuationNum": 1000,
    "funding": "$31M",
    "fundingNum": 31,
    "growthRate": "+115.0%",
    "growthNum": 115,
    "marketSignal": "Strong",
    "marketSignalDetail": "FLUX.1 State-of-the-Art Visual Models",
    "headquarters": "Freiburg, Germany",
    "foundedYear": 2024,
    "teamSize": "25+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "14M / mo",
    "website": "https://blackforestlabs.ai",
    "shortDescription": "Research lab founded by original Stable Diffusion inventors, creators of the frontier FLUX.1 image models.",
    "fullDescription": "Black Forest Labs is a high-growth AI enterprise operating in the Creative & Video AI sector. Recognized across industry benchmarks for flux.1 state-of-the-art visual models, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Robin Rombach",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$31M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Andreessen Horowitz",
      "General Catalyst",
      "Timo Aila"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "FLUX.1 State-of-the-Art Visual Models with +115.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in Freiburg, Germany with 25+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "ideogram",
    "slug": "ideogram",
    "name": "Ideogram",
    "org": "Ideogram Inc.",
    "logoColor": "#6E56CF",
    "logoText": "IDE",
    "category": "Creative & Video AI",
    "rank": 54,
    "rankDelta": "0",
    "valuation": "$500M",
    "valuationNum": 500,
    "funding": "$96M",
    "fundingNum": 96,
    "growthRate": "+65.0%",
    "growthNum": 65,
    "marketSignal": "Strong",
    "marketSignalDetail": "Flawless Typography & Graphic Synthesis",
    "headquarters": "Toronto, Canada",
    "foundedYear": 2023,
    "teamSize": "30+",
    "hiringVelocity": "High (+35 open roles)",
    "webVisits": "12M / mo",
    "website": "https://ideogram.ai",
    "shortDescription": "Generative AI platform specialized in typographic precision and visual graphic design synthesis.",
    "fullDescription": "Ideogram is a high-growth AI enterprise operating in the Creative & Video AI sector. Recognized across industry benchmarks for flawless typography & graphic synthesis, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Mohammad Norouzi",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$96M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Andreessen Horowitz",
      "Index Ventures",
      "Redpoint"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Flawless Typography & Graphic Synthesis with +65.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in Toronto, Canada with 30+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "kling-ai-kuaishou-",
    "slug": "kling-ai-kuaishou-",
    "name": "Kling AI (Kuaishou)",
    "org": "Kling AI (Kuaishou) Inc.",
    "logoColor": "#3B82F6",
    "logoText": "KLI",
    "category": "Creative & Video AI",
    "rank": 55,
    "rankDelta": "+2",
    "valuation": "$3.5B",
    "valuationNum": 3500,
    "funding": "Corporate Backed",
    "fundingNum": 400,
    "growthRate": "+92.0%",
    "growthNum": 92,
    "marketSignal": "Strong",
    "marketSignalDetail": "High-Resolution Generative Video Models",
    "headquarters": "Beijing, China",
    "foundedYear": 2024,
    "teamSize": "120+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "25M / mo",
    "website": "https://klingai.com",
    "shortDescription": "State-of-the-art cinematic video generator creating realistic motions, fluid physics, and multi-prompt sequences.",
    "fullDescription": "Kling AI (Kuaishou) is a high-growth AI enterprise operating in the Creative & Video AI sector. Recognized across industry benchmarks for high-resolution generative video models, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Kuaishou AI Lab",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "Corporate Backed",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Kuaishou Technology"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "High-Resolution Generative Video Models with +92.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in Beijing, China with 120+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "hailuo-ai-minimax-",
    "slug": "hailuo-ai-minimax-",
    "name": "Hailuo AI (MiniMax)",
    "org": "Hailuo AI (MiniMax) Inc.",
    "logoColor": "#10A37F",
    "logoText": "HAI",
    "category": "Creative & Video AI",
    "rank": 56,
    "rankDelta": "-1",
    "valuation": "$2.5B",
    "valuationNum": 2500,
    "funding": "$600M",
    "fundingNum": 600,
    "growthRate": "+85.0%",
    "growthNum": 85,
    "marketSignal": "Strong",
    "marketSignalDetail": "Video-01 Physics Simulation Engine",
    "headquarters": "Shanghai, China",
    "foundedYear": 2021,
    "teamSize": "200+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "20M / mo",
    "website": "https://hailuoai.video",
    "shortDescription": "Generative video platform celebrated for ultra-consistent human character movements and lighting physics.",
    "fullDescription": "Hailuo AI (MiniMax) is a high-growth AI enterprise operating in the Creative & Video AI sector. Recognized across industry benchmarks for video-01 physics simulation engine, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Yan Junjie",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$600M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Alibaba",
      "Tencent",
      "HongShan",
      "Hillhouse"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Video-01 Physics Simulation Engine with +85.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in Shanghai, China with 200+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "krea-ai",
    "slug": "krea-ai",
    "name": "Krea AI",
    "org": "Krea AI Inc.",
    "logoColor": "#F59E0B",
    "logoText": "KRE",
    "category": "Creative & Video AI",
    "rank": 57,
    "rankDelta": "0",
    "valuation": "$150M",
    "valuationNum": 150,
    "funding": "$15M",
    "fundingNum": 15,
    "growthRate": "+58.0%",
    "growthNum": 58,
    "marketSignal": "Emerging",
    "marketSignalDetail": "Real-time Canvas & Video Enhancer",
    "headquarters": "San Francisco, CA",
    "foundedYear": 2022,
    "teamSize": "20+",
    "hiringVelocity": "High (+35 open roles)",
    "webVisits": "9M / mo",
    "website": "https://krea.ai",
    "shortDescription": "Real-time generative canvas allowing designers to create images, enhance resolutions, and generate video seamlessly.",
    "fullDescription": "Krea AI is a high-growth AI enterprise operating in the Creative & Video AI sector. Recognized across industry benchmarks for real-time canvas & video enhancer, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Victor Perez",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$15M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "LocalGlobe",
      "Firstminute Capital"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Real-time Canvas & Video Enhancer with +58.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in San Francisco, CA with 20+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "leonardo-ai",
    "slug": "leonardo-ai",
    "name": "Leonardo AI",
    "org": "Leonardo AI Inc.",
    "logoColor": "#EC4899",
    "logoText": "LEO",
    "category": "Creative & Video AI",
    "rank": 58,
    "rankDelta": "0",
    "valuation": "$320M",
    "valuationNum": 320,
    "funding": "$44M",
    "fundingNum": 44,
    "growthRate": "+35.0%",
    "growthNum": 35,
    "marketSignal": "Strong",
    "marketSignalDetail": "Acquired by Canva • Production Asset Gen",
    "headquarters": "Sydney, Australia",
    "foundedYear": 2022,
    "teamSize": "70+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "24M / mo",
    "website": "https://leonardo.ai",
    "shortDescription": "Production-ready creative asset generation platform acquired by Canva to power digital design tools.",
    "fullDescription": "Leonardo AI is a high-growth AI enterprise operating in the Creative & Video AI sector. Recognized across industry benchmarks for acquired by canva • production asset gen, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "JJ Fiasson",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$44M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Canva (Acquirer)",
      "Blackbird Ventures",
      "Side Stage"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Acquired by Canva • Production Asset Gen with +35.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in Sydney, Australia with 70+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "captions",
    "slug": "captions",
    "name": "Captions",
    "org": "Captions Inc.",
    "logoColor": "#14B8A6",
    "logoText": "CAP",
    "category": "Creative & Video AI",
    "rank": 59,
    "rankDelta": "0",
    "valuation": "$500M",
    "valuationNum": 500,
    "funding": "$100M",
    "fundingNum": 100,
    "growthRate": "+60.0%",
    "growthNum": 60,
    "marketSignal": "Strong",
    "marketSignalDetail": "Creator Video Studios with AI Eye Contact",
    "headquarters": "New York, NY",
    "foundedYear": 2021,
    "teamSize": "90+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "8M / mo",
    "website": "https://captions.ai",
    "shortDescription": "AI-powered creative studio for video recording, automated subtitles, translation, and studio audio enhancement.",
    "fullDescription": "Captions is a high-growth AI enterprise operating in the Creative & Video AI sector. Recognized across industry benchmarks for creator video studios with ai eye contact, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Gaurav Misra",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$100M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Index Ventures",
      "Kleiner Perkins",
      "Andreessen Horowitz"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Creator Video Studios with AI Eye Contact with +60.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in New York, NY with 90+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "heygen",
    "slug": "heygen",
    "name": "HeyGen",
    "org": "HeyGen Inc.",
    "logoColor": "#6E56CF",
    "logoText": "HEY",
    "category": "Creative & Video AI",
    "rank": 60,
    "rankDelta": "+2",
    "valuation": "$500M",
    "valuationNum": 500,
    "funding": "$69M",
    "fundingNum": 69,
    "growthRate": "+70.0%",
    "growthNum": 70,
    "marketSignal": "Strong",
    "marketSignalDetail": "Photorealistic AI Video Avatars & Voice",
    "headquarters": "Los Angeles, CA",
    "foundedYear": 2020,
    "teamSize": "100+",
    "hiringVelocity": "High (+35 open roles)",
    "webVisits": "16M / mo",
    "website": "https://heygen.com",
    "shortDescription": "AI video generation platform creating custom digital avatars that deliver presentations and localized marketing in minutes.",
    "fullDescription": "HeyGen is a high-growth AI enterprise operating in the Creative & Video AI sector. Recognized across industry benchmarks for photorealistic ai video avatars & voice, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Joshua Xu",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$69M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Benchmark",
      "Thrive Capital",
      "Bond Capital"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Photorealistic AI Video Avatars & Voice with +70.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in Los Angeles, CA with 100+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "synthesia",
    "slug": "synthesia",
    "name": "Synthesia",
    "org": "Synthesia Inc.",
    "logoColor": "#3B82F6",
    "logoText": "SYN",
    "category": "Creative & Video AI",
    "rank": 61,
    "rankDelta": "0",
    "valuation": "$1.0B",
    "valuationNum": 1000,
    "funding": "$156M",
    "fundingNum": 156,
    "growthRate": "+32.0%",
    "growthNum": 32,
    "marketSignal": "Strong",
    "marketSignalDetail": "Enterprise Avatar Training Videos",
    "headquarters": "London, UK",
    "foundedYear": 2017,
    "teamSize": "300+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "11M / mo",
    "website": "https://synthesia.io",
    "shortDescription": "Generative enterprise video platform replacing cameras with interactive AI avatars in over 140 languages.",
    "fullDescription": "Synthesia is a high-growth AI enterprise operating in the Creative & Video AI sector. Recognized across industry benchmarks for enterprise avatar training videos, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Victor Riparbelli",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$156M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Accel",
      "Kleiner Perkins",
      "GV",
      "FirstMark"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Enterprise Avatar Training Videos with +32.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in London, UK with 300+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "tome",
    "slug": "tome",
    "name": "Tome",
    "org": "Tome Inc.",
    "logoColor": "#10A37F",
    "logoText": "TOM",
    "category": "Enterprise & Productivity",
    "rank": 62,
    "rankDelta": "0",
    "valuation": "$300M",
    "valuationNum": 300,
    "funding": "$75M",
    "fundingNum": 75,
    "growthRate": "+20.0%",
    "growthNum": 20,
    "marketSignal": "Watch",
    "marketSignalDetail": "Generative Storytelling & Deck Platform",
    "headquarters": "San Francisco, CA",
    "foundedYear": 2020,
    "teamSize": "60+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "4M / mo",
    "website": "https://tome.app",
    "shortDescription": "AI-powered format for generative presentations, interactive portfolios, and enterprise sales decks.",
    "fullDescription": "Tome is a high-growth AI enterprise operating in the Enterprise & Productivity sector. Recognized across industry benchmarks for generative storytelling & deck platform, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Keith Peiris",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$75M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Lightspeed",
      "Coatue",
      "Greylock"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Generative Storytelling & Deck Platform with +20.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in San Francisco, CA with 60+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "gamma",
    "slug": "gamma",
    "name": "Gamma",
    "org": "Gamma Inc.",
    "logoColor": "#F59E0B",
    "logoText": "GAM",
    "category": "Enterprise & Productivity",
    "rank": 63,
    "rankDelta": "-1",
    "valuation": "$400M",
    "valuationNum": 400,
    "funding": "$25M",
    "fundingNum": 25,
    "growthRate": "+85.0%",
    "growthNum": 85,
    "marketSignal": "Strong",
    "marketSignalDetail": "Viral Presentation & Document Engine",
    "headquarters": "San Francisco, CA",
    "foundedYear": 2020,
    "teamSize": "40+",
    "hiringVelocity": "High (+35 open roles)",
    "webVisits": "22M / mo",
    "website": "https://gamma.app",
    "shortDescription": "AI generator turning conversational bullet points into polished web presentations, docs, and webpages.",
    "fullDescription": "Gamma is a high-growth AI enterprise operating in the Enterprise & Productivity sector. Recognized across industry benchmarks for viral presentation & document engine, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Grant Lee",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$25M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Accel",
      "Spark Capital",
      "Zoom Ventures"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Viral Presentation & Document Engine with +85.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in San Francisco, CA with 40+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "codiumai-qodo-",
    "slug": "codiumai-qodo-",
    "name": "CodiumAI (Qodo)",
    "org": "CodiumAI (Qodo) Inc.",
    "logoColor": "#EC4899",
    "logoText": "COD",
    "category": "AI Code & DevTools",
    "rank": 64,
    "rankDelta": "0",
    "valuation": "$250M",
    "valuationNum": 250,
    "funding": "$51M",
    "fundingNum": 51,
    "growthRate": "+62.0%",
    "growthNum": 62,
    "marketSignal": "Emerging",
    "marketSignalDetail": "Automated Code Integrity & Unit Testing",
    "headquarters": "Tel Aviv, Israel & San Francisco",
    "foundedYear": 2022,
    "teamSize": "70+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "2.5M / mo",
    "website": "https://qodo.ai",
    "shortDescription": "Developer platform analyzing code to autonomously generate meaningful tests, pull request reviews, and bugs.",
    "fullDescription": "CodiumAI (Qodo) is a high-growth AI enterprise operating in the AI Code & DevTools sector. Recognized across industry benchmarks for automated code integrity & unit testing, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Itamar Friedman",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$51M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Susa Ventures",
      "Square Peg",
      "TLDV"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Automated Code Integrity & Unit Testing with +62.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in Tel Aviv, Israel & San Francisco with 70+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "tabnine",
    "slug": "tabnine",
    "name": "Tabnine",
    "org": "Tabnine Inc.",
    "logoColor": "#14B8A6",
    "logoText": "TAB",
    "category": "AI Code & DevTools",
    "rank": 65,
    "rankDelta": "+2",
    "valuation": "$300M",
    "valuationNum": 300,
    "funding": "$55M",
    "fundingNum": 55,
    "growthRate": "+22.0%",
    "growthNum": 22,
    "marketSignal": "Watch",
    "marketSignalDetail": "Private Air-Gapped Code Completion",
    "headquarters": "Tel Aviv, Israel",
    "foundedYear": 2018,
    "teamSize": "90+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "3M / mo",
    "website": "https://tabnine.com",
    "shortDescription": "Security-first AI coding assistant that can run air-gapped on private servers without data retention.",
    "fullDescription": "Tabnine is a high-growth AI enterprise operating in the AI Code & DevTools sector. Recognized across industry benchmarks for private air-gapped code completion, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Dror Weiss",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$55M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Telstra Ventures",
      "Atlassian Ventures",
      "Pitango"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Private Air-Gapped Code Completion with +22.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in Tel Aviv, Israel with 90+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "replit",
    "slug": "replit",
    "name": "Replit",
    "org": "Replit Inc.",
    "logoColor": "#6E56CF",
    "logoText": "REP",
    "category": "AI Code & DevTools",
    "rank": 66,
    "rankDelta": "+3",
    "valuation": "$3.0B",
    "valuationNum": 3000,
    "funding": "$200M",
    "fundingNum": 200,
    "growthRate": "+45.0%",
    "growthNum": 45,
    "marketSignal": "Strong",
    "marketSignalDetail": "Replit Agent Collaborative Cloud IDE",
    "headquarters": "San Francisco, CA",
    "foundedYear": 2016,
    "teamSize": "120+",
    "hiringVelocity": "High (+35 open roles)",
    "webVisits": "25M / mo",
    "website": "https://replit.com",
    "shortDescription": "Collaborative cloud development environment with autonomous Replit Agent building full applications from prompts.",
    "fullDescription": "Replit is a high-growth AI enterprise operating in the AI Code & DevTools sector. Recognized across industry benchmarks for replit agent collaborative cloud ide, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Amjad Masad",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$200M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Andreessen Horowitz",
      "Coatue",
      "Khosla Ventures",
      "Y Combinator"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Replit Agent Collaborative Cloud IDE with +45.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in San Francisco, CA with 120+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "sourcegraph-cody-",
    "slug": "sourcegraph-cody-",
    "name": "Sourcegraph (Cody)",
    "org": "Sourcegraph (Cody) Inc.",
    "logoColor": "#3B82F6",
    "logoText": "SOU",
    "category": "AI Code & DevTools",
    "rank": 67,
    "rankDelta": "0",
    "valuation": "$2.6B",
    "valuationNum": 2600,
    "funding": "$250M",
    "fundingNum": 250,
    "growthRate": "+18.0%",
    "growthNum": 18,
    "marketSignal": "Watch",
    "marketSignalDetail": "Enterprise Universal Code Intelligence",
    "headquarters": "San Francisco, CA",
    "foundedYear": 2013,
    "teamSize": "220+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "2.2M / mo",
    "website": "https://sourcegraph.com",
    "shortDescription": "Enterprise code search and AI assistant indexing massive monorepos across languages and repositories.",
    "fullDescription": "Sourcegraph (Cody) is a high-growth AI enterprise operating in the AI Code & DevTools sector. Recognized across industry benchmarks for enterprise universal code intelligence, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Quinn Slack",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$250M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Andreessen Horowitz",
      "Insight Partners",
      "Sequoia Capital"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Enterprise Universal Code Intelligence with +18.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in San Francisco, CA with 220+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "magicschool-ai",
    "slug": "magicschool-ai",
    "name": "MagicSchool AI",
    "org": "MagicSchool AI Inc.",
    "logoColor": "#10A37F",
    "logoText": "MAG",
    "category": "Enterprise & Productivity",
    "rank": 68,
    "rankDelta": "0",
    "valuation": "$200M",
    "valuationNum": 200,
    "funding": "$32M",
    "fundingNum": 32,
    "growthRate": "+78.0%",
    "growthNum": 78,
    "marketSignal": "Strong",
    "marketSignalDetail": "Fastest Growing Education AI Suite",
    "headquarters": "Denver, CO",
    "foundedYear": 2023,
    "teamSize": "45+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "8M / mo",
    "website": "https://magicschool.ai",
    "shortDescription": "AI platform assisting over 4 million educators with lesson plans, assessments, and IEP communication.",
    "fullDescription": "MagicSchool AI is a high-growth AI enterprise operating in the Enterprise & Productivity sector. Recognized across industry benchmarks for fastest growing education ai suite, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Adeel Khan",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$32M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Bain Capital Ventures",
      "Adobe Ventures",
      "Range Ventures"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Fastest Growing Education AI Suite with +78.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in Denver, CO with 45+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "braintrust-data",
    "slug": "braintrust-data",
    "name": "Braintrust Data",
    "org": "Braintrust Data Inc.",
    "logoColor": "#F59E0B",
    "logoText": "BRA",
    "category": "AI Infrastructure",
    "rank": 69,
    "rankDelta": "0",
    "valuation": "$400M",
    "valuationNum": 400,
    "funding": "$43M",
    "fundingNum": 43,
    "growthRate": "+65.0%",
    "growthNum": 65,
    "marketSignal": "Emerging",
    "marketSignalDetail": "Enterprise AI Evaluation & Tracing",
    "headquarters": "San Francisco, CA",
    "foundedYear": 2023,
    "teamSize": "40+",
    "hiringVelocity": "High (+35 open roles)",
    "webVisits": "1.5M / mo",
    "website": "https://braintrust.dev",
    "shortDescription": "Enterprise evaluation, logging, and continuous automated tuning platform for LLM deployments.",
    "fullDescription": "Braintrust Data is a high-growth AI enterprise operating in the AI Infrastructure sector. Recognized across industry benchmarks for enterprise ai evaluation & tracing, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Ankur Goyal",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$43M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "a16z",
      "Elad Gil",
      "Greylock"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Enterprise AI Evaluation & Tracing with +65.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in San Francisco, CA with 40+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "unstructured",
    "slug": "unstructured",
    "name": "Unstructured",
    "org": "Unstructured Inc.",
    "logoColor": "#EC4899",
    "logoText": "UNS",
    "category": "AI Infrastructure",
    "rank": 70,
    "rankDelta": "+2",
    "valuation": "$280M",
    "valuationNum": 280,
    "funding": "$65M",
    "fundingNum": 65,
    "growthRate": "+72.0%",
    "growthNum": 72,
    "marketSignal": "Emerging",
    "marketSignalDetail": "Enterprise Document Ingestion for LLMs",
    "headquarters": "San Francisco, CA",
    "foundedYear": 2022,
    "teamSize": "60+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "2M / mo",
    "website": "https://unstructured.io",
    "shortDescription": "Data transformation platform converting raw PDFs, Word docs, and emails into structured vector embeddings.",
    "fullDescription": "Unstructured is a high-growth AI enterprise operating in the AI Infrastructure sector. Recognized across industry benchmarks for enterprise document ingestion for llms, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Brian Raymond",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$65M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Menlo Ventures",
      "Databricks Ventures",
      "IBM Ventures"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Enterprise Document Ingestion for LLMs with +72.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in San Francisco, CA with 60+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "lamini",
    "slug": "lamini",
    "name": "Lamini",
    "org": "Lamini Inc.",
    "logoColor": "#14B8A6",
    "logoText": "LAM",
    "category": "AI Infrastructure",
    "rank": 71,
    "rankDelta": "0",
    "valuation": "$150M",
    "valuationNum": 150,
    "funding": "$25M",
    "fundingNum": 25,
    "growthRate": "+40.0%",
    "growthNum": 40,
    "marketSignal": "Emerging",
    "marketSignalDetail": "Enterprise LLM Fine-Tuning Engine",
    "headquarters": "Palo Alto, CA",
    "foundedYear": 2022,
    "teamSize": "30+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "800k / mo",
    "website": "https://lamini.ai",
    "shortDescription": "Enterprise LLM engine enabling Fortune 500 teams to fine-tune private open-source foundation models.",
    "fullDescription": "Lamini is a high-growth AI enterprise operating in the AI Infrastructure sector. Recognized across industry benchmarks for enterprise llm fine-tuning engine, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Sharon Zhou",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$25M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Amplify Partners",
      "Felicis",
      "First Round"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Enterprise LLM Fine-Tuning Engine with +40.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in Palo Alto, CA with 30+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "octoai",
    "slug": "octoai",
    "name": "OctoAI",
    "org": "OctoAI Inc.",
    "logoColor": "#6E56CF",
    "logoText": "OCT",
    "category": "AI Infrastructure",
    "rank": 72,
    "rankDelta": "0",
    "valuation": "$350M",
    "valuationNum": 350,
    "funding": "$132M",
    "fundingNum": 132,
    "growthRate": "+30.0%",
    "growthNum": 30,
    "marketSignal": "Watch",
    "marketSignalDetail": "Compute Optimization • Acquired by NVIDIA",
    "headquarters": "Seattle, WA",
    "foundedYear": 2019,
    "teamSize": "100+",
    "hiringVelocity": "High (+35 open roles)",
    "webVisits": "1.2M / mo",
    "website": "https://octo.ai",
    "shortDescription": "Cloud inference engine optimizing Apache TVM open models for maximum hardware throughput.",
    "fullDescription": "OctoAI is a high-growth AI enterprise operating in the AI Infrastructure sector. Recognized across industry benchmarks for compute optimization • acquired by nvidia, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Luis Ceze",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$132M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "NVIDIA",
      "Tiger Global",
      "Madrona",
      "Amplify"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Compute Optimization • Acquired by NVIDIA with +30.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in Seattle, WA with 100+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "anyscale",
    "slug": "anyscale",
    "name": "Anyscale",
    "org": "Anyscale Inc.",
    "logoColor": "#3B82F6",
    "logoText": "ANY",
    "category": "AI Infrastructure",
    "rank": 73,
    "rankDelta": "0",
    "valuation": "$1.0B",
    "valuationNum": 1000,
    "funding": "$260M",
    "fundingNum": 260,
    "growthRate": "+25.0%",
    "growthNum": 25,
    "marketSignal": "Watch",
    "marketSignalDetail": "Creators of Ray Distributed AI Computing",
    "headquarters": "San Francisco, CA",
    "foundedYear": 2019,
    "teamSize": "180+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "2M / mo",
    "website": "https://anyscale.com",
    "shortDescription": "Platform for scaling AI and Python workloads powered by Ray, the open-source distributed compute standard.",
    "fullDescription": "Anyscale is a high-growth AI enterprise operating in the AI Infrastructure sector. Recognized across industry benchmarks for creators of ray distributed ai computing, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Robert Nishihara",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$260M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Andreessen Horowitz",
      "NEA",
      "Addition",
      "Intel Capital"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Creators of Ray Distributed AI Computing with +25.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in San Francisco, CA with 180+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "fireworks-ai",
    "slug": "fireworks-ai",
    "name": "Fireworks AI",
    "org": "Fireworks AI Inc.",
    "logoColor": "#10A37F",
    "logoText": "FIR",
    "category": "AI Infrastructure",
    "rank": 74,
    "rankDelta": "0",
    "valuation": "$552M",
    "valuationNum": 552,
    "funding": "$77M",
    "fundingNum": 77,
    "growthRate": "+94.0%",
    "growthNum": 94,
    "marketSignal": "Strong",
    "marketSignalDetail": "Compound AI Systems & Sub-second APIs",
    "headquarters": "Redwood City, CA",
    "foundedYear": 2022,
    "teamSize": "50+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "4M / mo",
    "website": "https://fireworks.ai",
    "shortDescription": "High-speed production AI platform serving compound models and function calling at lowest latency.",
    "fullDescription": "Fireworks AI is a high-growth AI enterprise operating in the AI Infrastructure sector. Recognized across industry benchmarks for compound ai systems & sub-second apis, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Lin Qiao",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$77M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Benchmark",
      "Sequoia Capital",
      "NVIDIA",
      "AMD Ventures"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Compound AI Systems & Sub-second APIs with +94.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in Redwood City, CA with 50+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "deepgram",
    "slug": "deepgram",
    "name": "Deepgram",
    "org": "Deepgram Inc.",
    "logoColor": "#F59E0B",
    "logoText": "DEE",
    "category": "Voice & Multimodal",
    "rank": 75,
    "rankDelta": "+2",
    "valuation": "$400M",
    "valuationNum": 400,
    "funding": "$115M",
    "fundingNum": 115,
    "growthRate": "+55.0%",
    "growthNum": 55,
    "marketSignal": "Strong",
    "marketSignalDetail": "Nova-3 Real-time Speech-to-Text API",
    "headquarters": "San Francisco, CA",
    "foundedYear": 2015,
    "teamSize": "130+",
    "hiringVelocity": "High (+35 open roles)",
    "webVisits": "3M / mo",
    "website": "https://deepgram.com",
    "shortDescription": "Enterprise speech-to-text platform transcribing audio streams with sub-300ms latency and high accuracy.",
    "fullDescription": "Deepgram is a high-growth AI enterprise operating in the Voice & Multimodal sector. Recognized across industry benchmarks for nova-3 real-time speech-to-text api, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Scott Stephenson",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$115M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Tiger Global",
      "Wing VC",
      "In-Q-Tel",
      "Y Combinator"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Nova-3 Real-time Speech-to-Text API with +55.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in San Francisco, CA with 130+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "cartesia",
    "slug": "cartesia",
    "name": "Cartesia",
    "org": "Cartesia Inc.",
    "logoColor": "#EC4899",
    "logoText": "CAR",
    "category": "Voice & Multimodal",
    "rank": 76,
    "rankDelta": "0",
    "valuation": "$200M",
    "valuationNum": 200,
    "funding": "$30M",
    "fundingNum": 30,
    "growthRate": "+125.0%",
    "growthNum": 125,
    "marketSignal": "Emerging",
    "marketSignalDetail": "State Space Architecture for Audio (Sonic)",
    "headquarters": "San Francisco, CA",
    "foundedYear": 2023,
    "teamSize": "25+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "1.8M / mo",
    "website": "https://cartesia.ai",
    "shortDescription": "Voice foundation model builder using State Space Models for 100ms ultra-low latency voice streaming.",
    "fullDescription": "Cartesia is a high-growth AI enterprise operating in the Voice & Multimodal sector. Recognized across industry benchmarks for state space architecture for audio (sonic), serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Karan Goel",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$30M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Index Ventures",
      "Lightspeed",
      "Amplify"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "State Space Architecture for Audio (Sonic) with +125.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in San Francisco, CA with 25+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "smallest-ai",
    "slug": "smallest-ai",
    "name": "Smallest AI",
    "org": "Smallest AI Inc.",
    "logoColor": "#14B8A6",
    "logoText": "SMA",
    "category": "Voice & Multimodal",
    "rank": 77,
    "rankDelta": "-1",
    "valuation": "$100M",
    "valuationNum": 100,
    "funding": "$12M",
    "fundingNum": 12,
    "growthRate": "+85.0%",
    "growthNum": 85,
    "marketSignal": "Emerging",
    "marketSignalDetail": "Waves Ultra-Compact Synthetic Voice",
    "headquarters": "Bengaluru & San Francisco",
    "foundedYear": 2023,
    "teamSize": "20+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "800k / mo",
    "website": "https://smallest.ai",
    "shortDescription": "Ultra-fast, compact multilingual text-to-speech models designed for edge hardware and call centers.",
    "fullDescription": "Smallest AI is a high-growth AI enterprise operating in the Voice & Multimodal sector. Recognized across industry benchmarks for waves ultra-compact synthetic voice, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Sudharshan Ravichandran",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$12M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Khosla Ventures",
      "Emergent Ventures"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Waves Ultra-Compact Synthetic Voice with +85.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in Bengaluru & San Francisco with 20+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "playht",
    "slug": "playht",
    "name": "PlayHT",
    "org": "PlayHT Inc.",
    "logoColor": "#6E56CF",
    "logoText": "PLA",
    "category": "Voice & Multimodal",
    "rank": 78,
    "rankDelta": "0",
    "valuation": "$150M",
    "valuationNum": 150,
    "funding": "$24M",
    "fundingNum": 24,
    "growthRate": "+35.0%",
    "growthNum": 35,
    "marketSignal": "Watch",
    "marketSignalDetail": "Conversational Voice Cloning Suite",
    "headquarters": "Mountain View, CA",
    "foundedYear": 2016,
    "teamSize": "40+",
    "hiringVelocity": "High (+35 open roles)",
    "webVisits": "5M / mo",
    "website": "https://play.ht",
    "shortDescription": "AI voice generator and voice cloning engine for podcasts, videos, and dynamic customer telephony.",
    "fullDescription": "PlayHT is a high-growth AI enterprise operating in the Voice & Multimodal sector. Recognized across industry benchmarks for conversational voice cloning suite, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Mahmoud Felfel",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$24M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Tribe Capital",
      "Supercapital"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Conversational Voice Cloning Suite with +35.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in Mountain View, CA with 40+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "phind",
    "slug": "phind",
    "name": "Phind",
    "org": "Phind Inc.",
    "logoColor": "#3B82F6",
    "logoText": "PHI",
    "category": "AI Search & Assistants",
    "rank": 79,
    "rankDelta": "0",
    "valuation": "$200M",
    "valuationNum": 200,
    "funding": "$15M",
    "fundingNum": 15,
    "growthRate": "+45.0%",
    "growthNum": 45,
    "marketSignal": "Emerging",
    "marketSignalDetail": "Search Engine for Software Developers",
    "headquarters": "San Francisco, CA",
    "foundedYear": 2022,
    "teamSize": "15+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "6M / mo",
    "website": "https://phind.com",
    "shortDescription": "Intelligent search engine engineered for developers, explaining complex code errors and documentation directly.",
    "fullDescription": "Phind is a high-growth AI enterprise operating in the AI Search & Assistants sector. Recognized across industry benchmarks for search engine for software developers, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Michael Royzen",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$15M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Y Combinator",
      "Khosla Ventures"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Search Engine for Software Developers with +45.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in San Francisco, CA with 15+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "you-com",
    "slug": "you-com",
    "name": "You.com",
    "org": "You.com Inc.",
    "logoColor": "#10A37F",
    "logoText": "YOU",
    "category": "AI Search & Assistants",
    "rank": 80,
    "rankDelta": "+2",
    "valuation": "$350M",
    "valuationNum": 350,
    "funding": "$99M",
    "fundingNum": 99,
    "growthRate": "+30.0%",
    "growthNum": 30,
    "marketSignal": "Watch",
    "marketSignalDetail": "Customizable Multi-Agent Search",
    "headquarters": "Palo Alto, CA",
    "foundedYear": 2020,
    "teamSize": "60+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "14M / mo",
    "website": "https://you.com",
    "shortDescription": "AI search engine and multi-agent assistant delivering cited answers, deep research, and collaborative workspaces.",
    "fullDescription": "You.com is a high-growth AI enterprise operating in the AI Search & Assistants sector. Recognized across industry benchmarks for customizable multi-agent search, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Richard Socher",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$99M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Georgian",
      "Marc Benioff",
      "Norwest",
      "Day One"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Customizable Multi-Agent Search with +30.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in Palo Alto, CA with 60+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "kindo-ai",
    "slug": "kindo-ai",
    "name": "Kindo AI",
    "org": "Kindo AI Inc.",
    "logoColor": "#F59E0B",
    "logoText": "KIN",
    "category": "Enterprise & Productivity",
    "rank": 81,
    "rankDelta": "0",
    "valuation": "$80M",
    "valuationNum": 80,
    "funding": "$10M",
    "fundingNum": 10,
    "growthRate": "+50.0%",
    "growthNum": 50,
    "marketSignal": "Emerging",
    "marketSignalDetail": "Enterprise Security & Governance Layer",
    "headquarters": "San Francisco, CA",
    "foundedYear": 2023,
    "teamSize": "25+",
    "hiringVelocity": "High (+35 open roles)",
    "webVisits": "500k / mo",
    "website": "https://kindo.ai",
    "shortDescription": "Unified enterprise AI orchestration and security governance platform supporting over 200 foundation models.",
    "fullDescription": "Kindo AI is a high-growth AI enterprise operating in the Enterprise & Productivity sector. Recognized across industry benchmarks for enterprise security & governance layer, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Ron Kirschner",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$10M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Drive Capital",
      "RRE Ventures"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Enterprise Security & Governance Layer with +50.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in San Francisco, CA with 25+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "cribl",
    "slug": "cribl",
    "name": "Cribl",
    "org": "Cribl Inc.",
    "logoColor": "#EC4899",
    "logoText": "CRI",
    "category": "AI Infrastructure",
    "rank": 82,
    "rankDelta": "0",
    "valuation": "$3.5B",
    "valuationNum": 3500,
    "funding": "$600M",
    "fundingNum": 600,
    "growthRate": "+40.0%",
    "growthNum": 40,
    "marketSignal": "Strong",
    "marketSignalDetail": "Observability & IT Telemetry for AI",
    "headquarters": "San Francisco, CA",
    "foundedYear": 2018,
    "teamSize": "600+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "1.5M / mo",
    "website": "https://cribl.io",
    "shortDescription": "Data observability pipeline empowering enterprises to route, analyze, and format telemetry for LLM security.",
    "fullDescription": "Cribl is a high-growth AI enterprise operating in the AI Infrastructure sector. Recognized across industry benchmarks for observability & it telemetry for ai, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Clint Sharp",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$600M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "GV",
      "Greylock",
      "IVP",
      "CRV"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Observability & IT Telemetry for AI with +40.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in San Francisco, CA with 600+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "abacus-ai",
    "slug": "abacus-ai",
    "name": "Abacus.ai",
    "org": "Abacus.ai Inc.",
    "logoColor": "#14B8A6",
    "logoText": "ABA",
    "category": "AI Infrastructure",
    "rank": 83,
    "rankDelta": "0",
    "valuation": "$600M",
    "valuationNum": 600,
    "funding": "$105M",
    "fundingNum": 105,
    "growthRate": "+45.0%",
    "growthNum": 45,
    "marketSignal": "Emerging",
    "marketSignalDetail": "ChatLLM & Enterprise Agent Cloud",
    "headquarters": "San Francisco, CA",
    "foundedYear": 2019,
    "teamSize": "110+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "2M / mo",
    "website": "https://abacus.ai",
    "shortDescription": "Complete enterprise generative AI and MLOps platform for automated agent fine-tuning and retrieval pipelines.",
    "fullDescription": "Abacus.ai is a high-growth AI enterprise operating in the AI Infrastructure sector. Recognized across industry benchmarks for chatllm & enterprise agent cloud, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Bindu Reddy",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$105M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Tiger Global",
      "Coatue",
      "Index Ventures"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "ChatLLM & Enterprise Agent Cloud with +45.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in San Francisco, CA with 110+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "deepl",
    "slug": "deepl",
    "name": "DeepL",
    "org": "DeepL Inc.",
    "logoColor": "#6E56CF",
    "logoText": "DEE",
    "category": "Enterprise & Productivity",
    "rank": 84,
    "rankDelta": "-1",
    "valuation": "$2.0B",
    "valuationNum": 2000,
    "funding": "$420M",
    "fundingNum": 420,
    "growthRate": "+25.0%",
    "growthNum": 25,
    "marketSignal": "Strong",
    "marketSignalDetail": "Nuanced Enterprise Neural Translation",
    "headquarters": "Cologne, Germany",
    "foundedYear": 2017,
    "teamSize": "500+",
    "hiringVelocity": "High (+35 open roles)",
    "webVisits": "78M / mo",
    "website": "https://deepl.com",
    "shortDescription": "Leading language AI company specialized in nuanced neural machine translation and business writing assistance.",
    "fullDescription": "DeepL is a high-growth AI enterprise operating in the Enterprise & Productivity sector. Recognized across industry benchmarks for nuanced enterprise neural translation, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Jaroslaw Kutylowski",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$420M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Index Ventures",
      "IVP",
      "WiL (World Innovation Lab)"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Nuanced Enterprise Neural Translation with +25.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in Cologne, Germany with 500+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "otter-ai",
    "slug": "otter-ai",
    "name": "Otter.ai",
    "org": "Otter.ai Inc.",
    "logoColor": "#3B82F6",
    "logoText": "OTT",
    "category": "Enterprise & Productivity",
    "rank": 85,
    "rankDelta": "+2",
    "valuation": "$1.0B",
    "valuationNum": 1000,
    "funding": "$63M",
    "fundingNum": 63,
    "growthRate": "+15.0%",
    "growthNum": 15,
    "marketSignal": "Watch",
    "marketSignalDetail": "Meeting Intelligence & Audio Transcription",
    "headquarters": "Mountain View, CA",
    "foundedYear": 2016,
    "teamSize": "150+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "28M / mo",
    "website": "https://otter.ai",
    "shortDescription": "Automated AI meeting transcription and collaborative action item extraction for hybrid enterprises.",
    "fullDescription": "Otter.ai is a high-growth AI enterprise operating in the Enterprise & Productivity sector. Recognized across industry benchmarks for meeting intelligence & audio transcription, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Sam Liang",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$63M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Spectrum Equity",
      "Horizons Ventures",
      "Duke University"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Meeting Intelligence & Audio Transcription with +15.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in Mountain View, CA with 150+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "character-ai",
    "slug": "character-ai",
    "name": "Character.ai",
    "org": "Character.ai Inc.",
    "logoColor": "#10A37F",
    "logoText": "CHA",
    "category": "AI Search & Assistants",
    "rank": 86,
    "rankDelta": "0",
    "valuation": "$2.5B",
    "valuationNum": 2500,
    "funding": "$193M",
    "fundingNum": 193,
    "growthRate": "+30.0%",
    "growthNum": 30,
    "marketSignal": "Watch",
    "marketSignalDetail": "Conversational Personalities • Google License",
    "headquarters": "Palo Alto, CA",
    "foundedYear": 2021,
    "teamSize": "130+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "140M / mo",
    "website": "https://character.ai",
    "shortDescription": "Social conversational AI platform where millions of users interact with customized open neural agent personas.",
    "fullDescription": "Character.ai is a high-growth AI enterprise operating in the AI Search & Assistants sector. Recognized across industry benchmarks for conversational personalities • google license, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Noam Shazeer",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$193M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Andreessen Horowitz",
      "Google",
      "Nat Friedman"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Conversational Personalities • Google License with +30.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in Palo Alto, CA with 130+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "inworld-ai",
    "slug": "inworld-ai",
    "name": "Inworld AI",
    "org": "Inworld AI Inc.",
    "logoColor": "#F59E0B",
    "logoText": "INW",
    "category": "Voice & Multimodal",
    "rank": 87,
    "rankDelta": "0",
    "valuation": "$500M",
    "valuationNum": 500,
    "funding": "$120M",
    "fundingNum": 120,
    "growthRate": "+45.0%",
    "growthNum": 45,
    "marketSignal": "Emerging",
    "marketSignalDetail": "Dynamic AI Non-Player Characters for Games",
    "headquarters": "Mountain View, CA",
    "foundedYear": 2021,
    "teamSize": "80+",
    "hiringVelocity": "High (+35 open roles)",
    "webVisits": "2M / mo",
    "website": "https://inworld.ai",
    "shortDescription": "Character engine bringing expressive multimodal AI NPCs with emotions, memories, and voices to game engines.",
    "fullDescription": "Inworld AI is a high-growth AI enterprise operating in the Voice & Multimodal sector. Recognized across industry benchmarks for dynamic ai non-player characters for games, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Ilya Gelfenbeyn",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$120M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Lightspeed",
      "Stanford University",
      "Microsoft M12",
      "Disney"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Dynamic AI Non-Player Characters for Games with +45.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in Mountain View, CA with 80+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "hippocratic-ai",
    "slug": "hippocratic-ai",
    "name": "Hippocratic AI",
    "org": "Hippocratic AI Inc.",
    "logoColor": "#EC4899",
    "logoText": "HIP",
    "category": "Enterprise & Productivity",
    "rank": 88,
    "rankDelta": "+3",
    "valuation": "$500M",
    "valuationNum": 500,
    "funding": "$140M",
    "fundingNum": 140,
    "growthRate": "+65.0%",
    "growthNum": 65,
    "marketSignal": "Strong",
    "marketSignalDetail": "Safety-Centric Healthcare LLM Agents",
    "headquarters": "Palo Alto, CA",
    "foundedYear": 2023,
    "teamSize": "70+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "800k / mo",
    "website": "https://hippocraticai.com",
    "shortDescription": "Safety-focused generative AI platform building medical co-pilots and patient call nurses.",
    "fullDescription": "Hippocratic AI is a high-growth AI enterprise operating in the Enterprise & Productivity sector. Recognized across industry benchmarks for safety-centric healthcare llm agents, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Munjal Shah",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$140M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "General Catalyst",
      "Andreessen Horowitz",
      "Memorial Hermann"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Safety-Centric Healthcare LLM Agents with +65.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in Palo Alto, CA with 70+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "abridge",
    "slug": "abridge",
    "name": "Abridge",
    "org": "Abridge Inc.",
    "logoColor": "#14B8A6",
    "logoText": "ABR",
    "category": "Enterprise & Productivity",
    "rank": 89,
    "rankDelta": "0",
    "valuation": "$2.5B",
    "valuationNum": 2500,
    "funding": "$460M",
    "fundingNum": 460,
    "growthRate": "+120.0%",
    "growthNum": 120,
    "marketSignal": "Strong",
    "marketSignalDetail": "Clinical Audio Documentation Standard",
    "headquarters": "Pittsburgh, PA",
    "foundedYear": 2018,
    "teamSize": "140+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "3M / mo",
    "website": "https://abridge.com",
    "shortDescription": "Clinical generative AI platform transcribing doctor-patient conversations into structured EHR notes in real time.",
    "fullDescription": "Abridge is a high-growth AI enterprise operating in the Enterprise & Productivity sector. Recognized across industry benchmarks for clinical audio documentation standard, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Dr. Shiv Rao",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$460M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Lightspeed Venture Partners",
      "IVP",
      "Redpoint",
      "CVS Health"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Clinical Audio Documentation Standard with +120.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in Pittsburgh, PA with 140+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "ambience-healthcare",
    "slug": "ambience-healthcare",
    "name": "Ambience Healthcare",
    "org": "Ambience Healthcare Inc.",
    "logoColor": "#6E56CF",
    "logoText": "AMB",
    "category": "Enterprise & Productivity",
    "rank": 90,
    "rankDelta": "+2",
    "valuation": "$800M",
    "valuationNum": 800,
    "funding": "$100M",
    "fundingNum": 100,
    "growthRate": "+90.0%",
    "growthNum": 90,
    "marketSignal": "Emerging",
    "marketSignalDetail": "Hospital AI Operating System for Clinicians",
    "headquarters": "San Francisco, CA",
    "foundedYear": 2020,
    "teamSize": "80+",
    "hiringVelocity": "High (+35 open roles)",
    "webVisits": "1.2M / mo",
    "website": "https://ambiencehealthcare.com",
    "shortDescription": "Operating system for healthcare organizations with automated medical scribing and coding.",
    "fullDescription": "Ambience Healthcare is a high-growth AI enterprise operating in the Enterprise & Productivity sector. Recognized across industry benchmarks for hospital ai operating system for clinicians, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Mike Ng",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$100M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Kleiner Perkins",
      "OpenAI Startup Fund",
      "Andreessen Horowitz"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Hospital AI Operating System for Clinicians with +90.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in San Francisco, CA with 80+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "insilico-medicine",
    "slug": "insilico-medicine",
    "name": "Insilico Medicine",
    "org": "Insilico Medicine Inc.",
    "logoColor": "#3B82F6",
    "logoText": "INS",
    "category": "Enterprise & Productivity",
    "rank": 91,
    "rankDelta": "-1",
    "valuation": "$1.2B",
    "valuationNum": 1200,
    "funding": "$400M",
    "fundingNum": 400,
    "growthRate": "+28.0%",
    "growthNum": 28,
    "marketSignal": "Strong",
    "marketSignalDetail": "Generative AI Drug Discovery & Pharma",
    "headquarters": "Hong Kong & Cambridge, MA",
    "foundedYear": 2014,
    "teamSize": "250+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "1.5M / mo",
    "website": "https://insilico.com",
    "shortDescription": "Pioneer in generative AI biology designing novel small molecules and therapeutics entering Phase II clinical trials.",
    "fullDescription": "Insilico Medicine is a high-growth AI enterprise operating in the Enterprise & Productivity sector. Recognized across industry benchmarks for generative ai drug discovery & pharma, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Alex Zhavoronkov",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$400M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Warburg Pincus",
      "B Capital",
      "Prosperity7"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Generative AI Drug Discovery & Pharma with +28.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in Hong Kong & Cambridge, MA with 250+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "recursion-pharmaceuticals",
    "slug": "recursion-pharmaceuticals",
    "name": "Recursion Pharmaceuticals",
    "org": "Recursion Pharmaceuticals Inc.",
    "logoColor": "#10A37F",
    "logoText": "REC",
    "category": "Enterprise & Productivity",
    "rank": 92,
    "rankDelta": "0",
    "valuation": "$2.2B",
    "valuationNum": 2200,
    "funding": "$1.0B",
    "fundingNum": 1000,
    "growthRate": "+35.0%",
    "growthNum": 35,
    "marketSignal": "Strong",
    "marketSignalDetail": "Industrial Phenomics & NVIDIA BioNeMo",
    "headquarters": "Salt Lake City, UT",
    "foundedYear": 2013,
    "teamSize": "500+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "2M / mo",
    "website": "https://recursion.com",
    "shortDescription": "TechBio company decoding biology by combining proprietary multi-petabyte cellular image datasets with AI models.",
    "fullDescription": "Recursion Pharmaceuticals is a high-growth AI enterprise operating in the Enterprise & Productivity sector. Recognized across industry benchmarks for industrial phenomics & nvidia bionemo, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Chris Gibson",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$1.0B",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "NVIDIA",
      "Mubadala",
      "Baillie Gifford",
      "Lux Capital"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Industrial Phenomics & NVIDIA BioNeMo with +35.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in Salt Lake City, UT with 500+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "cradle-bio",
    "slug": "cradle-bio",
    "name": "Cradle Bio",
    "org": "Cradle Bio Inc.",
    "logoColor": "#F59E0B",
    "logoText": "CRA",
    "category": "Enterprise & Productivity",
    "rank": 93,
    "rankDelta": "0",
    "valuation": "$300M",
    "valuationNum": 300,
    "funding": "$90M",
    "fundingNum": 90,
    "growthRate": "+85.0%",
    "growthNum": 85,
    "marketSignal": "Emerging",
    "marketSignalDetail": "Generative Protein Engineering Platform",
    "headquarters": "Amsterdam, Netherlands & Zurich",
    "foundedYear": 2021,
    "teamSize": "50+",
    "hiringVelocity": "High (+35 open roles)",
    "webVisits": "600k / mo",
    "website": "https://cradle.bio",
    "shortDescription": "Biotech software platform using generative neural networks to engineer optimized custom enzymes and proteins.",
    "fullDescription": "Cradle Bio is a high-growth AI enterprise operating in the Enterprise & Productivity sector. Recognized across industry benchmarks for generative protein engineering platform, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Stef van Grieken",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$90M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Index Ventures",
      "Kindred Capital",
      "Sofinnova"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Generative Protein Engineering Platform with +85.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in Amsterdam, Netherlands & Zurich with 50+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "twelve-labs",
    "slug": "twelve-labs",
    "name": "Twelve Labs",
    "org": "Twelve Labs Inc.",
    "logoColor": "#EC4899",
    "logoText": "TWE",
    "category": "Creative & Video AI",
    "rank": 94,
    "rankDelta": "0",
    "valuation": "$300M",
    "valuationNum": 300,
    "funding": "$77M",
    "fundingNum": 77,
    "growthRate": "+75.0%",
    "growthNum": 75,
    "marketSignal": "Emerging",
    "marketSignalDetail": "Multimodal Video Search & Embeddings (Marengo)",
    "headquarters": "San Francisco, CA",
    "foundedYear": 2021,
    "teamSize": "60+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "2M / mo",
    "website": "https://twelvelabs.io",
    "shortDescription": "Multimodal video foundation models enabling semantic search, chapter extraction, and natural dialogue from raw video.",
    "fullDescription": "Twelve Labs is a high-growth AI enterprise operating in the Creative & Video AI sector. Recognized across industry benchmarks for multimodal video search & embeddings (marengo), serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Jae Lee",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$77M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "New Enterprise Associates (NEA)",
      "Index Ventures",
      "NVIDIA"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Multimodal Video Search & Embeddings (Marengo) with +75.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in San Francisco, CA with 60+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "arthur-ai",
    "slug": "arthur-ai",
    "name": "Arthur AI",
    "org": "Arthur AI Inc.",
    "logoColor": "#14B8A6",
    "logoText": "ART",
    "category": "AI Infrastructure",
    "rank": 95,
    "rankDelta": "+2",
    "valuation": "$250M",
    "valuationNum": 250,
    "funding": "$60M",
    "fundingNum": 60,
    "growthRate": "+35.0%",
    "growthNum": 35,
    "marketSignal": "Watch",
    "marketSignalDetail": "LLM Firewall & Hallucination Guardrails",
    "headquarters": "New York, NY",
    "foundedYear": 2018,
    "teamSize": "70+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "1M / mo",
    "website": "https://arthur.ai",
    "shortDescription": "Model monitoring and security platform providing real-time firewalls against prompt injection and hallucinations.",
    "fullDescription": "Arthur AI is a high-growth AI enterprise operating in the AI Infrastructure sector. Recognized across industry benchmarks for llm firewall & hallucination guardrails, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Adam Wenchel",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$60M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Index Ventures",
      "Work-Bench",
      "Greycroft"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "LLM Firewall & Hallucination Guardrails with +35.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in New York, NY with 70+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "robust-intelligence",
    "slug": "robust-intelligence",
    "name": "Robust Intelligence",
    "org": "Robust Intelligence Inc.",
    "logoColor": "#6E56CF",
    "logoText": "ROB",
    "category": "AI Infrastructure",
    "rank": 96,
    "rankDelta": "0",
    "valuation": "$300M",
    "valuationNum": 300,
    "funding": "$44M",
    "fundingNum": 44,
    "growthRate": "+40.0%",
    "growthNum": 40,
    "marketSignal": "Strong",
    "marketSignalDetail": "AI Model Red Teaming • Cisco Acquisition",
    "headquarters": "San Francisco, CA",
    "foundedYear": 2019,
    "teamSize": "80+",
    "hiringVelocity": "High (+35 open roles)",
    "webVisits": "1.2M / mo",
    "website": "https://robustintelligence.com",
    "shortDescription": "Automated AI vulnerability scanner and AI model security testing platform acquired by Cisco in 2024.",
    "fullDescription": "Robust Intelligence is a high-growth AI enterprise operating in the AI Infrastructure sector. Recognized across industry benchmarks for ai model red teaming • cisco acquisition, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Yaron Singer",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$44M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Cisco (Acquirer)",
      "Tiger Global",
      "Sequoia Capital"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "AI Model Red Teaming • Cisco Acquisition with +40.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in San Francisco, CA with 80+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "galileo",
    "slug": "galileo",
    "name": "Galileo",
    "org": "Galileo Inc.",
    "logoColor": "#3B82F6",
    "logoText": "GAL",
    "category": "AI Infrastructure",
    "rank": 97,
    "rankDelta": "0",
    "valuation": "$200M",
    "valuationNum": 200,
    "funding": "$63M",
    "fundingNum": 63,
    "growthRate": "+90.0%",
    "growthNum": 90,
    "marketSignal": "Emerging",
    "marketSignalDetail": "Evaluation & Hallucination Benchmark Suite",
    "headquarters": "San Francisco, CA",
    "foundedYear": 2021,
    "teamSize": "50+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "1.5M / mo",
    "website": "https://rungalileo.io",
    "shortDescription": "GenAI evaluation platform providing prompt analytics, synthetic test sets, and metric guardrails for enterprises.",
    "fullDescription": "Galileo is a high-growth AI enterprise operating in the AI Infrastructure sector. Recognized across industry benchmarks for evaluation & hallucination benchmark suite, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Vikram Chatterji",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$63M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Scale Venture Partners",
      "Battery Ventures",
      "The Factory"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Evaluation & Hallucination Benchmark Suite with +90.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in San Francisco, CA with 50+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "writerbuddy",
    "slug": "writerbuddy",
    "name": "WriterBuddy",
    "org": "WriterBuddy Inc.",
    "logoColor": "#10A37F",
    "logoText": "WRI",
    "category": "Enterprise & Productivity",
    "rank": 98,
    "rankDelta": "-1",
    "valuation": "$60M",
    "valuationNum": 60,
    "funding": "$8M",
    "fundingNum": 8,
    "growthRate": "+45.0%",
    "growthNum": 45,
    "marketSignal": "Emerging",
    "marketSignalDetail": "Copywriting & Content Operations Engine",
    "headquarters": "San Francisco, CA",
    "foundedYear": 2022,
    "teamSize": "25+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "3M / mo",
    "website": "https://writerbuddy.ai",
    "shortDescription": "Marketing content automation tool enabling copywriting teams to generate social campaigns and SEO briefs.",
    "fullDescription": "WriterBuddy is a high-growth AI enterprise operating in the Enterprise & Productivity sector. Recognized across industry benchmarks for copywriting & content operations engine, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Geoffrey Mungai",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$8M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Techstars",
      "Private Angels"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Copywriting & Content Operations Engine with +45.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in San Francisco, CA with 25+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "deepl-se",
    "slug": "deepl-se",
    "name": "DeepL SE",
    "org": "DeepL SE Inc.",
    "logoColor": "#F59E0B",
    "logoText": "DEE",
    "category": "Enterprise & Productivity",
    "rank": 99,
    "rankDelta": "+3",
    "valuation": "$2.0B",
    "valuationNum": 2000,
    "funding": "$420M",
    "fundingNum": 420,
    "growthRate": "+22.0%",
    "growthNum": 22,
    "marketSignal": "Strong",
    "marketSignalDetail": "European Language AI Powerhouse",
    "headquarters": "Cologne, Germany",
    "foundedYear": 2017,
    "teamSize": "500+",
    "hiringVelocity": "High (+35 open roles)",
    "webVisits": "78M / mo",
    "website": "https://deepl.com",
    "shortDescription": "Neural translation systems outperforming generalist models across formatting retention and terminology adherence.",
    "fullDescription": "DeepL SE is a high-growth AI enterprise operating in the Enterprise & Productivity sector. Recognized across industry benchmarks for european language ai powerhouse, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Jaroslaw Kutylowski",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$420M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Index Ventures",
      "IVP",
      "World Innovation Lab"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "European Language AI Powerhouse with +22.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in Cologne, Germany with 500+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  },
  {
    "id": "ai2-allen-institute-for-ai-",
    "slug": "ai2-allen-institute-for-ai-",
    "name": "Ai2 (Allen Institute for AI)",
    "org": "Ai2 (Allen Institute for AI) Inc.",
    "logoColor": "#EC4899",
    "logoText": "AI2",
    "category": "Foundation Models",
    "rank": 100,
    "rankDelta": "+2",
    "valuation": "Non-Profit / Research",
    "valuationNum": 500,
    "funding": "$120M",
    "fundingNum": 120,
    "growthRate": "+38.0%",
    "growthNum": 38,
    "marketSignal": "Strong",
    "marketSignalDetail": "Open Language Model (OLMo) Scientific Pioneer",
    "headquarters": "Seattle, WA",
    "foundedYear": 2014,
    "teamSize": "200+",
    "hiringVelocity": "Moderate (+15 open roles)",
    "webVisits": "6M / mo",
    "website": "https://allenai.org",
    "shortDescription": "Non-profit research institute dedicated to open, transparent frontier AI research with OLMo and open datasets.",
    "fullDescription": "Ai2 (Allen Institute for AI) is a high-growth AI enterprise operating in the Foundation Models sector. Recognized across industry benchmarks for open language model (olmo) scientific pioneer, serving developers and enterprise clients globally.",
    "leadership": [
      {
        "name": "Oren Etzioni",
        "role": "CEO / Founder"
      },
      {
        "name": "Core Team",
        "role": "Head of Engineering"
      }
    ],
    "latestRound": {
      "round": "Venture Growth",
      "amount": "$120M",
      "date": "2024",
      "source": "Regulatory Disclosures & Norgard X"
    },
    "majorInvestors": [
      "Paul G. Allen Estate",
      "National Science Foundation"
    ],
    "signals": [
      {
        "type": "Growth",
        "text": "Open Language Model (OLMo) Scientific Pioneer with +38.0% momentum"
      },
      {
        "type": "Scale",
        "text": "Headquartered in Seattle, WA with 200+ staff"
      }
    ],
    "lastUpdated": "March 2026",
    "verificationStatus": "Verified Disclosed"
  }
];
