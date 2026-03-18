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
  interface Part {
    text: string;
  }

  interface Content {
    role: string;
    parts: Part[];
  }

  interface UsageMetadata {
    promptTokenCount?: number;
    candidatesTokenCount?: number;
    totalTokenCount?: number;
  }

  interface GenerateContentResponse {
    text(): string;
    usageMetadata?: UsageMetadata;
  }

  interface GenerateContentStreamResult {
    stream: AsyncIterable<{ text(): string }>;
  }

  interface ChatSession {
    sendMessage(message: string): Promise<{ response: GenerateContentResponse }>;
    sendMessageStream(message: string): Promise<GenerateContentStreamResult>;
  }

  interface GenerativeModel {
    startChat(params?: { history?: Content[] }): ChatSession;
  }

  export class GoogleGenerativeAI {
    constructor(apiKey: string);
    getGenerativeModel(params: {
      model: string;
      systemInstruction?: string;
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
