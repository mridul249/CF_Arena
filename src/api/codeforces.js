// A simple cache to respect the 1 request/2 seconds rule for repeated concurrent requests
const cache = new Map();
const CACHE_DURATION = 60000; // 1 minute
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 2100; // 2.1 seconds to be safe

// Queue for scheduling API requests to prevent HTTP 400 Call limit exceeded
let requestQueue = Promise.resolve();

const queueRequest = async (url) => {
    return new Promise((resolve, reject) => {
        requestQueue = requestQueue.then(async () => {
            const now = Date.now();
            const waitTime = Math.max(0, lastRequestTime + MIN_REQUEST_INTERVAL - now);

            if (waitTime > 0) {
                await new Promise(r => setTimeout(r, waitTime));
            }

            try {
                lastRequestTime = Date.now();
                const response = await fetch(url);
                const data = await response.json();

                if (data.status === 'OK') {
                    resolve(data.result);
                } else {
                    reject(new Error(data.comment || 'API request failed'));
                }
            } catch (error) {
                reject(error);
            }
        });
    });
};

const fetchWithCache = async (url, bypassCache = false) => {
    if (!bypassCache && cache.has(url)) {
        const { data, timestamp } = cache.get(url);
        if (Date.now() - timestamp < CACHE_DURATION) {
            return data;
        }
    }

    const result = await queueRequest(url);
    cache.set(url, { data: result, timestamp: Date.now() });
    return result;
};

export const codeforcesAPI = {
    getUserInfo: async (handle) => {
        const url = `https://codeforces.com/api/user.info?handles=${handle}`;
        return fetchWithCache(url);
    },

    getUserRatingHistory: async (handle) => {
        const url = `https://codeforces.com/api/user.rating?handle=${handle}`;
        return fetchWithCache(url);
    },

    getUserStatus: async (handle, count = 10) => {
        const url = `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=${count}`;
        return fetchWithCache(url);
    }
};
