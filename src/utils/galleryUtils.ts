
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

export const isValidGalleryImage = (url: string): boolean => {
  // Accept Supabase public storage URLs, /lovable-uploads/ images, Base64 data URLs, and standard http(s) images
  return (
    url.includes('/lovable-uploads/') ||
    url.startsWith('data:image/') ||
    url.includes('/storage/v1/object/public/') ||
    url.startsWith('http://') ||
    url.startsWith('https://')
  );
};

export const filterGalleryImages = (images: any[]): any[] => {
  return images.filter(image => isValidGalleryImage(image.url));
};
