import type { AIModel, ModelDetail } from "@/lib/types";

const NOVAMIND_X1: AIModel = {
  id: "mock-novamind-x1",
  slug: "novamind-x1",
  name: "NovaMind X1",
  creator: "NovaMind AI",
  provider: { id: "mock-provider-novamind", slug: "novamind-ai", name: "NovaMind AI", logoUrl: null },
  modelType: "TEXT",
  modality: "Text",
  primaryTask: "Reasoning",
  parameterSize: "405B",
  contextWindow: "256K tokens",
  releaseDate: "June 2026",
  openSource: false,
  description:
    "NovaMind X1 is a flagship general-purpose reasoning model designed for complex analysis, coding, research, and planning workflows. It combines advanced reasoning with long-context understanding, allowing it to process large documents, technical specifications, and multi-step problems while maintaining context across extended interactions.\n\nThe model supports structured outputs, function calling, and external tool integration, making it suitable for both conversational applications and autonomous workflow automation. NovaMind X1 is primarily targeted at enterprise applications where accuracy, reasoning depth, and reliable instruction following are more important than low-latency responses.",
  tags: ["Reasoning", "Long Context", "Function Calling", "Enterprise"],
  subCategories: [
    { id: "mock-sub-llm", name: "LLM", slug: "llm" },
    { id: "mock-sub-reasoning", name: "Reasoning", slug: "reasoning" },
    { id: "mock-sub-agents", name: "AI Agents", slug: "ai-agents" },
  ],
  benchmarks: [
    { name: "MMLU", score: 91.4 },
    { name: "GPQA", score: 74.8 },
    { name: "HumanEval", score: 93.1 },
    { name: "AIME", score: 89.6 },
  ],
  tasks: [
    { task: { id: "mock-task-research", title: "Research & Analysis", slug: "research-analysis" } },
    { task: { id: "mock-task-code", title: "Code Generation", slug: "generate-code" } },
    { task: { id: "mock-task-planning", title: "Planning", slug: "planning" } },
    { task: { id: "mock-task-documents", title: "Document Analysis", slug: "document-analysis" } },
  ],
  updatedAt: "2026-09-01T10:30:00.000Z",
};

const VISIONFORGE_V2: AIModel = {
  id: "mock-visionforge-v2",
  slug: "visionforge-v2",
  name: "VisionForge V2",
  creator: "VisionForge Labs",
  provider: { id: "mock-provider-visionforge", slug: "visionforge-labs", name: "VisionForge Labs", logoUrl: null },
  modelType: "MULTIMODAL",
  modality: "Text, Image",
  primaryTask: "Visual Reasoning",
  parameterSize: "72B",
  contextWindow: "128K tokens",
  releaseDate: "April 2026",
  openSource: true,
  description:
    "VisionForge V2 is a multimodal AI model designed to understand and reason over images, documents, charts, diagrams, and natural language. It can combine visual information with textual instructions to answer questions, extract structured information, interpret complex diagrams, and analyze visual content.\n\nThe model is optimized for document intelligence and visual reasoning workloads, with support for structured outputs and tool-assisted workflows. VisionForge V2 is particularly suited for applications involving document processing, visual search, image analysis, and automated data extraction.",
  tags: ["Vision", "Multimodal", "OCR", "Document AI"],
  subCategories: [
    { id: "mock-sub-multimodal", name: "Multimodal", slug: "multimodal" },
    { id: "mock-sub-vision", name: "Vision Models", slug: "vision-models" },
    { id: "mock-sub-docs", name: "Document AI", slug: "document-ai" },
  ],
  benchmarks: [
    { name: "MMMU", score: 82.7 },
    { name: "ChartQA", score: 89.3 },
    { name: "DocVQA", score: 94.1 },
    { name: "OCRBench", score: 91.8 },
  ],
  tasks: [
    { task: { id: "mock-task-image-analysis", title: "Image Analysis", slug: "image-analysis" } },
    { task: { id: "mock-task-document-extraction", title: "Document Extraction", slug: "document-extraction" } },
    { task: { id: "mock-task-visual-qa", title: "Visual Question Answering", slug: "visual-question-answering" } },
    { task: { id: "mock-task-chart-analysis", title: "Chart Analysis", slug: "chart-analysis" } },
  ],
  updatedAt: "2026-08-29T14:15:00.000Z",
};

const CODEPILOT_PRO: AIModel = {
  id: "mock-codepilot-pro",
  slug: "codepilot-pro",
  name: "CodePilot Pro",
  creator: "CodePilot",
  provider: { id: "mock-provider-codepilot", slug: "codepilot", name: "CodePilot", logoUrl: null },
  modelType: "CODE",
  modality: "Text, Code",
  primaryTask: "Code Generation",
  parameterSize: "34B",
  contextWindow: "200K tokens",
  releaseDate: "May 2026",
  openSource: true,
  description:
    "CodePilot Pro is a specialized AI model built for modern software development workflows, from code generation and completion to debugging and repository-level reasoning. It is designed to understand large codebases and maintain context across multiple files, making it useful for complex development tasks rather than isolated code snippets.\n\nThe model supports code review, refactoring, technical documentation, and tool-assisted development workflows through structured outputs and function calling. CodePilot Pro is intended for developers and engineering teams looking to automate repetitive programming tasks while keeping humans in control of the final implementation.",
  tags: ["Coding", "Code Review", "Refactoring", "Agents"],
  subCategories: [
    { id: "mock-sub-code", name: "Code Generation", slug: "code-generation" },
    { id: "mock-sub-devtools", name: "Developer Tools", slug: "developer-tools" },
    { id: "mock-sub-agents-2", name: "AI Agents", slug: "ai-agents" },
  ],
  benchmarks: [
    { name: "HumanEval", score: 96.2 },
    { name: "SWE-bench", score: 58.4 },
    { name: "MBPP", score: 94.7 },
    { name: "LiveCodeBench", score: 81.9 },
  ],
  tasks: [
    { task: { id: "mock-task-code-generation", title: "Code Generation", slug: "generate-code" } },
    { task: { id: "mock-task-code-review", title: "Code Review", slug: "code-review" } },
    { task: { id: "mock-task-debugging", title: "Debugging", slug: "debugging" } },
    { task: { id: "mock-task-refactoring", title: "Code Refactoring", slug: "refactoring" } },
  ],
  updatedAt: "2026-08-31T09:45:00.000Z",
};

const ECHOVOICE_STUDIO: AIModel = {
  id: "mock-echovoice-studio",
  slug: "echovoice-studio",
  name: "EchoVoice Studio",
  creator: "EchoVoice",
  provider: { id: "mock-provider-echovoice", slug: "echovoice", name: "EchoVoice", logoUrl: null },
  modelType: "AUDIO",
  modality: "Audio, Text",
  primaryTask: "Speech Generation",
  parameterSize: "18B",
  contextWindow: "64K tokens",
  releaseDate: "March 2026",
  openSource: false,
  description:
    "EchoVoice Studio is an audio-focused AI model designed for natural speech generation, transcription, and conversational voice applications. It can process spoken language and generate expressive speech while maintaining the conversational context required for interactive voice experiences.\n\nThe model supports multilingual speech processing, real-time streaming, and voice-oriented workflows, making it suitable for assistants, accessibility applications, and customer-support systems. EchoVoice Studio is optimized for applications where natural interaction, low-latency audio processing, and consistent voice quality are important.",
  tags: ["Speech", "TTS", "STT", "Streaming", "Multilingual"],
  subCategories: [
    { id: "mock-sub-speech", name: "Speech", slug: "speech" },
    { id: "mock-sub-audio", name: "Audio AI", slug: "audio-ai" },
    { id: "mock-sub-realtime", name: "Real-time AI", slug: "real-time-ai" },
  ],
  benchmarks: [
    { name: "WER", score: 4.8 },
    { name: "MOS", score: 4.6 },
    { name: "XTTS", score: 92.1 },
    { name: "VoiceBench", score: 88.7 },
  ],
  tasks: [
    { task: { id: "mock-task-transcription", title: "Speech Transcription", slug: "speech-transcription" } },
    { task: { id: "mock-task-voice-generation", title: "Voice Generation", slug: "voice-generation" } },
    { task: { id: "mock-task-voice-assistant", title: "Voice Assistants", slug: "voice-assistants" } },
    { task: { id: "mock-task-dubbing", title: "Audio Dubbing", slug: "audio-dubbing" } },
  ],
  updatedAt: "2026-08-27T16:20:00.000Z",
};

const models: AIModel[] = [
  NOVAMIND_X1,
  VISIONFORGE_V2,
  CODEPILOT_PRO,
  ECHOVOICE_STUDIO,
];

const relatedById: Record<string, string[]> = {
  "mock-novamind-x1": ["mock-codepilot-pro", "mock-visionforge-v2", "mock-echovoice-studio"],
  "mock-visionforge-v2": ["mock-novamind-x1", "mock-codepilot-pro", "mock-echovoice-studio"],
  "mock-codepilot-pro": ["mock-novamind-x1", "mock-visionforge-v2", "mock-echovoice-studio"],
  "mock-echovoice-studio": ["mock-novamind-x1", "mock-visionforge-v2", "mock-codepilot-pro"],
};

for (const model of models) {
  model.relatedModels = (relatedById[model.id] || [])
    .map((id) => models.find((candidate) => candidate.id === id))
    .filter((candidate): candidate is AIModel => Boolean(candidate));
}

NOVAMIND_X1.similarModels = [CODEPILOT_PRO];
VISIONFORGE_V2.similarModels = [NOVAMIND_X1];
CODEPILOT_PRO.similarModels = [NOVAMIND_X1];
ECHOVOICE_STUDIO.similarModels = [VISIONFORGE_V2];

export const MOCK_MODELS: ModelDetail[] = models;

export const MOCK_MODELS_BY_ID: Record<string, ModelDetail> = Object.fromEntries(
  models.map((model) => [model.id, model])
);
