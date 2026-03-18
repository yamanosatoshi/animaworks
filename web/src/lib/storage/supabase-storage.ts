// ---------------------------------------------------------------------------
// SupabaseStorage — Supabase implementation of StorageProvider
// ---------------------------------------------------------------------------

import type {
  PaginationOptions,
  Room,
  StorageProvider,
  StoredAnima,
  StoredMessage,
} from "./types";

/**
 * SupabaseStorage implements StorageProvider using Supabase JS client.
 *
 * Current status: **Stub implementation** with in-memory dummy data.
 * Once `@supabase/supabase-js` is installed and configured, the real
 * implementation replaces each method with actual Supabase queries.
 *
 * Table mapping (planned):
 * - `animas`   → StoredAnima
 * - `rooms`    → Room
 * - `messages` → StoredMessage
 */
export class SupabaseStorage implements StorageProvider {
  // -------------------------------------------------------------------------
  // In-memory store (stub)
  // -------------------------------------------------------------------------
  private animas: StoredAnima[] = [
    {
      id: "aoi",
      name: "葵（Aoi）",
      description: "ビジネス・キャリア全般のアドバイザー",
      avatar: "葵",
      avatarColor: "from-violet-500 to-indigo-500",
      llmProvider: "claude",
      systemPrompt:
        "あなたは「葵」というAIキャラクターです。ビジネス・キャリアのアドバイスが得意で、丁寧で前向きな話し方をします。",
      status: "online",
      tags: ["カウンセリング", "キャリア相談", "プレゼン"],
      messageCount: 1248,
      followerCount: 342,
    },
    {
      id: "ren",
      name: "蓮（Ren）",
      description: "マーケティング・経営戦略スペシャリスト",
      avatar: "蓮",
      avatarColor: "from-emerald-500 to-teal-500",
      llmProvider: "gemini",
      systemPrompt:
        "あなたは「蓮」というAIキャラクターです。マーケティングと経営戦略に精通しており、論理的で簡潔な話し方をします。",
      status: "online",
      tags: ["ビジネス戦略", "マーケティング", "財務分析"],
      messageCount: 832,
      followerCount: 218,
    },
    {
      id: "hina",
      name: "陽菜（Hina）",
      description: "UI/UXデザイン・クリエイティブディレクター",
      avatar: "陽",
      avatarColor: "from-pink-500 to-rose-500",
      llmProvider: "openai",
      systemPrompt:
        "あなたは「陽菜」というAIキャラクターです。デザインとクリエイティブが得意で、明るく元気な話し方をします。",
      status: "offline",
      tags: ["UI/UXデザイン", "ブランディング", "クリエイティブ"],
      messageCount: 654,
      followerCount: 186,
    },
    {
      id: "sora",
      name: "空（Sora）",
      description: "ソフトウェアエンジニア・技術アドバイザー",
      avatar: "空",
      avatarColor: "from-blue-500 to-cyan-500",
      llmProvider: "claude",
      systemPrompt:
        "あなたは「空」というAIキャラクターです。ソフトウェア開発全般に詳しく、的確で落ち着いた話し方をします。",
      status: "online",
      tags: ["コードレビュー", "アーキテクチャ", "DevOps"],
      messageCount: 1021,
      followerCount: 405,
    },
    {
      id: "mio",
      name: "美桜（Mio）",
      description: "健康・フィットネスコーチ",
      avatar: "美",
      avatarColor: "from-amber-500 to-orange-500",
      llmProvider: "gemini",
      systemPrompt:
        "あなたは「美桜」というAIキャラクターです。健康とフィットネスの専門家で、ポジティブで励ましてくれる話し方をします。",
      status: "offline",
      tags: ["フィットネス", "栄養管理", "メンタルケア"],
      messageCount: 445,
      followerCount: 132,
    },
  ];

  private rooms: Room[] = [];
  private messages: StoredMessage[] = [];
  private nextMsgId = 1;

  // -------------------------------------------------------------------------
  // Messages
  // -------------------------------------------------------------------------
  async getMessages(
    roomId: string,
    opts?: PaginationOptions,
  ): Promise<StoredMessage[]> {
    const limit = opts?.limit ?? 50;
    const roomMessages = this.messages.filter((m) => m.roomId === roomId);

    if (opts?.before) {
      const idx = roomMessages.findIndex((m) => m.id === opts.before);
      if (idx > 0) {
        return roomMessages.slice(Math.max(0, idx - limit), idx);
      }
    }

    // Return the latest N messages
    return roomMessages.slice(-limit);
  }

  async saveMessage(
    roomId: string,
    message: Omit<StoredMessage, "id" | "createdAt">,
  ): Promise<StoredMessage> {
    const stored: StoredMessage = {
      ...message,
      id: `msg_${this.nextMsgId++}`,
      roomId,
      createdAt: new Date().toISOString(),
    };
    this.messages.push(stored);
    return stored;
  }

  // -------------------------------------------------------------------------
  // Rooms
  // -------------------------------------------------------------------------
  async getRoom(roomId: string): Promise<Room | null> {
    return this.rooms.find((r) => r.id === roomId) ?? null;
  }

  async createRoom(animaId: string, userId: string): Promise<Room> {
    const room: Room = {
      id: `room_${Date.now()}`,
      animaId,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.rooms.push(room);
    return room;
  }

  // -------------------------------------------------------------------------
  // Animas
  // -------------------------------------------------------------------------
  async listAnimas(): Promise<StoredAnima[]> {
    return this.animas;
  }

  async getAnima(animaId: string): Promise<StoredAnima | null> {
    return this.animas.find((a) => a.id === animaId) ?? null;
  }
}
