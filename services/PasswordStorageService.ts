// services/PasswordStorageService.ts
import * as SecureStore from "expo-secure-store";
import { v4 as uuidv4 } from "uuid";
import { EncryptionService } from "./EncryptionService";

interface PasswordEntry {
  id: string;
  title: string;
  username: string;
  password: string;
  website?: string;
  notes?: string;
}

interface StoredPasswordEntry extends Omit<PasswordEntry, "password"> {
  encryptedPassword: {
    iv: string;
    encryptedData: string;
  };
}

export class PasswordStorageService {
  private static readonly PASSWORD_INDEX_KEY = "password_index";

  /**
   * Store a new password entry
   */
  static async storePassword(
    entry: PasswordEntry,
    pin: string
  ): Promise<string> {
    const id = entry.id || uuidv4();

    // Encrypt the password
    const encryptedPassword = await EncryptionService.encrypt(
      entry.password,
      pin
    );

    // Create stored entry format
    const storedEntry: StoredPasswordEntry = {
      id,
      title: entry.title,
      username: entry.username,
      encryptedPassword,
      website: entry.website,
      notes: entry.notes,
    };

    // Store the entry
    await SecureStore.setItemAsync(
      `password_${id}`,
      JSON.stringify(storedEntry)
    );

    // Update password index
    await this.updatePasswordIndex(id);

    return id;
  }

  /**
   * Retrieve a password entry
   */
  static async getPassword(
    id: string,
    pin: string
  ): Promise<PasswordEntry | null> {
    const storedEntryJson = await SecureStore.getItemAsync(`password_${id}`);
    if (!storedEntryJson) return null;

    const storedEntry: StoredPasswordEntry = JSON.parse(storedEntryJson);

    // Decrypt the password
    const password = await EncryptionService.decrypt(
      storedEntry.encryptedPassword,
      pin
    );

    return {
      id: storedEntry.id,
      title: storedEntry.title,
      username: storedEntry.username,
      password,
      website: storedEntry.website,
      notes: storedEntry.notes,
    };
  }

  /**
   * Get all password entries (without decrypted passwords)
   */
  static async getAllPasswordEntries(): Promise<
    Omit<PasswordEntry, "password">[]
  > {
    const passwordIds = await this.getPasswordIndex();
    const entries: Omit<PasswordEntry, "password">[] = [];

    for (const id of passwordIds) {
      const entryJson = await SecureStore.getItemAsync(`password_${id}`);
      if (entryJson) {
        const entry: StoredPasswordEntry = JSON.parse(entryJson);
        entries.push({
          id: entry.id,
          title: entry.title,
          username: entry.username,
          website: entry.website,
          notes: entry.notes,
        });
      }
    }

    return entries;
  }

  /**
   * Delete a password entry
   */
  static async deletePassword(id: string): Promise<void> {
    await SecureStore.deleteItemAsync(`password_${id}`);
    await this.removeFromPasswordIndex(id);
  }

  /**
   * Maintain an index of all password IDs
   */
  private static async getPasswordIndex(): Promise<string[]> {
    const indexJson = await SecureStore.getItemAsync(this.PASSWORD_INDEX_KEY);
    return indexJson ? JSON.parse(indexJson) : [];
  }

  private static async updatePasswordIndex(id: string): Promise<void> {
    const currentIds = await this.getPasswordIndex();
    if (!currentIds.includes(id)) {
      currentIds.push(id);
      await SecureStore.setItemAsync(
        this.PASSWORD_INDEX_KEY,
        JSON.stringify(currentIds)
      );
    }
  }

  private static async removeFromPasswordIndex(id: string): Promise<void> {
    const currentIds = await this.getPasswordIndex();
    const updatedIds = currentIds.filter((currentId) => currentId !== id);
    await SecureStore.setItemAsync(
      this.PASSWORD_INDEX_KEY,
      JSON.stringify(updatedIds)
    );
  }
}
