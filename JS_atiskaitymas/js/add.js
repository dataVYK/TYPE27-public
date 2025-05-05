import { insertItem } from './utils/fetch.js';
import { validateItem } from './utils/validation.js';

// DOM elements
const submitBtn = document.getElementById('submit-btn');
const nameInput = document.getElementById('name');
const priceInput = document.getElementById('price');
const imgUrlInput = document.getElementById('imgUrl');
const descriptionInput = document.getElementById('description');
const locationInput = document.getElementById('location');
const successMessage = document.getElementById('success-message');
const errorMessage = document.getElementById('error-message');

// Initialize by hiding messages
document.addEventListener('DOMContentLoaded', () => {
  errorMessage.style.display = 'none';
  successMessage.style.display = 'none';
});

// Clear error message
const clearError = () => {
  errorMessage.textContent = '';
  errorMessage.style.display = 'none';
};

// Show error message
const showError = (message) => {
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
};

// Submit button event listener
submitBtn.addEventListener('click', async () => {
  // Clear previous messages
  clearError();
  successMessage.textContent = '';
  successMessage.style.display = 'none';

  // Collect form data
  const data = {
    name: nameInput.value.trim(),
    imgUrl: imgUrlInput.value.trim(),
    price: priceInput.value ? parseFloat(priceInput.value) : '',
    description: descriptionInput.value.trim(),
    location: locationInput.value.trim()
  };

  // Validate the data
  const validationError = validateItem(data);

  if (validationError) {
    showError(validationError);
    return;
  }

  try {
    // Submit the data
    const item = await insertItem(data);

    if (item && item.id) {
      // Show success message
      successMessage.textContent = '✨ Your magical item has been successfully conjured into our inventory! Returning to catalog shortly...';
      successMessage.style.display = 'block';

      // Clear the form
      nameInput.value = '';
      priceInput.value = '';
      imgUrlInput.value = '';
      descriptionInput.value = '';
      locationInput.value = '';

      // Redirect to catalog after 3 seconds
      setTimeout(() => {
        window.location.replace('../index.html');
      }, 3000);
    }
  } catch (error) {
    console.error('Failed to add item:', error);
    showError('A mystical disturbance prevented your item from being added. Try again later.');
  }
});