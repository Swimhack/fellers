
export interface GalleryImage {
  id: number;
  url: string;
  alt: string;
  order: number;
  uploadDate?: string;
  size?: number;
  metadata?: {
    source?: 'admin' | 'default';
    fileName?: string;
  };
}

export interface ImageLoadState {
  [key: number]: {
    loaded: boolean;
    error: boolean;
  };
}
