import { Palette, SlideContent, Brand } from '@/lib/types';

export interface ThemeSlideProps {
  slide: SlideContent;
  index: number;        // 0-based
  total: number;
  palette: Palette;
  brand: Brand;
  dayLabel: string;     // "DAY 71" etc.
  postLabel: string;    // "POST 1 OF 5" etc.
  theme?: string;       // overall topic
}

export const SLIDE_W = 1080;
export const SLIDE_H = 1350;
