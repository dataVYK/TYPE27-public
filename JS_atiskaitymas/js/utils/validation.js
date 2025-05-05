// Validate item data before submission
export const validateItem = (data) => {
  // Check if all required fields are filled
  if (!data.name) {
    return 'Please provide a name for your magical item.';
  }

  if (!data.imgUrl) {
    return 'Please provide an image URL for your magical item.';
  }

  if (!data.price && data.price !== 0) {
    return 'Please provide a price for your magical item.';
  }

  if (!data.description) {
    return 'Please provide a description of your magical item\'s mystical properties.';
  }

  if (!data.location) {
    return 'Please provide a location where this magical item can be found.';
  }

  // Validate price format
  if (isNaN(data.price) || data.price < 0) {
    return 'Price must be a valid positive number.';
  }

  // Validate image URL format
  const imgUrlRegex = /^https?:\/\/.*\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/i;
  if (!imgUrlRegex.test(data.imgUrl)) {
    return 'Please provide a valid image URL (ending with jpg, jpeg, png, gif, webp, bmp, or svg).';
  }

  // All validations passed
  return null;
};