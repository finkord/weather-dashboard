import { Injectable } from '@angular/core';

// Інтерфейс для запису в кеші
interface CacheEntry<T> {
  data: T;
  expires: number; // Timestamp, коли дані стануть недійсними
}

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  private cache = new Map<string, CacheEntry<unknown>>();

  /**
   * Отримує дані з кешу за ключем.
   * Повертає null, якщо запис відсутній або прострочений.
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;

    if (!entry) {
      return null;
    }

    // Перевіряємо час життя
    const isExpired = Date.now() > entry.expires;

    if (isExpired) {
      this.cache.delete(key); // Очищуємо прострочений запис
      return null;
    }

    return entry.data;
  }

  /**
   * Зберігає дані в кеші.
   * @param key Унікальний ключ
   * @param data Дані для зберігання
   * @param ttlMs Час життя в мілісекундах (за замовчуванням 1 година)
   */
  set<T>(key: string, data: T, ttlMs: number = 3600000): void {
    const expires = Date.now() + ttlMs;
    this.cache.set(key, { data, expires });
  }

  /**
   * Примусово очищує запис з кешу
   */
  clear(key: string): void {
    this.cache.delete(key);
  }
}