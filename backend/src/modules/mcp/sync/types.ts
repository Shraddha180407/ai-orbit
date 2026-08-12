// ============================================================
// Smithery Sync Types
// ============================================================

export interface SmitheryServerSummary {
  id: string;
  qualifiedName: string;
  namespace: string | null;
  slug: string | null;
  displayName: string;
  description: string;
  iconUrl: string | null;
  verified: boolean;
  useCount: number;
  remote: boolean | null;
  isDeployed: boolean;
  createdAt: string;
  homepage: string | null;
  bySmithery: boolean;
  owner: string | null;
  score: number | null;
}

export interface SmitheryServerDetail {
  qualifiedName: string;
  displayName: string;
  description: string;
  iconUrl: string | null;
  remote: boolean;
  deploymentUrl: string | null;
  connections: SmitheryConnection[];
  security: SmitheryServerSecurity | null;
  tools: SmitheryTool[] | null;
  resources: SmitheryResource[] | null;
  prompts: SmitheryPrompt[] | null;
}

export interface SmitheryStdioConnection {
  type: 'stdio';
  bundleUrl: string;
  runtime: 'node' | 'binary' | 'python' | 'bun';
  configSchema: Record<string, unknown>;
}

export interface SmitheryHttpConnection {
  type: 'http';
  deploymentUrl: string;
  configSchema: Record<string, unknown>;
}

export type SmitheryConnection = SmitheryStdioConnection | SmitheryHttpConnection;

export interface SmitheryServerSecurity {
  scanPassed: boolean;
}

export interface SmitheryTool {
  name: string;
  description: string | null;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
  };
  outputSchema?: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

export interface SmitheryResource {
  name: string;
  uri: string;
  description?: string;
  mimeType?: string;
}

export interface SmitheryPrompt {
  name: string;
  description?: string;
  arguments?: Array<{
    name: string;
    description?: string;
    required?: boolean;
  }>;
}

export interface SmitheryListResponse {
  servers: SmitheryServerSummary[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
  };
}

export interface SmitheryClientConfig {
  baseUrl: string;
  timeout: number;
  maxRetries: number;
  initialBackoffMs: number;
  maxBackoffMs: number;
}

export const DEFAULT_SMITHERY_CLIENT_CONFIG: SmitheryClientConfig = {
  baseUrl: 'https://api.smithery.ai',
  timeout: 30_000,
  maxRetries: 3,
  initialBackoffMs: 1_000,
  maxBackoffMs: 30_000,
};

export interface SyncConfig {
  dryRun: boolean;
  pageSize: number;
  maxPages: number;
  maxServers: number;
  startPage: number;
  source: string;
  itemPrefix: string;
  detailConcurrency: number;
}
