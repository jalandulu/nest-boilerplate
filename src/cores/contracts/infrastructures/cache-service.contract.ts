export abstract class ICacheServiceProvider {
  abstract set<T>(key: string, value: T, ttl?: number): Promise<void>;
  abstract get<T>(key: string): Promise<T>;
  abstract del(key: string): Promise<void>;
  abstract has(key: string): Promise<boolean>;
  abstract reset(): Promise<void>;
}
