import { fetchItems } from './utils/fetch.js';

const itemsWrapper = document.getElementById('items-wrapper');

// Format price with gold coin symbol
const formatPrice = (price) => {
  return `${price} 🪙`;
};

// Build item cards and add them to the page
const buildCards = (data) => {
  // Clear loading message
  itemsWrapper.innerHTML = '';

  // Sort items by price (lowest to highest)
  const sortedItems = [...data].sort((a, b) => a.price - b.price);

  sortedItems.forEach((item) => {
    const card = document.createElement('a');
    card.href = `./product/index.html?id=${item.id}`;
    card.classList.add('card');

    const img = document.createElement('img');
    img.src = item.imgUrl;
    img.alt = item.name;

    const cardContent = document.createElement('div');
    cardContent.classList.add('card-content');

    const title = document.createElement('h3');
    title.textContent = item.name;

    const price = document.createElement('div');
    price.classList.add('price');
    price.textContent = formatPrice(item.price);

    cardContent.appendChild(title);
    cardContent.appendChild(price);

    card.appendChild(img);
    card.appendChild(cardContent);

    itemsWrapper.appendChild(card);
  });
};

// Main function to build the page
const buildScreen = async () => {
  try {
    const items = await fetchItems();

    if (items.length === 0) {
      itemsWrapper.innerHTML = '<p class="no-items">No magical items available at the moment. The mystical inventory is depleted.</p>';
      return;
    }

    buildCards(items);
  } catch (error) {
    console.error('Failed to fetch items:', error);
    itemsWrapper.innerHTML = '<p class="error">A magical disturbance prevents us from showing the items. Try again later.</p>';
  }
};

// Initialize the page
buildScreen();