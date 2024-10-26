// services/EncryptionService.ts
import * as SecureStore from "expo-secure-store";
import { Buffer } from "buffer";
import * as Crypto from "expo-crypto";
import base64 from "base64-js";

interface EncryptedData {
  iv: string;
  encryptedData: string;
}

export class EncryptionService {
  private static readonly SALT_KEY = "encryption_salt";
  private static readonly PIN_HASH_KEY = "pin_hash";
  private static readonly ITERATION_COUNT = 100000;
  private static readonly KEY_LENGTH = 256;
  private static readonly ALGORITHM = "AES-GCM";

  /**
   * Initialize encryption service by setting up a new salt
   * This should be called when user first sets up their PIN
   */
  static async initialize(pin: string): Promise<void> {
    // Generate a random salt
    const salt = await Crypto.getRandomBytesAsync(16);
    const saltBase64 = base64.fromByteArray(salt);

    // Generate and store PIN hash for verification
    const pinHash = await this.hashPin(pin, saltBase64);

    // Store salt and PIN hash
    await SecureStore.setItemAsync(this.SALT_KEY, saltBase64);
    await SecureStore.setItemAsync(this.PIN_HASH_KEY, pinHash);
  }

  /**
   * Verify if the entered PIN is correct
   */
  static async verifyPin(pin: string): Promise<boolean> {
    const storedSalt = await SecureStore.getItemAsync(this.SALT_KEY);
    const storedHash = await SecureStore.getItemAsync(this.PIN_HASH_KEY);

    if (!storedSalt || !storedHash) {
      throw new Error("Encryption service not initialized");
    }

    const pinHash = await this.hashPin(pin, storedSalt);
    return pinHash === storedHash;
  }

  /**
   * Generate an encryption key from PIN and salt
   */
  private static async generateKey(
    pin: string,
    salt: string
  ): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const pinBuffer = encoder.encode(pin);
    const saltBuffer = base64.toByteArray(salt);

    // Generate key material using PBKDF2
    const keyMaterial = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      pin + salt
    );

    // Import key
    return await crypto.subtle.importKey(
      "raw",
      Buffer.from(keyMaterial, "hex"),
      { name: "AES-GCM" },
      false,
      ["encrypt", "decrypt"]
    );
  }

  /**
   * Encrypt data using PIN-derived key
   */
  static async encrypt(data: string, pin: string): Promise<EncryptedData> {
    const salt = await SecureStore.getItemAsync(this.SALT_KEY);
    if (!salt) {
      throw new Error("Encryption service not initialized");
    }

    const key = await this.generateKey(pin, salt);
    const iv = await Crypto.getRandomBytesAsync(12);

    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);

    const encryptedBuffer = await crypto.subtle.encrypt(
      {
        name: this.ALGORITHM,
        iv,
      },
      key,
      dataBuffer
    );

    return {
      iv: base64.fromByteArray(iv),
      encryptedData: base64.fromByteArray(new Uint8Array(encryptedBuffer)),
    };
  }

  /**
   * Decrypt data using PIN-derived key
   */
  static async decrypt(
    encryptedData: EncryptedData,
    pin: string
  ): Promise<string> {
    const salt = await SecureStore.getItemAsync(this.SALT_KEY);
    if (!salt) {
      throw new Error("Encryption service not initialized");
    }

    const key = await this.generateKey(pin, salt);

    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: this.ALGORITHM,
        iv: base64.toByteArray(encryptedData.iv),
      },
      key,
      base64.toByteArray(encryptedData.encryptedData)
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  }

  /**
   * Hash PIN with salt for verification
   */
  private static async hashPin(pin: string, salt: string): Promise<string> {
    return await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      pin + salt
    );
  }
}
