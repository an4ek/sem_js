export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

export function formatNumber(num) {
    return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function truncate(str, maxLength) {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength - 3) + '...';
}

export function isValidNumber(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
}

export function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

export function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

export function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

export function removeDuplicates(arr) {
    return [...new Set(arr)];
}

export function chunkArray(arr, size) {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
    }
    return chunks;
}

export function getCurrentTimestamp() {
    return new Date().toISOString();
}

export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function parseQueryString(query) {
    const params = {};
    query.replace(/^\?/, '').split('&').forEach(param => {
        const [key, value] = param.split('=');
        if (key) params[key] = decodeURIComponent(value || '');
    });
    return params;
}

export function buildQueryString(params) {
    return Object.entries(params).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
}

export function isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
}

export function mergeObjects(obj1, obj2) {
    return { ...obj1, ...obj2 };
}

export function getObjectSize(obj) {
    return Object.keys(obj).length;
}

export function mapValues(obj, callback) {
    return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, callback(value)]));
}

export function filterObject(obj, callback) {
    return Object.fromEntries(Object.entries(obj).filter(([key, value]) => callback(value)));
}

export function pickObject(obj, keys) {
    return Object.fromEntries(keys.map(key => [key, obj[key]]));
}