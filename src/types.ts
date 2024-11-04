export interface TextOverlay {
  id: number;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  font: string;
}

export interface ImageSize {
  width: number;
  height: number;
  label: string;
}

export const SOCIAL_SIZES: ImageSize[] = [
  { width: 1200, height: 630, label: 'Facebook/LinkedIn Post' },
  { width: 1080, height: 1080, label: 'Instagram Square' },
  { width: 1080, height: 1350, label: 'Instagram Portrait' },
  { width: 1200, height: 675, label: 'Twitter Post' },
  { width: 1280, height: 720, label: 'YouTube Thumbnail' },
  { width: 1200, height: 628, label: 'Open Graph' },
];