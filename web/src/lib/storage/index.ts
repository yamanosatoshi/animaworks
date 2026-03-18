// ---------------------------------------------------------------------------
// Storage — re-exports & singleton
// ---------------------------------------------------------------------------

export type {
  StorageProvider,
  StoredMessage,
  StoredAnima,
  Room,
  PaginationOptions,
} from "./types";

export { SupabaseStorage } from "./supabase-storage";

import { SupabaseStorage } from "./supabase-storage";
import type { StorageProvider } from "./types";

// ---------------------------------------------------------------------------
// Singleton — in production this would read config to decide which storage
// provider to instantiate. For now, always returns SupabaseStorage.
// ---------------------------------------------------------------------------

let _instance: StorageProvider | null = null;

export function getStorage(): StorageProvider {
  if (!_instance) {
    _instance = new SupabaseStorage();
  }
  return _instance;
}
