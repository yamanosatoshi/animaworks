// ---------------------------------------------------------------------------
// Stub type declarations for LLM SDKs (installed on demand)
// ---------------------------------------------------------------------------
// These declarations allow TypeScript to compile without the actual SDK
// packages. Once the packages are installed, their own type definitions
// will take precedence.
// ---------------------------------------------------------------------------

declare module "@anthropic-ai/sdk" {
  interface TextDelta {
    type: "text_delta";
    text: string;
  }

  interface ContentBlockDelta {
    type: "content_block_delta";
    delta: TextDelta;
  }

  interface TextBlock {
    type: "text";
    text: string;
  }

  interface Usage {
    input_tokens: number;
    output_tokens: number;
  }

  interface Message {
    id: string;
    model: string;
    content: TextBlock[];
    usage: Usage;
  }

  interface StreamEvent {
    type: string;
    delta?: TextDelta;
  }

  interface MessageStream {
    [Symbol.asyncIterator](): AsyncIterator<ContentBlockDelta & { type: string }>;
  }

  interface Messages {
    create(params: {
      model: string;
      max_tokens: number;
      system: string;
      messages: Array<{ role: "user" | "assistant"; content: string }>;
    }): Promise<Message>;

    stream(params: {
      model: string;
      max_tokens: number;
      system: string;
      messages: Array<{ role: "user" | "assistant"; content: string }>;
    }): MessageStream;
  }

  class Anthropic {
    constructor(opts?: { apiKey?: string });
    messages: Messages;
  }

  export default Anthropic;
}

declare module "@google/generative-ai" {
  // -- Schema types -----------------------------------------------------------
  enum SchemaType {
    STRING = "STRING",
    NUMBER = "NUMBER",
    INTEGER = "INTEGER",
    BOOLEAN = "BOOLEAN",
    ARRAY = "ARRAY",
    OBJECT = "OBJECT",
  }

  // -- Part types -------------------------------------------------------------
  interface TextPart {
    text: string;
    functionCall?: never;
    functionResponse?: never;
  }

  interface FunctionCall {
    name: string;
    args: Record<string, unknown>;
  }

  interface FunctionCallPart {
    text?: never;
    functionCall: FunctionCall;
    functionResponse?: never;
  }

  interface FunctionResponse {
    name: string;
    response: unknown;
  }

  interface FunctionResponsePart {
    text?: never;
    functionCall?: never;
    functionResponse: FunctionResponse;
  }

  type Part = TextPart | FunctionCallPart | FunctionResponsePart;

  interface Content {
    role: string;
    parts: Part[];
  }

  // -- Tool definitions -------------------------------------------------------
  interface FunctionDeclarationSchema {
    type: SchemaType;
    properties?: { [k: string]: FunctionDeclarationSchema };
    required?: string[];
    description?: string;
    items?: FunctionDeclarationSchema;
    enum?: string[];
  }

  interface FunctionDeclaration {
    name: string;
    description: string;
    parameters?: FunctionDeclarationSchema;
  }

  interface FunctionDeclarationsTool {
    functionDeclarations?: FunctionDeclaration[];
  }

  type Tool = FunctionDeclarationsTool;

  interface FunctionCallingConfig {
    mode?: FunctionCallingMode;
    allowedFunctionNames?: string[];
  }

  enum FunctionCallingMode {
    AUTO = "AUTO",
    ANY = "ANY",
    NONE = "NONE",
  }

  interface ToolConfig {
    functionCallingConfig: FunctionCallingConfig;
  }

  // -- Response types ---------------------------------------------------------
  interface UsageMetadata {
    promptTokenCount?: number;
    candidatesTokenCount?: number;
    totalTokenCount?: number;
  }

  interface Candidate {
    content: Content;
  }

  interface GenerateContentResponse {
    text(): string;
    functionCalls(): FunctionCall[] | undefined;
    usageMetadata?: UsageMetadata;
    candidates?: Candidate[];
  }

  interface GenerateContentResult {
    response: GenerateContentResponse;
  }

  interface GenerateContentStreamResult {
    stream: AsyncIterable<{ text(): string }>;
    response: Promise<GenerateContentResponse>;
  }

  // -- Chat & Model -----------------------------------------------------------
  interface StartChatParams {
    history?: Content[];
    tools?: Tool[];
    toolConfig?: ToolConfig;
  }

  interface ChatSession {
    sendMessage(
      request: string | Array<string | Part>,
    ): Promise<GenerateContentResult>;
    sendMessageStream(
      request: string | Array<string | Part>,
    ): Promise<GenerateContentStreamResult>;
  }

  interface GenerativeModel {
    startChat(params?: StartChatParams): ChatSession;
  }

  export class GoogleGenerativeAI {
    constructor(apiKey: string);
    getGenerativeModel(params: {
      model: string;
      systemInstruction?: string;
      tools?: Tool[];
      toolConfig?: ToolConfig;
    }): GenerativeModel;
  }
}

declare module "openai" {
  interface ChatCompletionChunkChoice {
    delta?: { content?: string };
  }

  interface ChatCompletionChunk {
    choices: ChatCompletionChunkChoice[];
  }

  interface ChatCompletionChoice {
    message?: { content?: string };
  }

  interface ChatCompletionUsage {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  }

  interface ChatCompletion {
    model: string;
    choices: ChatCompletionChoice[];
    usage?: ChatCompletionUsage;
  }

  type ChatMessage = {
    role: "system" | "user" | "assistant";
    content: string;
  };

  interface ChatCompletions {
    create(params: {
      model: string;
      messages: ChatMessage[];
      stream?: false;
    }): Promise<ChatCompletion>;

    create(params: {
      model: string;
      messages: ChatMessage[];
      stream: true;
    }): Promise<AsyncIterable<ChatCompletionChunk>>;
  }

  interface Chat {
    completions: ChatCompletions;
  }

  class OpenAI {
    constructor(opts?: { apiKey?: string });
    chat: Chat;
  }

  export default OpenAI;
}
