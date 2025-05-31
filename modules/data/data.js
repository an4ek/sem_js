const API_KEY = 'live_your_api_key_here';
export async function fetchBreeds() {
    if (!API_KEY || API_KEY === 'live_your_api_key_here') {
        throw new Error('API-ключ не указан. Замените API_KEY в data.js на действительный ключ от TheCatAPI.');
    }
    console.log('Запрос к API для загрузки пород...');
    const response = await fetch('https://api.thecatapi.com/v1/breeds', {
        headers: { 'x-api-key': API_KEY }
    });
    if (!response.ok) {
        throw new Error(`Ошибка API: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    console.log('Данные о породах получены:', data.length, 'breeds');
    return data;
}

export async function fetchCatImage(breedId) {
    console.log(`Запрос изображения для породы ${breedId}...`);
    const response = await fetch(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`, {
        headers: { 'x-api-key': API_KEY }
    });
    if (!response.ok) {
        throw new Error('Ошибка загрузки изображения');
    }
    const data = await response.json();
    console.log('Изображение получено:', data[0]?.url || 'Нет изображения');
    return data[0] || null;
}

export function calculateStats(breeds) {
    const totalBreeds = breeds.length;
    const avgLifeSpan = breeds.reduce((sum, breed) => sum + (parseInt(breed.life_span) || 0), 0) / totalBreeds || 0;
    const avgWeight = breeds.reduce((sum, breed) => sum + (parseFloat(breed.weight?.metric?.split('-')[0]) || 0), 0) / totalBreeds || 0;
    const uniqueOrigins = [...new Set(breeds.map(breed => breed.origin).filter(Boolean))].length;
    return { totalBreeds, avgLifeSpan: avgLifeSpan.toFixed(1), avgWeight: avgWeight.toFixed(1), uniqueOrigins };
}

export function cacheData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        console.log(`Данные сохранены в кэш под ключом "${key}"`);
    } catch (error) {
        console.error('Ошибка кэширования:', error);
    }
}

export function getCachedData(key) {
    try {
        const data = localStorage.getItem(key);
        console.log(`Чтение кэша для ключа "${key}":`, data ? 'Данные найдены' : 'Кэш пуст');
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Ошибка чтения кэша:', error);
        return null;
    }
}

export function clearCache() {
    try {
        localStorage.clear();
        console.log('Кэш очищен');
    } catch (error) {
        console.error('Ошибка очистки кэша:', error);
    }
}

export function getBreedById(breeds, id) {
    return breeds.find(breed => breed.id === id);
}

export function getBreedsByOrigin(breeds, origin) {
    return breeds.filter(breed => breed.origin === origin);
}

export function getBreedsByWeightRange(breeds, min, max) {
    return breeds.filter(breed => {
        const weight = parseFloat(breed.weight?.metric?.split('-')[0]) || 0;
        return weight >= min && weight <= (max || Infinity);
    });
}

export function getBreedsByLifeSpanRange(breeds, min, max) {
    return breeds.filter(breed => {
        const lifeSpan = parseInt(breed.life_span) || 0;
        return lifeSpan >= min && lifeSpan <= (max || Infinity);
    });
}

export function getBreedsByTemperament(breeds, temperament) {
    return breeds.filter(breed => breed.temperament?.includes(temperament));
}

export function getBreedsByEnergyLevel(breeds, level) {
    return breeds.filter(breed => breed.energy_level === level);
}

export function getBreedsByGroomingLevel(breeds, level) {
    return breeds.filter(breed => breed.grooming === level);
}

export function getBreedsBySheddingLevel(breeds, level) {
    return breeds.filter(breed => breed.shedding_level === level);
}

export function getBreedsByChildFriendly(breeds, level) {
    return breeds.filter(breed => breed.child_friendly === level);
}

export function getBreedsByDogFriendly(breeds, level) {
    return breeds.filter(breed => breed.dog_friendly === level);
}

export function getBreedsByCoatLength(breeds, length) {
    return breeds.filter(breed => breed.coat === length);
}

export function getBreedsByAdaptability(breeds, level) {
    return breeds.filter(breed => breed.adaptability === level);
}

export function getBreedsByHealthIssues(breeds, level) {
    return breeds.filter(breed => breed.health_issues === level);
}

export function getBreedsByIntelligence(breeds, level) {
    return breeds.filter(breed => breed.intelligence === level);
}

export function getBreedsBySocialNeeds(breeds, level) {
    return breeds.filter(breed => breed.social_needs === level);
}

export function getBreedsByStrangerFriendly(breeds, level) {
    return breeds.filter(breed => breed.stranger_friendly === level);
}