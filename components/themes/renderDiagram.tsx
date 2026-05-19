'use client';

import Diagram from '@/components/diagrams/Diagram';
import { Palette, SlideContent } from '@/lib/types';

interface Props {
  slide: SlideContent;
  palette: Palette;
  font?: string;
  /** title size override */
  titleStyle?: React.CSSProperties;
  /** wrap diagram in extra container styling */
  wrapperStyle?: React.CSSProperties;
}

export default function DiagramSlideBody({ slide, palette, font, titleStyle, wrapperStyle }: Props) {
  if (!slide.diagram) return null;
  return (
    <>
      {slide.title && <div style={titleStyle}>{slide.title}</div>}
      <div style={{ marginTop: 28, ...wrapperStyle }}>
        <Diagram spec={slide.diagram} palette={palette} font={font} />
      </div>
    </>
  );
}
