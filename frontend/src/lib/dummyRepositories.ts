import { Repository } from "./types";

const FAMOUS_REPOS: Omit<Repository, "id" | "createdAt" | "updatedAt">[] = [
  {
    name: "stable-diffusion-webui",
    owner: "AUTOMATIC1111",
    stars: 131800,
    language: "Python",
    description: "A comprehensive browser interface built on Gradio for running Stable Diffusion text-to-image and image-to-image models.",
    url: "https://github.com/AUTOMATIC1111/stable-diffusion-webui",
  },
  {
    name: "transformers",
    owner: "huggingface",
    stars: 129000,
    language: "Python",
    description: "State-of-the-art Machine Learning architectures (BERT, GPT, LLaMA, Whisper) for PyTorch, TensorFlow, and JAX.",
    url: "https://github.com/huggingface/transformers",
  },
  {
    name: "ComfyUI",
    owner: "comfyanonymous",
    stars: 48900,
    language: "Python",
    description: "A powerful, modular node-based graphic interface for running diffusion models in customizable, complex workflows.",
    url: "https://github.com/comfyanonymous/ComfyUI",
  },
  {
    name: "bark",
    owner: "suno-ai",
    stars: 32400,
    language: "Python",
    description: "Transformer-based audio generation model capable of highly realistic multi-lingual text-to-speech and sound effects.",
    url: "https://github.com/suno-ai/bark",
  },
  {
    name: "Ollama",
    owner: "ollama",
    stars: 84600,
    language: "Go",
    description: "Get up and running with large language models locally. Run Llama 3, Mistral, Gemma, and other models.",
    url: "https://github.com/ollama/ollama",
  },
  {
    name: "LangChain",
    owner: "langchain-ai",
    stars: 92100,
    language: "Python",
    description: "Building applications with LLMs through composability. Connect models to other sources of computation or data.",
    url: "https://github.com/langchain-ai/langchain",
  },
  {
    name: "LlamaIndex",
    owner: "run-llama",
    stars: 34500,
    language: "Python",
    description: "Data framework for your LLM applications to connect, index, and query custom data sources.",
    url: "https://github.com/run-llama/llama_index",
  },
  {
    name: "AutoGPT",
    owner: "Significant-Gravitas",
    stars: 165000,
    language: "Python",
    description: "An experimental open-source attempt to make GPT-4 fully autonomous. Pushing the boundaries of what is possible with AI.",
    url: "https://github.com/Significant-Gravitas/AutoGPT",
  },
  {
    name: "crewAI",
    owner: "crewAIInc",
    stars: 21500,
    language: "Python",
    description: "Framework for orchestrating role-playing, autonomous AI agents. Collaborative intelligence for complex workflows.",
    url: "https://github.com/crewAIInc/crewAI",
  },
  {
    name: "Open-WebUI",
    owner: "open-webui",
    stars: 43200,
    language: "TypeScript",
    description: "User-friendly WebUI for LLMs supporting Ollama, OpenAI-compatible APIs, and local models. Multi-user dashboard.",
    url: "https://github.com/open-webui/open-webui",
  },
  {
    name: "Continue",
    owner: "continuedev",
    stars: 18900,
    language: "TypeScript",
    description: "The open-source AI code assistant. Easily customize autocomplete and chat inside VS Code and JetBrains.",
    url: "https://github.com/continuedev/continue",
  },
  {
    name: "OpenHands",
    owner: "All-Hands-AI",
    stars: 31200,
    language: "Python",
    description: "An agentic AI software engineer capable of writing code, fixing bugs, and collaborating on complex projects.",
    url: "https://github.com/All-Hands-AI/OpenHands",
  },
  {
    name: "OpenInterpreter",
    owner: "OpenInterpreter",
    stars: 49800,
    language: "Python",
    description: "A natural language interface for your computer. Let LLMs run Python, Bash, and JavaScript scripts locally.",
    url: "https://github.com/OpenInterpreter/open-interpreter",
  },
  {
    name: "WhisperX",
    owner: "m-bain",
    stars: 12500,
    language: "Python",
    description: "Automatic speech recognition with word-level timestamps and speaker diarization using Faster-Whisper.",
    url: "https://github.com/m-bain/whisperX",
  },
  {
    name: "vllm",
    owner: "vllm-project",
    stars: 28400,
    language: "Python",
    description: "A high-throughput and memory-efficient LLM serving engine using PagedAttention optimization.",
    url: "https://github.com/vllm-project/vllm",
  },
  {
    name: "localai",
    owner: "mudler",
    stars: 23100,
    language: "Go",
    description: "Free, open-source local OpenAI-compatible API alternative. Run LLMs, generate audio, images locally on consumer hardware.",
    url: "https://github.com/mudler/LocalAI",
  },
  {
    name: "fabric",
    owner: "danielmiessler",
    stars: 21900,
    language: "Go",
    description: "An open-source framework for personal AI augmentation using crowd-sourced prompts and templates.",
    url: "https://github.com/danielmiessler/fabric",
  },
  {
    name: "qdrant",
    owner: "qdrant",
    stars: 19500,
    language: "Rust",
    description: "Vector Database for the next generation of AI applications. Fast, scalable, and built in Rust.",
    url: "https://github.com/qdrant/qdrant",
  },
  {
    name: "milvus",
    owner: "milvus-io",
    stars: 28700,
    language: "Go",
    description: "A highly-functional open-source vector database built to power spatial and semantic similarity search.",
    url: "https://github.com/milvus-io/milvus",
  },
  {
    name: "chroma",
    owner: "chroma-core",
    stars: 14500,
    language: "Python",
    description: "The AI-native open-source vector database. Designed to build and scale LLM apps easily.",
    url: "https://github.com/chroma-core/chroma",
  }
];

function generateDummyRepos(): Repository[] {
  const result: Repository[] = FAMOUS_REPOS.map((r, i) => {
    const updatedDate = new Date(Date.now() - (i * 3 + 2) * 60 * 60 * 1000).toISOString();
    return {
      id: `famous-${i}`,
      ...r,
      createdAt: updatedDate,
      updatedAt: updatedDate
    };
  });

  const ownersPrefix = ["Mind", "Alpha", "Vertex", "Core", "Helix", "Sync", "Quant", "Tensor", "Neuro", "Semantic", "Deep", "Cognitive", "Robo", "Auto", "Flow", "Open", "Mind", "Hyper", "Apex", "Logic"];
  const ownersSuffix = ["Labs", "AI", "Tech", "Software", "Corp", "Research", "Systems", "Technologies", "Hub", "Group", "Solutions", "Networks", "Foundations", "Intelligence", "Analytics"];
  const namePrefix = ["llama", "agent", "gpt", "embed", "vectra", "whisper", "diffusion", "model", "tensor", "prompt", "rag", "voice", "vision", "ocr", "speech", "video", "crawler", "evaluate", "infra", "tuner", "chat", "context", "search", "summarize", "analyze", "translate", "transcribe", "synthesize", "classify", "detect"];
  const nameSuffix = ["-flow", "-hub", "-core", "-sdk", "-cli", "-web", "-api", "-ui", "-run", "-tuner", "-engine", "-db", "-agent", "-mesh", "-chain", "-link", "-pilot", "-assistant", "-studio", "-bench", "-server", "-client", "-tuner", "-router", "-orchestrator", "-gateway", "-agent", "-ops", "-dev", "-tool"];
  const languages = ["Python", "TypeScript", "Rust", "Go", "C++", "JavaScript"];
  const categories = [
    "Large Language Models", "AI Agents", "Coding Assistants", "Machine Learning", "Deep Learning",
    "Computer Vision", "NLP", "Speech AI", "Voice AI", "OCR", "Image Generation", "Video Generation",
    "Automation", "Robotics", "Prompt Engineering", "RAG", "Vector Databases", "AI Infrastructure",
    "AI Evaluation", "Developer Tools"
  ];

  let seed = 42;
  function random(): number {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  function pickRandom<T>(arr: T[]): T {
    return arr[Math.floor(random() * arr.length)];
  }

  for (let i = 0; i < 310; i++) {
    const owner = `${pickRandom(ownersPrefix)}${pickRandom(ownersSuffix)}`;
    const name = `${pickRandom(namePrefix)}${pickRandom(nameSuffix)}`;
    const language = pickRandom(languages);
    const category = pickRandom(categories);
    const stars = Math.floor(random() * 85000) + 1200;
    
    const updatedDate = new Date(Date.now() - Math.floor(random() * 120 + 2) * 60 * 60 * 1000).toISOString();
    result.push({
      id: `gen-${i}`,
      name,
      owner,
      stars,
      language,
      description: `A highly capable and modular ${category.toLowerCase()} tool designed to optimize and scale modern developer workflows.`,
      url: `https://github.com/${owner}/${name}`,
      createdAt: updatedDate,
      updatedAt: updatedDate
    });
  }

  return result;
}

export const DUMMY_REPOSITORIES = generateDummyRepos();
