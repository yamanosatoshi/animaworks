// ---------------------------------------------------------------------------
// GeminiProvider — Google Generative AI SDK wrapper
// ---------------------------------------------------------------------------

import type {
  ChatMessage,
  CompletionResult,
  LLMProvider,
  ToolDefinition,
  ToolCall,
  ToolStreamEvent,
} from "./types";

/**
 * GeminiProvider wraps `@google/generative-ai`.
 *
 * SDK is lazy-loaded so the provider can be referenced even when the
 * package isn't installed (useful during development / testing).
 */
export class GeminiProvider implements LLMProvider {
  readonly name = "gemini" as const;
  private model: string;
  private apiKey: string;

  constructor(opts?: { model?: string; apiKey?: string }) {
    this.model = opts?.model ?? "gemini-2.5-flash";
    this.apiKey = opts?.apiKey ?? process.env.GOOGLE_AI_API_KEY ?? "";
  }

  // -------------------------------------------------------------------------
  // streamChat
  // -------------------------------------------------------------------------
  async *streamChat(
    messages: ChatMessage[],
    systemPrompt: string,
  ): AsyncGenerator<string, void, unknown> {
    const { GoogleGenerativeAI } = await this.loadSdk();
    const genAI = new GoogleGenerativeAI(this.apiKey);
    const model = genAI.getGenerativeModel({
      model: this.model,
      systemInstruction: systemPrompt,
    });

    const history = messages.slice(0, -1).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const lastMessage = messages[messages.length - 1];
    const chat = model.startChat({ history });

    const result = await chat.sendMessageStream(lastMessage.content);

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) yield text;
    }
  }

  // -------------------------------------------------------------------------
  // completeChat
  // -------------------------------------------------------------------------
  async completeChat(
    messages: ChatMessage[],
    systemPrompt: string,
  ): Promise<CompletionResult> {
    const { GoogleGenerativeAI } = await this.loadSdk();
    const genAI = new GoogleGenerativeAI(this.apiKey);
    const model = genAI.getGenerativeModel({
      model: this.model,
      systemInstruction: systemPrompt,
    });

    const history = messages.slice(0, -1).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const lastMessage = messages[messages.length - 1];
    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastMessage.content);
    const text = result.response.text();

    return {
      content: text,
      meta: {
        provider: this.name,
        model: this.model,
        usage: {
          promptTokens: result.response.usageMetadata?.promptTokenCount,
          completionTokens: result.response.usageMetadata?.candidatesTokenCount,
          totalTokens: result.response.usageMetadata?.totalTokenCount,
        },
      },
    };
  }

  // -------------------------------------------------------------------------
  // streamChatWithTools — function-calling loop
  // -------------------------------------------------------------------------
  async *streamChatWithTools(
    messages: ChatMessage[],
    systemPrompt: string,
    tools: ToolDefinition[],
    toolExecutor: (call: ToolCall) => Promise<unknown>,
  ): AsyncGenerator<ToolStreamEvent, void, unknown> {
    const sdk = await this.loadSdk();
    const genAI = new sdk.GoogleGenerativeAI(this.apiKey);

    // Convert our ToolDefinition[] to Gemini's FunctionDeclarationsTool
    const geminiTools = [
      {
        functionDeclarations: tools.map((t) => ({
          name: t.name,
          description: t.description,
          parameters: t.parameters
            ? {
                type: sdk.SchemaType.OBJECT,
                properties: Object.fromEntries(
                  Object.entries(t.parameters.properties).map(
                    ([key, prop]) => [
                      key,
                      {
                        type: this.toSchemaType(sdk, prop.type),
                        description: prop.description,
                        ...(prop.enum ? { enum: prop.enum } : {}),
                      },
                    ],
                  ),
                ),
                required: t.parameters.required,
              }
            : undefined,
        })),
      },
    ];

    const model = genAI.getGenerativeModel({
      model: this.model,
      systemInstruction: systemPrompt,
      tools: geminiTools,
    });

    const history = messages.slice(0, -1).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({ history });

    // Initial message
    const lastMessage = messages[messages.length - 1];

    // Tool-call loop: keep going until we get a text response
    const MAX_TOOL_ROUNDS = 5;
    // First round: send the user's text. Subsequent rounds: send function responses.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let sendArg: any = lastMessage.content;

    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
      const result = await chat.sendMessage(sendArg);
      const response = result.response;

      // Check for function calls
      const functionCalls = response.functionCalls?.();
      if (functionCalls && functionCalls.length > 0) {
        // Process each function call
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const functionResponses: any[] = [];

        for (const fc of functionCalls) {
          const call: ToolCall = { name: fc.name, args: fc.args };
          yield { type: "tool_call", call };

          // Execute the tool
          const toolResult = await toolExecutor(call);
          yield {
            type: "tool_result",
            result: { name: fc.name, result: toolResult },
          };

          functionResponses.push({
            functionResponse: {
              name: fc.name,
              response: toolResult,
            },
          });
        }

        // Feed results back to the model for the next round
        sendArg = functionResponses;
        continue;
      }

      // No function calls — yield the text response
      const text = response.text();
      if (text) {
        yield { type: "text", content: text };
      }
      return;
    }

    // Safety: if we hit max rounds, yield whatever text is available
    yield {
      type: "text",
      content: "ツールの呼び出し回数が上限に達しました。結果をもとにお答えします。",
    };
  }

  /** Map our simple type strings to Gemini SchemaType */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private toSchemaType(sdk: any, type: string) {
    const map: Record<string, unknown> = {
      string: sdk.SchemaType.STRING,
      number: sdk.SchemaType.NUMBER,
      integer: sdk.SchemaType.INTEGER,
      boolean: sdk.SchemaType.BOOLEAN,
      array: sdk.SchemaType.ARRAY,
      object: sdk.SchemaType.OBJECT,
    };
    return map[type] ?? sdk.SchemaType.STRING;
  }

  // -------------------------------------------------------------------------
  // SDK loader (lazy)
  // -------------------------------------------------------------------------
  private async loadSdk() {
    try {
      return await import("@google/generative-ai");
    } catch {
      throw new Error(
        "GeminiProvider requires @google/generative-ai. Run: npm install @google/generative-ai",
      );
    }
  }
}
