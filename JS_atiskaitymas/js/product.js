import { fetchItemById, deleteItemById } from './utils/fetch.js';

// Get the item ID from URL parameters
const url = new URL(window.location.href);
const id = url.searchParams.get('id');

// DOM elements
const title = document.getElementById('title');
const price = document.getElementById('price');
const description = document.getElementById('description');
const location = document.getElementById('location');
const img = document.getElementById('img');
const deleteBtn = document.getElementById('delete-btn');
const message = document.getElementById('message');
const productContent = document.querySelector('.product-content');
const loadingElement = document.querySelector('.loading');

// Format price with gold coin symbol
const formatPrice = (priceValue) => {
  return `${priceValue} 🪙`;
};

// Insert item data into the page
const insertDataToScreen = (item) => {
  title.textContent = item.name;
  price.textContent = formatPrice(item.price);
  description.textContent = item.description;
  location.textContent = `Available at: ${item.location}`;
  img.src = item.imgUrl;
  img.alt = item.name;

  // Show the product content and hide loading message
  loadingElement.style.display = 'none';
  productContent.style.display = 'grid';
};

// Build the page with item details
const buildScreen = async () => {
  try {
    if (!id) {
      showError('No item specified. Redirecting to catalog...');
      setTimeout(() => {
        window.location.replace('../index.html');
      }, 2000);
      return;
    }

    const item = await fetchItemById(id);

    if (!item || !item.id) {
      showError('The mystical item you seek does not exist or has been banished to another realm.');
      return;
    }

    insertDataToScreen(item);
  } catch (error) {
    console.error('Failed to fetch item details:', error);
    showError('A magical disturbance prevents us from showing this item.');
  }
};

// Show error message
const showError = (errorText) => {
  loadingElement.style.display = 'none';
  message.textContent = errorText;
  message.classList.add('error-message');
};

// Initialize the page
buildScreen();

// Delete button event listener
deleteBtn.addEventListener('click', async () => {
  try {
    const result = await deleteItemById(id);

    if (result) {
      // Hide product content
      productContent.style.display = 'none';

      // Show success message
      message.textContent = '✨ This item has been banished from our realm! Returning to catalog shortly...';
      message.classList.add('success-message');

      // Redirect back to the catalog after 3 seconds
      setTimeout(() => {
        window.location.replace('../index.html');
      }, 3000);
    }
  } catch (error) {
    console.error('Failed to delete item:', error);
    message.textContent = 'The magical protection on this item prevented it from being banished. Try again later.';
    message.classList.add('error-message');
  }
});