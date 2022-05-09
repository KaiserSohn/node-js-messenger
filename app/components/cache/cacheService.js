const NodeCache = require( "node-cache" );
const cache = new NodeCache();

module.exports = class CacheService {

    /**
     * @param key
     * @param data
     * @param ttl
     *
     * @returns {boolean}
     */
    static putDataToCache = (key, data, ttl = 60) => {
        return cache.set(key, data, ttl);
    };

    /**
     * @param key
     *
     * @returns {object}
     */
    static readDataFromCache = (key) => {
        return cache.get(key)
    }

    static clearCache = () => {
        return cache.flushAll();
    }
}
