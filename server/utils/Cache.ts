
/**
 * Because traditional applications need a global cache system, a singleton pattern must be incorporated into this Cache class to prevent unintended cache overwrites.
 * Additionally, each item set in the cache is invalidated 1 hour after initially set. We do not need to use a WeakMap for automatic garbage colletion of unused Map
 * entries because each Map entry automatically is deleted after 1 hour, regardless of use. 
 */
export default class Cache {

    private static cache_instance: Cache;
    private cache = new Map<string, any>();

    private constructor() {}

    /**
     * Implementation of singleton pattern to make use of globally-accessible data cache
     * @returns Cache
     */
    public static getCacheInstance(): Cache {
        if (!Cache.cache_instance) {
            Cache.cache_instance = new Cache();
        }
        return Cache.cache_instance;
    }

    /**
     * A setTimeout() begins a timer for a submitted cache item to identify when the item must be erased from the cache 
     * @param key a string value indicating the identifying key for a value
     * @param value an 'any' value indicating that any data can be stored in the cache
     * @param expiry_in_milliseconds a number value indicating in milliseconds how long the item in the cache is to be stored before deletion
     */
    set(key: string, value: any, expiry_in_milliseconds: number = 3600000): void {
        const delete_key_timeout = setTimeout(() => {
            this.cache.delete(key);
        }, expiry_in_milliseconds);
        this.cache.set(key, {value, delete_key_timeout});
    }

    /**
     * 
     * @param key a string value indicating the identifying key for a value
     * @returns an 'any' value that is associated with the specified key, or null if there is no associated value
     */
    get(key: string): any | null {
        const cache_data = this.cache.get(key);
        if (cache_data) {
            return cache_data.value;
        }
        return null;
    }

    /**
     * When this function is called, the cache item identified by the key can be manually deleted. However, the timeout attached to the Map entry automatically invokes this 
     * function after 1 hour
     * @param key A string value indicating the identifying key for a value
     */
    clear(key: string): void {
        if (this.cache.has(key)) {
            clearTimeout(this.cache.get(key).delete_key_timeout);
            this.cache.delete(key);
        }
    }
}