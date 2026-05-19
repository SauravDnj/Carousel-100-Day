'use client';

import { useMemo } from 'react';
import Prism from 'prismjs';
// Languages
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';

interface Props {
  code: string;
  lang?: string;
  theme: 'light' | 'dark';
  fontSize?: number;
  /** background colour for the code block surface */
  background: string;
  /** foreground/default text colour */
  text: string;
  border?: string;
  shadow?: string;
}

// Two tiny color schemes (we apply via inline styles after token-class lookup).
const SCHEMES: Record<'light' | 'dark', Record<string, string>> = {
  light: {
    keyword: '#D7472D',
    string: '#0F766E',
    number: '#1F3A8A',
    comment: '#7A6A55',
    function: '#1F3A8A',
    operator: '#2B2118',
    punctuation: '#2B2118',
    builtin: '#D7472D',
    'class-name': '#1F3A8A',
    boolean: '#D7472D',
  },
  dark: {
    keyword: '#FF6EC7',
    string: '#39FF14',
    number: '#FFB000',
    comment: '#7A8B9B',
    function: '#05D9E8',
    operator: '#E6F1FF',
    punctuation: '#E6F1FF',
    builtin: '#FF2A6D',
    'class-name': '#B388FF',
    boolean: '#FF2A6D',
  },
};

export default function CodeBlock({ code, lang = 'python', theme, fontSize = 24, background, text, border, shadow }: Props) {
  const grammar = Prism.languages[lang] ?? Prism.languages.javascript;
  const tokens = useMemo(() => Prism.tokenize(code, grammar), [code, grammar]);
  const scheme = SCHEMES[theme];

  return (
    <pre style={{
      background, color: text, padding: 24,
      borderRadius: 10, border: border ?? 'none',
      boxShadow: shadow ?? 'none',
      fontFamily: '"JetBrains Mono", monospace',
      fontSize, lineHeight: 1.55, margin: 0, whiteSpace: 'pre-wrap',
      maxWidth: 880, overflow: 'hidden',
    }}>
      <code>{renderTokens(tokens, scheme)}</code>
    </pre>
  );
}

function renderTokens(tokens: (string | Prism.Token)[], scheme: Record<string, string>, keyPrefix = ''): React.ReactNode {
  return tokens.map((t, i) => {
    if (typeof t === 'string') return <span key={`${keyPrefix}${i}`}>{t}</span>;
    const type = Array.isArray(t.type) ? t.type[0] : t.type;
    const color = scheme[type] ?? undefined;
    const inner = t.content;
    let rendered: React.ReactNode;
    if (typeof inner === 'string') {
      rendered = inner;
    } else if (Array.isArray(inner)) {
      rendered = renderTokens(inner as (string | Prism.Token)[], scheme, `${keyPrefix}${i}-`);
    } else {
      // single Token
      rendered = renderTokens([inner as Prism.Token], scheme, `${keyPrefix}${i}-`);
    }
    return (
      <span key={`${keyPrefix}${i}`} style={{ color, fontWeight: type === 'keyword' || type === 'builtin' ? 600 : 400 }}>
        {rendered}
      </span>
    );
  });
}
