import { debounce, throttle, capitalize, truncate } from '../utils/utils.js';

export function initUI(app) {
    console.log('Initializing UI...');
    const welcomeScreen = document.getElementById('welcome-screen');
    const mainScreen = document.getElementById('main-screen');
    const userNameInput = document.getElementById('user-name');
    const nextBtn = document.getElementById('next-btn');
    const greeting = document.getElementById('greeting');
    const breedFilter = document.getElementById('breed-filter');
    const originFilter = document.getElementById('origin-filter');
    const weightFilter = document.getElementById('weight-filter');
    const sortSelect = document.getElementById('sort-select');
    const loadCatsBtn = document.getElementById('load-cats');
    const showStatsBtn = document.getElementById('show-stats');
    const clearCacheBtn = document.getElementById('clear-cache');

    if (!welcomeScreen || !mainScreen || !userNameInput || !nextBtn || !greeting) {
        console.error('Main DOM elements not found:', { welcomeScreen, mainScreen, userNameInput, nextBtn, greeting });
        return;
    }

    nextBtn.addEventListener('click', () => {
        console.log('Next button clicked');
        const name = userNameInput.value.trim();
        if (name) {
            app.userName = name;
            app.updateGreeting();
            welcomeScreen.classList.add('hidden');
            mainScreen.classList.remove('hidden');
            console.log('Transition completed, name:', app.userName);
        } else {
            alert('Please enter your name!');
        }
    });

    userNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            nextBtn.click();
        }
    });

    breedFilter.addEventListener('input', debounce(() => {
        app.filterByBreed(breedFilter.value);
    }, 300));

    originFilter.addEventListener('input', debounce(() => {
        app.filterByOrigin(originFilter.value);
    }, 300));

    weightFilter.addEventListener('input', debounce(() => {
        app.filterByWeight(weightFilter.value);
    }, 300));

    sortSelect.addEventListener('change', () => {
        app.sortBreeds(sortSelect.value);
    });

    loadCatsBtn.addEventListener('click', () => app.loadBreeds());

    showStatsBtn.addEventListener('click', () => {
        const statsDiv = document.getElementById('stats');
        statsDiv.classList.toggle('hidden');
        if (!statsDiv.classList.contains('hidden')) {
            statsDiv.classList.add('fade-in');
            app.logState();
        }
    });

    clearCacheBtn.addEventListener('click', () => {
        app.clearCache();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.getElementById('modal').classList.add('hidden');
        }
    });

    window.addEventListener('resize', throttle(() => {
        console.log('Window resized:', window.innerWidth, window.innerHeight);
    }, 200));

    document.addEventListener('scroll', throttle(() => {
        console.log('Scroll position:', window.scrollY);
    }, 200));
}

export function renderBreeds(breeds, onDetailsClick) {
    const catList = document.getElementById('cat-list');
    catList.innerHTML = '';
    if (breeds.length === 0) {
        catList.innerHTML = '<p class="text-gray-500">No breeds found. Try adjusting filters or reloading data.</p>';
        return;
    }
    breeds.forEach(breed => {
        const card = document.createElement('div');
        card.className = 'card bg-white p-4 rounded shadow';
        card.innerHTML = `
            <h3 class="text-lg font-bold">${capitalize(breed.name)}</h3>
            <p><strong>Origin:</strong> ${breed.origin || 'Unknown'}</p>
            <p><strong>Lifespan:</strong> ${breed.life_span || 'Unknown'}</p>
            <p><strong>Weight:</strong> ${breed.weight?.metric || 'Unknown'} kg</p>
            <p><strong>Temperament:</strong> ${breed.temperament || 'Unknown'}</p>
            <p>${truncate(breed.description || 'Description unavailable', 100)}</p>
            <button class="mt-2 bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">Details</button>
        `;
        card.querySelector('button').addEventListener('click', () => {
            onDetailsClick(breed);
            animateCard(card);
        });
        card.classList.add('fade-in');
        catList.appendChild(card);
    });
}

export function renderStats(stats) {
    document.getElementById('total-breeds').textContent = `Total breeds: ${stats.totalBreeds}`;
    document.getElementById('avg-life-span').textContent = `Average lifespan: ${stats.avgLifeSpan} years`;
    document.getElementById('avg-weight').textContent = `Average weight: ${stats.avgWeight} kg`;
    document.getElementById('unique-origins').textContent = `Unique origins: ${stats.uniqueOrigins}`;
}

export function showModal(breed, imageUrl) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalImage = document.getElementById('modal-image');
    const modalDescription = document.getElementById('modal-description');
    const closeModalBtn = document.getElementById('close-modal');

    modalTitle.textContent = capitalize(breed.name);
    modalImage.src = imageUrl || 'https://via.placeholder.com/400x300?text=No+cat+photo';
    modalImage.alt = `Photo of ${breed.name}`;
    modalDescription.textContent = breed.description || 'Description unavailable';
    modal.classList.remove('hidden');
    modal.classList.add('fade-in');

    closeModalBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    modalImage.addEventListener('load', () => {
        console.log(`Image for ${breed.name} loaded`);
    });

    modalImage.addEventListener('error', () => {
        console.error(`Image load error for ${breed.name}`);
        modalImage.src = 'https://via.placeholder.com/400x300?text=Load+error';
    });
}

export function showError() {
    const errorMessage = document.getElementById('error-message');
    if (errorMessage) {
        errorMessage.classList.remove('hidden');
        errorMessage.classList.add('fade-in');
    }
}

export function animateCard(card) {
    card.style.transform = 'scale(1.05)';
    card.style.transition = 'transform 0.3s ease';
    setTimeout(() => {
        card.style.transform = 'scale(1)';
    }, 300);
}

export function highlightElement(element) {
    element.style.backgroundColor = '#e2e8f0';
    element.style.transition = 'background-color 0.5s ease';
    setTimeout(() => {
        element.style.backgroundColor = '';
    }, 500);
}

export function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

export function toggleTheme() {
    document.body.classList.toggle('dark');
    document.body.style.backgroundColor = document.body.classList.contains('dark') ? '#1a202c' : '#edf2f7';
}

export function getViewportSize() {
    return {
        width: window.innerWidth,
        height: window.innerHeight
    };
}

export function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

export function addHoverEffect(element, callback) {
    element.addEventListener('mouseover', () => callback(element));
    element.addEventListener('mouseout', () => {
        element.style.transform = 'scale(1)';
        element.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    });
}

export function createLoadingSpinner() {
    const spinner = document.createElement('div');
    spinner.className = 'fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center';
    spinner.innerHTML = '<div class="w-16 h-16 border-4 border-t-4 border-purple-500 border-solid rounded-full animate-spin"></div>';
    document.body.appendChild(spinner);
    return spinner;
}

export function removeLoadingSpinner(spinner) {
    if (spinner) document.body.removeChild(spinner);
}