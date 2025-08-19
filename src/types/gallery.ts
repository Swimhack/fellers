
export interface GalleryImage {
  id: number;
  url: string;
  alt: string;
  order: number;
}

export interface ImageLoadState {
  [key: number]: {
    loaded: boolean;
    error: boolean;
  };
}
