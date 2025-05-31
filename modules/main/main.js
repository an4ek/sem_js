import { fetchBreeds, fetchCatImage, calculateStats, cacheData, getCachedData, clearCache } from '../data/data.js';
import { renderBreeds, renderStats, initUI, showModal, showError } from '../view/view.js';
import { debounce, throttle, capitalize } from '../utils/utils.js';

class App {
    constructor() {
        this.userName = '';
        this.breeds = [];
        this.filteredBreeds = [];
        this.filters = { breed: '', origin: '', weight: '' };
        console.log('Конструктор App инициализирован');
        this.init();
    }

    init() {
        console.log('Инициализация приложения...');
        initUI(this);
        this.loadBreeds();
    }

    async loadBreeds() {
        try {
            console.log('Попытка загрузки пород...');
            const cachedBreeds = getCachedData('breeds');
            if (cachedBreeds) {
                this.breeds = cachedBreeds;
                console.log('Данные загружены из кэша:', this.breeds.length, 'пород');
            } else {
                this.breeds = await fetchBreeds();
                cacheData('breeds', this.breeds);
                console.log('Данные загружены с сервера:', this.breeds.length, 'пород');
            }
            if (this.breeds.length === 0) {
                console.warn('Список пород пустой');
                showError();
                return;
            }
            this.applyAllFilters();
            renderBreeds(this.filteredBreeds, this.showDetails.bind(this));
            renderStats(calculateStats(this.breeds));
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            showError();
        }
    }

    applyAllFilters() {
        this.filteredBreeds = [...this.breeds];
        if (this.filters.breed) this.filterByBreed(this.filters.breed);
        if (this.filters.origin) this.filterByOrigin(this.filters.origin);
        if (this.filters.weight) this.filterByWeight(this.filters.weight);
        console.log('Фильтры применены, отфильтровано пород:', this.filteredBreeds.length);
    }

    filterByBreed(query) {
        this.filters.breed = query;
        this.filteredBreeds = this.breeds.filter(breed =>
            breed.name.toLowerCase().includes(query.toLowerCase())
        );
        this.renderFiltered();
    }

    filterByOrigin(query) {
        this.filters.origin = query;
        this.filteredBreeds = this.breeds.filter(breed =>
            breed.origin?.toLowerCase().includes(query.toLowerCase())
        );
        this.renderFiltered();
    }

    filterByWeight(minWeight) {
        this.filters.weight = minWeight;
        const min = parseFloat(minWeight) || 0;
        this.filteredBreeds = this.breeds.filter(breed => {
            const weight = parseFloat(breed.weight?.metric?.split('-')[0]) || 0;
            return weight >= min;
        });
        this.renderFiltered();
    }

    renderFiltered() {
        renderBreeds(this.filteredBreeds, this.showDetails.bind(this));
    }

    sortBreeds(criteria) {
        this.filteredBreeds.sort((a, b) => {
            if (criteria === 'name-asc') return a.name.localeCompare(b.name);
            if (criteria === 'name-desc') return b.name.localeCompare(a.name);
            if (criteria === 'life-asc') return parseInt(a.life_span) - parseInt(b.life_span);
            if (criteria === 'life-desc') return parseInt(b.life_span) - parseInt(a.life_span);
            return 0;
        });
        renderBreeds(this.filteredBreeds, this.showDetails.bind(this));
    }

    async showDetails(breed) {
        try {
            const imageData = await fetchCatImage(breed.id);
            const imageUrl = imageData?.url || 'https://via.placeholder.com/400x300?text=Нет фото кошки';
            showModal(breed, imageUrl);
        } catch (error) {
            console.error('Ошибка загрузки изображения:', error);
            showModal(breed, 'https://via.placeholder.com/400x300?text=Ошибка загрузки');
        }
    }

    clearCache() {
        clearCache();
        this.filters = { breed: '', origin: '', weight: '' };
        this.loadBreeds();
        console.log('Кэш очищен, данные перезагружены');
    }

    resetFilters() {
        this.filters = { breed: '', origin: '', weight: '' };
        this.filteredBreeds = [...this.breeds];
        renderBreeds(this.filteredBreeds, this.showDetails.bind(this));
    }

    getBreedCount() {
        return this.breeds.length;
    }

    getFilteredBreedCount() {
        return this.filteredBreeds.length;
    }

    getOrigins() {
        return [...new Set(this.breeds.map(breed => breed.origin).filter(Boolean))];
    }

    getAverageTemperament() {
        const temperaments = this.breeds.map(breed => breed.temperament?.split(', ') || []).flat();
        const counts = temperaments.reduce((acc, temp) => {
            acc[temp] = (acc[temp] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Неизвестно';
    }

    getMostCommonColor() {
        const colors = this.breeds.map(breed => breed.coat || 'Неизвестно');
        const counts = colors.reduce((acc, color) => {
            acc[color] = (acc[color] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Неизвестно';
    }

    updateGreeting() {
        const greeting = document.getElementById('greeting');
        if (greeting) greeting.textContent = `Hello, ${capitalize(this.userName)}!`;
    }

    logState() {
        console.log('Текущее состояние:', {
            userName: this.userName,
            breedsCount: this.breeds.length,
            filteredCount: this.filteredBreeds.length,
            filters: this.filters
        });
    }
}

const app = new App();
export default app;