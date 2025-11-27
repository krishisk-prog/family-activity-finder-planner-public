/**
 * Cache Service - In-memory caching with TTL
 *
 * Caches search results to reduce API calls and costs.
 * Uses a simple Map-based cache with time-to-live (TTL) expiration.
 */

import type { FormattedActivity } from './activityFormatter';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export class CacheService<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private ttl: number; // Time to live in milliseconds
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(ttlMinutes: number = 10) {
    this.ttl = ttlMinutes * 60 * 1000;

    // Start automatic cleanup every 5 minutes
    this.startCleanup();
  }

  /**
   * Get value from cache if it exists and hasn't expired
   */
  get(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Store value in cache with TTL
   */
  set(key: string, data: T): void {
    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + this.ttl,
    });
  }

  /**
   * Check if key exists and hasn't expired
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Remove specific entry from cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all entries from cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get current cache size
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Get cache statistics
   */
  stats(): { size: number; ttlMinutes: number } {
    return {
      size: this.cache.size,
      ttlMinutes: this.ttl / (60 * 1000),
    };
  }

  /**
   * Start automatic cleanup of expired entries
   */
  private startCleanup(): void {
    // Run cleanup every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpired();
    }, 5 * 60 * 1000);
  }

  /**
   * Remove all expired entries from cache
   */
  private cleanupExpired(): void {
    const now = Date.now();
    let removed = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        removed++;
      }
    }

    if (removed > 0) {
      console.log(`🧹 Cache cleanup: Removed ${removed} expired entries`);
    }
  }

  /**
   * Stop automatic cleanup (for graceful shutdown)
   */
  stopCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
}

/**
 * Generate cache key from search parameters
 */
export function generateCacheKey(params: {
  city: string;
  kidsAges: string;
  availability: string;
  maxDistance: string;
  preferences: string;
  eventTypes?: string[];
}): string {
  // Normalize parameters for consistent caching
  const normalized = {
    city: params.city.toLowerCase().trim(),
    kidsAges: params.kidsAges.toLowerCase().trim(),
    availability: params.availability.toLowerCase().trim(),
    maxDistance: params.maxDistance.trim(),
    preferences: (params.preferences || '').toLowerCase().trim(),
    eventTypes: (params.eventTypes || []).sort().join(','),
  };

  // Create cache key from normalized parameters
  return JSON.stringify(normalized);
}

// Export singleton instance for activity search caching
// 10-minute TTL for activity searches
export const activityCache = new CacheService<FormattedActivity[]>(10);

// Log cache stats on startup
console.log('💾 Cache service initialized:', activityCache.stats());
