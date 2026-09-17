export const TOPOLOGY_NODES = {
  hub: {
    id: 'hub',
    title: 'Core Orbit Engine',
    desc: 'Foundation Graph connecting dynamic multi-agent loops and model runtimes.',
    badge: 'Universal Hub',
    color: '#6E56CF',
    lessonId: 'agent-first-lesson'
  },
  agents: {
    id: 'agents',
    title: 'Autonomous Agents',
    desc: 'LangGraph memory, ReAct tool execution loops, and MCP server interop.',
    badge: 'Active Path · 72%',
    color: '#6E56CF',
    lessonId: 'agent-first-lesson'
  },
  inference: {
    id: 'inference',
    title: 'LLM Inference & Systems',
    desc: 'vLLM continuous batching, PagedAttention KV-caching, and FlashAttention 3.',
    badge: 'Estimated 26h',
    color: '#F5A623',
    lessonId: 'kvcache-lesson'
  },
  multimodal: {
    id: 'multimodal',
    title: 'Multimodal & CV',
    desc: 'Contrastive Vision-Language pretraining, ViT patch projection, and RRF retrieval.',
    badge: '6 Modules',
    color: '#10B981',
    lessonId: 'rag-lesson'
  },
  robotics: {
    id: 'robotics',
    title: 'Robotics & VLA',
    desc: 'Mujoco physics simulation, ROS 2 joint trajectories, and OpenVLA policy tokens.',
    badge: 'Advanced · 9 Modules',
    color: '#00E5FF',
    lessonId: 'vla-lesson'
  },
  mcp: {
    id: 'mcp',
    title: 'Model Context Protocol (MCP)',
    desc: 'Standardized tool server protocol connecting models to secure local APIs.',
    badge: 'Tools Interop',
    color: '#C4B5FD',
    lessonId: 'mcp-lesson'
  },
  cuda: {
    id: 'cuda',
    title: 'CUDA & Custom Kernels',
    desc: 'Triton and raw CUDA tensor operations for maximum token throughput.',
    badge: 'Hardware Scaling',
    color: '#FBBF24',
    lessonId: 'kvcache-lesson'
  }
};

export const ACTIVE_TRACK = {
  discipline: 'Agentic AI Architecture',
  level: 'Level 03',
  targetRole: 'Autonomous Agent Architect',
  unitTitle: 'Building Your First AI Agent: Memory & ReAct Loops',
  unitSubtitle: 'Unit 08 of 12 • LangGraph State Checkpointing',
  description: 'Construct stateful graph cycles with autonomous reasoning branches, validate strict tool schema arguments, and implement zero-shot fallbacks for tool execution failure.',
  progressPercent: 72,
  completedUnits: 8,
  totalUnits: 12,
  investedHours: '14h',
  streakDays: 5,
  nextUp: 'Lesson 09: Model Context Protocol (MCP) Server Integration',
  nextUpTime: '20 min exercise',
  lastCheckpoint: '42 mins ago',
  lessonId: 'agent-first-lesson'
};

export const PROGRESSION_LEVELS = [
  {
    id: '01',
    name: '01. Foundations',
    status: 'Unlocked · 100%',
    statusType: 'completed',
    desc: 'Prompts, Embeddings, BM25 & Vector Databases',
    badge: '✓'
  },
  {
    id: '02',
    name: '02. Intermediate',
    status: 'Unlocked · 100%',
    statusType: 'completed',
    desc: 'Hybrid Search, Rerankers, Simple Tool Calling',
    badge: '✓'
  },
  {
    id: '03',
    name: '03. Advanced',
    status: 'Active · 72%',
    statusType: 'active',
    desc: 'Multi-Agent Graphs, MCP, KV-Cache Paging',
    badge: '●'
  },
  {
    id: '04',
    name: '04. Frontier',
    status: 'Locked · Req. Unit 12',
    statusType: 'locked',
    desc: 'GRPO CoT Distillation, CUDA Kernels & VLA Sim',
    badge: '🔒'
  }
];

export const CURRICULUM_PATHS = [
  {
    id: 'path-01',
    pathNumber: 'PATH 01',
    category: 'Autonomous Loops',
    title: 'Agentic AI Architectures',
    shortName: 'Agentic AI',
    status: 'Active',
    isActive: true,
    progress: '72% Completed',
    stats: '8 Modules • 42 Units',
    desc: 'Multi-turn reasoning swarms, MCP servers, LangGraph loops, and automated evaluators.',
    sandbox: 'Python 3.12',
    sandboxStatus: 'Ready',
    lessonId: 'agent-first-lesson',
    accentColor: '#6E56CF',
    bgGradient: 'from-[#160D2E] via-[#0F081D] to-black',
    borderHover: 'hover:border-[#6E56CF]/60',
    syllabus: [
      { num: '01', title: 'Tool Schema Parsing (Pydantic)', status: 'done' },
      { num: '02', title: 'ReAct Decision Trajectories', status: 'done' },
      { num: '03', title: 'Graph Checkpointing (Active)', status: 'active' },
      { num: '04', title: 'Model Context Protocol (MCP)', status: 'pending' },
      { num: '05', title: 'Multi-Agent Swarm Consensus', status: 'pending' }
    ]
  },
  {
    id: 'path-02',
    pathNumber: 'PATH 02',
    category: 'Systems & Kernels',
    title: 'Inference & Systems Scaling',
    shortName: 'LLM Engineering',
    status: 'Inference',
    isActive: false,
    progress: 'Estimated 26h',
    stats: '12 Modules • 58 Units',
    desc: 'PagedAttention KV-caching, vLLM multi-GPU serving, and speculative decoding.',
    sandbox: 'CUDA Env: H100 vGPU',
    sandboxStatus: 'Available',
    lessonId: 'kvcache-lesson',
    accentColor: '#F5A623',
    bgGradient: 'from-[#231505] via-[#140C03] to-black',
    borderHover: 'hover:border-amber-500/60',
    syllabus: [
      { num: '01', title: 'Transformer KV Cache Math', status: 'pending' },
      { num: '02', title: 'PagedAttention Memory Tables', status: 'pending' },
      { num: '03', title: 'Continuous Batching in vLLM', status: 'pending' },
      { num: '04', title: 'Speculative Decoding Tree', status: 'pending' },
      { num: '05', title: 'FP8 & AWQ Quantization', status: 'pending' }
    ]
  },
  {
    id: 'path-03',
    pathNumber: 'PATH 03',
    category: 'Kinematics & Actions',
    title: 'Embodied Robotics & VLA',
    shortName: 'Robotics & VLA',
    status: 'Physical AI',
    isActive: false,
    progress: 'Estimated 22h',
    stats: '9 Modules • 36 Units',
    desc: 'Mujoco sim-to-real transfer, ROS 2 node architecture, and OpenVLA tokenization.',
    sandbox: 'Sim Sandbox: Mujoco 3.0',
    sandboxStatus: 'Ready',
    lessonId: 'vla-lesson',
    accentColor: '#00E5FF',
    bgGradient: 'from-[#061B24] via-[#031017] to-black',
    borderHover: 'hover:border-cyan-400/60',
    syllabus: [
      { num: '01', title: 'Mujoco Kinematics & Joint Angles', status: 'pending' },
      { num: '02', title: 'ROS 2 Publisher/Subscriber C++', status: 'pending' },
      { num: '03', title: 'Discrete Action Tokens in VLA', status: 'pending' },
      { num: '04', title: '7-DOF Arm Trajectory Policy', status: 'pending' },
      { num: '05', title: 'Tactile Feedback Telemetry', status: 'pending' }
    ]
  },
  {
    id: 'path-04',
    pathNumber: 'PATH 04',
    category: 'Visual Understanding',
    title: 'Multimodal & Vision Systems',
    shortName: 'Multimodal & CV',
    status: 'Multimodal',
    isActive: false,
    progress: 'Estimated 16h',
    stats: '6 Modules • 28 Units',
    desc: 'Cross-attention cross-modal alignment, contrastive tokens, and dense retrieval.',
    sandbox: 'Env: PyTorch 2.4 + FlashAttn',
    sandboxStatus: 'Ready',
    lessonId: 'rag-lesson',
    accentColor: '#10B981',
    bgGradient: 'from-[#061E14] via-[#03130C] to-black',
    borderHover: 'hover:border-emerald-500/60',
    syllabus: [
      { num: '01', title: 'ViT Patch Linear Embeddings', status: 'pending' },
      { num: '02', title: 'Contrastive Loss (CLIP/SigLIP)', status: 'pending' },
      { num: '03', title: 'Dense Retrieval & Cross-Rerank', status: 'pending' },
      { num: '04', title: 'Video Temporal Attention Windows', status: 'pending' },
      { num: '05', title: 'Spatial Audio Embeddings', status: 'pending' }
    ]
  }
];

export const RECOMMENDED_ACTIONS = [
  {
    id: 'rec-01',
    matchScore: '98% Match for Agentic Path',
    duration: '18 min',
    title: 'Building Fast JSON-RPC MCP Servers',
    desc: 'Direct companion to your current agent unit. Provide your LLM with secure real-time file systems, database connectors, and CLI execution.',
    tags: ['FastAPI', 'Claude 3.7', 'JSON-RPC'],
    level: 'Intermediate Lab',
    lessonId: 'mcp-lesson',
    accent: 'orbit'
  },
  {
    id: 'rec-02',
    matchScore: '93% Reasoning Synergy',
    duration: '35 min',
    title: 'Reasoning Distillation with GRPO & Unsloth',
    desc: 'Teach your agent base model to self-correct math and logic queries using Group Relative Policy Optimization without dedicated reward models.',
    tags: ['DeepSeek-R1', 'Unsloth LoRA', '24GB VRAM'],
    level: 'Advanced Post-Training',
    lessonId: 'grpo-lesson',
    accent: 'emerald'
  },
  {
    id: 'rec-03',
    matchScore: '89% Throughput Fit',
    duration: '20 min',
    title: 'PagedAttention & vLLM Memory Layout',
    desc: 'Multi-agent loops generate large token histories that fragment memory. Learn how OS paging structures reduce memory waste by 70%.',
    tags: ['CUDA', 'KV-Cache', 'vLLM'],
    level: 'Systems Kernel',
    lessonId: 'kvcache-lesson',
    accent: 'amber'
  }
];

export const LESSONS_CONTENT = {
  'agent-first-lesson': {
    id: 'agent-first-lesson',
    badge: 'LESSON 08',
    breadcrumb: 'Agentic AI / Building Your First AI Agent',
    title: 'Building Your First AI Agent: Memory & ReAct Loops',
    remainingTime: 'Interactive System Sandbox · Est. 15 min remaining',
    overview: 'In this module, you will construct a stateful reasoning agent equipped with tool execution capabilities. We begin by configuring a core loop that queries the model, evaluates whether a tool was invoked, and injects the tool result back into the prompt history.',
    filename: 'agent_graph_runtime.py',
    code: `from typing import TypedDict, Annotated, Sequence
import operator
from langchain_core.messages import BaseMessage
from langgraph.graph import StateGraph, END

class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], operator.add]

workflow = StateGraph(AgentState)
workflow.add_node("agent", call_model)
workflow.add_node("tools", tool_executor)
workflow.set_entry_point("agent")

# Conditional branching based on tool_calls
workflow.add_conditional_edges(
    "agent",
    should_continue,
    {"continue": "tools", "end": END}
)
app = workflow.compile()`,
    takeaways: [
      'Stateful graphs prevent infinite recursion via max-turn safeguards',
      'Tool schema validation ensures JSON conforms strictly before execution',
      'Checkpointer snapshots allow human-in-the-loop review at every state transition'
    ]
  },
  'mcp-lesson': {
    id: 'mcp-lesson',
    badge: 'AGENT LAB',
    breadcrumb: 'Agentic AI / Tool Orchestration',
    title: 'Model Context Protocol (MCP) in Practice',
    remainingTime: 'Interactive System Sandbox · Est. 18 min remaining',
    overview: 'Learn to design and deploy compliant Model Context Protocol servers over standard IO (stdio) and Server-Sent Events (SSE). Expose secure file system access, SQL query execution, and browser automation to frontier reasoning models.',
    filename: 'mcp_fastapi_server.py',
    code: `from mcp.server.fastmcp import FastMCP

# Initialize FastMCP Server for AI Orbit
mcp = FastMCP("OrbitToolGateway")

@mcp.tool()
def execute_query(sql: str, read_only: bool = True) -> str:
    """Execute analytical read queries against the telemetry cluster."""
    if not read_only and "DROP" in sql.upper():
        raise PermissionError("Destructive queries disallowed")
    return db_cluster.run(sql)

if __name__ == "__main__":
    mcp.run(transport="stdio")`,
    takeaways: [
      'MCP decouples tool implementation from model prompt engineering',
      'JSON-RPC 2.0 transport ensures language-agnostic integration',
      'Capabilities negotiation enables graceful degradation across client types'
    ]
  },
  'rag-lesson': {
    id: 'rag-lesson',
    badge: 'FEATURED LAB',
    breadcrumb: 'Multimodal & Retrieval / RAG 101',
    title: 'Building Production-Ready RAG Systems',
    remainingTime: 'Architecture Lab · Est. 20 min remaining',
    overview: 'Eliminate hallucination in mission-critical applications. See how dense semantic embeddings, BM25 keyword matching, Reciprocal Rank Fusion (RRF), and Cohere rerankers collaborate before prompting the context-augmented LLM.',
    filename: 'hybrid_rrf_pipeline.py',
    code: `def reciprocal_rank_fusion(dense_ranks, sparse_ranks, k=60):
    rrf_scores = {}
    for rank, doc_id in enumerate(dense_ranks):
        rrf_scores[doc_id] = rrf_scores.get(doc_id, 0) + 1.0 / (k + rank)
    for rank, doc_id in enumerate(sparse_ranks):
        rrf_scores[doc_id] = rrf_scores.get(doc_id, 0) + 1.0 / (k + rank)
    
    sorted_docs = sorted(rrf_scores.items(), key=lambda x: x[1], reverse=True)
    return [doc for doc, score in sorted_docs[:5]]`,
    takeaways: [
      'Hybrid dense + sparse search captures both semantic nuances and exact part numbers',
      'Reciprocal Rank Fusion (RRF) standardizes scores across incompatible distance spaces',
      'Context compression drops latency by 40% while improving answer precision'
    ]
  },
  'kvcache-lesson': {
    id: 'kvcache-lesson',
    badge: 'SYSTEMS LAB',
    breadcrumb: 'LLM Engineering / Memory Optimization',
    title: 'KV-Cache Paging & PagedAttention Internals',
    remainingTime: 'Systems Kernel · Est. 22 min remaining',
    overview: 'Multi-agent loops generate large token histories that fragment memory. Learn how OS paging structures reduce memory waste by 70% in high-throughput inference engines like vLLM and TensorRT-LLM.',
    filename: 'paged_attention_allocator.cu',
    code: `// Conceptual PagedAttention Virtual Memory Block Mapping
struct PhysicalBlock {
    int block_id;
    int ref_count;
    float* k_cache_ptr;
    float* v_cache_ptr;
};

__global__ void paged_attention_kernel(
    const float* __restrict__ q,
    const int* __restrict__ block_tables,
    float* __restrict__ out,
    const int block_size
) {
    // Read non-contiguous block indices mapped to logical sequence tokens
    int logical_block = threadIdx.x / block_size;
    int physical_block = block_tables[logical_block];
    // Compute attention without pre-allocating contiguous VRAM buffer
}`,
    takeaways: [
      'Eliminates internal fragmentation from max_tokens reservations',
      'Enables zero-copy prefix caching across parallel multi-agent reasoning branches',
      'Doubles effective batch size on 80GB H100 GPU clusters'
    ]
  },
  'grpo-lesson': {
    id: 'grpo-lesson',
    badge: 'REASONING LAB',
    breadcrumb: 'Post-Training / GRPO & CoT Distillation',
    title: 'Fine-Tuning Reasoning Models with GRPO & Unsloth',
    remainingTime: 'Post-Training Sandbox · Est. 30 min remaining',
    overview: 'Teach your agent base model to self-correct math and logic queries using Group Relative Policy Optimization without dedicated reward models.',
    filename: 'grpo_training_loop.py',
    code: `from unsloth import FastLanguageModel
import torch

# Load model for GRPO Reasoning Post-Training
model, tokenizer = FastLanguageModel.from_pretrained(
    "DeepSeek-R1-Distill-Qwen-14B",
    max_seq_length=4096,
    load_in_4bit=True
)

def reward_math_accuracy(completions, target_answers):
    # Pure rule-based verifier: no critic network needed
    rewards = []
    for comp, target in zip(completions, target_answers):
        extracted = parse_final_boxed_answer(comp)
        rewards.append(1.0 if extracted == target else 0.0)
    return torch.tensor(rewards)`,
    takeaways: [
      'Eliminates need for separate critic model, saving 50% GPU memory during RL',
      'Group normalization standardizes trajectory advantage scores',
      'Produces clean test-time reasoning tokens inside <think> tags'
    ]
  },
  'vla-lesson': {
    id: 'vla-lesson',
    badge: 'ROBOTICS LAB',
    breadcrumb: 'Embodied AI / ROS 2 & OpenVLA',
    title: 'Vision-Language-Action (VLA) for Robotic Arm Control',
    remainingTime: 'Robotics Sim Lab · Est. 25 min remaining',
    overview: 'Connect high-level multimodal vision tokens with physical robot kinematics. Map discrete action tokens to continuous 7-DOF joint velocities in Mujoco physics simulations and micro-ROS controller nodes.',
    filename: 'vla_joint_policy.py',
    code: `import numpy as np
import rclpy
from sensor_msgs.msg import JointState

def predict_robot_action(rgb_frame, prompt_text):
    # Tokenize image and natural language command
    inputs = vla_processor(images=rgb_frame, text=prompt_text, return_tensors="pt")
    output_tokens = vla_model.generate(**inputs, max_new_tokens=7)
    
    # Unquantize 256-bin discrete action tokens to [-1.0, 1.0] velocity bounds
    joint_deltas = (output_tokens - 128) / 128.0
    return joint_deltas # [dx, dy, dz, droll, dpitch, dyaw, gripper]`,
    takeaways: [
      'Discrete tokenization allows standard LLM backbones to output continuous motor policies',
      'Closed-loop 20Hz-50Hz inference is required for smooth physical manipulation',
      'Sim-to-real domain randomization overcomes physical sensor noise'
    ]
  }
};

export const CONCEPT_MATRIX_TERMS = [
  {
    id: 'vla',
    term: 'VLA (Vision-Language-Action)',
    discipline: 'Robotics',
    color: 'cyan',
    analogy: 'Instead of just outputting text, the model produces motor tokens that twist robotic wrist joints and close grippers in physical space.',
    breakdown: 'Pretrained vision-language backbones fine-tuned with discrete tokenized 7-DOF angular velocity vectors running at 20-50Hz.'
  },
  {
    id: 'grpo',
    term: 'GRPO (Group Relative Policy Optimization)',
    discipline: 'Fine-Tuning',
    color: 'orbit',
    analogy: 'Generating 4 different solution paths simultaneously, scoring the final answers, and rewarding the better paths relative to the group average—no critic model required.',
    breakdown: 'Reinforcement learning algorithm introduced by DeepSeek eliminating the separate value model by computing group-level reward baselines directly.'
  },
  {
    id: 'paged-attention',
    term: 'PagedAttention (KV-Cache Paging)',
    discipline: 'Inference Engines',
    color: 'amber',
    analogy: 'Virtual memory for GPU VRAM: tokens slot into non-contiguous small memory pages instead of requiring wasteful static allocations.',
    breakdown: 'Splits Key-Value attention tensors into discontinuous memory blocks managed by a page lookup table, eliminating memory fragmentation in vLLM.'
  },
  {
    id: 'moe',
    term: 'MoE (Mixture of Experts)',
    discipline: 'Model Architecture',
    color: 'emerald',
    analogy: 'A council of specialized doctors where a triage nurse (router) directs each patient to only 2 relevant specialists instead of questioning all 64.',
    breakdown: 'Decoupled parameter layer where a gating network dynamically routes tokens to top-K feedforward sub-networks, achieving 10x parameter capacity with 1x FLOPs.'
  },
  {
    id: 'mcp-protocol',
    term: 'MCP (Model Context Protocol)',
    discipline: 'Agentic Tools',
    color: 'purple',
    analogy: 'The USB-C cable for AI models: an open standard allowing any LLM to plug into databases, local files, and APIs with zero custom wrapper code.',
    breakdown: 'Open JSON-RPC specification launched by Anthropic standardizing client-host-server interactions, capabilities discovery, and bidirectional streaming.'
  },
  {
    id: 'test-time-compute',
    term: 'Test-Time Compute (Reasoning Tokens)',
    discipline: 'Reasoning Engines',
    color: 'cyan',
    analogy: 'Giving a human candidate scrap paper to work out rough algebra steps before writing down their single final exam answer.',
    breakdown: 'Allowing the model to output hundreds or thousands of intermediate chain-of-thought tokens before returning the final solution, trading latency for correctness.'
  },
  {
    id: 'speculative-decoding',
    term: 'Speculative Decoding',
    discipline: 'Inference Acceleration',
    color: 'amber',
    analogy: 'A fast junior paralegal drafts 5 routine sentences, and the senior partner quickly scans and signs off on 4 of them in a single glance.',
    breakdown: 'A smaller draft model generates K candidate tokens quickly; the large target model verifies all K tokens concurrently in a single forward pass.'
  },
  {
    id: 'rrf',
    term: 'RRF (Reciprocal Rank Fusion)',
    discipline: 'Retrieval & Search',
    color: 'emerald',
    analogy: 'Combining an English test score and a Math score fairly by ranking students in each and averaging their placements, not their raw percentages.',
    breakdown: 'Algorithm fusing heterogeneous retrieval outputs (e.g. dense semantic embeddings + sparse BM25 keyword matches) without manual weight calibration.'
  }
];
