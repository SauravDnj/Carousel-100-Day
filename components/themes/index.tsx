'use client';

import { ThemeId } from '@/lib/types';
import { ThemeSlideProps } from './types';
import RetroGridSlide from './RetroGrid';
import DarkCyberSlide from './DarkCyber';
import MinimalSwissSlide from './MinimalSwiss';
import PastelSoftSlide from './PastelSoft';
import NotebookSlide from './Notebook';
import GlassSlide from './Glass';
import BrutalistSlide from './Brutalist';
import MagazineSlide from './Magazine';
import AuroraSlide from './Aurora';
import HolographicSlide from './Holographic';
import RisographSlide from './Risograph';
import ComicSlide from './Comic';
import Y2KSlide from './Y2K';
import HoloMeshSlide from './HoloMesh';
import CyberGlitchSlide from './CyberGlitch';
import AsciiSlide from './Ascii';
import TapeSlide from './Tape';
import CassetteSlide from './Cassette';
import NotebookGridSlide from './NotebookGrid';
import GlassDarkSlide from './GlassDark';
import MonoEditorialSlide from './MonoEditorial';

export default function ThemeSlide({ themeId, ...props }: ThemeSlideProps & { themeId: ThemeId }) {
  switch (themeId) {
    case 'retro-grid':     return <RetroGridSlide {...props} />;
    case 'dark-cyber':     return <DarkCyberSlide {...props} />;
    case 'minimal-swiss':  return <MinimalSwissSlide {...props} />;
    case 'pastel-soft':    return <PastelSoftSlide {...props} />;
    case 'notebook':       return <NotebookSlide {...props} />;
    case 'glass':          return <GlassSlide {...props} />;
    case 'brutalist':      return <BrutalistSlide {...props} />;
    case 'magazine':       return <MagazineSlide {...props} />;
    case 'aurora':         return <AuroraSlide {...props} />;
    case 'holographic':    return <HolographicSlide {...props} />;
    case 'risograph':      return <RisographSlide {...props} />;
    case 'comic':          return <ComicSlide {...props} />;
    case 'y2k':            return <Y2KSlide {...props} />;
    case 'holo-mesh':      return <HoloMeshSlide {...props} />;
    case 'cyber-glitch':   return <CyberGlitchSlide {...props} />;
    case 'ascii':          return <AsciiSlide {...props} />;
    case 'tape':           return <TapeSlide {...props} />;
    case 'cassette':       return <CassetteSlide {...props} />;
    case 'notebook-grid':  return <NotebookGridSlide {...props} />;
    case 'glass-dark':     return <GlassDarkSlide {...props} />;
    case 'mono-editorial': return <MonoEditorialSlide {...props} />;
  }
}
