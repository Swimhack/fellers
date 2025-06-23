
export const triggerGalleryUpdate = () => {
  window.dispatchEvent(new CustomEvent('galleryImagesUpdated'));
  console.log('Gallery update event triggered');
};

export const validateImageUrl = async (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};
