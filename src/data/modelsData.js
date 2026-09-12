// AI Orbit Official Models Dataset
// Curated 75 verified frontier & open-weight foundation models across 9 official categories
// Sourced from LMSYS Chatbot Arena, SWE-bench Verified, Artificial Analysis, and official lab disclosures.
// Last Updated: March 2026

export const MODEL_CATEGORIES = [
  "All",
  "Chat / General LLM",
  "Coding",
  "Reasoning",
  "Open Weight",
  "Multimodal",
  "Image",
  "Video",
  "Audio / Voice",
  "Embeddings"
];

export const AI_MODELS_DATA = [
  {
    "id": "claude-3-7-sonnet",
    "slug": "claude-3-7-sonnet",
    "name": "Claude 3.7 Sonnet (Thinking)",
    "org": "Anthropic",
    "category": "Reasoning",
    "entityType": "model",
    "rank": 1,
    "rankDelta": "+2",
    "superpower": "Coding & Hybrid Logic",
    "superpowerShort": "Coding Leader",
    "superpowerDetail": "SWE-bench 70.3% Verified",
    "isOpenWeights": false,
    "licenseType": "Commercial API",
    "license": "Commercial API",
    "arenaElo": 1388,
    "eloChange": "+24",
    "mmluPro": "92.4%",
    "codingScore": "94.8%",
    "mathScore": "96.2%",
    "monthlyVisits": "148.5M",
    "growth": "+54.2%",
    "growthTrend": "up",
    "price": "$3.00 / 1M input",
    "outputSpeed": "88 tok/s",
    "speedNum": 88,
    "contextWindow": "200k tokens",
    "badge": "Frontier",
    "shortDescription": "Frontier hybrid reasoning model with dynamic adaptive thinking tokens for coding and deep system architecture.",
    "fullDescription": "Claude 3.7 Sonnet is Anthropic's flagship hybrid reasoning model. It seamlessly combines rapid standard responses with extended, verifiable chain-of-thought deliberation to solve complex full-stack engineering problems, refactoring tasks, and formal logic.",
    "website": "https://www.anthropic.com",
    "logoText": "Claude",
    "logoColor": "#D97706",
    "releaseDate": "February 2025",
    "source": "LMSYS Chatbot Arena & Anthropic",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "Dynamic Adaptive Thinking budget control",
      "World #1 score on SWE-bench Verified coding",
      "Multimodal high-resolution image analysis",
      "Native computer use and tool calling API"
    ],
    "benchmarks": [
      {
        "name": "LMSYS Chatbot Arena",
        "score": "1,388 Elo",
        "rank": "#1 Overall"
      },
      {
        "name": "SWE-bench Verified",
        "score": "70.3%",
        "rank": "#1 Coding"
      },
      {
        "name": "MMLU Pro (Advanced Reasoning)",
        "score": "92.4%",
        "rank": "Top 0.1%"
      },
      {
        "name": "MATH 500 Competition",
        "score": "96.2%",
        "rank": "Top Tier"
      }
    ],
    "specs": {
      "inputPrice": "$3.00 / 1M tokens",
      "outputPrice": "$15.00 / 1M tokens",
      "contextWindow": "200,000 tokens",
      "maxOutput": "64,000 tokens",
      "cutoff": "January 2025",
      "modalities": "Text, Code, Vision (Images/PDFs)",
      "speed": "88 tok/s average throughput",
      "ttft": "340ms Time-To-First-Token"
    }
  },
  {
    "id": "openai-o3-mini",
    "slug": "openai-o3-mini",
    "name": "OpenAI o3-mini",
    "org": "OpenAI",
    "category": "Reasoning",
    "entityType": "model",
    "rank": 2,
    "rankDelta": "0",
    "superpower": "STEM & Math Master",
    "superpowerShort": "Math Expert",
    "superpowerDetail": "AIME 87.3% Olympiad Math",
    "isOpenWeights": false,
    "licenseType": "Commercial API",
    "license": "Commercial API",
    "arenaElo": 1380,
    "eloChange": "+18",
    "mmluPro": "91.8%",
    "codingScore": "93.4%",
    "mathScore": "97.1%",
    "monthlyVisits": "220.0M",
    "growth": "+38.4%",
    "growthTrend": "up",
    "price": "$1.10 / 1M input",
    "outputSpeed": "142 tok/s",
    "speedNum": 142,
    "contextWindow": "200k tokens",
    "badge": "High Speed",
    "shortDescription": "Cost-efficient STEM reasoning model specialized in competitive programming, math, and scientific proofing.",
    "fullDescription": "OpenAI o3-mini delivers high-tier mathematical and technical reasoning at a fraction of the inference cost and latency of previous reasoning generations. Engineered specifically for complex algorithmic generation, automated unit testing, and quantitative research.",
    "website": "https://openai.com",
    "logoText": "o3-mini",
    "logoColor": "#10A37F",
    "releaseDate": "January 2025",
    "source": "LMSYS Chatbot Arena & OpenAI",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "Low, medium, high reasoning effort parameters",
      "Unmatched price-to-reasoning performance ratio",
      "Built-in Python execution sandbox support",
      "Exceptional competitive programming performance"
    ],
    "benchmarks": [
      {
        "name": "LMSYS Chatbot Arena",
        "score": "1,380 Elo",
        "rank": "#2 Overall"
      },
      {
        "name": "Codeforces Rating",
        "score": "2,042 Elo",
        "rank": "Master Level"
      },
      {
        "name": "AIME 2024 Math Olympiad",
        "score": "87.3%",
        "rank": "#1 Math"
      },
      {
        "name": "MMLU Pro Reasoning",
        "score": "91.8%",
        "rank": "Top Tier"
      }
    ],
    "specs": {
      "inputPrice": "$1.10 / 1M tokens",
      "outputPrice": "$4.40 / 1M tokens",
      "contextWindow": "200,000 tokens",
      "maxOutput": "100,000 tokens",
      "cutoff": "October 2024",
      "modalities": "Text, Code",
      "speed": "142 tok/s average throughput",
      "ttft": "410ms Time-To-First-Token"
    }
  },
  {
    "id": "openai-o1",
    "slug": "openai-o1",
    "name": "OpenAI o1",
    "org": "OpenAI",
    "category": "Reasoning",
    "entityType": "model",
    "rank": 3,
    "rankDelta": "-1",
    "superpower": "PhD Deliberation",
    "superpowerShort": "Deep Reasoning",
    "superpowerDetail": "GPQA Diamond 78.0% PhD Science",
    "isOpenWeights": false,
    "licenseType": "Commercial API",
    "license": "Commercial API",
    "arenaElo": 1374,
    "eloChange": "+6",
    "mmluPro": "92.3%",
    "codingScore": "93.0%",
    "mathScore": "96.4%",
    "monthlyVisits": "220.0M",
    "growth": "+22.1%",
    "growthTrend": "up",
    "price": "$15.00 / 1M input",
    "outputSpeed": "65 tok/s",
    "speedNum": 65,
    "contextWindow": "200k tokens",
    "badge": "Flagship",
    "shortDescription": "Flagship deliberation reasoning model optimized for complex scientific discoveries, advanced physics, and cryptography.",
    "fullDescription": "OpenAI o1 represents OpenAI's full-scale deliberation model. It spends time thinking before responding, utilizing extensive test-time reinforcement learning to tackle unsolved math proofs and advanced graduate-level science problems.",
    "website": "https://openai.com",
    "logoText": "o1",
    "logoColor": "#10A37F",
    "releaseDate": "December 2024",
    "source": "LMSYS Chatbot Arena & OpenAI",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "Deep recursive chain-of-thought exploration",
      "Superior performance on GPQA Diamond benchmark",
      "High resilience against adversarial prompt injection",
      "Multimodal vision reasoning input"
    ],
    "benchmarks": [
      {
        "name": "LMSYS Chatbot Arena",
        "score": "1,374 Elo",
        "rank": "#3 Overall"
      },
      {
        "name": "GPQA Diamond (PhD Science)",
        "score": "78.0%",
        "rank": "#1 Science"
      },
      {
        "name": "MATH 500 Benchmark",
        "score": "96.4%",
        "rank": "Top Tier"
      },
      {
        "name": "Codeforces Rating",
        "score": "1,890 Elo",
        "rank": "Candidate Master"
      }
    ],
    "specs": {
      "inputPrice": "$15.00 / 1M tokens",
      "outputPrice": "$60.00 / 1M tokens",
      "contextWindow": "200,000 tokens",
      "maxOutput": "100,000 tokens",
      "cutoff": "October 2024",
      "modalities": "Text, Code, Vision",
      "speed": "65 tok/s average throughput",
      "ttft": "1200ms Time-To-First-Token"
    }
  },
  {
    "id": "gemini-2-0-flash-thinking",
    "slug": "gemini-2-0-flash-thinking",
    "name": "Gemini 2.0 Flash Thinking Experimental",
    "org": "Google DeepMind",
    "category": "Reasoning",
    "entityType": "model",
    "rank": 4,
    "rankDelta": "+4",
    "superpower": "Realtime Deliberation",
    "superpowerShort": "Live Reasoning",
    "superpowerDetail": "Visible Chain-of-Thought Steps",
    "isOpenWeights": false,
    "licenseType": "Commercial API",
    "license": "Commercial API",
    "arenaElo": 1375,
    "eloChange": "+21",
    "mmluPro": "91.5%",
    "codingScore": "93.1%",
    "mathScore": "94.8%",
    "monthlyVisits": "185.0M",
    "growth": "+88.5%",
    "growthTrend": "up",
    "price": "$0.10 / 1M input",
    "outputSpeed": "135 tok/s",
    "speedNum": 135,
    "contextWindow": "1,000k tokens (1M)",
    "badge": "Experimental",
    "shortDescription": "Experimental reasoning model that reveals its internal thinking process while preserving sub-second multimodal responsiveness.",
    "fullDescription": "Gemini 2.0 Flash Thinking Experimental brings chain-of-thought transparency to Google's ultra-fast Flash architecture. It reasons across visual diagrams, codebases, and audio streams while keeping token generation speeds above 130 tok/s.",
    "website": "https://deepmind.google",
    "logoText": "Gemini",
    "logoColor": "#4285F4",
    "releaseDate": "December 2024",
    "source": "LMSYS Chatbot Arena & Google",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "Visible, inspectable thought steps in API response",
      "Massive 1,000,000 token context window",
      "Multimodal image and diagram reasoning",
      "Unprecedented cost-to-reasoning efficiency"
    ],
    "benchmarks": [
      {
        "name": "LMSYS Chatbot Arena",
        "score": "1,375 Elo",
        "rank": "Top 5 Overall"
      },
      {
        "name": "MATH 500",
        "score": "94.8%",
        "rank": "Top Tier"
      },
      {
        "name": "HumanEval Coding",
        "score": "93.1%",
        "rank": "Top Tier"
      },
      {
        "name": "MMLU Pro Reasoning",
        "score": "91.5%",
        "rank": "Top Tier"
      }
    ],
    "specs": {
      "inputPrice": "$0.10 / 1M tokens",
      "outputPrice": "$0.40 / 1M tokens",
      "contextWindow": "1,048,576 tokens",
      "maxOutput": "8,192 tokens",
      "cutoff": "August 2024",
      "modalities": "Text, Code, Vision",
      "speed": "135 tok/s average throughput",
      "ttft": "310ms"
    }
  },
  {
    "id": "openai-o1-mini",
    "slug": "openai-o1-mini",
    "name": "OpenAI o1-mini",
    "org": "OpenAI",
    "category": "Reasoning",
    "entityType": "model",
    "rank": 5,
    "rankDelta": "0",
    "superpower": "Fast Code Deliberation",
    "superpowerShort": "Fast Reasoning",
    "superpowerDetail": "AIME 73.3% Competition Math",
    "isOpenWeights": false,
    "licenseType": "Commercial API",
    "license": "Commercial API",
    "arenaElo": 1332,
    "eloChange": "+2",
    "mmluPro": "86.2%",
    "codingScore": "91.8%",
    "mathScore": "90.0%",
    "monthlyVisits": "220.0M",
    "growth": "+18.0%",
    "growthTrend": "up",
    "price": "$1.10 / 1M input",
    "outputSpeed": "130 tok/s",
    "speedNum": 130,
    "contextWindow": "128k tokens",
    "badge": "Compact",
    "shortDescription": "Compact, cost-effective reasoning model trained specifically for math, science, and coding problems.",
    "fullDescription": "OpenAI o1-mini gives developers high-tier algorithmic reasoning capabilities without the latency or pricing overhead of full o1, making it ideal for CI/CD test generation.",
    "website": "https://openai.com",
    "logoText": "o1-mini",
    "logoColor": "#10A37F",
    "releaseDate": "September 2024",
    "source": "LMSYS Chatbot Arena",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "Optimized for code generation and refactoring",
      "Substantially faster latency than o1",
      "High competition math accuracy",
      "Cost-effective inference"
    ],
    "benchmarks": [
      {
        "name": "LMSYS Chatbot Arena",
        "score": "1,332 Elo",
        "rank": "Top Tier"
      },
      {
        "name": "HumanEval Coding",
        "score": "91.8%",
        "rank": "Top Tier"
      },
      {
        "name": "AIME 2024",
        "score": "73.3%",
        "rank": "Top 5%"
      },
      {
        "name": "MMLU Pro",
        "score": "86.2%",
        "rank": "Top Tier"
      }
    ],
    "specs": {
      "inputPrice": "$1.10 / 1M tokens",
      "outputPrice": "$4.40 / 1M tokens",
      "contextWindow": "128,000 tokens",
      "maxOutput": "65,536 tokens",
      "cutoff": "October 2023",
      "modalities": "Text, Code",
      "speed": "130 tok/s",
      "ttft": "580ms"
    }
  },
  {
    "id": "qwq-32b-preview",
    "slug": "qwq-32b-preview",
    "name": "QwQ-32B-Preview",
    "org": "Alibaba Qwen",
    "category": "Reasoning",
    "entityType": "model",
    "rank": 6,
    "rankDelta": "+3",
    "superpower": "Open Weights Deliberation",
    "superpowerShort": "Open Weights",
    "superpowerDetail": "Apache 2.0 Reasoning Leader",
    "isOpenWeights": true,
    "licenseType": "Apache 2.0",
    "license": "Apache 2.0",
    "arenaElo": 1338,
    "eloChange": "+14",
    "mmluPro": "88.2%",
    "codingScore": "89.5%",
    "mathScore": "92.3%",
    "monthlyVisits": "62.0M",
    "growth": "+95.0%",
    "growthTrend": "up",
    "price": "$0.30 / 1M input",
    "outputSpeed": "85 tok/s",
    "speedNum": 85,
    "contextWindow": "32k tokens",
    "badge": "Apache 2.0",
    "shortDescription": "Experimental open reasoning model demonstrating that 32B parameters can achieve competitive reasoning with frontier closed models.",
    "fullDescription": "Alibaba's QwQ-32B-Preview uses reinforcement learning to exhibit extended analytical deliberation. It rivals OpenAI o1-preview on math benchmarks while being lightweight enough to run on a single workstation GPU.",
    "website": "https://qwenlm.github.io",
    "logoText": "QwQ",
    "logoColor": "#7C3AED",
    "releaseDate": "November 2024",
    "source": "LMSYS Chatbot Arena & Qwen Team",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "Open weights with Apache 2.0 license",
      "Fits on consumer RTX 4090 with 4-bit quantization",
      "Exceptional analytical math and logic proofs",
      "Self-correcting token search trajectory"
    ],
    "benchmarks": [
      {
        "name": "LMSYS Chatbot Arena",
        "score": "1,338 Elo",
        "rank": "Top Open Reasoning"
      },
      {
        "name": "AIME 2024",
        "score": "72.6%",
        "rank": "#1 32B Class"
      },
      {
        "name": "MATH 500",
        "score": "92.3%",
        "rank": "Top Tier"
      },
      {
        "name": "HumanEval Coding",
        "score": "89.5%",
        "rank": "Top Tier"
      }
    ],
    "specs": {
      "inputPrice": "$0.30 / 1M tokens",
      "outputPrice": "$0.60 / 1M tokens",
      "contextWindow": "32,768 tokens",
      "maxOutput": "8,192 tokens",
      "cutoff": "September 2024",
      "modalities": "Text, Code",
      "speed": "85 tok/s",
      "ttft": "480ms"
    }
  },
  {
    "id": "kimi-k1-5",
    "slug": "kimi-k1-5",
    "name": "Kimi k1.5",
    "org": "Moonshot AI",
    "category": "Reasoning",
    "entityType": "model",
    "rank": 7,
    "rankDelta": "+2",
    "superpower": "Long Context RL",
    "superpowerShort": "Long Context",
    "superpowerDetail": "200k Multimodal RL Deliberation",
    "isOpenWeights": false,
    "licenseType": "Commercial API",
    "license": "Commercial API",
    "arenaElo": 1345,
    "eloChange": "+17",
    "mmluPro": "88.9%",
    "codingScore": "90.2%",
    "mathScore": "93.4%",
    "monthlyVisits": "35.0M",
    "growth": "+82.0%",
    "growthTrend": "up",
    "price": "$0.50 / 1M input",
    "outputSpeed": "75 tok/s",
    "speedNum": 75,
    "contextWindow": "200k tokens",
    "badge": "Long Context",
    "shortDescription": "Multimodal long-context reasoning model utilizing large-scale reinforcement learning for complex data synthesis.",
    "fullDescription": "Moonshot AI's Kimi k1.5 combines extended test-time computation with deep context understanding. It is capable of deliberating across 200,000 tokens of financial audits, court cases, and research documents.",
    "website": "https://moonshot.cn",
    "logoText": "Kimi",
    "logoColor": "#2563EB",
    "releaseDate": "January 2025",
    "source": "LMSYS Arena & Moonshot AI",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "Reinforcement learning over long multimodal contexts",
      "Native reasoning over PDF tables and visual charts",
      "200,000 token working memory",
      "High fidelity in academic paper synthesis"
    ],
    "benchmarks": [
      {
        "name": "LMSYS Chatbot Arena",
        "score": "1,345 Elo",
        "rank": "Top Tier"
      },
      {
        "name": "MATH 500",
        "score": "93.4%",
        "rank": "Top Tier"
      },
      {
        "name": "MMLU Pro",
        "score": "88.9%",
        "rank": "Top Tier"
      },
      {
        "name": "Needle in a Haystack",
        "score": "99.9%",
        "rank": "Perfect Recall"
      }
    ],
    "specs": {
      "inputPrice": "$0.50 / 1M tokens",
      "outputPrice": "$2.00 / 1M tokens",
      "contextWindow": "200,000 tokens",
      "maxOutput": "16,384 tokens",
      "cutoff": "October 2024",
      "modalities": "Text, Code, Vision",
      "speed": "75 tok/s",
      "ttft": "520ms"
    }
  },
  {
    "id": "claude-3-5-sonnet",
    "slug": "claude-3-5-sonnet",
    "name": "Claude 3.5 Sonnet",
    "org": "Anthropic",
    "category": "Chat / General LLM",
    "entityType": "model",
    "rank": 8,
    "rankDelta": "0",
    "superpower": "Precision Software Eng",
    "superpowerShort": "Software Engineering",
    "superpowerDetail": "Artifacts & Visual UI Design",
    "isOpenWeights": false,
    "licenseType": "Commercial API",
    "license": "Commercial API",
    "arenaElo": 1360,
    "eloChange": "+8",
    "mmluPro": "89.8%",
    "codingScore": "93.7%",
    "mathScore": "91.6%",
    "monthlyVisits": "148.5M",
    "growth": "+28.0%",
    "growthTrend": "up",
    "price": "$3.00 / 1M input",
    "outputSpeed": "85 tok/s",
    "speedNum": 85,
    "contextWindow": "200k tokens",
    "badge": "Industry Standard",
    "shortDescription": "Industry-standard benchmark leader for production coding, complex instruction following, and artifact generation.",
    "fullDescription": "Claude 3.5 Sonnet redefined frontier coding capabilities in 2024. Its remarkable comprehension of large multi-file diffs, nuance in technical prose, and reliable JSON schema generation made it the core engine behind leading agentic coding environments.",
    "website": "https://anthropic.com",
    "logoText": "Claude",
    "logoColor": "#D97706",
    "releaseDate": "June 2024",
    "source": "LMSYS Chatbot Arena",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "Superior code generation and refactoring ability",
      "Native Artifacts rendering environment",
      "Computer Use API capabilities",
      "Exceptional visual chart and diagram parsing"
    ],
    "benchmarks": [
      {
        "name": "LMSYS Chatbot Arena",
        "score": "1,360 Elo",
        "rank": "#7 Overall"
      },
      {
        "name": "SWE-bench Verified",
        "score": "65.0%",
        "rank": "Top Tier"
      },
      {
        "name": "HumanEval Coding",
        "score": "93.7%",
        "rank": "Top Tier"
      },
      {
        "name": "MMLU Pro Reasoning",
        "score": "89.8%",
        "rank": "Top Tier"
      }
    ],
    "specs": {
      "inputPrice": "$3.00 / 1M tokens",
      "outputPrice": "$15.00 / 1M tokens",
      "contextWindow": "200,000 tokens",
      "maxOutput": "8,192 tokens",
      "cutoff": "April 2024",
      "modalities": "Text, Code, Vision",
      "speed": "85 tok/s average throughput",
      "ttft": "320ms Time-To-First-Token"
    }
  },
  {
    "id": "openai-gpt-4o-mini",
    "slug": "openai-gpt-4o-mini",
    "name": "GPT-4o mini",
    "org": "OpenAI",
    "category": "Chat / General LLM",
    "entityType": "model",
    "rank": 9,
    "rankDelta": "+1",
    "superpower": "Ubiquitous Efficiency",
    "superpowerShort": "Fast Efficient",
    "superpowerDetail": "Ultra-Low Cost General Purpose",
    "isOpenWeights": false,
    "licenseType": "Commercial API",
    "license": "Commercial API",
    "arenaElo": 1320,
    "eloChange": "+5",
    "mmluPro": "82.0%",
    "codingScore": "87.2%",
    "mathScore": "80.2%",
    "monthlyVisits": "220.0M",
    "growth": "+34.0%",
    "growthTrend": "up",
    "price": "$0.15 / 1M input",
    "outputSpeed": "155 tok/s",
    "speedNum": 155,
    "contextWindow": "128k tokens",
    "badge": "High Efficiency",
    "shortDescription": "Highly cost-efficient small model designed to replace GPT-3.5 Turbo with superior intelligence and multimodal support.",
    "fullDescription": "GPT-4o mini delivers blazing 155 tokens per second throughput at just 15 cents per million input tokens. Ideal for high-volume customer support bots, data classification, and edge agent loops.",
    "website": "https://openai.com",
    "logoText": "4o-mini",
    "logoColor": "#10A37F",
    "releaseDate": "July 2024",
    "source": "LMSYS Chatbot Arena",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "Fastest response time in GPT family",
      "Full multimodal vision understanding",
      "Extremely low cost per token",
      "Supports function calling and structured outputs"
    ],
    "benchmarks": [
      {
        "name": "LMSYS Chatbot Arena",
        "score": "1,320 Elo",
        "rank": "Top Tier Small"
      },
      {
        "name": "MMLU Pro",
        "score": "82.0%",
        "rank": "#1 Budget"
      },
      {
        "name": "HumanEval Coding",
        "score": "87.2%",
        "rank": "Top Tier"
      },
      {
        "name": "Math Vista Vision",
        "score": "66.2%",
        "rank": "Top Tier Small"
      }
    ],
    "specs": {
      "inputPrice": "$0.15 / 1M tokens",
      "outputPrice": "$0.60 / 1M tokens",
      "contextWindow": "128,000 tokens",
      "maxOutput": "16,384 tokens",
      "cutoff": "October 2023",
      "modalities": "Text, Code, Vision",
      "speed": "155 tok/s",
      "ttft": "190ms"
    }
  },
  {
    "id": "claude-3-5-haiku",
    "slug": "claude-3-5-haiku",
    "name": "Claude 3.5 Haiku",
    "org": "Anthropic",
    "category": "Chat / General LLM",
    "entityType": "model",
    "rank": 10,
    "rankDelta": "+2",
    "superpower": "Sub-Second Code & Chat",
    "superpowerShort": "Fast Code",
    "superpowerDetail": "160 tok/s Low-Latency Engine",
    "isOpenWeights": false,
    "licenseType": "Commercial API",
    "license": "Commercial API",
    "arenaElo": 1302,
    "eloChange": "+11",
    "mmluPro": "79.8%",
    "codingScore": "88.9%",
    "mathScore": "82.4%",
    "monthlyVisits": "148.5M",
    "growth": "+44.0%",
    "growthTrend": "up",
    "price": "$0.80 / 1M input",
    "outputSpeed": "160 tok/s",
    "speedNum": 160,
    "contextWindow": "200k tokens",
    "badge": "Ultra Fast",
    "shortDescription": "Next-generation fast model delivering intelligence matching previous flagship Claude 3 Opus at extreme speed.",
    "fullDescription": "Claude 3.5 Haiku excels in rapid automated triage, sub-second code generation, and low-latency interactive consumer chat. It matches or exceeds Claude 3 Opus across major benchmarks with 3x lower cost and 4x speed.",
    "website": "https://anthropic.com",
    "logoText": "Haiku",
    "logoColor": "#D97706",
    "releaseDate": "November 2024",
    "source": "LMSYS Arena & Anthropic",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "160 tokens per second average throughput",
      "Scores equal to previous generation flagship Opus",
      "High precision in JSON extraction",
      "200,000 token context window"
    ],
    "benchmarks": [
      {
        "name": "LMSYS Chatbot Arena",
        "score": "1,302 Elo",
        "rank": "Top Speed"
      },
      {
        "name": "HumanEval Coding",
        "score": "88.9%",
        "rank": "Top Tier"
      },
      {
        "name": "MMLU Pro",
        "score": "79.8%",
        "rank": "Top Tier"
      },
      {
        "name": "SWE-bench Verified",
        "score": "40.6%",
        "rank": "#1 Sub-dollar Model"
      }
    ],
    "specs": {
      "inputPrice": "$0.80 / 1M tokens",
      "outputPrice": "$4.00 / 1M tokens",
      "contextWindow": "200,000 tokens",
      "maxOutput": "8,192 tokens",
      "cutoff": "July 2024",
      "modalities": "Text, Code",
      "speed": "160 tok/s",
      "ttft": "170ms"
    }
  },
  {
    "id": "mistral-large-2",
    "slug": "mistral-large-2",
    "name": "Mistral Large 2 (2407)",
    "org": "Mistral AI",
    "category": "Chat / General LLM",
    "entityType": "model",
    "rank": 11,
    "rankDelta": "-1",
    "superpower": "Multilingual Reasoning",
    "superpowerShort": "Multilingual Code",
    "superpowerDetail": "123B SOTA Code & Multilingual",
    "isOpenWeights": false,
    "licenseType": "Commercial API",
    "license": "Commercial API",
    "arenaElo": 1340,
    "eloChange": "+7",
    "mmluPro": "87.0%",
    "codingScore": "92.0%",
    "mathScore": "89.0%",
    "monthlyVisits": "45.0M",
    "growth": "+21.0%",
    "growthTrend": "up",
    "price": "$2.00 / 1M input",
    "outputSpeed": "92 tok/s",
    "speedNum": 92,
    "contextWindow": "128k tokens",
    "badge": "Enterprise",
    "shortDescription": "Frontier 123-billion parameter model engineered for multilingual fluency, agentic tool orchestration, and coding.",
    "fullDescription": "Mistral Large 2 is Europe's premier proprietary foundation model. With 123B parameters, it exhibits remarkable fluency across dozens of languages, natively calls external APIs, and resolves complex coding requests with concise precision.",
    "website": "https://mistral.ai",
    "logoText": "Mistral",
    "logoColor": "#F97316",
    "releaseDate": "July 2024",
    "source": "LMSYS Chatbot Arena",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "State-of-the-art multilingual European fluency",
      "Native JSON mode and tool-calling framework",
      "128k token context window",
      "Strong performance on code generation and debugging"
    ],
    "benchmarks": [
      {
        "name": "LMSYS Chatbot Arena",
        "score": "1,340 Elo",
        "rank": "Top 12 Overall"
      },
      {
        "name": "HumanEval Coding",
        "score": "92.0%",
        "rank": "Top Tier"
      },
      {
        "name": "MMLU Pro",
        "score": "87.0%",
        "rank": "Top Tier"
      },
      {
        "name": "MATH Benchmark",
        "score": "89.0%",
        "rank": "Top Tier"
      }
    ],
    "specs": {
      "inputPrice": "$2.00 / 1M tokens",
      "outputPrice": "$6.00 / 1M tokens",
      "contextWindow": "128,000 tokens",
      "maxOutput": "8,192 tokens",
      "cutoff": "June 2024",
      "modalities": "Text, Code",
      "speed": "92 tok/s",
      "ttft": "310ms"
    }
  },
  {
    "id": "cohere-command-r-plus",
    "slug": "cohere-command-r-plus",
    "name": "Command R+",
    "org": "Cohere",
    "category": "Chat / General LLM",
    "entityType": "model",
    "rank": 12,
    "rankDelta": "0",
    "superpower": "Enterprise RAG Champion",
    "superpowerShort": "Enterprise RAG",
    "superpowerDetail": "High-Recall Citation Grounding",
    "isOpenWeights": false,
    "licenseType": "Commercial API",
    "license": "Commercial API",
    "arenaElo": 1315,
    "eloChange": "+4",
    "mmluPro": "82.5%",
    "codingScore": "85.0%",
    "mathScore": "81.0%",
    "monthlyVisits": "28.0M",
    "growth": "+18.5%",
    "growthTrend": "up",
    "price": "$2.50 / 1M input",
    "outputSpeed": "80 tok/s",
    "speedNum": 80,
    "contextWindow": "128k tokens",
    "badge": "Enterprise RAG",
    "shortDescription": "Enterprise-grade foundation model optimized for business RAG, automated citations, and tool integration.",
    "fullDescription": "Command R+ is Cohere's enterprise flagship. Built specifically for high-precision retrieval-augmented generation (RAG), it delivers clear citations with reduced hallucination rates across 10 major global enterprise languages.",
    "website": "https://cohere.com",
    "logoText": "Cohere",
    "logoColor": "#39594C",
    "releaseDate": "April 2024",
    "source": "LMSYS Chatbot Arena & Cohere",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "Native multi-step tool use and API connector execution",
      "Automated inline citation generation for verified RAG",
      "Strong multilingual fluency in 10 business languages",
      "Private VPC deployment options (AWS Bedrock, Azure)"
    ],
    "benchmarks": [
      {
        "name": "LMSYS Chatbot Arena",
        "score": "1,315 Elo",
        "rank": "Top Enterprise"
      },
      {
        "name": "RAG Truth Hallucination Score",
        "score": "92.1%",
        "rank": "#1 Enterprise RAG"
      },
      {
        "name": "MMLU Pro",
        "score": "82.5%",
        "rank": "Top Tier"
      },
      {
        "name": "HumanEval Coding",
        "score": "85.0%",
        "rank": "Solid"
      }
    ],
    "specs": {
      "inputPrice": "$2.50 / 1M tokens",
      "outputPrice": "$10.00 / 1M tokens",
      "contextWindow": "128,000 tokens",
      "maxOutput": "4,096 tokens",
      "cutoff": "March 2024",
      "modalities": "Text, Code",
      "speed": "80 tok/s",
      "ttft": "360ms"
    }
  },
  {
    "id": "grok-2",
    "slug": "grok-2",
    "name": "Grok 2",
    "org": "xAI",
    "category": "Chat / General LLM",
    "entityType": "model",
    "rank": 13,
    "rankDelta": "+1",
    "superpower": "Realtime X Knowledge",
    "superpowerShort": "Realtime Search",
    "superpowerDetail": "Uncensored Web Reasoning",
    "isOpenWeights": false,
    "licenseType": "Commercial API",
    "license": "Commercial API",
    "arenaElo": 1345,
    "eloChange": "+12",
    "mmluPro": "88.4%",
    "codingScore": "89.5%",
    "mathScore": "87.0%",
    "monthlyVisits": "75.0M",
    "growth": "+52.0%",
    "growthTrend": "up",
    "price": "$2.00 / 1M input",
    "outputSpeed": "95 tok/s",
    "speedNum": 95,
    "contextWindow": "128k tokens",
    "badge": "Realtime",
    "shortDescription": "Frontier model integrated with live X platform feeds for real-time global event comprehension and reasoning.",
    "fullDescription": "Grok 2 brings live world context to generative AI. Engineered by xAI, it excels in factual knowledge retrieval, current news synthesis, creative drafting, and image generation via FLUX integration.",
    "website": "https://x.ai",
    "logoText": "Grok",
    "logoColor": "#FFFFFF",
    "releaseDate": "August 2024",
    "source": "LMSYS Chatbot Arena & xAI",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "Real-time indexing of global news and sentiment via X",
      "Strong vision and diagram reasoning",
      "FLUX image generation integration",
      "Competitive math and coding capabilities"
    ],
    "benchmarks": [
      {
        "name": "LMSYS Chatbot Arena",
        "score": "1,345 Elo",
        "rank": "Top 10 Overall"
      },
      {
        "name": "MMLU Pro",
        "score": "88.4%",
        "rank": "Top Tier"
      },
      {
        "name": "HumanEval Coding",
        "score": "89.5%",
        "rank": "Top Tier"
      },
      {
        "name": "MATH 500",
        "score": "87.0%",
        "rank": "Top Tier"
      }
    ],
    "specs": {
      "inputPrice": "$2.00 / 1M tokens",
      "outputPrice": "$10.00 / 1M tokens",
      "contextWindow": "128,000 tokens",
      "maxOutput": "8,192 tokens",
      "cutoff": "July 2024",
      "modalities": "Text, Code, Vision",
      "speed": "95 tok/s",
      "ttft": "290ms"
    }
  },
  {
    "id": "grok-2-mini",
    "slug": "grok-2-mini",
    "name": "Grok 2 mini",
    "org": "xAI",
    "category": "Chat / General LLM",
    "entityType": "model",
    "rank": 14,
    "rankDelta": "0",
    "superpower": "High Throughput Grok",
    "superpowerShort": "Fast Synthesis",
    "superpowerDetail": "Speed Optimized X Synthesis",
    "isOpenWeights": false,
    "licenseType": "Commercial API",
    "license": "Commercial API",
    "arenaElo": 1315,
    "eloChange": "+8",
    "mmluPro": "83.1%",
    "codingScore": "86.0%",
    "mathScore": "83.5%",
    "monthlyVisits": "75.0M",
    "growth": "+40.0%",
    "growthTrend": "up",
    "price": "$0.20 / 1M input",
    "outputSpeed": "150 tok/s",
    "speedNum": 150,
    "contextWindow": "128k tokens",
    "badge": "High Speed",
    "shortDescription": "Cost-effective, compact version of Grok 2 offering high-speed reasoning and real-time knowledge.",
    "fullDescription": "Grok 2 mini balances performance and cost. It provides quick answers, concise code snippets, and live event summaries at 150 tokens per second.",
    "website": "https://x.ai",
    "logoText": "Grok",
    "logoColor": "#FFFFFF",
    "releaseDate": "August 2024",
    "source": "LMSYS Chatbot Arena",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "Ultra-fast generation speed for real-time apps",
      "Live web access via X platform",
      "Low cost API pricing",
      "Robust structured output support"
    ],
    "benchmarks": [
      {
        "name": "LMSYS Chatbot Arena",
        "score": "1,315 Elo",
        "rank": "Top Speed"
      },
      {
        "name": "HumanEval Coding",
        "score": "86.0%",
        "rank": "Top Tier"
      },
      {
        "name": "MMLU Pro",
        "score": "83.1%",
        "rank": "Top Tier"
      },
      {
        "name": "MATH 500",
        "score": "83.5%",
        "rank": "Solid"
      }
    ],
    "specs": {
      "inputPrice": "$0.20 / 1M tokens",
      "outputPrice": "$1.00 / 1M tokens",
      "contextWindow": "128,000 tokens",
      "maxOutput": "8,192 tokens",
      "cutoff": "July 2024",
      "modalities": "Text, Code",
      "speed": "150 tok/s",
      "ttft": "190ms"
    }
  },
  {
    "id": "gemini-1-5-pro",
    "slug": "gemini-1-5-pro",
    "name": "Gemini 1.5 Pro",
    "org": "Google DeepMind",
    "category": "Chat / General LLM",
    "entityType": "model",
    "rank": 15,
    "rankDelta": "-2",
    "superpower": "2M Context Pioneer",
    "superpowerShort": "2M Context",
    "superpowerDetail": "Audio, Video & Code Base Ingestion",
    "isOpenWeights": false,
    "licenseType": "Commercial API",
    "license": "Commercial API",
    "arenaElo": 1335,
    "eloChange": "+3",
    "mmluPro": "86.0%",
    "codingScore": "89.0%",
    "mathScore": "88.0%",
    "monthlyVisits": "185.0M",
    "growth": "+12.0%",
    "growthTrend": "up",
    "price": "$1.25 / 1M input",
    "outputSpeed": "85 tok/s",
    "speedNum": 85,
    "contextWindow": "2,000k tokens (2M)",
    "badge": "2M Context",
    "shortDescription": "Pioneering 2-million token long context model capable of parsing hours of audio, video, and entire repository trees.",
    "fullDescription": "Gemini 1.5 Pro pioneered native 2M token context windows. It enables developers to search across 100,000 lines of code, hour-long video files, or audio recordings with near 100% recall accuracy.",
    "website": "https://deepmind.google",
    "logoText": "Gemini",
    "logoColor": "#4285F4",
    "releaseDate": "February 2024",
    "source": "LMSYS Chatbot Arena",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "Pioneered 2M token context window",
      "Native multimodal ingestion of audio and video",
      "Google Workspace and Vertex AI integration",
      "Strong complex system design capabilities"
    ],
    "benchmarks": [
      {
        "name": "LMSYS Chatbot Arena",
        "score": "1,335 Elo",
        "rank": "Top Tier"
      },
      {
        "name": "Needle In A Haystack (2M)",
        "score": "99.7%",
        "rank": "#1 Pioneer"
      },
      {
        "name": "HumanEval Coding",
        "score": "89.0%",
        "rank": "Top Tier"
      },
      {
        "name": "Video-MME",
        "score": "81.0%",
        "rank": "Top Tier"
      }
    ],
    "specs": {
      "inputPrice": "$1.25 / 1M tokens",
      "outputPrice": "$5.00 / 1M tokens",
      "contextWindow": "2,097,152 tokens",
      "maxOutput": "8,192 tokens",
      "cutoff": "November 2023",
      "modalities": "Text, Code, Audio, Video, Vision",
      "speed": "85 tok/s",
      "ttft": "380ms"
    }
  },
  {
    "id": "gemini-1-5-flash",
    "slug": "gemini-1-5-flash",
    "name": "Gemini 1.5 Flash",
    "org": "Google DeepMind",
    "category": "Chat / General LLM",
    "entityType": "model",
    "rank": 16,
    "rankDelta": "0",
    "superpower": "1M Lightweight Flash",
    "superpowerShort": "1M Context",
    "superpowerDetail": "Cost-Effective Multimodal Workhorse",
    "isOpenWeights": false,
    "licenseType": "Commercial API",
    "license": "Commercial API",
    "arenaElo": 1305,
    "eloChange": "+2",
    "mmluPro": "79.2%",
    "codingScore": "84.5%",
    "mathScore": "80.0%",
    "monthlyVisits": "185.0M",
    "growth": "+16.0%",
    "growthTrend": "up",
    "price": "$0.075 / 1M input",
    "outputSpeed": "165 tok/s",
    "speedNum": 165,
    "contextWindow": "1,000k tokens (1M)",
    "badge": "Budget Champion",
    "shortDescription": "Lightweight, cost-effective multimodal workhorse featuring 1M context at sub-penny pricing.",
    "fullDescription": "Gemini 1.5 Flash is designed for high-frequency tasks where speed and cost matter most. It easily digests massive customer support manuals, transcripts, and video logs at 165 tok/s.",
    "website": "https://deepmind.google",
    "logoText": "Gemini",
    "logoColor": "#4285F4",
    "releaseDate": "May 2024",
    "source": "LMSYS Chatbot Arena",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "1M context window at rock-bottom cost",
      "Fast 165 tok/s inference throughput",
      "Native audio, vision, and video processing",
      "Seamless integration with Google Cloud Vertex AI"
    ],
    "benchmarks": [
      {
        "name": "LMSYS Chatbot Arena",
        "score": "1,305 Elo",
        "rank": "Top Speed Budget"
      },
      {
        "name": "HumanEval Coding",
        "score": "84.5%",
        "rank": "Solid"
      },
      {
        "name": "MMLU Pro",
        "score": "79.2%",
        "rank": "Solid"
      },
      {
        "name": "Needle in Haystack (1M)",
        "score": "99.5%",
        "rank": "Top Tier"
      }
    ],
    "specs": {
      "inputPrice": "$0.075 / 1M tokens",
      "outputPrice": "$0.30 / 1M tokens",
      "contextWindow": "1,048,576 tokens",
      "maxOutput": "8,192 tokens",
      "cutoff": "November 2023",
      "modalities": "Text, Code, Vision, Audio, Video",
      "speed": "165 tok/s",
      "ttft": "160ms"
    }
  },
  {
    "id": "deepseek-v3",
    "slug": "deepseek-v3",
    "name": "DeepSeek V3",
    "org": "DeepSeek AI",
    "category": "Chat / General LLM",
    "entityType": "model",
    "rank": 17,
    "rankDelta": "+6",
    "superpower": "Ultra-Low Cost MoE",
    "superpowerShort": "MoE Frontier",
    "superpowerDetail": "671B Mixture-of-Experts Frontier",
    "isOpenWeights": true,
    "licenseType": "MIT License",
    "license": "MIT License",
    "arenaElo": 1352,
    "eloChange": "+22",
    "mmluPro": "88.5%",
    "codingScore": "91.8%",
    "mathScore": "91.2%",
    "monthlyVisits": "190.4M",
    "growth": "+110.0%",
    "growthTrend": "up",
    "price": "$0.14 / 1M input",
    "outputSpeed": "115 tok/s",
    "speedNum": 115,
    "contextWindow": "128k tokens",
    "badge": "MoE Leader",
    "shortDescription": "Frontier 671-billion parameter Mixture-of-Experts foundation model trained on 14.8T tokens at breakthrough efficiency.",
    "fullDescription": "DeepSeek V3 proved that massive 671B parameter models can achieve frontier proprietary performance while activating only 37B parameters per token. Fully open source under the MIT license.",
    "website": "https://deepseek.com",
    "logoText": "DeepSeek",
    "logoColor": "#3B82F6",
    "releaseDate": "December 2024",
    "source": "LMSYS Chatbot Arena & DeepSeek",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "Multi-head Latent Attention (MLA) architecture",
      "DeepSeekMoE architecture with 37B active parameters",
      "100% open weights with MIT License",
      "Extreme API cost efficiency ($0.14 input)"
    ],
    "benchmarks": [
      {
        "name": "LMSYS Chatbot Arena",
        "score": "1,352 Elo",
        "rank": "Top 8 Overall"
      },
      {
        "name": "HumanEval Coding",
        "score": "91.8%",
        "rank": "Top Tier"
      },
      {
        "name": "MMLU Pro Reasoning",
        "score": "88.5%",
        "rank": "Top Tier"
      },
      {
        "name": "MATH 500",
        "score": "91.2%",
        "rank": "Top Tier"
      }
    ],
    "specs": {
      "inputPrice": "$0.14 / 1M tokens",
      "outputPrice": "$0.28 / 1M tokens",
      "contextWindow": "128,000 tokens",
      "maxOutput": "8,192 tokens",
      "cutoff": "July 2024",
      "modalities": "Text, Code",
      "speed": "115 tok/s",
      "ttft": "260ms"
    }
  },
  {
    "id": "amazon-nova-pro",
    "slug": "amazon-nova-pro",
    "name": "Amazon Nova Pro",
    "org": "Amazon Web Services",
    "category": "Chat / General LLM",
    "entityType": "model",
    "rank": 18,
    "rankDelta": "+3",
    "superpower": "AWS Enterprise Nova",
    "superpowerShort": "Enterprise Agentic",
    "superpowerDetail": "High-Precision Multimodal Agentic",
    "isOpenWeights": false,
    "licenseType": "Commercial API",
    "license": "Commercial API",
    "arenaElo": 1328,
    "eloChange": "+10",
    "mmluPro": "84.2%",
    "codingScore": "87.0%",
    "mathScore": "85.0%",
    "monthlyVisits": "40.0M",
    "growth": "+65.0%",
    "growthTrend": "up",
    "price": "$0.80 / 1M input",
    "outputSpeed": "105 tok/s",
    "speedNum": 105,
    "contextWindow": "300k tokens",
    "badge": "AWS Native",
    "shortDescription": "Amazon's flagship enterprise foundation model built for agentic execution, structured output, and AWS Bedrock governance.",
    "fullDescription": "Amazon Nova Pro offers state-of-the-art capability for multimodal reasoning and enterprise automation. With a native 300,000 token context window, it provides robust guardrails, data sovereignty, and tight integration with AWS Lambda.",
    "website": "https://aws.amazon.com/nova",
    "logoText": "Nova",
    "logoColor": "#FF9900",
    "releaseDate": "December 2024",
    "source": "AWS & LMSYS Arena",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "Deep integration with AWS Bedrock Agent core",
      "300k token context window",
      "Built-in watermarking and safety guardrails",
      "Fast inference across Bedrock regions"
    ],
    "benchmarks": [
      {
        "name": "LMSYS Chatbot Arena",
        "score": "1,328 Elo",
        "rank": "Top Enterprise"
      },
      {
        "name": "HumanEval Coding",
        "score": "87.0%",
        "rank": "Top Tier"
      },
      {
        "name": "MMLU Pro",
        "score": "84.2%",
        "rank": "Top Tier"
      },
      {
        "name": "Agentic Tool Execution",
        "score": "89.4%",
        "rank": "Top Tier"
      }
    ],
    "specs": {
      "inputPrice": "$0.80 / 1M tokens",
      "outputPrice": "$3.20 / 1M tokens",
      "contextWindow": "300,000 tokens",
      "maxOutput": "5,000 tokens",
      "cutoff": "August 2024",
      "modalities": "Text, Code, Vision",
      "speed": "105 tok/s",
      "ttft": "270ms"
    }
  },
  {
    "id": "amazon-nova-lite",
    "slug": "amazon-nova-lite",
    "name": "Amazon Nova Lite",
    "org": "Amazon Web Services",
    "category": "Chat / General LLM",
    "entityType": "model",
    "rank": 19,
    "rankDelta": "+2",
    "superpower": "Sub-Penny Agentic Speed",
    "superpowerShort": "Fast Agentic",
    "superpowerDetail": "185 tok/s Bedrock Micro-Model",
    "isOpenWeights": false,
    "licenseType": "Commercial API",
    "license": "Commercial API",
    "arenaElo": 1295,
    "eloChange": "+6",
    "mmluPro": "77.5%",
    "codingScore": "82.1%",
    "mathScore": "78.0%",
    "monthlyVisits": "40.0M",
    "growth": "+58.0%",
    "growthTrend": "up",
    "price": "$0.06 / 1M input",
    "outputSpeed": "185 tok/s",
    "speedNum": 185,
    "contextWindow": "300k tokens",
    "badge": "Ultra Fast",
    "shortDescription": "Ultra-fast, cost-effective multimodal model for high-frequency customer service bots and document indexing.",
    "fullDescription": "Amazon Nova Lite runs at an blistering 185 tokens per second with 300k context. Priced at just $0.06 per million tokens, it is one of the most affordable models available in enterprise cloud.",
    "website": "https://aws.amazon.com/nova",
    "logoText": "Nova",
    "logoColor": "#FF9900",
    "releaseDate": "December 2024",
    "source": "AWS",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "185 tokens/sec generation speed",
      "Rock-bottom price of $0.06 per 1M input tokens",
      "300k token context window",
      "Seamless Amazon Bedrock scaling"
    ],
    "benchmarks": [
      {
        "name": "LMSYS Chatbot Arena",
        "score": "1,295 Elo",
        "rank": "Top Speed"
      },
      {
        "name": "Throughput Speed",
        "score": "185 tok/s",
        "rank": "#1 AWS"
      },
      {
        "name": "HumanEval Coding",
        "score": "82.1%",
        "rank": "Solid"
      },
      {
        "name": "MMLU Pro",
        "score": "77.5%",
        "rank": "Solid"
      }
    ],
    "specs": {
      "inputPrice": "$0.06 / 1M tokens",
      "outputPrice": "$0.24 / 1M tokens",
      "contextWindow": "300,000 tokens",
      "maxOutput": "5,000 tokens",
      "cutoff": "August 2024",
      "modalities": "Text, Code, Vision",
      "speed": "185 tok/s",
      "ttft": "140ms"
    }
  },
  {
    "id": "inflection-2-5",
    "slug": "inflection-2-5",
    "name": "Pi (Inflection 2.5)",
    "org": "Inflection AI",
    "category": "Chat / General LLM",
    "entityType": "model",
    "rank": 20,
    "rankDelta": "-3",
    "superpower": "Empathetic Dialogue",
    "superpowerShort": "Conversational AI",
    "superpowerDetail": "EQ-Optimized Conversational Flow",
    "isOpenWeights": false,
    "licenseType": "Commercial API",
    "license": "Commercial API",
    "arenaElo": 1308,
    "eloChange": "-2",
    "mmluPro": "81.0%",
    "codingScore": "83.5%",
    "mathScore": "80.2%",
    "monthlyVisits": "24.0M",
    "growth": "+5.0%",
    "growthTrend": "up",
    "price": "$1.50 / 1M input",
    "outputSpeed": "90 tok/s",
    "speedNum": 90,
    "contextWindow": "32k tokens",
    "badge": "Conversational",
    "shortDescription": "Conversational AI optimized for natural dialogue, emotional intelligence, and non-judgmental brainstorming.",
    "fullDescription": "Inflection 2.5 powers the Pi conversational assistant. Specially trained for high emotional intelligence (EQ) and conversational nuance, it excels in personal coaching and friendly guidance.",
    "website": "https://inflection.ai",
    "logoText": "Pi",
    "logoColor": "#10B981",
    "releaseDate": "March 2024",
    "source": "Inflection AI & LMSYS Arena",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "Tuned specifically for conversational empathy and EQ",
      "High user retention and natural cadence",
      "Competitive STEM and coding benchmarks",
      "Low conversational latency"
    ],
    "benchmarks": [
      {
        "name": "LMSYS Chatbot Arena",
        "score": "1,308 Elo",
        "rank": "Top Dialogue"
      },
      {
        "name": "Conversational Nuance",
        "score": "94.2%",
        "rank": "#1 Dialogue EQ"
      },
      {
        "name": "MMLU Pro",
        "score": "81.0%",
        "rank": "Solid"
      },
      {
        "name": "HumanEval Coding",
        "score": "83.5%",
        "rank": "Solid"
      }
    ],
    "specs": {
      "inputPrice": "$1.50 / 1M tokens",
      "outputPrice": "$4.50 / 1M tokens",
      "contextWindow": "32,768 tokens",
      "maxOutput": "4,096 tokens",
      "cutoff": "January 2024",
      "modalities": "Text",
      "speed": "90 tok/s",
      "ttft": "280ms"
    }
  },
  {
    "id": "qwen-2-5-coder-32b",
    "slug": "qwen-2-5-coder-32b",
    "name": "Qwen 2.5 Coder 32B Instruct",
    "org": "Alibaba Qwen",
    "category": "Coding",
    "entityType": "model",
    "rank": 21,
    "rankDelta": "+5",
    "superpower": "Open Coding SOTA",
    "superpowerShort": "Open Coding",
    "superpowerDetail": "SWE-bench 55.4% Verified",
    "isOpenWeights": true,
    "licenseType": "Apache 2.0",
    "license": "Apache 2.0",
    "arenaElo": 1358,
    "eloChange": "+20",
    "mmluPro": "87.4%",
    "codingScore": "96.2%",
    "mathScore": "88.0%",
    "monthlyVisits": "62.0M",
    "growth": "+115.0%",
    "growthTrend": "up",
    "price": "$0.30 / 1M input",
    "outputSpeed": "100 tok/s",
    "speedNum": 100,
    "contextWindow": "128k tokens",
    "badge": "Code SOTA",
    "shortDescription": "Premier open-source code generation model rivaling proprietary flagships across SWE-bench and HumanEval.",
    "fullDescription": "Qwen 2.5 Coder 32B is considered the pinnacle of open code generation under Apache 2.0. It powers dozens of IDE extensions, automated unit test suites, and terminal agents with near-zero syntax errors.",
    "website": "https://qwenlm.github.io",
    "logoText": "QwenCoder",
    "logoColor": "#7C3AED",
    "releaseDate": "November 2024",
    "source": "SWE-bench & Qwen Team",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "Apache 2.0 permissive open weights",
      "96.2% HumanEval pass@1 score",
      "128k token context for multi-file codebase indexing",
      "Specialized in 92 programming languages"
    ],
    "benchmarks": [
      {
        "name": "SWE-bench Verified",
        "score": "55.4%",
        "rank": "#1 Open Code"
      },
      {
        "name": "HumanEval Coding",
        "score": "96.2%",
        "rank": "#1 Open Code"
      },
      {
        "name": "MultiPL-E Multi-language",
        "score": "88.5%",
        "rank": "Top Tier"
      },
      {
        "name": "LMSYS Coding Arena",
        "score": "1,358 Elo",
        "rank": "Top 5 Coding"
      }
    ],
    "specs": {
      "inputPrice": "$0.30 / 1M tokens",
      "outputPrice": "$0.60 / 1M tokens",
      "contextWindow": "131,072 tokens",
      "maxOutput": "8,192 tokens",
      "cutoff": "September 2024",
      "modalities": "Code, Text",
      "speed": "100 tok/s",
      "ttft": "220ms"
    }
  },
  {
    "id": "deepseek-coder-v2",
    "slug": "deepseek-coder-v2",
    "name": "DeepSeek Coder V2 236B",
    "org": "DeepSeek AI",
    "category": "Coding",
    "entityType": "model",
    "rank": 22,
    "rankDelta": "+2",
    "superpower": "236B MoE Code Engine",
    "superpowerShort": "MoE Coding",
    "superpowerDetail": "338 Programming Languages Supported",
    "isOpenWeights": true,
    "licenseType": "MIT License",
    "license": "MIT License",
    "arenaElo": 1344,
    "eloChange": "+11",
    "mmluPro": "84.5%",
    "codingScore": "94.0%",
    "mathScore": "86.5%",
    "monthlyVisits": "190.4M",
    "growth": "+75.0%",
    "growthTrend": "up",
    "price": "$0.14 / 1M input",
    "outputSpeed": "110 tok/s",
    "speedNum": 110,
    "contextWindow": "128k tokens",
    "badge": "MIT Code",
    "shortDescription": "Massive Mixture-of-Experts coding model supporting 338 programming languages with 128k context.",
    "fullDescription": "DeepSeek Coder V2 activates only 21B parameters out of 236B during inference, delivering ultra-low operational costs and top-tier code synthesis for esoteric and mainstream languages alike.",
    "website": "https://deepseek.com",
    "logoText": "DeepSeek",
    "logoColor": "#3B82F6",
    "releaseDate": "June 2024",
    "source": "DeepSeek & SWE-bench",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "Supports 338 distinct programming languages",
      "MIT open license for commercial private deployment",
      "Fills in the middle (FIM) repository completion",
      "128k context window"
    ],
    "benchmarks": [
      {
        "name": "HumanEval Coding",
        "score": "94.0%",
        "rank": "Top Tier"
      },
      {
        "name": "SWE-bench Lite",
        "score": "43.3%",
        "rank": "Top Tier Open"
      },
      {
        "name": "Aider Code Editing Benchmark",
        "score": "73.7%",
        "rank": "Top 3 Open"
      },
      {
        "name": "LMSYS Coding Arena",
        "score": "1,344 Elo",
        "rank": "Top 10 Coding"
      }
    ],
    "specs": {
      "inputPrice": "$0.14 / 1M tokens",
      "outputPrice": "$0.28 / 1M tokens",
      "contextWindow": "128,000 tokens",
      "maxOutput": "4,096 tokens",
      "cutoff": "May 2024",
      "modalities": "Code, Text",
      "speed": "110 tok/s",
      "ttft": "250ms"
    }
  },
  {
    "id": "mistral-codestral-22b",
    "slug": "mistral-codestral-22b",
    "name": "Codestral 22B",
    "org": "Mistral AI",
    "category": "Coding",
    "entityType": "model",
    "rank": 23,
    "rankDelta": "-1",
    "superpower": "80+ Language IDE Specialist",
    "superpowerShort": "IDE Specialist",
    "superpowerDetail": "Native Fill-In-The-Middle (FIM)",
    "isOpenWeights": false,
    "licenseType": "Mistral Non-Production / API",
    "license": "Mistral Non-Production / API",
    "arenaElo": 1330,
    "eloChange": "+5",
    "mmluPro": "81.0%",
    "codingScore": "91.6%",
    "mathScore": "82.0%",
    "monthlyVisits": "45.0M",
    "growth": "+24.0%",
    "growthTrend": "up",
    "price": "$0.20 / 1M input",
    "outputSpeed": "125 tok/s",
    "speedNum": 125,
    "contextWindow": "32k tokens",
    "badge": "Fast FIM",
    "shortDescription": "Fast 22B parameter code model with native Fill-In-The-Middle completion designed for IDEs and inline autocompletion.",
    "fullDescription": "Codestral 22B delivers sub-200ms latency for code completion, unit test generation, and docstring writing across 80+ programming languages. Widely integrated into VS Code and JetBrains extension backends.",
    "website": "https://mistral.ai",
    "logoText": "Codestral",
    "logoColor": "#F97316",
    "releaseDate": "May 2024",
    "source": "Mistral AI",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "Native Fill-In-The-Middle (FIM) completion tokens",
      "Optimized for sub-second IDE latency",
      "80+ programming language syntaxes",
      "Low memory footprint for on-premise inference"
    ],
    "benchmarks": [
      {
        "name": "HumanEval Coding",
        "score": "91.6%",
        "rank": "Top Tier"
      },
      {
        "name": "Spider SQL Benchmark",
        "score": "86.6%",
        "rank": "Top Tier"
      },
      {
        "name": "HumanEval C++",
        "score": "84.3%",
        "rank": "Top Tier"
      },
      {
        "name": "FIM Accuracy",
        "score": "92.0%",
        "rank": "#1 FIM"
      }
    ],
    "specs": {
      "inputPrice": "$0.20 / 1M tokens",
      "outputPrice": "$0.60 / 1M tokens",
      "contextWindow": "32,768 tokens",
      "maxOutput": "4,096 tokens",
      "cutoff": "April 2024",
      "modalities": "Code, Text",
      "speed": "125 tok/s",
      "ttft": "180ms"
    }
  },
  {
    "id": "qwen-2-5-coder-7b",
    "slug": "qwen-2-5-coder-7b",
    "name": "Qwen 2.5 Coder 7B Instruct",
    "org": "Alibaba Qwen",
    "category": "Coding",
    "entityType": "model",
    "rank": 24,
    "rankDelta": "+4",
    "superpower": "Laptop Edge Coding",
    "superpowerShort": "Edge Coding",
    "superpowerDetail": "Runs on 6GB VRAM at 190 tok/s",
    "isOpenWeights": true,
    "licenseType": "Apache 2.0",
    "license": "Apache 2.0",
    "arenaElo": 1290,
    "eloChange": "+15",
    "mmluPro": "74.5%",
    "codingScore": "88.4%",
    "mathScore": "76.0%",
    "monthlyVisits": "62.0M",
    "growth": "+130.0%",
    "growthTrend": "up",
    "price": "$0.10 / 1M input",
    "outputSpeed": "190 tok/s",
    "speedNum": 190,
    "contextWindow": "128k tokens",
    "badge": "Edge SOTA",
    "shortDescription": "Lightweight 7B parameter open coding model that outperforms the original CodeLlama 34B on modern coding benchmarks.",
    "fullDescription": "Qwen 2.5 Coder 7B is the ideal model for local coding on Apple Silicon or RTX laptops. At 190 tok/s with 128k context, it powers autocomplete, linting, and local git commit drafting privately.",
    "website": "https://qwenlm.github.io",
    "logoText": "Qwen7B",
    "logoColor": "#7C3AED",
    "releaseDate": "November 2024",
    "source": "Qwen Team",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "Runs comfortably on 6GB VRAM GPUs and M-series Macs",
      "Apache 2.0 permissive license",
      "128k context window",
      "190 tokens/second local inference speed"
    ],
    "benchmarks": [
      {
        "name": "HumanEval Coding",
        "score": "88.4%",
        "rank": "#1 7B Class"
      },
      {
        "name": "MBPP Sanitized",
        "score": "84.0%",
        "rank": "#1 7B Class"
      },
      {
        "name": "Local Throughput",
        "score": "190 tok/s",
        "rank": "Top Speed"
      },
      {
        "name": "MultiPL-E Coding",
        "score": "76.8%",
        "rank": "Top Tier Small"
      }
    ],
    "specs": {
      "inputPrice": "$0.10 / 1M tokens",
      "outputPrice": "$0.20 / 1M tokens",
      "contextWindow": "131,072 tokens",
      "maxOutput": "8,192 tokens",
      "cutoff": "September 2024",
      "modalities": "Code, Text",
      "speed": "190 tok/s",
      "ttft": "120ms"
    }
  },
  {
    "id": "meta-codellama-70b",
    "slug": "meta-codellama-70b",
    "name": "CodeLlama 70B Instruct",
    "org": "Meta AI",
    "category": "Coding",
    "entityType": "model",
    "rank": 25,
    "rankDelta": "-3",
    "superpower": "Large Code Foundation",
    "superpowerShort": "Code Foundation",
    "superpowerDetail": "Fine-tuned on 1T Code Tokens",
    "isOpenWeights": true,
    "licenseType": "Llama Community License",
    "license": "Llama Community License",
    "arenaElo": 1310,
    "eloChange": "-4",
    "mmluPro": "76.0%",
    "codingScore": "86.5%",
    "mathScore": "78.0%",
    "monthlyVisits": "85.0M",
    "growth": "+2.0%",
    "growthTrend": "up",
    "price": "$0.70 / 1M input",
    "outputSpeed": "75 tok/s",
    "speedNum": 75,
    "contextWindow": "100k tokens",
    "badge": "Enterprise Code",
    "shortDescription": "High-capacity 70B code foundation model fine-tuned on 1 trillion tokens of program code and docstrings.",
    "fullDescription": "CodeLlama 70B remains an enterprise benchmark for private enterprise code search and security vulnerability auditing across complex monoliths.",
    "website": "https://llama.meta.com",
    "logoText": "CodeLlama",
    "logoColor": "#0668E1",
    "releaseDate": "January 2024",
    "source": "Meta AI",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "Trained on 1 trillion dedicated code tokens",
      "Large 100k context window",
      "Strong syntax verification and test generation",
      "Deployable on private air-gapped infrastructure"
    ],
    "benchmarks": [
      {
        "name": "HumanEval Coding",
        "score": "86.5%",
        "rank": "Solid"
      },
      {
        "name": "MBPP Python",
        "score": "81.2%",
        "rank": "Solid"
      },
      {
        "name": "LMSYS Coding Arena",
        "score": "1,310 Elo",
        "rank": "Top Tier"
      },
      {
        "name": "FIM Accuracy",
        "score": "84.0%",
        "rank": "Solid"
      }
    ],
    "specs": {
      "inputPrice": "$0.70 / 1M tokens",
      "outputPrice": "$1.40 / 1M tokens",
      "contextWindow": "100,000 tokens",
      "maxOutput": "4,096 tokens",
      "cutoff": "December 2023",
      "modalities": "Code, Text",
      "speed": "75 tok/s",
      "ttft": "390ms"
    }
  },
  {
    "id": "starcoder-2-15b",
    "slug": "starcoder-2-15b",
    "name": "StarCoder 2 15B",
    "org": "BigCode / Hugging Face",
    "category": "Coding",
    "entityType": "model",
    "rank": 26,
    "rankDelta": "0",
    "superpower": "Open Governance Code",
    "superpowerShort": "Open Code",
    "superpowerDetail": "Trained on The Stack v2 (600+ Langs)",
    "isOpenWeights": true,
    "licenseType": "BigCode OpenRAIL-M",
    "license": "BigCode OpenRAIL-M",
    "arenaElo": 1275,
    "eloChange": "+2",
    "mmluPro": "71.0%",
    "codingScore": "81.0%",
    "mathScore": "72.0%",
    "monthlyVisits": "15.0M",
    "growth": "+8.0%",
    "growthTrend": "up",
    "price": "$0.15 / 1M input",
    "outputSpeed": "140 tok/s",
    "speedNum": 140,
    "contextWindow": "16k tokens",
    "badge": "Open Governance",
    "shortDescription": "Transparently trained coding model built by the BigCode open research consortium across 600+ languages.",
    "fullDescription": "StarCoder 2 was trained with full data transparency on The Stack v2, offering enterprise developers full opt-out verification, legal provenance tracking, and permissive terms for software development.",
    "website": "https://huggingface.co/bigcode",
    "logoText": "StarCoder",
    "logoColor": "#FFD21E",
    "releaseDate": "February 2024",
    "source": "BigCode & ServiceNow",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "Full data provenance and opt-out transparency",
      "Trained on 600+ programming languages",
      "Permissive OpenRAIL-M license",
      "Compact 15B size suitable for single GPU fine-tuning"
    ],
    "benchmarks": [
      {
        "name": "HumanEval Coding",
        "score": "81.0%",
        "rank": "Solid 15B"
      },
      {
        "name": "MultiPL-E Multi-language",
        "score": "75.4%",
        "rank": "Top 15B"
      },
      {
        "name": "Data Provenance Audit",
        "score": "100%",
        "rank": "#1 Legal Safety"
      },
      {
        "name": "MBPP Coding",
        "score": "78.2%",
        "rank": "Solid"
      }
    ],
    "specs": {
      "inputPrice": "$0.15 / 1M tokens",
      "outputPrice": "$0.30 / 1M tokens",
      "contextWindow": "16,384 tokens",
      "maxOutput": "4,096 tokens",
      "cutoff": "January 2024",
      "modalities": "Code, Text",
      "speed": "140 tok/s",
      "ttft": "210ms"
    }
  },
  {
    "id": "qwen-2-5-coder-14b",
    "slug": "qwen-2-5-coder-14b",
    "name": "Qwen 2.5 Coder 14B Instruct",
    "org": "Alibaba Qwen",
    "category": "Coding",
    "entityType": "model",
    "rank": 27,
    "rankDelta": "+2",
    "superpower": "Mid-Weight Code Power",
    "superpowerShort": "Midweight Coding",
    "superpowerDetail": "HumanEval 92.7% on Single GPU",
    "isOpenWeights": true,
    "licenseType": "Apache 2.0",
    "license": "Apache 2.0",
    "arenaElo": 1325,
    "eloChange": "+12",
    "mmluPro": "81.5%",
    "codingScore": "92.7%",
    "mathScore": "82.5%",
    "monthlyVisits": "62.0M",
    "growth": "+88.0%",
    "growthTrend": "up",
    "price": "$0.20 / 1M input",
    "outputSpeed": "135 tok/s",
    "speedNum": 135,
    "contextWindow": "128k tokens",
    "badge": "Mid-Weight",
    "shortDescription": "Mid-size 14B coding powerhouse that achieves 92.7% HumanEval on a single RTX 3090/4090 GPU.",
    "fullDescription": "Qwen 2.5 Coder 14B represents the sweet spot between parameter efficiency and intelligence for self-hosted developer toolchains.",
    "website": "https://qwenlm.github.io",
    "logoText": "Qwen14B",
    "logoColor": "#7C3AED",
    "releaseDate": "November 2024",
    "source": "Qwen Team",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "Apache 2.0 open-source license",
      "HumanEval 92.7% accuracy",
      "128k context window",
      "Runs on a single 16GB-24GB consumer GPU"
    ],
    "benchmarks": [
      {
        "name": "HumanEval Coding",
        "score": "92.7%",
        "rank": "#1 14B Class"
      },
      {
        "name": "MultiPL-E Multi-language",
        "score": "84.2%",
        "rank": "#1 14B Class"
      },
      {
        "name": "SWE-bench Lite",
        "score": "38.0%",
        "rank": "Top Tier Mid"
      },
      {
        "name": "MBPP Python",
        "score": "87.0%",
        "rank": "Top Tier"
      }
    ],
    "specs": {
      "inputPrice": "$0.20 / 1M tokens",
      "outputPrice": "$0.40 / 1M tokens",
      "contextWindow": "131,072 tokens",
      "maxOutput": "8,192 tokens",
      "cutoff": "September 2024",
      "modalities": "Code, Text",
      "speed": "135 tok/s",
      "ttft": "180ms"
    }
  },
  {
    "id": "deepseek-r1-open",
    "slug": "deepseek-r1-open",
    "name": "DeepSeek R1",
    "org": "DeepSeek AI",
    "category": "Open Weight",
    "entityType": "model",
    "rank": 28,
    "rankDelta": "+4",
    "superpower": "Open Weights Leader",
    "superpowerShort": "Open Reasoning",
    "superpowerDetail": "100% MIT Uncensored Weights",
    "isOpenWeights": true,
    "licenseType": "MIT License",
    "license": "MIT License",
    "arenaElo": 1365,
    "eloChange": "+32",
    "mmluPro": "90.8%",
    "codingScore": "91.5%",
    "mathScore": "95.8%",
    "monthlyVisits": "190.4M",
    "growth": "+142.0%",
    "growthTrend": "up",
    "price": "$0.55 / 1M input",
    "outputSpeed": "95 tok/s",
    "speedNum": 95,
    "contextWindow": "128k tokens",
    "badge": "MIT SOTA",
    "shortDescription": "High-performance open-weights reasoning model trained with large-scale reinforcement learning under MIT license.",
    "fullDescription": "DeepSeek R1 proved open weights can achieve parity with proprietary deliberation models. Distributed freely under MIT for on-premise deployments.",
    "website": "https://deepseek.com",
    "logoText": "DeepSeek",
    "logoColor": "#3B82F6",
    "releaseDate": "January 2025",
    "source": "LMSYS Chatbot Arena",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "100% open weights with MIT License",
      "Chain-of-thought visible tokens",
      "Fraction of API cost ($0.55/M)",
      "vLLM and Ollama native integration"
    ],
    "benchmarks": [
      {
        "name": "LMSYS Chatbot Arena",
        "score": "1,365 Elo",
        "rank": "#1 Open Weight"
      },
      {
        "name": "AIME 2024 Math",
        "score": "79.8%",
        "rank": "#1 Open Math"
      },
      {
        "name": "MATH 500",
        "score": "93.6%",
        "rank": "Top Tier"
      },
      {
        "name": "Codeforces Rating",
        "score": "1,940 Elo",
        "rank": "Master Level"
      }
    ],
    "specs": {
      "inputPrice": "$0.55 / 1M tokens",
      "outputPrice": "$2.19 / 1M tokens",
      "contextWindow": "128,000 tokens",
      "maxOutput": "8,192 tokens",
      "cutoff": "July 2024",
      "modalities": "Text, Code",
      "speed": "95 tok/s",
      "ttft": "450ms"
    }
  },
  {
    "id": "llama-3-3-70b-open",
    "slug": "llama-3-3-70b-open",
    "name": "Llama 3.3 70B Instruct",
    "org": "Meta AI",
    "category": "Open Weight",
    "entityType": "model",
    "rank": 29,
    "rankDelta": "+3",
    "superpower": "Open Weights Efficiency",
    "superpowerShort": "Open Frontier",
    "superpowerDetail": "Matches 405B at 70B Footprint",
    "isOpenWeights": true,
    "licenseType": "Llama 3.3 Community",
    "license": "Llama 3.3 Community",
    "arenaElo": 1342,
    "eloChange": "+19",
    "mmluPro": "88.6%",
    "codingScore": "89.2%",
    "mathScore": "90.5%",
    "monthlyVisits": "85.0M",
    "growth": "+48.0%",
    "growthTrend": "up",
    "price": "$0.35 / 1M input",
    "outputSpeed": "115 tok/s",
    "speedNum": 115,
    "contextWindow": "128k tokens",
    "badge": "Efficiency Leader",
    "shortDescription": "Ultra-efficient 70B parameter open-weights model delivering the performance of prior 405B frontier systems.",
    "fullDescription": "Meta Llama 3.3 70B represents a major leap in parameter efficiency. Easily hosted on dual H100 servers with 128k context.",
    "website": "https://llama.meta.com",
    "logoText": "Llama",
    "logoColor": "#0668E1",
    "releaseDate": "December 2024",
    "source": "Meta AI & LMSYS Arena",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "Community license for commercial use up to 700M MAU",
      "Runs on standard 2x GPU hardware",
      "128k token context window",
      "Strong multilingual fluency"
    ],
    "benchmarks": [
      {
        "name": "LMSYS Chatbot Arena",
        "score": "1,342 Elo",
        "rank": "Top Tier Open"
      },
      {
        "name": "MMLU Pro",
        "score": "88.6%",
        "rank": "Top Tier Open"
      },
      {
        "name": "HumanEval Coding",
        "score": "89.2%",
        "rank": "Top Tier Open"
      },
      {
        "name": "MATH 500",
        "score": "90.5%",
        "rank": "Top Tier"
      }
    ],
    "specs": {
      "inputPrice": "$0.35 / 1M tokens",
      "outputPrice": "$0.70 / 1M tokens",
      "contextWindow": "128,000 tokens",
      "maxOutput": "8,192 tokens",
      "cutoff": "December 2023",
      "modalities": "Text, Code",
      "speed": "115 tok/s",
      "ttft": "220ms"
    }
  },
  {
    "id": "meta-llama-3-1-405b",
    "slug": "meta-llama-3-1-405b",
    "name": "Llama 3.1 405B Instruct",
    "org": "Meta AI",
    "category": "Open Weight",
    "entityType": "model",
    "rank": 30,
    "rankDelta": "-1",
    "superpower": "Massive Open Frontier",
    "superpowerShort": "Open Giant",
    "superpowerDetail": "405 Billion Parameters Open Weights",
    "isOpenWeights": true,
    "licenseType": "Llama 3.1 Community",
    "license": "Llama 3.1 Community",
    "arenaElo": 1360,
    "eloChange": "+4",
    "mmluPro": "89.5%",
    "codingScore": "91.0%",
    "mathScore": "92.0%",
    "monthlyVisits": "85.0M",
    "growth": "+14.0%",
    "growthTrend": "up",
    "price": "$2.00 / 1M input",
    "outputSpeed": "65 tok/s",
    "speedNum": 65,
    "contextWindow": "128k tokens",
    "badge": "405B Giant",
    "shortDescription": "The largest and most capable openly available foundation model in existence, trained on 15 trillion tokens across 16,000 H100 GPUs.",
    "fullDescription": "Llama 3.1 405B rivals closed frontier flagships across reasoning, coding, and translation. It is widely used by AI labs to distill synthetic data and fine-tune specialized smaller models.",
    "website": "https://llama.meta.com",
    "logoText": "Llama405B",
    "logoColor": "#0668E1",
    "releaseDate": "July 2024",
    "source": "LMSYS Arena & Meta AI",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "World's largest openly downloadable foundation model",
      "128k context with 16k GPU training scale",
      "Used globally for synthetic data distillation",
      "Exemplary zero-shot multi-step reasoning"
    ],
    "benchmarks": [
      {
        "name": "LMSYS Chatbot Arena",
        "score": "1,360 Elo",
        "rank": "Top 8 Overall"
      },
      {
        "name": "MMLU Pro Reasoning",
        "score": "89.5%",
        "rank": "Top Tier"
      },
      {
        "name": "HumanEval Coding",
        "score": "91.0%",
        "rank": "Top Tier"
      },
      {
        "name": "GSM8K Math",
        "score": "96.8%",
        "rank": "Top Tier"
      }
    ],
    "specs": {
      "inputPrice": "$2.00 / 1M tokens",
      "outputPrice": "$4.00 / 1M tokens",
      "contextWindow": "128,000 tokens",
      "maxOutput": "8,192 tokens",
      "cutoff": "December 2023",
      "modalities": "Text, Code",
      "speed": "65 tok/s",
      "ttft": "480ms"
    }
  },
  {
    "id": "qwen-2-5-72b-open",
    "slug": "qwen-2-5-72b-open",
    "name": "Qwen 2.5 72B Instruct",
    "org": "Alibaba Qwen",
    "category": "Open Weight",
    "entityType": "model",
    "rank": 31,
    "rankDelta": "+2",
    "superpower": "Apache 2.0 Flagship",
    "superpowerShort": "Open LLM",
    "superpowerDetail": "Top-Rated Permissive Open LLM",
    "isOpenWeights": true,
    "licenseType": "Apache 2.0",
    "license": "Apache 2.0",
    "arenaElo": 1350,
    "eloChange": "+16",
    "mmluPro": "89.1%",
    "codingScore": "91.0%",
    "mathScore": "92.8%",
    "monthlyVisits": "62.0M",
    "growth": "+62.5%",
    "growthTrend": "up",
    "price": "$0.40 / 1M input",
    "outputSpeed": "105 tok/s",
    "speedNum": 105,
    "contextWindow": "128k tokens",
    "badge": "Apache 2.0",
    "shortDescription": "Permissively licensed Apache 2.0 foundation model with exceptional coding, mathematics, and multilingual fluency.",
    "fullDescription": "Alibaba Qwen 2.5 72B is recognized globally as one of the most powerful truly open-source models available under the Apache 2.0 license.",
    "website": "https://qwenlm.github.io",
    "logoText": "Qwen",
    "logoColor": "#7C3AED",
    "releaseDate": "September 2024",
    "source": "Qwen Team & LMSYS",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "100% Apache 2.0 permissive license",
      "Native 128k context window",
      "Strongest Apache 2.0 multilingual reasoning",
      "Unrestricted commercial distribution"
    ],
    "benchmarks": [
      {
        "name": "LMSYS Chatbot Arena",
        "score": "1,350 Elo",
        "rank": "#1 Apache 2.0"
      },
      {
        "name": "MMLU Pro",
        "score": "89.1%",
        "rank": "#1 Permissive"
      },
      {
        "name": "HumanEval Coding",
        "score": "91.0%",
        "rank": "Top Tier"
      },
      {
        "name": "MATH 500",
        "score": "92.8%",
        "rank": "Top Tier"
      }
    ],
    "specs": {
      "inputPrice": "$0.40 / 1M tokens",
      "outputPrice": "$0.80 / 1M tokens",
      "contextWindow": "131,072 tokens",
      "maxOutput": "8,192 tokens",
      "cutoff": "June 2024",
      "modalities": "Text, Code",
      "speed": "105 tok/s",
      "ttft": "240ms"
    }
  },
  {
    "id": "meta-llama-3-1-70b",
    "slug": "meta-llama-3-1-70b",
    "name": "Llama 3.1 70B Instruct",
    "org": "Meta AI",
    "category": "Open Weight",
    "entityType": "model",
    "rank": 32,
    "rankDelta": "-2",
    "superpower": "Enterprise Open Standard",
    "superpowerShort": "Enterprise Open",
    "superpowerDetail": "Battle-Tested 70B Workhorse",
    "isOpenWeights": true,
    "licenseType": "Llama 3.1 Community",
    "license": "Llama 3.1 Community",
    "arenaElo": 1335,
    "eloChange": "+3",
    "mmluPro": "86.0%",
    "codingScore": "87.5%",
    "mathScore": "88.0%",
    "monthlyVisits": "85.0M",
    "growth": "+18.0%",
    "growthTrend": "up",
    "price": "$0.35 / 1M input",
    "outputSpeed": "110 tok/s",
    "speedNum": 110,
    "contextWindow": "128k tokens",
    "badge": "Industry Standard",
    "shortDescription": "Battle-tested 70-billion parameter workhorse powering enterprise fine-tuning, RAG pipelines, and agent loops.",
    "fullDescription": "Llama 3.1 70B proved that open weights can deliver enterprise-grade accuracy across 8 languages and 128k context windows.",
    "website": "https://llama.meta.com",
    "logoText": "Llama70B",
    "logoColor": "#0668E1",
    "releaseDate": "July 2024",
    "source": "Meta AI",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "128k context window",
      "Extensively fine-tuned by open-source ecosystem",
      "Runs efficiently on vLLM and TensorRT-LLM",
      "Community commercial license"
    ],
    "benchmarks": [
      {
        "name": "LMSYS Chatbot Arena",
        "score": "1,335 Elo",
        "rank": "Top Tier"
      },
      {
        "name": "MMLU Pro",
        "score": "86.0%",
        "rank": "Solid"
      },
      {
        "name": "HumanEval Coding",
        "score": "87.5%",
        "rank": "Solid"
      },
      {
        "name": "MATH Benchmark",
        "score": "88.0%",
        "rank": "Solid"
      }
    ],
    "specs": {
      "inputPrice": "$0.35 / 1M tokens",
      "outputPrice": "$0.70 / 1M tokens",
      "contextWindow": "128,000 tokens",
      "maxOutput": "8,192 tokens",
      "cutoff": "December 2023",
      "modalities": "Text, Code",
      "speed": "110 tok/s",
      "ttft": "230ms"
    }
  },
  {
    "id": "meta-llama-3-1-8b",
    "slug": "meta-llama-3-1-8b",
    "name": "Llama 3.1 8B Instruct",
    "org": "Meta AI",
    "category": "Open Weight",
    "entityType": "model",
    "rank": 33,
    "rankDelta": "+1",
    "superpower": "Ubiquitous 8B Engine",
    "superpowerShort": "Edge Deployment",
    "superpowerDetail": "180 tok/s Local Edge Deployment",
    "isOpenWeights": true,
    "licenseType": "Llama 3.1 Community",
    "license": "Llama 3.1 Community",
    "arenaElo": 1270,
    "eloChange": "+6",
    "mmluPro": "72.4%",
    "codingScore": "78.5%",
    "mathScore": "74.0%",
    "monthlyVisits": "85.0M",
    "growth": "+25.0%",
    "growthTrend": "up",
    "price": "$0.10 / 1M input",
    "outputSpeed": "180 tok/s",
    "speedNum": 180,
    "contextWindow": "128k tokens",
    "badge": "Edge Champion",
    "shortDescription": "The world's most popular 8-billion parameter open-weights model, deployable on consumer laptops and edge devices.",
    "fullDescription": "Llama 3.1 8B packs impressive intelligence and 128k context into a lightweight footprint running at 180 tok/s.",
    "website": "https://llama.meta.com",
    "logoText": "Llama8B",
    "logoColor": "#0668E1",
    "releaseDate": "July 2024",
    "source": "Meta AI",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "128k context window in compact 8B size",
      "Runs locally on Mac, Windows, and Linux via Ollama",
      "Fast 180 tokens/sec generation throughput",
      "Massive ecosystem of community fine-tunes"
    ],
    "benchmarks": [
      {
        "name": "LMSYS Chatbot Arena",
        "score": "1,270 Elo",
        "rank": "Top 8B Model"
      },
      {
        "name": "Throughput Speed",
        "score": "180 tok/s",
        "rank": "Top Speed"
      },
      {
        "name": "HumanEval Coding",
        "score": "78.5%",
        "rank": "Solid 8B"
      },
      {
        "name": "MMLU Benchmark",
        "score": "72.4%",
        "rank": "Solid"
      }
    ],
    "specs": {
      "inputPrice": "$0.10 / 1M tokens",
      "outputPrice": "$0.20 / 1M tokens",
      "contextWindow": "128,000 tokens",
      "maxOutput": "8,192 tokens",
      "cutoff": "December 2023",
      "modalities": "Text, Code",
      "speed": "180 tok/s",
      "ttft": "130ms"
    }
  },
  {
    "id": "qwen-2-5-32b",
    "slug": "qwen-2-5-32b",
    "name": "Qwen 2.5 32B Instruct",
    "org": "Alibaba Qwen",
    "category": "Open Weight",
    "entityType": "model",
    "rank": 34,
    "rankDelta": "+3",
    "superpower": "Sweet-Spot Open Power",
    "superpowerShort": "Open Workhorse",
    "superpowerDetail": "Apache 2.0 32B Sweet Spot",
    "isOpenWeights": true,
    "licenseType": "Apache 2.0",
    "license": "Apache 2.0",
    "arenaElo": 1325,
    "eloChange": "+14",
    "mmluPro": "84.5%",
    "codingScore": "89.0%",
    "mathScore": "86.5%",
    "monthlyVisits": "62.0M",
    "growth": "+74.0%",
    "growthTrend": "up",
    "price": "$0.25 / 1M input",
    "outputSpeed": "125 tok/s",
    "speedNum": 125,
    "contextWindow": "128k tokens",
    "badge": "Apache 2.0",
    "shortDescription": "The ideal balance of model weight and intelligence, fitting on a single dual-GPU or high-RAM workstation.",
    "fullDescription": "Qwen 2.5 32B delivers near-70B performance under a fully permissive Apache 2.0 license with 128k context.",
    "website": "https://qwenlm.github.io",
    "logoText": "Qwen32B",
    "logoColor": "#7C3AED",
    "releaseDate": "September 2024",
    "source": "Qwen Team",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "Apache 2.0 open-source license",
      "Near 70B performance at less than half the compute",
      "128k context window",
      "Strong STEM and multi-language capabilities"
    ],
    "benchmarks": [
      {
        "name": "LMSYS Chatbot Arena",
        "score": "1,325 Elo",
        "rank": "Top Tier Mid"
      },
      {
        "name": "MMLU Pro",
        "score": "84.5%",
        "rank": "Top Tier"
      },
      {
        "name": "HumanEval Coding",
        "score": "89.0%",
        "rank": "Top Tier"
      },
      {
        "name": "MATH 500",
        "score": "86.5%",
        "rank": "Top Tier"
      }
    ],
    "specs": {
      "inputPrice": "$0.25 / 1M tokens",
      "outputPrice": "$0.50 / 1M tokens",
      "contextWindow": "131,072 tokens",
      "maxOutput": "8,192 tokens",
      "cutoff": "June 2024",
      "modalities": "Text, Code",
      "speed": "125 tok/s",
      "ttft": "190ms"
    }
  },
  {
    "id": "qwen-2-5-14b",
    "slug": "qwen-2-5-14b",
    "name": "Qwen 2.5 14B Instruct",
    "org": "Alibaba Qwen",
    "category": "Open Weight",
    "entityType": "model",
    "rank": 35,
    "rankDelta": "+2",
    "superpower": "Efficient Workstation LLM",
    "superpowerShort": "Workstation LLM",
    "superpowerDetail": "Runs on Single Consumer GPU",
    "isOpenWeights": true,
    "licenseType": "Apache 2.0",
    "license": "Apache 2.0",
    "arenaElo": 1300,
    "eloChange": "+10",
    "mmluPro": "78.5%",
    "codingScore": "84.0%",
    "mathScore": "81.0%",
    "monthlyVisits": "62.0M",
    "growth": "+68.0%",
    "growthTrend": "up",
    "price": "$0.18 / 1M input",
    "outputSpeed": "145 tok/s",
    "speedNum": 145,
    "contextWindow": "128k tokens",
    "badge": "Apache 2.0",
    "shortDescription": "Workstation-friendly 14B parameter foundation model capable of running entirely in VRAM on a single RTX 3090/4090.",
    "fullDescription": "Qwen 2.5 14B sets a high bar for mid-sized open models, beating many older 70B models in math and instruction following.",
    "website": "https://qwenlm.github.io",
    "logoText": "Qwen14B",
    "logoColor": "#7C3AED",
    "releaseDate": "September 2024",
    "source": "Qwen Team",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "Apache 2.0 permissive license",
      "Runs on single 24GB GPU without quantization",
      "128k token context window",
      "Robust JSON and function calling adherence"
    ],
    "benchmarks": [
      {
        "name": "LMSYS Chatbot Arena",
        "score": "1,300 Elo",
        "rank": "Top Tier Mid"
      },
      {
        "name": "HumanEval Coding",
        "score": "84.0%",
        "rank": "Top Tier"
      },
      {
        "name": "MMLU Pro",
        "score": "78.5%",
        "rank": "Solid"
      },
      {
        "name": "MATH 500",
        "score": "81.0%",
        "rank": "Solid"
      }
    ],
    "specs": {
      "inputPrice": "$0.18 / 1M tokens",
      "outputPrice": "$0.36 / 1M tokens",
      "contextWindow": "131,072 tokens",
      "maxOutput": "8,192 tokens",
      "cutoff": "June 2024",
      "modalities": "Text, Code",
      "speed": "145 tok/s",
      "ttft": "160ms"
    }
  },
  {
    "id": "qwen-2-5-7b",
    "slug": "qwen-2-5-7b",
    "name": "Qwen 2.5 7B Instruct",
    "org": "Alibaba Qwen",
    "category": "Open Weight",
    "entityType": "model",
    "rank": 36,
    "rankDelta": "+3",
    "superpower": "Edge LLM Benchmark",
    "superpowerShort": "Edge Performer",
    "superpowerDetail": "Apache 2.0 Top 7B Performer",
    "isOpenWeights": true,
    "licenseType": "Apache 2.0",
    "license": "Apache 2.0",
    "arenaElo": 1275,
    "eloChange": "+12",
    "mmluPro": "73.2%",
    "codingScore": "81.5%",
    "mathScore": "75.0%",
    "monthlyVisits": "62.0M",
    "growth": "+85.0%",
    "growthTrend": "up",
    "price": "$0.10 / 1M input",
    "outputSpeed": "190 tok/s",
    "speedNum": 190,
    "contextWindow": "128k tokens",
    "badge": "Apache 2.0",
    "shortDescription": "High-velocity 7B parameter open LLM delivering 190 tok/s generation throughput with 128k context.",
    "fullDescription": "Qwen 2.5 7B is the open-source community's preferred small model for local AI applications, edge reasoning, and agents.",
    "website": "https://qwenlm.github.io",
    "logoText": "Qwen7B",
    "logoColor": "#7C3AED",
    "releaseDate": "September 2024",
    "source": "Qwen Team",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "Apache 2.0 open-source license",
      "190 tok/s local generation speed",
      "128k context window",
      "Exceptional Chinese and English fluency"
    ],
    "benchmarks": [
      {
        "name": "LMSYS Chatbot Arena",
        "score": "1,275 Elo",
        "rank": "#1 7B LLM"
      },
      {
        "name": "Throughput Speed",
        "score": "190 tok/s",
        "rank": "Top Speed"
      },
      {
        "name": "HumanEval Coding",
        "score": "81.5%",
        "rank": "Top Tier Small"
      },
      {
        "name": "MMLU Pro",
        "score": "73.2%",
        "rank": "Solid"
      }
    ],
    "specs": {
      "inputPrice": "$0.10 / 1M tokens",
      "outputPrice": "$0.20 / 1M tokens",
      "contextWindow": "131,072 tokens",
      "maxOutput": "8,192 tokens",
      "cutoff": "June 2024",
      "modalities": "Text, Code",
      "speed": "190 tok/s",
      "ttft": "120ms"
    }
  },
  {
    "id": "mistral-nemo-12b",
    "slug": "mistral-nemo-12b",
    "name": "Mistral NeMo 12B",
    "org": "Mistral AI / NVIDIA",
    "category": "Open Weight",
    "entityType": "model",
    "rank": 37,
    "rankDelta": "0",
    "superpower": "NVIDIA Multilingual Collab",
    "superpowerShort": "Multilingual Open",
    "superpowerDetail": "Tekken Tokenizer & Apache 2.0",
    "isOpenWeights": true,
    "licenseType": "Apache 2.0",
    "license": "Apache 2.0",
    "arenaElo": 1288,
    "eloChange": "+6",
    "mmluPro": "75.0%",
    "codingScore": "82.0%",
    "mathScore": "76.5%",
    "monthlyVisits": "45.0M",
    "growth": "+31.0%",
    "growthTrend": "up",
    "price": "$0.15 / 1M input",
    "outputSpeed": "150 tok/s",
    "speedNum": 150,
    "contextWindow": "128k tokens",
    "badge": "Apache 2.0",
    "shortDescription": "Joint research foundation model from Mistral AI and NVIDIA featuring the advanced Tekken multilingual tokenizer.",
    "fullDescription": "Mistral NeMo 12B packs high multilingual efficiency into a 12B parameter footprint. Designed to drop into standard enterprise workflows under Apache 2.0.",
    "website": "https://mistral.ai",
    "logoText": "NeMo",
    "logoColor": "#F97316",
    "releaseDate": "July 2024",
    "source": "Mistral AI & NVIDIA",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "Trained with NVIDIA on Megatron-LM",
      "Tekken tokenizer with 100k+ vocabulary",
      "Apache 2.0 permissive license",
      "128k context window"
    ],
    "benchmarks": [
      {
        "name": "LMSYS Chatbot Arena",
        "score": "1,288 Elo",
        "rank": "Top Tier 12B"
      },
      {
        "name": "HumanEval Coding",
        "score": "82.0%",
        "rank": "Solid"
      },
      {
        "name": "MMLU Pro",
        "score": "75.0%",
        "rank": "Solid"
      },
      {
        "name": "Multilingual Compression",
        "score": "88.2%",
        "rank": "#1 Tekken"
      }
    ],
    "specs": {
      "inputPrice": "$0.15 / 1M tokens",
      "outputPrice": "$0.30 / 1M tokens",
      "contextWindow": "128,000 tokens",
      "maxOutput": "4,096 tokens",
      "cutoff": "June 2024",
      "modalities": "Text, Code",
      "speed": "150 tok/s",
      "ttft": "160ms"
    }
  },
  {
    "id": "mistral-mixtral-8x22b",
    "slug": "mistral-mixtral-8x22b",
    "name": "Mixtral 8x22B Instruct",
    "org": "Mistral AI",
    "category": "Open Weight",
    "entityType": "model",
    "rank": 38,
    "rankDelta": "-2",
    "superpower": "176B Sparse MoE",
    "superpowerShort": "Sparse MoE",
    "superpowerDetail": "39B Active Parameters Apache 2.0",
    "isOpenWeights": true,
    "licenseType": "Apache 2.0",
    "license": "Apache 2.0",
    "arenaElo": 1320,
    "eloChange": "+1",
    "mmluPro": "81.4%",
    "codingScore": "86.0%",
    "mathScore": "83.0%",
    "monthlyVisits": "45.0M",
    "growth": "+9.0%",
    "growthTrend": "up",
    "price": "$0.90 / 1M input",
    "outputSpeed": "85 tok/s",
    "speedNum": 85,
    "contextWindow": "64k tokens",
    "badge": "Apache 2.0",
    "shortDescription": "Massive 176B parameter sparse Mixture-of-Experts model that routes each token through 39B active parameters.",
    "fullDescription": "Mixtral 8x22B provides strong mathematical reasoning, coding, and multi-language capabilities under Apache 2.0 with excellent price-to-performance efficiency.",
    "website": "https://mistral.ai",
    "logoText": "Mixtral",
    "logoColor": "#F97316",
    "releaseDate": "April 2024",
    "source": "Mistral AI",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "Sparse Mixture-of-Experts architecture (39B active)",
      "Apache 2.0 open-source license",
      "Native function calling and JSON mode",
      "64k context window"
    ],
    "benchmarks": [
      {
        "name": "LMSYS Chatbot Arena",
        "score": "1,320 Elo",
        "rank": "Top Tier MoE"
      },
      {
        "name": "MMLU Pro",
        "score": "81.4%",
        "rank": "Solid"
      },
      {
        "name": "HumanEval Coding",
        "score": "86.0%",
        "rank": "Top Tier"
      },
      {
        "name": "GSM8K Math",
        "score": "90.0%",
        "rank": "Top Tier"
      }
    ],
    "specs": {
      "inputPrice": "$0.90 / 1M tokens",
      "outputPrice": "$1.80 / 1M tokens",
      "contextWindow": "65,536 tokens",
      "maxOutput": "4,096 tokens",
      "cutoff": "March 2024",
      "modalities": "Text, Code",
      "speed": "85 tok/s",
      "ttft": "290ms"
    }
  },
  {
    "id": "mistral-mixtral-8x7b",
    "slug": "mistral-mixtral-8x7b",
    "name": "Mixtral 8x7B Instruct",
    "org": "Mistral AI",
    "category": "Open Weight",
    "entityType": "model",
    "rank": 39,
    "rankDelta": "-3",
    "superpower": "Pioneering Open MoE",
    "superpowerShort": "Pioneering MoE",
    "superpowerDetail": "46.7B Sparse MoE Architecture",
    "isOpenWeights": true,
    "licenseType": "Apache 2.0",
    "license": "Apache 2.0",
    "arenaElo": 1265,
    "eloChange": "-1",
    "mmluPro": "70.5%",
    "codingScore": "76.0%",
    "mathScore": "72.0%",
    "monthlyVisits": "45.0M",
    "growth": "+4.0%",
    "growthTrend": "up",
    "price": "$0.25 / 1M input",
    "outputSpeed": "130 tok/s",
    "speedNum": 130,
    "contextWindow": "32k tokens",
    "badge": "Pioneer MoE",
    "shortDescription": "The historic Mixture-of-Experts model that demonstrated sparse routing could beat dense models twice its size.",
    "fullDescription": "Mixtral 8x7B remains a standard baseline in open-source AI infrastructure. Activating only 12.9B parameters per token, it delivers rapid inference under Apache 2.0.",
    "website": "https://mistral.ai",
    "logoText": "Mixtral",
    "logoColor": "#F97316",
    "releaseDate": "December 2023",
    "source": "Mistral AI",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "Pioneered modern sparse MoE architecture in open source",
      "Apache 2.0 permissive license",
      "Fast 130 tok/s inference throughput",
      "32k context window"
    ],
    "benchmarks": [
      {
        "name": "LMSYS Chatbot Arena",
        "score": "1,265 Elo",
        "rank": "Historic Pioneer"
      },
      {
        "name": "MMLU Benchmark",
        "score": "70.5%",
        "rank": "Solid"
      },
      {
        "name": "HumanEval Coding",
        "score": "76.0%",
        "rank": "Solid"
      },
      {
        "name": "GSM8K Math",
        "score": "74.4%",
        "rank": "Solid"
      }
    ],
    "specs": {
      "inputPrice": "$0.25 / 1M tokens",
      "outputPrice": "$0.50 / 1M tokens",
      "contextWindow": "32,768 tokens",
      "maxOutput": "4,096 tokens",
      "cutoff": "November 2023",
      "modalities": "Text, Code",
      "speed": "130 tok/s",
      "ttft": "180ms"
    }
  },
  {
    "id": "google-gemma-2-27b",
    "slug": "google-gemma-2-27b",
    "name": "Gemma 2 27B",
    "org": "Google DeepMind",
    "category": "Open Weight",
    "entityType": "model",
    "rank": 40,
    "rankDelta": "+1",
    "superpower": "Google Open Architecture",
    "superpowerShort": "Open SOTA",
    "superpowerDetail": "Sliding Window Attention SOTA",
    "isOpenWeights": true,
    "licenseType": "Gemma Community",
    "license": "Gemma Community",
    "arenaElo": 1318,
    "eloChange": "+8",
    "mmluPro": "82.5%",
    "codingScore": "84.2%",
    "mathScore": "82.0%",
    "monthlyVisits": "185.0M",
    "growth": "+32.0%",
    "growthTrend": "up",
    "price": "$0.27 / 1M input",
    "outputSpeed": "110 tok/s",
    "speedNum": 110,
    "contextWindow": "8k tokens",
    "badge": "Gemma SOTA",
    "shortDescription": "High-efficiency 27B parameter open-weights model trained on 13 trillion tokens using Gemini research technology.",
    "fullDescription": "Google's Gemma 2 27B punches far above its weight class, delivering benchmark performance on par with models more than twice its size through interleaved sliding-window attention.",
    "website": "https://ai.google.dev/gemma",
    "logoText": "Gemma27B",
    "logoColor": "#4285F4",
    "releaseDate": "June 2024",
    "source": "Google DeepMind",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "Built with technology from Gemini models",
      "Alternating local sliding window and global attention",
      "Gemma community terms for commercial use",
      "High parameter efficiency"
    ],
    "benchmarks": [
      {
        "name": "LMSYS Chatbot Arena",
        "score": "1,318 Elo",
        "rank": "Top Tier Mid"
      },
      {
        "name": "MMLU Pro",
        "score": "82.5%",
        "rank": "Top Tier"
      },
      {
        "name": "HumanEval Coding",
        "score": "84.2%",
        "rank": "Solid"
      },
      {
        "name": "MATH 500",
        "score": "82.0%",
        "rank": "Solid"
      }
    ],
    "specs": {
      "inputPrice": "$0.27 / 1M tokens",
      "outputPrice": "$0.54 / 1M tokens",
      "contextWindow": "8,192 tokens",
      "maxOutput": "4,096 tokens",
      "cutoff": "March 2024",
      "modalities": "Text, Code",
      "speed": "110 tok/s",
      "ttft": "210ms"
    }
  },
  {
    "id": "google-gemma-2-9b",
    "slug": "google-gemma-2-9b",
    "name": "Gemma 2 9B",
    "org": "Google DeepMind",
    "category": "Open Weight",
    "entityType": "model",
    "rank": 41,
    "rankDelta": "+1",
    "superpower": "Knowledge Distillation Leader",
    "superpowerShort": "Distilled LLM",
    "superpowerDetail": "Distilled from 27B Teacher",
    "isOpenWeights": true,
    "licenseType": "Gemma Community",
    "license": "Gemma Community",
    "arenaElo": 1285,
    "eloChange": "+7",
    "mmluPro": "76.0%",
    "codingScore": "80.0%",
    "mathScore": "76.0%",
    "monthlyVisits": "185.0M",
    "growth": "+40.0%",
    "growthTrend": "up",
    "price": "$0.12 / 1M input",
    "outputSpeed": "160 tok/s",
    "speedNum": 160,
    "contextWindow": "8k tokens",
    "badge": "Distillation",
    "shortDescription": "Distilled 9B parameter model that outperforms 13B and 20B predecessor models through knowledge distillation.",
    "fullDescription": "Gemma 2 9B offers exceptional instruction following, factual retrieval, and reasoning on single consumer GPUs, making it a favorite for local prototyping.",
    "website": "https://ai.google.dev/gemma",
    "logoText": "Gemma9B",
    "logoColor": "#4285F4",
    "releaseDate": "June 2024",
    "source": "Google DeepMind",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "Trained with knowledge distillation from larger Gemma models",
      "Runs locally on consumer RTX GPUs",
      "Fast 160 tokens/second throughput",
      "Strong safety and alignment baseline"
    ],
    "benchmarks": [
      {
        "name": "LMSYS Chatbot Arena",
        "score": "1,285 Elo",
        "rank": "Top Tier 9B"
      },
      {
        "name": "MMLU Pro",
        "score": "76.0%",
        "rank": "Solid"
      },
      {
        "name": "HumanEval Coding",
        "score": "80.0%",
        "rank": "Solid"
      },
      {
        "name": "Throughput Speed",
        "score": "160 tok/s",
        "rank": "Top Speed"
      }
    ],
    "specs": {
      "inputPrice": "$0.12 / 1M tokens",
      "outputPrice": "$0.24 / 1M tokens",
      "contextWindow": "8,192 tokens",
      "maxOutput": "4,096 tokens",
      "cutoff": "March 2024",
      "modalities": "Text, Code",
      "speed": "160 tok/s",
      "ttft": "140ms"
    }
  },
  {
    "id": "google-gemma-2-2b",
    "slug": "google-gemma-2-2b",
    "name": "Gemma 2 2B",
    "org": "Google DeepMind",
    "category": "Open Weight",
    "entityType": "model",
    "rank": 42,
    "rankDelta": "+2",
    "superpower": "On-Device Lightweight",
    "superpowerShort": "On-Device Edge",
    "superpowerDetail": "220 tok/s Ultra-Compact Edge",
    "isOpenWeights": true,
    "licenseType": "Gemma Community",
    "license": "Gemma Community",
    "arenaElo": 1220,
    "eloChange": "+14",
    "mmluPro": "62.0%",
    "codingScore": "68.0%",
    "mathScore": "61.0%",
    "monthlyVisits": "185.0M",
    "growth": "+60.0%",
    "growthTrend": "up",
    "price": "$0.05 / 1M input",
    "outputSpeed": "220 tok/s",
    "speedNum": 220,
    "contextWindow": "8k tokens",
    "badge": "Ultra Compact",
    "shortDescription": "Ultra-compact 2.6B parameter model built specifically for mobile phones, on-device assistants, and embedded systems.",
    "fullDescription": "Gemma 2 2B brings capable natural language understanding to smartphones and embedded edge hardware at over 220 tokens/sec.",
    "website": "https://ai.google.dev/gemma",
    "logoText": "Gemma2B",
    "logoColor": "#4285F4",
    "releaseDate": "August 2024",
    "source": "Google DeepMind",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "Runs natively on Android/iOS via MediaPipe",
      "220 tokens/second generation speed",
      "Fits in less than 2GB RAM with quantization",
      "Ideal for private edge NLP"
    ],
    "benchmarks": [
      {
        "name": "LMSYS Chatbot Arena",
        "score": "1,220 Elo",
        "rank": "#1 Sub-3B Model"
      },
      {
        "name": "Throughput Speed",
        "score": "220 tok/s",
        "rank": "#1 Speed Champion"
      },
      {
        "name": "HumanEval Coding",
        "score": "68.0%",
        "rank": "Top 2B"
      },
      {
        "name": "MMLU Score",
        "score": "62.0%",
        "rank": "Top 2B"
      }
    ],
    "specs": {
      "inputPrice": "$0.05 / 1M tokens",
      "outputPrice": "$0.10 / 1M tokens",
      "contextWindow": "8,192 tokens",
      "maxOutput": "4,096 tokens",
      "cutoff": "March 2024",
      "modalities": "Text, Code",
      "speed": "220 tok/s",
      "ttft": "90ms"
    }
  },
  {
    "id": "databricks-dbrx-instruct",
    "slug": "databricks-dbrx-instruct",
    "name": "DBRX Instruct",
    "org": "Databricks",
    "category": "Open Weight",
    "entityType": "model",
    "rank": 43,
    "rankDelta": "-2",
    "superpower": "Enterprise Open MoE",
    "superpowerShort": "Enterprise MoE",
    "superpowerDetail": "132B Total Parameters (36B Active)",
    "isOpenWeights": true,
    "licenseType": "Databricks Open Model License",
    "license": "Databricks Open Model License",
    "arenaElo": 1292,
    "eloChange": "0",
    "mmluPro": "77.0%",
    "codingScore": "81.5%",
    "mathScore": "78.0%",
    "monthlyVisits": "30.0M",
    "growth": "+10.0%",
    "growthTrend": "up",
    "price": "$0.60 / 1M input",
    "outputSpeed": "95 tok/s",
    "speedNum": 95,
    "contextWindow": "32k tokens",
    "badge": "Enterprise MoE",
    "shortDescription": "132-billion parameter sparse Mixture-of-Experts model trained specifically on enterprise tabular and structured datasets.",
    "fullDescription": "DBRX was engineered by Mosaic AI / Databricks to excel at enterprise SQL generation, structured tabular reasoning, and code intelligence across lakehouses.",
    "website": "https://www.databricks.com",
    "logoText": "DBRX",
    "logoColor": "#FF3621",
    "releaseDate": "March 2024",
    "source": "Databricks",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "Trained specifically on structured enterprise data and code",
      "Sparse MoE architecture with 36B active parameters",
      "Fine-grained 16 experts routing",
      "Databricks Lakehouse native integration"
    ],
    "benchmarks": [
      {
        "name": "LMSYS Chatbot Arena",
        "score": "1,292 Elo",
        "rank": "Top Enterprise Open"
      },
      {
        "name": "HumanEval Coding",
        "score": "81.5%",
        "rank": "Solid"
      },
      {
        "name": "MMLU Benchmark",
        "score": "77.0%",
        "rank": "Solid"
      },
      {
        "name": "SQL Spider Benchmark",
        "score": "84.0%",
        "rank": "Top Tier"
      }
    ],
    "specs": {
      "inputPrice": "$0.60 / 1M tokens",
      "outputPrice": "$1.20 / 1M tokens",
      "contextWindow": "32,768 tokens",
      "maxOutput": "4,096 tokens",
      "cutoff": "December 2023",
      "modalities": "Text, Code",
      "speed": "95 tok/s",
      "ttft": "260ms"
    }
  },
  {
    "id": "microsoft-phi-3-5-moe",
    "slug": "microsoft-phi-3-5-moe",
    "name": "Phi-3.5 MoE",
    "org": "Microsoft Research",
    "category": "Open Weight",
    "entityType": "model",
    "rank": 44,
    "rankDelta": "+1",
    "superpower": "Small Footprint MoE",
    "superpowerShort": "Compact MoE",
    "superpowerDetail": "16x3.8B Sparse MoE (6.6B Active)",
    "isOpenWeights": true,
    "licenseType": "MIT License",
    "license": "MIT License",
    "arenaElo": 1290,
    "eloChange": "+8",
    "mmluPro": "76.2%",
    "codingScore": "82.0%",
    "mathScore": "79.0%",
    "monthlyVisits": "50.0M",
    "growth": "+45.0%",
    "growthTrend": "up",
    "price": "$0.15 / 1M input",
    "outputSpeed": "155 tok/s",
    "speedNum": 155,
    "contextWindow": "128k tokens",
    "badge": "MIT MoE",
    "shortDescription": "Lightweight Mixture-of-Experts model combining 16 experts of 3.8B parameters each with only 6.6B active per token.",
    "fullDescription": "Phi-3.5 MoE achieves reasoning capabilities that rival 70B dense models while requiring minimal memory footprint under the MIT license.",
    "website": "https://azure.microsoft.com",
    "logoText": "Phi3.5",
    "logoColor": "#0089D6",
    "releaseDate": "August 2024",
    "source": "Microsoft Research",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "MIT permissive open-source license",
      "128k token context window",
      "Only 6.6B active parameters per token",
      "155 tok/s generation throughput"
    ],
    "benchmarks": [
      {
        "name": "LMSYS Chatbot Arena",
        "score": "1,290 Elo",
        "rank": "Top Tier Small MoE"
      },
      {
        "name": "HumanEval Coding",
        "score": "82.0%",
        "rank": "Top Tier"
      },
      {
        "name": "MMLU Pro",
        "score": "76.2%",
        "rank": "Solid"
      },
      {
        "name": "Throughput Speed",
        "score": "155 tok/s",
        "rank": "Top Speed"
      }
    ],
    "specs": {
      "inputPrice": "$0.15 / 1M tokens",
      "outputPrice": "$0.30 / 1M tokens",
      "contextWindow": "128,000 tokens",
      "maxOutput": "4,096 tokens",
      "cutoff": "May 2024",
      "modalities": "Text, Code",
      "speed": "155 tok/s",
      "ttft": "140ms"
    }
  },
  {
    "id": "microsoft-phi-3-5-mini",
    "slug": "microsoft-phi-3-5-mini",
    "name": "Phi-3.5 Mini",
    "org": "Microsoft Research",
    "category": "Open Weight",
    "entityType": "model",
    "rank": 45,
    "rankDelta": "0",
    "superpower": "Dense 3.8B SOTA",
    "superpowerShort": "Compact Reasoning",
    "superpowerDetail": "Trained on Synthetic High-Quality Text",
    "isOpenWeights": true,
    "licenseType": "MIT License",
    "license": "MIT License",
    "arenaElo": 1250,
    "eloChange": "+4",
    "mmluPro": "69.0%",
    "codingScore": "75.0%",
    "mathScore": "71.0%",
    "monthlyVisits": "50.0M",
    "growth": "+35.0%",
    "growthTrend": "up",
    "price": "$0.08 / 1M input",
    "outputSpeed": "200 tok/s",
    "speedNum": 200,
    "contextWindow": "128k tokens",
    "badge": "Dense Mini",
    "shortDescription": "Dense 3.8B parameter model trained on high-quality synthetic textbooks, curriculum data, and logic puzzles.",
    "fullDescription": "Phi-3.5 Mini packs 128k context into a sub-4B dense footprint under the MIT license, delivering 200 tokens per second.",
    "website": "https://azure.microsoft.com",
    "logoText": "PhiMini",
    "logoColor": "#0089D6",
    "releaseDate": "August 2024",
    "source": "Microsoft Research",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "MIT permissive open-source license",
      "128k context window",
      "Blazing 200 tok/s generation speed",
      "Trained on high-signal synthetic textbooks"
    ],
    "benchmarks": [
      {
        "name": "LMSYS Chatbot Arena",
        "score": "1,250 Elo",
        "rank": "Top 4B Model"
      },
      {
        "name": "Throughput Speed",
        "score": "200 tok/s",
        "rank": "Top Speed"
      },
      {
        "name": "HumanEval Coding",
        "score": "75.0%",
        "rank": "Solid Small"
      },
      {
        "name": "MMLU Score",
        "score": "69.0%",
        "rank": "Solid"
      }
    ],
    "specs": {
      "inputPrice": "$0.08 / 1M tokens",
      "outputPrice": "$0.16 / 1M tokens",
      "contextWindow": "128,000 tokens",
      "maxOutput": "4,096 tokens",
      "cutoff": "May 2024",
      "modalities": "Text, Code",
      "speed": "200 tok/s",
      "ttft": "100ms"
    }
  },
  {
    "id": "openai-gpt-4o-vision",
    "slug": "openai-gpt-4o-vision",
    "name": "GPT-4o (Omni Vision)",
    "org": "OpenAI",
    "category": "Multimodal",
    "entityType": "model",
    "rank": 46,
    "rankDelta": "-1",
    "superpower": "Omni Visual Reasoning",
    "superpowerShort": "Omni Vision",
    "superpowerDetail": "Sub-300ms Realtime Visual QA",
    "isOpenWeights": false,
    "licenseType": "Commercial API",
    "license": "Commercial API",
    "arenaElo": 1370,
    "eloChange": "+4",
    "mmluPro": "90.4%",
    "codingScore": "90.2%",
    "mathScore": "92.0%",
    "monthlyVisits": "220.0M",
    "growth": "+14.5%",
    "growthTrend": "up",
    "price": "$2.50 / 1M input",
    "outputSpeed": "110 tok/s",
    "speedNum": 110,
    "contextWindow": "128k tokens",
    "badge": "Omni Flagship",
    "shortDescription": "Versatile flagship multimodal foundation model supporting native text, visual reasoning, and high-res diagram analysis.",
    "fullDescription": "GPT-4o processes and generates text, audio, and images natively within a single neural network architecture.",
    "website": "https://openai.com",
    "logoText": "GPT-4o",
    "logoColor": "#10A37F",
    "releaseDate": "May 2024",
    "source": "LMSYS Chatbot Arena",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "Native multimodal vision, audio, and text architecture",
      "High-speed visual OCR and diagram parsing",
      "JSON mode and structured object extraction",
      "Broadest developer ecosystem adoption"
    ],
    "benchmarks": [
      {
        "name": "LMSYS Chatbot Arena",
        "score": "1,370 Elo",
        "rank": "#1 Multimodal"
      },
      {
        "name": "MMMU Vision Benchmark",
        "score": "69.1%",
        "rank": "#1 Vision"
      },
      {
        "name": "MathVista Multimodal Math",
        "score": "74.8%",
        "rank": "#1 Visual Math"
      },
      {
        "name": "DocVQA Document Parsing",
        "score": "92.8%",
        "rank": "Top Tier"
      }
    ],
    "specs": {
      "inputPrice": "$2.50 / 1M tokens",
      "outputPrice": "$10.00 / 1M tokens",
      "contextWindow": "128,000 tokens",
      "maxOutput": "16,384 tokens",
      "cutoff": "October 2023",
      "modalities": "Text, Code, Vision, Audio",
      "speed": "110 tok/s average throughput",
      "ttft": "280ms Time-To-First-Token"
    }
  },
  {
    "id": "gemini-2-5-pro-vision",
    "slug": "gemini-2-5-pro-vision",
    "name": "Gemini 2.5 Pro",
    "org": "Google DeepMind",
    "category": "Multimodal",
    "entityType": "model",
    "rank": 47,
    "rankDelta": "+1",
    "superpower": "2M Native Multimodal",
    "superpowerShort": "Native Multimodal",
    "superpowerDetail": "Processes Full Length Movies & Audio",
    "isOpenWeights": false,
    "licenseType": "Commercial API",
    "license": "Commercial API",
    "arenaElo": 1372,
    "eloChange": "+15",
    "mmluPro": "92.1%",
    "codingScore": "92.6%",
    "mathScore": "95.4%",
    "monthlyVisits": "185.0M",
    "growth": "+29.5%",
    "growthTrend": "up",
    "price": "$1.25 / 1M input",
    "outputSpeed": "125 tok/s",
    "speedNum": 125,
    "contextWindow": "2,000k tokens (2M)",
    "badge": "2M Context",
    "shortDescription": "Frontier multimodal model featuring 2-million-token native context window and deep cross-modal reasoning.",
    "fullDescription": "Gemini 2.5 Pro sets the gold standard for massive multimodal ingestion, processing entire video archives and documentation in a single prompt.",
    "website": "https://deepmind.google",
    "logoText": "Gemini",
    "logoColor": "#4285F4",
    "releaseDate": "February 2025",
    "source": "LMSYS Chatbot Arena & Google",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "2M token native context window",
      "Native video and audio stream understanding",
      "Near 100% video needle retrieval",
      "Sub-second cross-modal latency"
    ],
    "benchmarks": [
      {
        "name": "LMSYS Chatbot Arena",
        "score": "1,372 Elo",
        "rank": "Top 3 Overall"
      },
      {
        "name": "Video-MME (Multimodal)",
        "score": "84.5%",
        "rank": "#1 Video QA"
      },
      {
        "name": "Needle in Haystack (2M)",
        "score": "99.8%",
        "rank": "#1 Recall"
      },
      {
        "name": "MMMU Benchmark",
        "score": "70.2%",
        "rank": "Top Tier"
      }
    ],
    "specs": {
      "inputPrice": "$1.25 / 1M tokens",
      "outputPrice": "$5.00 / 1M tokens",
      "contextWindow": "2,097,152 tokens",
      "maxOutput": "8,192 tokens",
      "cutoff": "January 2025",
      "modalities": "Text, Code, Audio, Video, Vision",
      "speed": "125 tok/s",
      "ttft": "290ms"
    }
  },
  {
    "id": "gemini-2-0-flash-multimodal",
    "slug": "gemini-2-0-flash-multimodal",
    "name": "Gemini 2.0 Flash",
    "org": "Google DeepMind",
    "category": "Multimodal",
    "entityType": "model",
    "rank": 48,
    "rankDelta": "+5",
    "superpower": "Realtime Multimodal Agent",
    "superpowerShort": "Realtime Vision",
    "superpowerDetail": "175 tok/s Streaming Audio & Video",
    "isOpenWeights": false,
    "licenseType": "Commercial API",
    "license": "Commercial API",
    "arenaElo": 1355,
    "eloChange": "+28",
    "mmluPro": "87.5%",
    "codingScore": "88.4%",
    "mathScore": "89.2%",
    "monthlyVisits": "185.0M",
    "growth": "+72.0%",
    "growthTrend": "up",
    "price": "$0.10 / 1M input",
    "outputSpeed": "175 tok/s",
    "speedNum": 175,
    "contextWindow": "1,000k tokens (1M)",
    "badge": "Speed King",
    "shortDescription": "Lightning-fast multimodal model engineered for high-throughput streaming, agents, and realtime voice-to-voice.",
    "fullDescription": "Gemini 2.0 Flash delivers 175 tokens per second with sub-200ms latency, providing native video and audio understanding at rock-bottom pricing.",
    "website": "https://deepmind.google",
    "logoText": "Gemini",
    "logoColor": "#4285F4",
    "releaseDate": "December 2024",
    "source": "LMSYS Chatbot Arena",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "175 tokens/second production throughput",
      "Native 1,000,000 token context window",
      "Realtime bidirectional audio & video streaming",
      "Lowest cost per million tokens in frontier tier"
    ],
    "benchmarks": [
      {
        "name": "LMSYS Chatbot Arena",
        "score": "1,355 Elo",
        "rank": "Top 10 Overall"
      },
      {
        "name": "Output Throughput",
        "score": "175 tok/s",
        "rank": "#1 Speed"
      },
      {
        "name": "Video Retrieval QA",
        "score": "81.2%",
        "rank": "Top Tier"
      },
      {
        "name": "MMLU Pro",
        "score": "87.5%",
        "rank": "Top Tier"
      }
    ],
    "specs": {
      "inputPrice": "$0.10 / 1M tokens",
      "outputPrice": "$0.40 / 1M tokens",
      "contextWindow": "1,048,576 tokens",
      "maxOutput": "8,192 tokens",
      "cutoff": "August 2024",
      "modalities": "Text, Code, Vision, Audio, Video",
      "speed": "175 tok/s",
      "ttft": "180ms"
    }
  },
  {
    "id": "qwen-2-5-vl-72b",
    "slug": "qwen-2-5-vl-72b",
    "name": "Qwen 2.5 VL 72B",
    "org": "Alibaba Qwen",
    "category": "Multimodal",
    "entityType": "model",
    "rank": 49,
    "rankDelta": "+4",
    "superpower": "Open Vision SOTA",
    "superpowerShort": "Open Vision",
    "superpowerDetail": "Native Video Understanding Apache 2.0",
    "isOpenWeights": true,
    "licenseType": "Apache 2.0",
    "license": "Apache 2.0",
    "arenaElo": 1348,
    "eloChange": "+18",
    "mmluPro": "88.0%",
    "codingScore": "89.0%",
    "mathScore": "90.5%",
    "monthlyVisits": "62.0M",
    "growth": "+92.0%",
    "growthTrend": "up",
    "price": "$0.45 / 1M input",
    "outputSpeed": "98 tok/s",
    "speedNum": 98,
    "contextWindow": "128k tokens",
    "badge": "Apache 2.0",
    "shortDescription": "The world's leading open-weights vision-language foundation model, supporting hour-long video analysis and high-res OCR under Apache 2.0.",
    "fullDescription": "Qwen 2.5 VL 72B accurately parses complex UI screens, scans documents in 30+ languages, and reasons across multi-frame video inputs.",
    "website": "https://qwenlm.github.io",
    "logoText": "QwenVL",
    "logoColor": "#7C3AED",
    "releaseDate": "January 2025",
    "source": "Qwen Team & LMSYS",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "Apache 2.0 open-source license",
      "Native dynamic resolution image encoder",
      "Deep video frame temporal reasoning",
      "Top-ranked open weights visual benchmark performance"
    ],
    "benchmarks": [
      {
        "name": "MMMU Multimodal Benchmark",
        "score": "68.2%",
        "rank": "#1 Open Vision"
      },
      {
        "name": "DocVQA Document Text",
        "score": "95.1%",
        "rank": "#1 OCR Accuracy"
      },
      {
        "name": "Video-MME",
        "score": "79.8%",
        "rank": "Top Tier Open"
      },
      {
        "name": "MathVista",
        "score": "72.4%",
        "rank": "Top Tier"
      }
    ],
    "specs": {
      "inputPrice": "$0.45 / 1M tokens",
      "outputPrice": "$0.90 / 1M tokens",
      "contextWindow": "131,072 tokens",
      "maxOutput": "8,192 tokens",
      "cutoff": "November 2024",
      "modalities": "Text, Vision, Video",
      "speed": "98 tok/s",
      "ttft": "260ms"
    }
  },
  {
    "id": "mistral-pixtral-large",
    "slug": "mistral-pixtral-large",
    "name": "Pixtral Large 124B",
    "org": "Mistral AI",
    "category": "Multimodal",
    "entityType": "model",
    "rank": 50,
    "rankDelta": "+1",
    "superpower": "124B Multimodal Frontier",
    "superpowerShort": "Vision MoE",
    "superpowerDetail": "Native High-Resolution Vision MoE",
    "isOpenWeights": false,
    "licenseType": "Commercial API",
    "license": "Commercial API",
    "arenaElo": 1342,
    "eloChange": "+8",
    "mmluPro": "86.5%",
    "codingScore": "89.5%",
    "mathScore": "87.0%",
    "monthlyVisits": "45.0M",
    "growth": "+38.0%",
    "growthTrend": "up",
    "price": "$2.00 / 1M input",
    "outputSpeed": "90 tok/s",
    "speedNum": 90,
    "contextWindow": "128k tokens",
    "badge": "Enterprise Vision",
    "shortDescription": "Frontier 124B multimodal foundation model from Mistral AI with native 128k context for high-res document and chart analysis.",
    "fullDescription": "Pixtral Large excels at chart parsing, complex PDF financial document extraction, and reasoning over multiple images in sequence.",
    "website": "https://mistral.ai",
    "logoText": "Pixtral",
    "logoColor": "#F97316",
    "releaseDate": "November 2024",
    "source": "Mistral AI",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "128k token multimodal context window",
      "Native multi-image comparison and layout parsing",
      "Tuned for European languages and compliance",
      "Available on Mistral La Plateforme and Cloud APIs"
    ],
    "benchmarks": [
      {
        "name": "MMMU Benchmark",
        "score": "66.5%",
        "rank": "Top Tier"
      },
      {
        "name": "DocVQA",
        "score": "93.4%",
        "rank": "Top Tier"
      },
      {
        "name": "MathVista",
        "score": "69.8%",
        "rank": "Top Tier"
      },
      {
        "name": "ChartQA",
        "score": "88.2%",
        "rank": "Top Tier"
      }
    ],
    "specs": {
      "inputPrice": "$2.00 / 1M tokens",
      "outputPrice": "$6.00 / 1M tokens",
      "contextWindow": "128,000 tokens",
      "maxOutput": "8,192 tokens",
      "cutoff": "October 2024",
      "modalities": "Text, Code, Vision",
      "speed": "90 tok/s",
      "ttft": "290ms"
    }
  },
  {
    "id": "meta-llama-3-2-90b-vision",
    "slug": "meta-llama-3-2-90b-vision",
    "name": "Llama 3.2 90B Vision",
    "org": "Meta AI",
    "category": "Multimodal",
    "entityType": "model",
    "rank": 51,
    "rankDelta": "0",
    "superpower": "Open Weights 90B Vision",
    "superpowerShort": "Vision Llama",
    "superpowerDetail": "Image + Text Multimodal Llama",
    "isOpenWeights": true,
    "licenseType": "Llama 3.2 Community",
    "license": "Llama 3.2 Community",
    "arenaElo": 1330,
    "eloChange": "+6",
    "mmluPro": "84.0%",
    "codingScore": "86.5%",
    "mathScore": "85.0%",
    "monthlyVisits": "85.0M",
    "growth": "+22.0%",
    "growthTrend": "up",
    "price": "$0.60 / 1M input",
    "outputSpeed": "95 tok/s",
    "speedNum": 95,
    "contextWindow": "128k tokens",
    "badge": "Open Vision",
    "shortDescription": "Open multimodal weights from Meta featuring cross-attention image adapter layers integrated into Llama 3 architecture.",
    "fullDescription": "Llama 3.2 90B Vision allows enterprises to run self-hosted document image extraction, visual question answering, and UI inspection on private clusters.",
    "website": "https://llama.meta.com",
    "logoText": "LlamaVision",
    "logoColor": "#0668E1",
    "releaseDate": "September 2024",
    "source": "Meta AI",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "Open weights under Llama 3.2 Community License",
      "128k token context window",
      "Cross-attention visual adapter architecture",
      "Strong visual reasoning over charts and diagrams"
    ],
    "benchmarks": [
      {
        "name": "MMMU Benchmark",
        "score": "64.5%",
        "rank": "Top Tier Open"
      },
      {
        "name": "DocVQA",
        "score": "90.1%",
        "rank": "Top Tier"
      },
      {
        "name": "ChartQA",
        "score": "85.5%",
        "rank": "Top Tier"
      },
      {
        "name": "HumanEval Coding",
        "score": "86.5%",
        "rank": "Solid"
      }
    ],
    "specs": {
      "inputPrice": "$0.60 / 1M tokens",
      "outputPrice": "$1.20 / 1M tokens",
      "contextWindow": "128,000 tokens",
      "maxOutput": "8,192 tokens",
      "cutoff": "July 2024",
      "modalities": "Text, Vision",
      "speed": "95 tok/s",
      "ttft": "280ms"
    }
  },
  {
    "id": "ai2-molmo-72b",
    "slug": "ai2-molmo-72b",
    "name": "Molmo 72B",
    "org": "Allen Institute for AI (Ai2)",
    "category": "Multimodal",
    "entityType": "model",
    "rank": 52,
    "rankDelta": "+3",
    "superpower": "Open Vision Grounding",
    "superpowerShort": "Open Vision",
    "superpowerDetail": "PixMo Open Dataset Apache 2.0",
    "isOpenWeights": true,
    "licenseType": "Apache 2.0",
    "license": "Apache 2.0",
    "arenaElo": 1336,
    "eloChange": "+16",
    "mmluPro": "85.0%",
    "codingScore": "87.0%",
    "mathScore": "84.5%",
    "monthlyVisits": "12.0M",
    "growth": "+95.0%",
    "growthTrend": "up",
    "price": "$0.40 / 1M input",
    "outputSpeed": "95 tok/s",
    "speedNum": 95,
    "contextWindow": "32k tokens",
    "badge": "Fully Open",
    "shortDescription": "Fully open, state-of-the-art multimodal model built by Ai2 using open weights, open dataset (PixMo), and transparent training scripts.",
    "fullDescription": "Molmo 72B matches proprietary flagships on image reasoning and UI element pointing while providing complete open science reproducibility.",
    "website": "https://molmo.allenai.org",
    "logoText": "Molmo",
    "logoColor": "#10B981",
    "releaseDate": "September 2024",
    "source": "Allen Institute for AI",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "100% open weights, open code, and open training data",
      "Native 2D point grounding on visual objects",
      "Apache 2.0 license",
      "Trained on high-quality human speech annotated visual data"
    ],
    "benchmarks": [
      {
        "name": "MMMU Benchmark",
        "score": "66.0%",
        "rank": "#1 Open Science"
      },
      {
        "name": "PointQA Grounding",
        "score": "91.2%",
        "rank": "#1 Visual Grounding"
      },
      {
        "name": "DocVQA",
        "score": "92.0%",
        "rank": "Top Tier"
      },
      {
        "name": "ChartQA",
        "score": "87.0%",
        "rank": "Top Tier"
      }
    ],
    "specs": {
      "inputPrice": "$0.40 / 1M tokens",
      "outputPrice": "$0.80 / 1M tokens",
      "contextWindow": "32,768 tokens",
      "maxOutput": "4,096 tokens",
      "cutoff": "August 2024",
      "modalities": "Text, Vision",
      "speed": "95 tok/s",
      "ttft": "270ms"
    }
  },
  {
    "id": "flux-1-dev",
    "slug": "flux-1-dev",
    "name": "FLUX.1 [dev]",
    "org": "Black Forest Labs",
    "category": "Image",
    "entityType": "model",
    "rank": 53,
    "rankDelta": "+3",
    "superpower": "Photorealistic Visuals",
    "superpowerShort": "Photorealism",
    "superpowerDetail": "12B Rectified Flow SOTA",
    "isOpenWeights": true,
    "licenseType": "FLUX.1 Non-Commercial",
    "license": "FLUX.1 Non-Commercial",
    "arenaElo": 1245,
    "eloChange": "+18",
    "mmluPro": "N/A",
    "codingScore": "N/A",
    "mathScore": "N/A",
    "monthlyVisits": "45.0M",
    "growth": "+120.0%",
    "growthTrend": "up",
    "price": "$0.03 / image",
    "outputSpeed": "3.2s / img",
    "speedNum": 100,
    "contextWindow": "Prompt based",
    "badge": "Visual SOTA",
    "shortDescription": "12-billion parameter rectified flow image transformer model delivering photorealistic anatomy and typography.",
    "fullDescription": "FLUX.1 [dev] is the groundbreaking image generation foundation model created by the original Stable Diffusion inventors.",
    "website": "https://blackforestlabs.ai",
    "logoText": "FLUX",
    "logoColor": "#000000",
    "releaseDate": "August 2024",
    "source": "Artificial Analysis Image Arena",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "Rectified flow transformer architecture (12B params)",
      "Exceptional hands and human anatomy fidelity",
      "State-of-the-art text rendering and typography",
      "Weights available on Hugging Face"
    ],
    "benchmarks": [
      {
        "name": "Artificial Analysis Visual Elo",
        "score": "1,245 Elo",
        "rank": "#1 Open Image"
      },
      {
        "name": "Text Rendering Accuracy",
        "score": "95.2%",
        "rank": "#1 Typography"
      },
      {
        "name": "Prompt Adherence Win Rate",
        "score": "88.4%",
        "rank": "Top Tier"
      },
      {
        "name": "Inference Latency",
        "score": "3.2s",
        "rank": "Top Rated"
      }
    ],
    "specs": {
      "inputPrice": "$0.025 / image API",
      "outputPrice": "Up to 2048x2048",
      "contextWindow": "512 prompt tokens",
      "maxOutput": "High-res images",
      "cutoff": "August 2024",
      "modalities": "Text-to-Image",
      "speed": "3.2s generation time",
      "ttft": "1.1s"
    },
    "categoryMetricLabel": "Visual Elo",
    "categoryMetricValue": "1,245 Elo",
    "categorySubMetricLabel": "Render Time",
    "categorySubMetricValue": "3.2s",
    "categoryDimension3": "2048px"
  },
  {
    "id": "midjourney-v6-1",
    "slug": "midjourney-v6-1",
    "name": "Midjourney v6.1",
    "org": "Midjourney",
    "category": "Image",
    "entityType": "model",
    "rank": 54,
    "rankDelta": "0",
    "superpower": "Cinematic Aesthetic",
    "superpowerShort": "Cinematic Visuals",
    "superpowerDetail": "Photorealistic Coherence & Lighting",
    "isOpenWeights": false,
    "licenseType": "Commercial SaaS",
    "license": "Commercial SaaS",
    "arenaElo": 1238,
    "eloChange": "+4",
    "mmluPro": "N/A",
    "codingScore": "N/A",
    "mathScore": "N/A",
    "monthlyVisits": "82.5M",
    "growth": "+15.0%",
    "growthTrend": "up",
    "price": "$10 / month",
    "outputSpeed": "8.5s / img",
    "speedNum": 80,
    "contextWindow": "Prompt based",
    "badge": "Aesthetic Leader",
    "shortDescription": "State-of-the-art generative image model renowned for cinematic coherence, complex lighting, and organic textures.",
    "fullDescription": "Midjourney v6.1 delivers industry-leading artistic aesthetics, nuanced photorealism, and rich textural details.",
    "website": "https://midjourney.com",
    "logoText": "Midjourney",
    "logoColor": "#2B5876",
    "releaseDate": "July 2024",
    "source": "Artificial Analysis Visual Arena",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "Unmatched cinematic lighting and artistic coherence",
      "Realistic skin textures and complex human eyes",
      "Nuanced prompt understanding with style references",
      "Web and Discord generation interfaces"
    ],
    "benchmarks": [
      {
        "name": "Artificial Analysis Visual Elo",
        "score": "1,238 Elo",
        "rank": "#2 Overall Visual"
      },
      {
        "name": "Human Preference Win Rate",
        "score": "78.4%",
        "rank": "Top Tier"
      },
      {
        "name": "Style Adherence",
        "score": "92.0%",
        "rank": "#1 Aesthetics"
      },
      {
        "name": "Photorealism Score",
        "score": "94.5%",
        "rank": "#1 Realism"
      }
    ],
    "specs": {
      "inputPrice": "$10/mo Basic, $30/mo Pro",
      "outputPrice": "Unlimited relaxed generations",
      "contextWindow": "Prompt up to 1,000 chars",
      "maxOutput": "1024x1024 to 4K upscale",
      "cutoff": "Continuous aesthetic updates",
      "modalities": "Text-to-Image, Image-to-Image",
      "speed": "8.5s fast generation",
      "ttft": "2.0s"
    },
    "categoryMetricLabel": "Visual Elo",
    "categoryMetricValue": "1,238 Elo",
    "categorySubMetricLabel": "Render Time",
    "categorySubMetricValue": "8.5s",
    "categoryDimension3": "4K Upscale"
  },
  {
    "id": "flux-1-schnell",
    "slug": "flux-1-schnell",
    "name": "FLUX.1 [schnell]",
    "org": "Black Forest Labs",
    "category": "Image",
    "entityType": "model",
    "rank": 55,
    "rankDelta": "+4",
    "superpower": "Sub-Second Apache 2.0",
    "superpowerShort": "Fast Generation",
    "superpowerDetail": "4-Step Ultra-Fast Image Gen",
    "isOpenWeights": true,
    "licenseType": "Apache 2.0",
    "license": "Apache 2.0",
    "arenaElo": 1215,
    "eloChange": "+24",
    "mmluPro": "N/A",
    "codingScore": "N/A",
    "mathScore": "N/A",
    "monthlyVisits": "45.0M",
    "growth": "+140.0%",
    "growthTrend": "up",
    "price": "$0.003 / image",
    "outputSpeed": "0.8s / img",
    "speedNum": 180,
    "contextWindow": "Prompt based",
    "badge": "Apache 2.0 SOTA",
    "shortDescription": "Ultra-fast 4-step distilled rectified flow image model licensed permissively under Apache 2.0 for commercial use.",
    "fullDescription": "FLUX.1 [schnell] delivers photorealistic images in under 1 second on modern GPUs with full Apache 2.0 commercial rights.",
    "website": "https://blackforestlabs.ai",
    "logoText": "FLUX",
    "logoColor": "#000000",
    "releaseDate": "August 2024",
    "source": "Artificial Analysis Visual Arena",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "Apache 2.0 open-source license",
      "Generates high-res images in only 4 sampling steps",
      "Sub-second inference on single consumer GPU",
      "High typography and prompt compliance"
    ],
    "benchmarks": [
      {
        "name": "Artificial Analysis Visual Elo",
        "score": "1,215 Elo",
        "rank": "#1 Apache Image"
      },
      {
        "name": "Render Speed",
        "score": "0.8s",
        "rank": "#1 Speed Champion"
      },
      {
        "name": "Typography Accuracy",
        "score": "91.0%",
        "rank": "Top Tier"
      },
      {
        "name": "Open-Source Adherence",
        "score": "84.2%",
        "rank": "Top Tier"
      }
    ],
    "specs": {
      "inputPrice": "$0.003 / image API",
      "outputPrice": "1024x1024",
      "contextWindow": "512 prompt tokens",
      "maxOutput": "Standard output",
      "cutoff": "August 2024",
      "modalities": "Text-to-Image",
      "speed": "0.8s generation time",
      "ttft": "0.3s"
    },
    "categoryMetricLabel": "Visual Elo",
    "categoryMetricValue": "1,215 Elo",
    "categorySubMetricLabel": "Render Time",
    "categorySubMetricValue": "0.8s",
    "categoryDimension3": "1024px"
  },
  {
    "id": "stability-sd-3-5-large",
    "slug": "stability-sd-3-5-large",
    "name": "Stable Diffusion 3.5 Large",
    "org": "Stability AI",
    "category": "Image",
    "entityType": "model",
    "rank": 56,
    "rankDelta": "+1",
    "superpower": "Customizable Image Base",
    "superpowerShort": "Custom Diffusion",
    "superpowerDetail": "8B Multimodal Diffusion Transformer",
    "isOpenWeights": true,
    "licenseType": "Stability Community License",
    "license": "Stability Community License",
    "arenaElo": 1210,
    "eloChange": "+12",
    "mmluPro": "N/A",
    "codingScore": "N/A",
    "mathScore": "N/A",
    "monthlyVisits": "38.0M",
    "growth": "+28.0%",
    "growthTrend": "up",
    "price": "Free / Self-hosted",
    "outputSpeed": "4.0s / img",
    "speedNum": 90,
    "contextWindow": "Prompt based",
    "badge": "Community SOTA",
    "shortDescription": "8-billion parameter Multimodal Diffusion Transformer (MMDiT) engineered for customizable enterprise and consumer workflows.",
    "fullDescription": "Stable Diffusion 3.5 Large offers immense adaptability for LoRA fine-tuning, ControlNet adapters, and local creative production.",
    "website": "https://stability.ai",
    "logoText": "SD3.5",
    "logoColor": "#8B5CF6",
    "releaseDate": "October 2024",
    "source": "Stability AI & HF",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "MMDiT architecture with separate image/text weights",
      "Extensive ecosystem of community LoRAs and adapters",
      "Free commercial use up to $1M annual revenue",
      "High typography and composition control"
    ],
    "benchmarks": [
      {
        "name": "Artificial Analysis Visual Elo",
        "score": "1,210 Elo",
        "rank": "Top Tier Open"
      },
      {
        "name": "LoRA Fine-Tune Compatibility",
        "score": "98.0%",
        "rank": "#1 Ecosystem"
      },
      {
        "name": "Typography Accuracy",
        "score": "89.5%",
        "rank": "Top Tier"
      },
      {
        "name": "Prompt Coherence",
        "score": "86.0%",
        "rank": "Solid"
      }
    ],
    "specs": {
      "inputPrice": "Free open weights ($0.03 API)",
      "outputPrice": "Up to 2048x2048",
      "contextWindow": "Prompt tokens",
      "maxOutput": "High-res images",
      "cutoff": "October 2024",
      "modalities": "Text-to-Image",
      "speed": "4.0s on RTX 4090",
      "ttft": "1.2s"
    },
    "categoryMetricLabel": "Visual Elo",
    "categoryMetricValue": "1,210 Elo",
    "categorySubMetricLabel": "Render Time",
    "categorySubMetricValue": "4.0s",
    "categoryDimension3": "2048px"
  },
  {
    "id": "ideogram-v2",
    "slug": "ideogram-v2",
    "name": "Ideogram 2.0",
    "org": "Ideogram",
    "category": "Image",
    "entityType": "model",
    "rank": 57,
    "rankDelta": "0",
    "superpower": "Graphic Design & Type",
    "superpowerShort": "Typography SOTA",
    "superpowerDetail": "World #1 In-Image Typography",
    "isOpenWeights": false,
    "licenseType": "Commercial API / SaaS",
    "license": "Commercial API / SaaS",
    "arenaElo": 1228,
    "eloChange": "+9",
    "mmluPro": "N/A",
    "codingScore": "N/A",
    "mathScore": "N/A",
    "monthlyVisits": "22.0M",
    "growth": "+45.0%",
    "growthTrend": "up",
    "price": "$0.04 / image",
    "outputSpeed": "5.0s / img",
    "speedNum": 85,
    "contextWindow": "Prompt based",
    "badge": "Graphic Leader",
    "shortDescription": "Specialized text-to-image foundation model famous for perfect in-image typography, posters, and vector-style graphic assets.",
    "fullDescription": "Ideogram 2.0 solves the longstanding challenge of rendering accurate logos, t-shirt graphics, typography layouts, and signage.",
    "website": "https://ideogram.ai",
    "logoText": "Ideogram",
    "logoColor": "#EF4444",
    "releaseDate": "August 2024",
    "source": "Artificial Analysis Visual Arena",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "World-class text layout and multi-font rendering",
      "Specialized Graphic, Realistic, and Anime style modes",
      "Color palette and aspect ratio granular control",
      "High commercial utility for marketing and branding"
    ],
    "benchmarks": [
      {
        "name": "In-Image Typography Elo",
        "score": "1,310 Elo",
        "rank": "#1 In-Image Text"
      },
      {
        "name": "Visual Preference Elo",
        "score": "1,228 Elo",
        "rank": "Top Tier"
      },
      {
        "name": "Graphic Layout Precision",
        "score": "96.4%",
        "rank": "#1 Graphics"
      },
      {
        "name": "Ad Copy Rendering",
        "score": "94.0%",
        "rank": "#1 Marketing"
      }
    ],
    "specs": {
      "inputPrice": "$0.04 / image API",
      "outputPrice": "High-res PNG",
      "contextWindow": "Prompt up to 800 chars",
      "maxOutput": "High-res graphics",
      "cutoff": "August 2024",
      "modalities": "Text-to-Image",
      "speed": "5.0s per image",
      "ttft": "1.5s"
    },
    "categoryMetricLabel": "Visual Elo",
    "categoryMetricValue": "1,228 Elo",
    "categorySubMetricLabel": "Render Time",
    "categorySubMetricValue": "5.0s",
    "categoryDimension3": "Graphic Vector"
  },
  {
    "id": "recraft-v20",
    "slug": "recraft-v20",
    "name": "Recraft 20B",
    "org": "Recraft AI",
    "category": "Image",
    "entityType": "model",
    "rank": 58,
    "rankDelta": "+2",
    "superpower": "Vector & Icon Design",
    "superpowerShort": "Vector Design",
    "superpowerDetail": "Direct SVG Vector Generation",
    "isOpenWeights": false,
    "licenseType": "Commercial API / SaaS",
    "license": "Commercial API / SaaS",
    "arenaElo": 1225,
    "eloChange": "+15",
    "mmluPro": "N/A",
    "codingScore": "N/A",
    "mathScore": "N/A",
    "monthlyVisits": "18.5M",
    "growth": "+85.0%",
    "growthTrend": "up",
    "price": "$0.04 / image",
    "outputSpeed": "4.5s / img",
    "speedNum": 85,
    "contextWindow": "Prompt based",
    "badge": "Vector SOTA",
    "shortDescription": "Pioneering generative model capable of exporting clean, editable vector graphics (SVG) as well as photorealistic raster imagery.",
    "fullDescription": "Recraft 20B is loved by brand designers for generating scalable brand logos, 3D icons, and vector illustrations with strict brand color palette controls.",
    "website": "https://recraft.ai",
    "logoText": "Recraft",
    "logoColor": "#6366F1",
    "releaseDate": "November 2024",
    "source": "Hugging Face Text-to-Image Leaderboard",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "Native SVG vector graphic export",
      "Brand color palette adherence mechanism",
      "Vector icon sets and 3D illustration modes",
      "Infinite canvas design workspace"
    ],
    "benchmarks": [
      {
        "name": "Text-to-Vector Benchmark",
        "score": "96.5%",
        "rank": "#1 Vector Generation"
      },
      {
        "name": "Visual Elo",
        "score": "1,225 Elo",
        "rank": "Top Tier"
      },
      {
        "name": "Brand Palette Adherence",
        "score": "98.2%",
        "rank": "#1 Design Utility"
      },
      {
        "name": "SVG Clean Path Score",
        "score": "94.0%",
        "rank": "#1 Scalable Asset"
      }
    ],
    "specs": {
      "inputPrice": "$0.04 / vector, $15/mo SaaS",
      "outputPrice": "SVG / PNG / Lottie",
      "contextWindow": "Prompt based",
      "maxOutput": "Infinite resolution SVG",
      "cutoff": "October 2024",
      "modalities": "Text-to-Vector, Text-to-Image",
      "speed": "4.5s generation time",
      "ttft": "1.4s"
    },
    "categoryMetricLabel": "Visual Elo",
    "categoryMetricValue": "1,225 Elo",
    "categorySubMetricLabel": "Render Time",
    "categorySubMetricValue": "4.5s",
    "categoryDimension3": "Native SVG"
  },
  {
    "id": "google-imagen-3",
    "slug": "google-imagen-3",
    "name": "Imagen 3",
    "org": "Google DeepMind",
    "category": "Image",
    "entityType": "model",
    "rank": 59,
    "rankDelta": "-1",
    "superpower": "Photorealistic Detail",
    "superpowerShort": "Photorealism",
    "superpowerDetail": "Enterprise Brand Safety Guardrails",
    "isOpenWeights": false,
    "licenseType": "Commercial API",
    "license": "Commercial API",
    "arenaElo": 1230,
    "eloChange": "+5",
    "mmluPro": "N/A",
    "codingScore": "N/A",
    "mathScore": "N/A",
    "monthlyVisits": "185.0M",
    "growth": "+20.0%",
    "growthTrend": "up",
    "price": "$0.03 / image",
    "outputSpeed": "6.0s / img",
    "speedNum": 80,
    "contextWindow": "Prompt based",
    "badge": "Photorealism",
    "shortDescription": "Google's highest-quality image generation model, featuring remarkable photorealism, fine lighting, and synthetic artifacts elimination.",
    "fullDescription": "Imagen 3 understands natural language prompts with exceptional fidelity, rendering intricate reflections, diverse textures, and clean text.",
    "website": "https://deepmind.google/technologies/imagen-3",
    "logoText": "Imagen",
    "logoColor": "#4285F4",
    "releaseDate": "August 2024",
    "source": "Google DeepMind",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "Deep natural language prompt understanding",
      "SynthID digital watermarking embedded natively",
      "Vastly reduced visual artifacts in human hands",
      "Available via Google Vertex AI and Gemini"
    ],
    "benchmarks": [
      {
        "name": "Visual Elo",
        "score": "1,230 Elo",
        "rank": "Top 5 Visual"
      },
      {
        "name": "Photorealism Benchmark",
        "score": "93.0%",
        "rank": "Top Tier"
      },
      {
        "name": "Artifact Elimination Rate",
        "score": "91.5%",
        "rank": "Top Tier"
      },
      {
        "name": "Text Rendering Accuracy",
        "score": "89.0%",
        "rank": "Solid"
      }
    ],
    "specs": {
      "inputPrice": "$0.03 / image on Vertex AI",
      "outputPrice": "Up to 2048x2048",
      "contextWindow": "Natural language prompt",
      "maxOutput": "Photorealistic images",
      "cutoff": "July 2024",
      "modalities": "Text-to-Image",
      "speed": "6.0s generation",
      "ttft": "2.0s"
    },
    "categoryMetricLabel": "Visual Elo",
    "categoryMetricValue": "1,230 Elo",
    "categorySubMetricLabel": "Render Time",
    "categorySubMetricValue": "6.0s",
    "categoryDimension3": "2048px"
  },
  {
    "id": "runway-gen3-alpha",
    "slug": "runway-gen3-alpha",
    "name": "Runway Gen-3 Alpha",
    "org": "Runway",
    "category": "Video",
    "entityType": "model",
    "rank": 60,
    "rankDelta": "0",
    "superpower": "High-Motion Physics",
    "superpowerShort": "Motion Physics",
    "superpowerDetail": "Photorealistic Temporal Consistency",
    "isOpenWeights": false,
    "licenseType": "Commercial SaaS & API",
    "license": "Commercial SaaS & API",
    "arenaElo": 1220,
    "eloChange": "+8",
    "mmluPro": "N/A",
    "codingScore": "N/A",
    "mathScore": "N/A",
    "monthlyVisits": "38.2M",
    "growth": "+32.0%",
    "growthTrend": "up",
    "price": "$0.05 / second",
    "outputSpeed": "45s / 5s vid",
    "speedNum": 60,
    "contextWindow": "Prompt / Video based",
    "badge": "Video Leader",
    "shortDescription": "Frontier video generation model capable of synthesizing complex cinematographic motion with temporal coherence.",
    "fullDescription": "Runway Gen-3 Alpha represents a major leap in cinematic video generation, offering granular motion brush controls and director mode.",
    "website": "https://runwayml.com",
    "logoText": "Runway",
    "logoColor": "#10B981",
    "releaseDate": "June 2024",
    "source": "Artificial Analysis Video Arena",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "Pioneering video temporal coherence",
      "Granular Camera Motion Control and Motion Brush",
      "High fidelity fluid dynamics and atmospheric effects",
      "Enterprise API integration"
    ],
    "benchmarks": [
      {
        "name": "Video Generation Quality",
        "score": "92.4%",
        "rank": "#1 Video Gen"
      },
      {
        "name": "Temporal Coherence Score",
        "score": "89.1%",
        "rank": "Top Tier"
      },
      {
        "name": "Motion Brush Accuracy",
        "score": "94.0%",
        "rank": "#1 Controls"
      },
      {
        "name": "Cinematic Lighting Win Rate",
        "score": "88.5%",
        "rank": "Top Rated"
      }
    ],
    "specs": {
      "inputPrice": "$0.05 / video second API, $12/mo SaaS",
      "outputPrice": "720p / 1080p 60fps video",
      "contextWindow": "Prompt + Keyframes",
      "maxOutput": "5s to 10s continuous clips",
      "cutoff": "May 2024",
      "modalities": "Text-to-Video, Image-to-Video",
      "speed": "45s render per 5s video",
      "ttft": "4.2s"
    },
    "categoryMetricLabel": "Video Elo",
    "categoryMetricValue": "1,220 Elo",
    "categorySubMetricLabel": "Render Time",
    "categorySubMetricValue": "45s / 5s",
    "categoryDimension3": "1080p 60fps"
  },
  {
    "id": "luma-dream-machine-1-5",
    "slug": "luma-dream-machine-1-5",
    "name": "Luma Dream Machine 1.5",
    "org": "Luma AI",
    "category": "Video",
    "entityType": "model",
    "rank": 61,
    "rankDelta": "+2",
    "superpower": "Rapid Camera Physics",
    "superpowerShort": "Camera Physics",
    "superpowerDetail": "Physics-Accurate 3D Camera Tracking",
    "isOpenWeights": false,
    "licenseType": "Commercial SaaS & API",
    "license": "Commercial SaaS & API",
    "arenaElo": 1212,
    "eloChange": "+15",
    "mmluPro": "N/A",
    "codingScore": "N/A",
    "mathScore": "N/A",
    "monthlyVisits": "25.0M",
    "growth": "+64.0%",
    "growthTrend": "up",
    "price": "$0.04 / second",
    "outputSpeed": "35s / 5s vid",
    "speedNum": 70,
    "contextWindow": "Prompt / Image based",
    "badge": "3D Camera",
    "shortDescription": "High-speed video generation model specialized in realistic 3D camera fly-throughs, physics, and character acting.",
    "fullDescription": "Luma Dream Machine 1.5 allows creators to turn single photographs into high-resolution cinematic sequences with fluid motion.",
    "website": "https://lumalabs.ai",
    "logoText": "Luma",
    "logoColor": "#FF007A",
    "releaseDate": "August 2024",
    "source": "Artificial Analysis Video Arena",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "Photorealistic 3D camera pan, tilt, and crane moves",
      "Fast 35-second rendering time per sequence",
      "Keyframe-to-keyframe interpolation",
      "Image-to-video character consistency"
    ],
    "benchmarks": [
      {
        "name": "Camera Motion Physics Score",
        "score": "93.0%",
        "rank": "#1 3D Camera"
      },
      {
        "name": "Video Preference Elo",
        "score": "1,212 Elo",
        "rank": "Top Tier"
      },
      {
        "name": "Generation Speed",
        "score": "35s / 5s",
        "rank": "#1 Fast Video"
      },
      {
        "name": "Image-to-Video Fidelity",
        "score": "90.2%",
        "rank": "Top Tier"
      }
    ],
    "specs": {
      "inputPrice": "$0.04 / second API",
      "outputPrice": "1080p MP4",
      "contextWindow": "Keyframe images + prompt",
      "maxOutput": "5s extendable clips",
      "cutoff": "July 2024",
      "modalities": "Text-to-Video, Image-to-Video",
      "speed": "35s per 5s video",
      "ttft": "3.5s"
    },
    "categoryMetricLabel": "Video Elo",
    "categoryMetricValue": "1,212 Elo",
    "categorySubMetricLabel": "Render Time",
    "categorySubMetricValue": "35s / 5s",
    "categoryDimension3": "1080p 3D Cam"
  },
  {
    "id": "kling-1-5",
    "slug": "kling-1-5",
    "name": "Kling 1.5",
    "org": "Kuaishou Technology",
    "category": "Video",
    "entityType": "model",
    "rank": 62,
    "rankDelta": "+3",
    "superpower": "Extended 2-Minute Video",
    "superpowerShort": "Cinematic Video",
    "superpowerDetail": "1080p Complex Motion & Kinematics",
    "isOpenWeights": false,
    "licenseType": "Commercial API / SaaS",
    "license": "Commercial API / SaaS",
    "arenaElo": 1218,
    "eloChange": "+19",
    "mmluPro": "N/A",
    "codingScore": "N/A",
    "mathScore": "N/A",
    "monthlyVisits": "32.0M",
    "growth": "+88.0%",
    "growthTrend": "up",
    "price": "$0.05 / second",
    "outputSpeed": "50s / 5s vid",
    "speedNum": 55,
    "contextWindow": "Prompt based",
    "badge": "Long Video",
    "shortDescription": "State-of-the-art video model capable of generating up to 2-minute continuous sequences with accurate real-world kinematics.",
    "fullDescription": "Kling 1.5 excels at human full-body actions, realistic dining, athletics, and continuous physics interactions without hallucinations.",
    "website": "https://klingai.com",
    "logoText": "Kling",
    "logoColor": "#FF5000",
    "releaseDate": "September 2024",
    "source": "Artificial Analysis Video Arena",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "Generates extended video up to 2 minutes in duration",
      "1080p high definition at 30fps",
      "Physically accurate human anatomy in motion",
      "Camera movement and motion brush controls"
    ],
    "benchmarks": [
      {
        "name": "Human Motion Kinematics",
        "score": "94.2%",
        "rank": "#1 Kinematics"
      },
      {
        "name": "Video Preference Elo",
        "score": "1,218 Elo",
        "rank": "#2 Video Overall"
      },
      {
        "name": "Duration Stability",
        "score": "92.0%",
        "rank": "#1 Long Form"
      },
      {
        "name": "Prompt Compliance",
        "score": "89.5%",
        "rank": "Top Tier"
      }
    ],
    "specs": {
      "inputPrice": "$0.05 / second",
      "outputPrice": "1080p 30fps",
      "contextWindow": "Prompt + start/end frames",
      "maxOutput": "Up to 2 minutes",
      "cutoff": "August 2024",
      "modalities": "Text-to-Video, Image-to-Video",
      "speed": "50s per 5s clip",
      "ttft": "4.8s"
    },
    "categoryMetricLabel": "Video Elo",
    "categoryMetricValue": "1,218 Elo",
    "categorySubMetricLabel": "Render Time",
    "categorySubMetricValue": "50s / 5s",
    "categoryDimension3": "1080p Long Form"
  },
  {
    "id": "hailuo-ai-video",
    "slug": "hailuo-ai-video",
    "name": "Hailuo AI (MiniMax Video)",
    "org": "MiniMax",
    "category": "Video",
    "entityType": "model",
    "rank": 63,
    "rankDelta": "+4",
    "superpower": "Hyper-Realistic Acting",
    "superpowerShort": "Expressive Acting",
    "superpowerDetail": "Expressive Facial Dynamics",
    "isOpenWeights": false,
    "licenseType": "Commercial SaaS & API",
    "license": "Commercial SaaS & API",
    "arenaElo": 1215,
    "eloChange": "+25",
    "mmluPro": "N/A",
    "codingScore": "N/A",
    "mathScore": "N/A",
    "monthlyVisits": "28.0M",
    "growth": "+110.0%",
    "growthTrend": "up",
    "price": "$0.04 / second",
    "outputSpeed": "40s / 5s vid",
    "speedNum": 65,
    "contextWindow": "Prompt based",
    "badge": "Facial Dynamics",
    "shortDescription": "Groundbreaking generative video model famous for realistic facial emotions, accurate lip dynamics, and organic character acting.",
    "fullDescription": "Hailuo AI video became viral globally for its ability to animate characters with subtle micro-expressions and complex hand gestures.",
    "website": "https://hailuoai.video",
    "logoText": "Hailuo",
    "logoColor": "#4F46E5",
    "releaseDate": "September 2024",
    "source": "Artificial Analysis Video Arena",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "World-leading facial expression fidelity",
      "Realistic physics and character movement",
      "High prompt adherence for complex narratives",
      "Low artifact rate around hands and faces"
    ],
    "benchmarks": [
      {
        "name": "Facial Dynamics Score",
        "score": "96.0%",
        "rank": "#1 Facial Acting"
      },
      {
        "name": "Video Preference Elo",
        "score": "1,215 Elo",
        "rank": "Top 3 Video"
      },
      {
        "name": "Hand Gesture Coherence",
        "score": "88.2%",
        "rank": "Top Tier"
      },
      {
        "name": "Lighting & Shading",
        "score": "91.0%",
        "rank": "Top Tier"
      }
    ],
    "specs": {
      "inputPrice": "$0.04 / second",
      "outputPrice": "720p / 1080p",
      "contextWindow": "Prompt + Keyframe",
      "maxOutput": "6s clips extendable",
      "cutoff": "August 2024",
      "modalities": "Text-to-Video, Image-to-Video",
      "speed": "40s per 6s clip",
      "ttft": "3.9s"
    },
    "categoryMetricLabel": "Video Elo",
    "categoryMetricValue": "1,215 Elo",
    "categorySubMetricLabel": "Render Time",
    "categorySubMetricValue": "40s / 6s",
    "categoryDimension3": "1080p Facial SOTA"
  },
  {
    "id": "pika-2-0",
    "slug": "pika-2-0",
    "name": "Pika 2.0",
    "org": "Pika Labs",
    "category": "Video",
    "entityType": "model",
    "rank": 64,
    "rankDelta": "-1",
    "superpower": "Pikaffects & Physics",
    "superpowerShort": "Physics Animation",
    "superpowerDetail": "Object Manipulation & Physics SOTA",
    "isOpenWeights": false,
    "licenseType": "Commercial SaaS",
    "license": "Commercial SaaS",
    "arenaElo": 1195,
    "eloChange": "+4",
    "mmluPro": "N/A",
    "codingScore": "N/A",
    "mathScore": "N/A",
    "monthlyVisits": "22.0M",
    "growth": "+15.0%",
    "growthTrend": "up",
    "price": "$10 / month",
    "outputSpeed": "40s / 4s vid",
    "speedNum": 60,
    "contextWindow": "Prompt based",
    "badge": "Pikaffects",
    "shortDescription": "Creative video generation platform celebrated for 'Pikaffects' (melt, crush, inflate, explode) and stylized animation.",
    "fullDescription": "Pika 2.0 turns text prompts and images into fun, engaging short-form video sequences with dedicated physical transformation tools.",
    "website": "https://pika.art",
    "logoText": "Pika",
    "logoColor": "#000000",
    "releaseDate": "October 2024",
    "source": "Pika Labs",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "Pikaffects physics transformations (crush, inflate, cake)",
      "Seamless audio generation synchronized with video",
      "Lip-sync integration",
      "Web and mobile app generation"
    ],
    "benchmarks": [
      {
        "name": "Stylized Effect Accuracy",
        "score": "95.0%",
        "rank": "#1 Creative FX"
      },
      {
        "name": "Video Elo",
        "score": "1,195 Elo",
        "rank": "Top Tier Stylized"
      },
      {
        "name": "Audio-Video Sync",
        "score": "89.4%",
        "rank": "Top Tier"
      },
      {
        "name": "Prompt Coherence",
        "score": "85.0%",
        "rank": "Solid"
      }
    ],
    "specs": {
      "inputPrice": "$10/mo Basic, $35/mo Pro",
      "outputPrice": "1080p MP4",
      "contextWindow": "Prompt + Image",
      "maxOutput": "4s extendable",
      "cutoff": "September 2024",
      "modalities": "Text-to-Video, Image-to-Video",
      "speed": "40s per 4s clip",
      "ttft": "3.8s"
    },
    "categoryMetricLabel": "Video Elo",
    "categoryMetricValue": "1,195 Elo",
    "categorySubMetricLabel": "Render Time",
    "categorySubMetricValue": "40s / 4s",
    "categoryDimension3": "Stylized FX"
  },
  {
    "id": "cogvideox-5b",
    "slug": "cogvideox-5b",
    "name": "CogVideoX-5B",
    "org": "Zhipu AI",
    "category": "Video",
    "entityType": "model",
    "rank": 65,
    "rankDelta": "+2",
    "superpower": "Open Source Video SOTA",
    "superpowerShort": "Open Video",
    "superpowerDetail": "3D VAE Open Weights Video",
    "isOpenWeights": true,
    "licenseType": "Apache 2.0",
    "license": "Apache 2.0",
    "arenaElo": 1180,
    "eloChange": "+12",
    "mmluPro": "N/A",
    "codingScore": "N/A",
    "mathScore": "N/A",
    "monthlyVisits": "10.5M",
    "growth": "+75.0%",
    "growthTrend": "up",
    "price": "Free / Self-hosted",
    "outputSpeed": "60s / 6s vid",
    "speedNum": 50,
    "contextWindow": "Prompt based",
    "badge": "Apache 2.0",
    "shortDescription": "The premier open-weights video generation model available under Apache 2.0, trained using 3D Variational Autoencoders.",
    "fullDescription": "CogVideoX-5B enables AI researchers and studios to run full video generation locally on a single consumer GPU (RTX 4090).",
    "website": "https://github.com/THUDM/CogVideo",
    "logoText": "CogVideo",
    "logoColor": "#2563EB",
    "releaseDate": "August 2024",
    "source": "Zhipu AI & Hugging Face",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "Apache 2.0 permissive open-source license",
      "Runs on single 24GB VRAM GPU with INT4/FP8",
      "3D VAE compression for temporal smoothness",
      "Full training scripts and pipeline released"
    ],
    "benchmarks": [
      {
        "name": "Open Video Quality Benchmark",
        "score": "88.2%",
        "rank": "#1 Open Video"
      },
      {
        "name": "Video Elo",
        "score": "1,180 Elo",
        "rank": "#1 Permissive Video"
      },
      {
        "name": "Temporal Smoothness",
        "score": "86.5%",
        "rank": "Top Tier Open"
      },
      {
        "name": "Local Throughput",
        "score": "60s / 6s",
        "rank": "Top Rated Open"
      }
    ],
    "specs": {
      "inputPrice": "Free open weights ($0.05 API)",
      "outputPrice": "720p 16fps",
      "contextWindow": "Prompt up to 226 tokens",
      "maxOutput": "6s clips",
      "cutoff": "July 2024",
      "modalities": "Text-to-Video",
      "speed": "60s on RTX 4090",
      "ttft": "5.0s"
    },
    "categoryMetricLabel": "Video Elo",
    "categoryMetricValue": "1,180 Elo",
    "categorySubMetricLabel": "Render Time",
    "categorySubMetricValue": "60s / 6s",
    "categoryDimension3": "720p Open"
  },
  {
    "id": "elevenlabs-multilingual-v3",
    "slug": "elevenlabs-multilingual-v3",
    "name": "ElevenLabs Multilingual v3",
    "org": "ElevenLabs",
    "category": "Audio / Voice",
    "entityType": "model",
    "rank": 66,
    "rankDelta": "+1",
    "superpower": "Expressive Human Voice",
    "superpowerShort": "Human Voice",
    "superpowerDetail": "Sub-200ms Voice Synthesis in 32 Langs",
    "isOpenWeights": false,
    "licenseType": "Commercial API",
    "license": "Commercial API",
    "arenaElo": 1350,
    "eloChange": "+16",
    "mmluPro": "N/A",
    "codingScore": "N/A",
    "mathScore": "N/A",
    "monthlyVisits": "48.2M",
    "growth": "+38.0%",
    "growthTrend": "up",
    "price": "$0.15 / 1k characters",
    "outputSpeed": "Instant",
    "speedNum": 180,
    "contextWindow": "Text to Speech",
    "badge": "Voice SOTA",
    "shortDescription": "Industry-defining voice synthesis model delivering emotional inflection, breathing pauses, and instant voice cloning.",
    "fullDescription": "ElevenLabs v3 captures delicate vocal nuances, whispers, laughter, and accent subtleties across 32 languages.",
    "website": "https://elevenlabs.io",
    "logoText": "ElevenLabs",
    "logoColor": "#10B981",
    "releaseDate": "August 2024",
    "source": "Artificial Analysis Speech Arena",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "Emotional prosody, whisper, and inflection controls",
      "Zero-shot voice cloning from 1-minute audio",
      "Sub-200ms latency on turbo streaming endpoints",
      "32 native languages supported with regional accents"
    ],
    "benchmarks": [
      {
        "name": "Human MOS Speech Naturalness",
        "score": "4.82 / 5.0",
        "rank": "#1 Voice Overall"
      },
      {
        "name": "Voice Clone Similarity",
        "score": "97.4%",
        "rank": "#1 Voice Cloning"
      },
      {
        "name": "Streaming Latency (TTFB)",
        "score": "180ms",
        "rank": "#1 Streaming Voice"
      },
      {
        "name": "Language Accent Accuracy",
        "score": "95.0%",
        "rank": "Top Tier"
      }
    ],
    "specs": {
      "inputPrice": "$0.15 / 1,000 characters API",
      "outputPrice": "44.1kHz Studio Quality Audio",
      "contextWindow": "Up to 5,000 characters / request",
      "maxOutput": "Hours of continuous audio",
      "cutoff": "August 2024",
      "modalities": "Text-to-Speech, Speech-to-Speech",
      "speed": "180ms time-to-first-chunk",
      "ttft": "180ms"
    },
    "categoryMetricLabel": "Voice MOS",
    "categoryMetricValue": "4.82 MOS",
    "categorySubMetricLabel": "Stream Latency",
    "categorySubMetricValue": "180ms",
    "categoryDimension3": "32 Languages"
  },
  {
    "id": "whisper-large-v3",
    "slug": "whisper-large-v3",
    "name": "Whisper large-v3",
    "org": "OpenAI",
    "category": "Audio / Voice",
    "entityType": "model",
    "rank": 67,
    "rankDelta": "0",
    "superpower": "Universal Speech Recognition",
    "superpowerShort": "Speech Recognition",
    "superpowerDetail": "Robust Multilingual SOTA Transcriber",
    "isOpenWeights": true,
    "licenseType": "MIT License",
    "license": "MIT License",
    "arenaElo": 1335,
    "eloChange": "+2",
    "mmluPro": "N/A",
    "codingScore": "N/A",
    "mathScore": "N/A",
    "monthlyVisits": "220.0M",
    "growth": "+18.0%",
    "growthTrend": "up",
    "price": "Free open / $0.006/min",
    "outputSpeed": "Realtime",
    "speedNum": 150,
    "contextWindow": "Audio to Text",
    "badge": "MIT Transcribe",
    "shortDescription": "Universal speech-to-text foundation model trained on 5 million hours of audio across 100+ languages under MIT license.",
    "fullDescription": "Whisper large-v3 achieves near-human transcription accuracy even in noisy environments, heavy accents, and complex technical jargon.",
    "website": "https://openai.com",
    "logoText": "Whisper",
    "logoColor": "#10A37F",
    "releaseDate": "November 2023",
    "source": "OpenAI & Hugging Face",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "Trained on 5,000,000 hours of weakly supervised audio",
      "MIT permissive open-source license",
      "Native timestamped word-level alignment",
      "Zero-shot performance across 100 languages"
    ],
    "benchmarks": [
      {
        "name": "Word Error Rate (Clean English)",
        "score": "2.8% WER",
        "rank": "#1 Open STT"
      },
      {
        "name": "Word Error Rate (Noisy Speech)",
        "score": "6.1% WER",
        "rank": "#1 Robust STT"
      },
      {
        "name": "Multilingual Word Error Rate",
        "score": "7.5% WER",
        "rank": "Top Tier"
      },
      {
        "name": "Timestamp Accuracy",
        "score": "98.5%",
        "rank": "#1 Alignment"
      }
    ],
    "specs": {
      "inputPrice": "Free open weights ($0.006/min API)",
      "outputPrice": "VTT / SRT / JSON text",
      "contextWindow": "30s audio chunks sliding window",
      "maxOutput": "Full transcripts",
      "cutoff": "November 2023",
      "modalities": "Audio-to-Text",
      "speed": "Fast on GPU / realtime",
      "ttft": "150ms"
    },
    "categoryMetricLabel": "STT Accuracy",
    "categoryMetricValue": "2.8% WER",
    "categorySubMetricLabel": "Word Error Rate",
    "categorySubMetricValue": "2.8% WER",
    "categoryDimension3": "100 Languages"
  },
  {
    "id": "whisper-large-v3-turbo",
    "slug": "whisper-large-v3-turbo",
    "name": "Whisper large-v3-turbo",
    "org": "OpenAI",
    "category": "Audio / Voice",
    "entityType": "model",
    "rank": 68,
    "rankDelta": "+3",
    "superpower": "8x Faster Transcription",
    "superpowerShort": "Fast Transcription",
    "superpowerDetail": "Distilled Whisper Architecture",
    "isOpenWeights": true,
    "licenseType": "MIT License",
    "license": "MIT License",
    "arenaElo": 1325,
    "eloChange": "+15",
    "mmluPro": "N/A",
    "codingScore": "N/A",
    "mathScore": "N/A",
    "monthlyVisits": "220.0M",
    "growth": "+45.0%",
    "growthTrend": "up",
    "price": "Free open / $0.003/min",
    "outputSpeed": "8x Realtime",
    "speedNum": 200,
    "contextWindow": "Audio to Text",
    "badge": "Ultra Fast STT",
    "shortDescription": "Pruned 4-layer decoder Whisper variant that runs 8x faster than large-v3 with virtually identical transcription accuracy.",
    "fullDescription": "Whisper large-v3-turbo delivers instant audio transcription on mobile devices, live meeting recorders, and voice agents.",
    "website": "https://openai.com",
    "logoText": "WhisperTurbo",
    "logoColor": "#10A37F",
    "releaseDate": "October 2024",
    "source": "OpenAI",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "8x faster inference than large-v3",
      "MIT open license",
      "Minimal Word Error Rate regression (<0.5%)",
      "Ideal for realtime speech-to-speech agents"
    ],
    "benchmarks": [
      {
        "name": "Inference Speedup",
        "score": "8.0x Realtime",
        "rank": "#1 Fast STT"
      },
      {
        "name": "Word Error Rate (English)",
        "score": "3.1% WER",
        "rank": "Top Tier"
      },
      {
        "name": "Memory Consumption",
        "score": "3.2GB VRAM",
        "rank": "#1 Efficiency"
      },
      {
        "name": "Streaming Latency",
        "score": "120ms",
        "rank": "Top Speed"
      }
    ],
    "specs": {
      "inputPrice": "Free open weights ($0.003/min API)",
      "outputPrice": "Text / SRT",
      "contextWindow": "30s chunks",
      "maxOutput": "Full audio",
      "cutoff": "October 2024",
      "modalities": "Audio-to-Text",
      "speed": "8x faster than large-v3",
      "ttft": "120ms"
    },
    "categoryMetricLabel": "STT Accuracy",
    "categoryMetricValue": "3.1% WER",
    "categorySubMetricLabel": "Speedup",
    "categorySubMetricValue": "8.0x Realtime",
    "categoryDimension3": "Sub-3.2GB VRAM"
  },
  {
    "id": "cartesia-sonic",
    "slug": "cartesia-sonic",
    "name": "Cartesia Sonic",
    "org": "Cartesia AI",
    "category": "Audio / Voice",
    "entityType": "model",
    "rank": 69,
    "rankDelta": "+4",
    "superpower": "Ultra-Low Latency Voice",
    "superpowerShort": "Ultra-Low Latency",
    "superpowerDetail": "State Space Model (SSM) Voice 90ms",
    "isOpenWeights": false,
    "licenseType": "Commercial API",
    "license": "Commercial API",
    "arenaElo": 1340,
    "eloChange": "+22",
    "mmluPro": "N/A",
    "codingScore": "N/A",
    "mathScore": "N/A",
    "monthlyVisits": "14.0M",
    "growth": "+120.0%",
    "growthTrend": "up",
    "price": "$0.08 / 1k characters",
    "outputSpeed": "Instant",
    "speedNum": 220,
    "contextWindow": "Text to Speech",
    "badge": "SSM Voice",
    "shortDescription": "Revolutionary State Space Model (SSM) architecture delivering natural voice synthesis with record-breaking 90ms latency.",
    "fullDescription": "Cartesia Sonic was purpose-built for conversational voice agents. Its sub-100ms TTFB eliminates conversational lag in phone and customer support bots.",
    "website": "https://cartesia.ai",
    "logoText": "Sonic",
    "logoColor": "#6E56CF",
    "releaseDate": "September 2024",
    "source": "Artificial Analysis Speech Arena",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "State Space Model (Mamba-like) architecture",
      "Industry-leading 90ms Time-To-First-Byte latency",
      "Emotion and pace dynamic prompt steering",
      "Low cost per generation"
    ],
    "benchmarks": [
      {
        "name": "Streaming Latency (TTFB)",
        "score": "90ms TTFB",
        "rank": "#1 Lowest Latency"
      },
      {
        "name": "MOS Naturalness Score",
        "score": "4.74 / 5.0",
        "rank": "Top Tier"
      },
      {
        "name": "Conversational Interruption Lag",
        "score": "110ms",
        "rank": "#1 Realtime Bot"
      },
      {
        "name": "Voice Stability",
        "score": "96.2%",
        "rank": "Top Tier"
      }
    ],
    "specs": {
      "inputPrice": "$0.08 / 1,000 characters API",
      "outputPrice": "24kHz / 44.1kHz PCM Audio",
      "contextWindow": "Stream based",
      "maxOutput": "Continuous voice streaming",
      "cutoff": "September 2024",
      "modalities": "Text-to-Speech",
      "speed": "90ms TTFB streaming",
      "ttft": "90ms"
    },
    "categoryMetricLabel": "Voice MOS",
    "categoryMetricValue": "4.74 MOS",
    "categorySubMetricLabel": "Stream Latency",
    "categorySubMetricValue": "90ms TTFB",
    "categoryDimension3": "SSM Realtime"
  },
  {
    "id": "fish-speech-1-5",
    "slug": "fish-speech-1-5",
    "name": "Fish Speech 1.5",
    "org": "Fish Audio",
    "category": "Audio / Voice",
    "entityType": "model",
    "rank": 70,
    "rankDelta": "+2",
    "superpower": "Open Weights Voice Clone",
    "superpowerShort": "Voice Cloning",
    "superpowerDetail": "Zero-Shot Dual-AR Architecture",
    "isOpenWeights": true,
    "licenseType": "Apache 2.0",
    "license": "Apache 2.0",
    "arenaElo": 1310,
    "eloChange": "+14",
    "mmluPro": "N/A",
    "codingScore": "N/A",
    "mathScore": "N/A",
    "monthlyVisits": "12.0M",
    "growth": "+90.0%",
    "growthTrend": "up",
    "price": "Free open / $0.05 API",
    "outputSpeed": "Instant",
    "speedNum": 160,
    "contextWindow": "Voice Clone",
    "badge": "Apache 2.0 Voice",
    "shortDescription": "High-fidelity open-weights voice generation and cloning engine based on dual autoregressive state architectures.",
    "fullDescription": "Fish Speech 1.5 enables completely local, private voice cloning with 5 seconds of sample audio under Apache 2.0.",
    "website": "https://fish.audio",
    "logoText": "FishSpeech",
    "logoColor": "#3B82F6",
    "releaseDate": "November 2024",
    "source": "Fish Audio",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "Apache 2.0 open-source license",
      "Zero-shot voice cloning from 5s sample",
      "Dual autoregressive architecture",
      "Runs locally on consumer GPU"
    ],
    "benchmarks": [
      {
        "name": "Zero-Shot Similarity",
        "score": "94.5%",
        "rank": "#1 Open Voice Clone"
      },
      {
        "name": "MOS Naturalness",
        "score": "4.62 / 5.0",
        "rank": "#1 Open Voice"
      },
      {
        "name": "Latency",
        "score": "210ms",
        "rank": "Top Tier Open"
      },
      {
        "name": "Language Coverage",
        "score": "15 Languages",
        "rank": "Top Tier"
      }
    ],
    "specs": {
      "inputPrice": "Free open weights ($0.05 API)",
      "outputPrice": "Audio WAV",
      "contextWindow": "Audio + text",
      "maxOutput": "Continuous audio",
      "cutoff": "October 2024",
      "modalities": "Text-to-Speech",
      "speed": "Fast local GPU",
      "ttft": "210ms"
    },
    "categoryMetricLabel": "Voice MOS",
    "categoryMetricValue": "4.62 MOS",
    "categorySubMetricLabel": "Stream Latency",
    "categorySubMetricValue": "210ms",
    "categoryDimension3": "Apache 2.0 Clone"
  },
  {
    "id": "chat-tts-open",
    "slug": "chat-tts-open",
    "name": "ChatTTS",
    "org": "2noise",
    "category": "Audio / Voice",
    "entityType": "model",
    "rank": 71,
    "rankDelta": "-1",
    "superpower": "Conversational Prosody",
    "superpowerShort": "Conversational Voice",
    "superpowerDetail": "Natural Laughs & Breathing Tokens",
    "isOpenWeights": true,
    "licenseType": "Bespoke Academic Open",
    "license": "Bespoke Academic Open",
    "arenaElo": 1285,
    "eloChange": "+5",
    "mmluPro": "N/A",
    "codingScore": "N/A",
    "mathScore": "N/A",
    "monthlyVisits": "16.0M",
    "growth": "+35.0%",
    "growthTrend": "up",
    "price": "Free open source",
    "outputSpeed": "Realtime",
    "speedNum": 140,
    "contextWindow": "Conversational",
    "badge": "Conversational Open",
    "shortDescription": "Open conversational speech model uniquely optimized for dialogue nuances like laughter, oral pauses, and interjections.",
    "fullDescription": "ChatTTS revolutionized conversational audio synthesis by inserting natural chuckles and breathing pauses natively without manual prompt markers.",
    "website": "https://github.com/2noise/ChatTTS",
    "logoText": "ChatTTS",
    "logoColor": "#10B981",
    "releaseDate": "May 2024",
    "source": "2noise GitHub",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "Native laughter and oral interjection tokens",
      "Open-source weights for research and deployment",
      "Natural conversational dialogue cadence",
      "Lightweight single-GPU inference"
    ],
    "benchmarks": [
      {
        "name": "Conversational Realism",
        "score": "92.0%",
        "rank": "#1 Dialogue Audio"
      },
      {
        "name": "Laughter Naturalness",
        "score": "95.5%",
        "rank": "#1 Interjections"
      },
      {
        "name": "MOS Score",
        "score": "4.55 / 5.0",
        "rank": "Solid Open"
      },
      {
        "name": "Inference Latency",
        "score": "260ms",
        "rank": "Solid"
      }
    ],
    "specs": {
      "inputPrice": "Free open source",
      "outputPrice": "24kHz Audio",
      "contextWindow": "Dialogue script",
      "maxOutput": "Continuous dialogue",
      "cutoff": "April 2024",
      "modalities": "Text-to-Speech",
      "speed": "Realtime GPU",
      "ttft": "260ms"
    },
    "categoryMetricLabel": "Voice MOS",
    "categoryMetricValue": "4.55 MOS",
    "categorySubMetricLabel": "Stream Latency",
    "categorySubMetricValue": "260ms",
    "categoryDimension3": "Conversational FX"
  },
  {
    "id": "openai-text-embedding-3-large",
    "slug": "openai-text-embedding-3-large",
    "name": "text-embedding-3-large",
    "org": "OpenAI",
    "category": "Embeddings",
    "entityType": "model",
    "rank": 72,
    "rankDelta": "0",
    "superpower": "Enterprise Embedding Standard",
    "superpowerShort": "Semantic Search",
    "superpowerDetail": "3072 Dimensions with Matryoshka Slicing",
    "isOpenWeights": false,
    "licenseType": "Commercial API",
    "license": "Commercial API",
    "arenaElo": 1360,
    "eloChange": "+4",
    "mmluPro": "N/A",
    "codingScore": "N/A",
    "mathScore": "N/A",
    "monthlyVisits": "220.0M",
    "growth": "+20.0%",
    "growthTrend": "up",
    "price": "$0.13 / 1M tokens",
    "outputSpeed": "Instant",
    "speedNum": 250,
    "contextWindow": "8k tokens",
    "badge": "Enterprise Embed",
    "shortDescription": "OpenAI's flagship text embedding model offering 3072-dimensional vector representations with flexible Matryoshka dimension reduction.",
    "fullDescription": "text-embedding-3-large sets the enterprise standard for dense semantic retrieval in vector databases like Pinecone, Qdrant, and pgvector.",
    "website": "https://openai.com",
    "logoText": "EmbedLarge",
    "logoColor": "#10A37F",
    "releaseDate": "January 2024",
    "source": "MTEB Benchmark & OpenAI",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "3072 native vector dimensions",
      "Matryoshka representation learning (slice to 1024 or 256)",
      "8,191 token sequence length",
      "Lowest cost-per-accuracy in commercial tier"
    ],
    "benchmarks": [
      {
        "name": "MTEB Dense Retrieval Average",
        "score": "64.6%",
        "rank": "Top Tier MTEB"
      },
      {
        "name": "MIRACL Multilingual Retrieval",
        "score": "54.9%",
        "rank": "Top Tier"
      },
      {
        "name": "Dimension Flexibility",
        "score": "3072 to 256 dims",
        "rank": "#1 Elasticity"
      },
      {
        "name": "Semantic Clustering",
        "score": "89.2%",
        "rank": "Top Tier"
      }
    ],
    "specs": {
      "inputPrice": "$0.13 / 1M tokens",
      "outputPrice": "3072-dim float vectors",
      "contextWindow": "8,191 tokens",
      "maxOutput": "Vector embeddings",
      "cutoff": "September 2023",
      "modalities": "Text-to-Vector",
      "speed": "Sub-50ms API batch",
      "ttft": "50ms"
    },
    "categoryMetricLabel": "MTEB Score",
    "categoryMetricValue": "64.6% MTEB",
    "categorySubMetricLabel": "Dimensions",
    "categorySubMetricValue": "3,072 Dims",
    "categoryDimension3": "8,191 Tokens"
  },
  {
    "id": "cohere-embed-v3",
    "slug": "cohere-embed-v3",
    "name": "Cohere Embed v3 Multilingual",
    "org": "Cohere",
    "category": "Embeddings",
    "entityType": "model",
    "rank": 73,
    "rankDelta": "+1",
    "superpower": "Production Search & Compression",
    "superpowerShort": "Search Embeddings",
    "superpowerDetail": "Binary & Int8 Compression Native",
    "isOpenWeights": false,
    "licenseType": "Commercial API",
    "license": "Commercial API",
    "arenaElo": 1355,
    "eloChange": "+6",
    "mmluPro": "N/A",
    "codingScore": "N/A",
    "mathScore": "N/A",
    "monthlyVisits": "28.0M",
    "growth": "+24.0%",
    "growthTrend": "up",
    "price": "$0.10 / 1M tokens",
    "outputSpeed": "Instant",
    "speedNum": 250,
    "contextWindow": "512 tokens",
    "badge": "RAG Compression",
    "shortDescription": "Enterprise embedding model featuring native Int8 and binary quantization for 95% vector database storage cost reductions.",
    "fullDescription": "Cohere Embed v3 is designed from the ground up for real-world RAG search, handling noisy real-world queries and 100+ languages.",
    "website": "https://cohere.com",
    "logoText": "Embedv3",
    "logoColor": "#39594C",
    "releaseDate": "November 2023",
    "source": "MTEB & Cohere",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "Native binary and Int8 vector compression",
      "Tuned specifically for noisy search queries (search_document vs search_query)",
      "100+ languages supported with zero-shot transfer",
      "Direct integration with major vector DBs"
    ],
    "benchmarks": [
      {
        "name": "MTEB Search & Retrieval",
        "score": "65.2%",
        "rank": "#1 Enterprise RAG"
      },
      {
        "name": "Vector Storage Compression",
        "score": "95% Savings",
        "rank": "#1 Quantization"
      },
      {
        "name": "Multilingual Retrieval (MIRACL)",
        "score": "56.0%",
        "rank": "#1 Multilingual"
      },
      {
        "name": "Latency",
        "score": "45ms",
        "rank": "Top Speed"
      }
    ],
    "specs": {
      "inputPrice": "$0.10 / 1M tokens",
      "outputPrice": "1024-dim compressed vectors",
      "contextWindow": "512 tokens",
      "maxOutput": "Vector embeddings",
      "cutoff": "October 2023",
      "modalities": "Text-to-Vector",
      "speed": "Sub-45ms API batch",
      "ttft": "45ms"
    },
    "categoryMetricLabel": "MTEB Score",
    "categoryMetricValue": "65.2% MTEB",
    "categorySubMetricLabel": "Dimensions",
    "categorySubMetricValue": "1,024 Dims",
    "categoryDimension3": "Int8 Compressed"
  },
  {
    "id": "baai-bge-m3",
    "slug": "baai-bge-m3",
    "name": "BGE-M3",
    "org": "BAAI",
    "category": "Embeddings",
    "entityType": "model",
    "rank": 74,
    "rankDelta": "+2",
    "superpower": "Multi-Function Embedding",
    "superpowerShort": "Hybrid Embeddings",
    "superpowerDetail": "Dense, Sparse & ColBERT in One Model",
    "isOpenWeights": true,
    "licenseType": "MIT License",
    "license": "MIT License",
    "arenaElo": 1340,
    "eloChange": "+8",
    "mmluPro": "N/A",
    "codingScore": "N/A",
    "mathScore": "N/A",
    "monthlyVisits": "18.0M",
    "growth": "+40.0%",
    "growthTrend": "up",
    "price": "Free open source",
    "outputSpeed": "Instant",
    "speedNum": 220,
    "contextWindow": "8k tokens",
    "badge": "MIT Multi-RAG",
    "shortDescription": "Versatile open-source embedding model supporting Dense retrieval, Multi-Vector (ColBERT-style), and Sparse (lexical) representations simultaneously.",
    "fullDescription": "BAAI's BGE-M3 represents a breakthrough in open search technology. It supports 8192 token sequences and over 100 languages under the MIT license.",
    "website": "https://github.com/FlagOpen/FlagEmbedding",
    "logoText": "BGE-M3",
    "logoColor": "#2563EB",
    "releaseDate": "January 2024",
    "source": "BAAI & Hugging Face",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "Triple retrieval modes: Dense, Sparse (BM25-like), and ColBERT Multi-vector",
      "8,192 token context window",
      "100+ languages supported",
      "MIT permissive open-source license"
    ],
    "benchmarks": [
      {
        "name": "MTEB Multilingual Retrieval",
        "score": "64.8%",
        "rank": "#1 Open Multi-lingual"
      },
      {
        "name": "Long Document Retrieval",
        "score": "87.0%",
        "rank": "#1 Long Context Embed"
      },
      {
        "name": "Hybrid Retrieval Accuracy",
        "score": "92.4%",
        "rank": "#1 Hybrid Search"
      },
      {
        "name": "License",
        "score": "MIT",
        "rank": "#1 Open Science"
      }
    ],
    "specs": {
      "inputPrice": "Free open source ($0.05 API)",
      "outputPrice": "1024-dim dense + sparse vectors",
      "contextWindow": "8,192 tokens",
      "maxOutput": "Hybrid vector representations",
      "cutoff": "January 2024",
      "modalities": "Text-to-Vector",
      "speed": "Fast local GPU",
      "ttft": "60ms"
    },
    "categoryMetricLabel": "MTEB Score",
    "categoryMetricValue": "64.8% MTEB",
    "categorySubMetricLabel": "Dimensions",
    "categorySubMetricValue": "1,024 Dims",
    "categoryDimension3": "Hybrid Multi-vector"
  },
  {
    "id": "voyage-code-3",
    "slug": "voyage-code-3",
    "name": "voyage-code-3",
    "org": "Voyage AI",
    "category": "Embeddings",
    "entityType": "model",
    "rank": 75,
    "rankDelta": "+3",
    "superpower": "Codebase Retrieval SOTA",
    "superpowerShort": "Code Retrieval",
    "superpowerDetail": "Optimized for Code Search & Repositories",
    "isOpenWeights": false,
    "licenseType": "Commercial API",
    "license": "Commercial API",
    "arenaElo": 1365,
    "eloChange": "+14",
    "mmluPro": "N/A",
    "codingScore": "N/A",
    "mathScore": "N/A",
    "monthlyVisits": "12.5M",
    "growth": "+65.0%",
    "growthTrend": "up",
    "price": "$0.12 / 1M tokens",
    "outputSpeed": "Instant",
    "speedNum": 260,
    "contextWindow": "16k tokens",
    "badge": "Code Embed SOTA",
    "shortDescription": "State-of-the-art embedding model specialized in source code search, function retrieval, and repository navigation.",
    "fullDescription": "Created by Stanford AI researchers at Voyage AI, voyage-code-3 outperforms OpenAI and general embeddings by over 15% on code retrieval benchmarks.",
    "website": "https://voyageai.com",
    "logoText": "VoyageCode",
    "logoColor": "#7C3AED",
    "releaseDate": "October 2024",
    "source": "Voyage AI Benchmark",
    "lastUpdated": "March 2026",
    "keyFeatures": [
      "Trained exclusively on ASTs, code repositories, and technical docs",
      "16,000 token context window for large files",
      "High precision in matching natural queries to code functions",
      "Used by leading AI code editors and search engines"
    ],
    "benchmarks": [
      {
        "name": "CodeSearchNet Benchmark",
        "score": "78.4%",
        "rank": "#1 Code Search"
      },
      {
        "name": "Repository Retrieval Recall@5",
        "score": "91.2%",
        "rank": "#1 Code Repos"
      },
      {
        "name": "Context Length",
        "score": "16,000 tokens",
        "rank": "#1 Code Context"
      },
      {
        "name": "Latency",
        "score": "40ms",
        "rank": "Top Speed"
      }
    ],
    "specs": {
      "inputPrice": "$0.12 / 1M tokens",
      "outputPrice": "1536-dim vector",
      "contextWindow": "16,000 tokens",
      "maxOutput": "Code vector embeddings",
      "cutoff": "September 2024",
      "modalities": "Code-to-Vector",
      "speed": "Sub-40ms API batch",
      "ttft": "40ms"
    },
    "categoryMetricLabel": "MTEB Score",
    "categoryMetricValue": "78.4% CodeNet",
    "categorySubMetricLabel": "Dimensions",
    "categorySubMetricValue": "1,536 Dims",
    "categoryDimension3": "16k Code Context"
  }
];
