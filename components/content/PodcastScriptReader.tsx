'use client';
import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Link from 'next/link';

interface PodcastScriptReaderProps {
  content: string;
  episodeSlug?: string;
}

export function PodcastScriptReader({ content, episodeSlug }: PodcastScriptReaderProps) {
  const [viewMode, setViewMode] = useState<'chat' | 'article'>('chat');
  const [audioExists, setAudioExists] = useState(false);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  useEffect(() => {
    if (!episodeSlug) return;
    const isAws = episodeSlug.startsWith('aws/');
    const ext = isAws ? 'm4a' : 'mp3';
    const audioUrl = `${basePath}/data/audio/${episodeSlug}.${ext}`;
    fetch(audioUrl, { method: 'HEAD' })
      .then(r => setAudioExists(r.ok))
      .catch(() => setAudioExists(false));
  }, [episodeSlug, basePath]);

  // Pre-process content for chat mode
  const chatSections: { speaker: string | null; text: string }[] = [];
  let currentSpeaker: string | null = null;
  let currentText = '';

  const lines = content.split('\n');
  for (const line of lines) {
    if (line.trim().startsWith('**Mahi:**')) {
      if (currentText.trim()) chatSections.push({ speaker: currentSpeaker, text: currentText });
      currentSpeaker = 'Mahi';
      currentText = line.replace('**Mahi:**', '') + '\n';
    } else if (line.trim().startsWith('**Thiru:**')) {
      if (currentText.trim()) chatSections.push({ speaker: currentSpeaker, text: currentText });
      currentSpeaker = 'Thiru';
      currentText = line.replace('**Thiru:**', '') + '\n';
    } else if (line.trim().startsWith('---') || line.trim().startsWith('##')) {
      if (currentText.trim()) chatSections.push({ speaker: currentSpeaker, text: currentText });
      currentSpeaker = null;
      currentText = line + '\n';
    } else {
      currentText += line + '\n';
    }
  }
  if (currentText.trim()) chatSections.push({ speaker: currentSpeaker, text: currentText });

  // Custom Markdown Components for beautiful code rendering
  const markdownComponents: any = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      // If it's a code block (not inline), use SyntaxHighlighter
      if (!inline && match) {
        return (
          <div style={{ margin: '16px 0', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
            <SyntaxHighlighter
              style={vscDarkPlus as any}
              language={match[1]}
              PreTag="div"
              customStyle={{ margin: 0, fontSize: '0.9rem', padding: '16px' }}
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          </div>
        );
      }
      // Inline code
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    p({ node, children, ...props }: any) {
      let isQA = false;
      const childrenArray = React.Children.toArray(children);
      
      if (childrenArray.length > 0) {
         const firstChild = childrenArray[0];
         if (React.isValidElement(firstChild) && firstChild.type === 'strong') {
            const strongContent = (firstChild.props as any).children;
            if (strongContent === 'Q:') {
               isQA = true;
            }
         }
      }

      if (isQA) {
         return (
           <div className="qa-card">
              <div className="qa-header">
                <span className="qa-icon">💡</span>
                <span className="qa-title">Interview Deep-Dive</span>
              </div>
              <div className="qa-content">
                {childrenArray.map((child, idx) => {
                  if (idx === 0) {
                     return <strong key={idx} className="qa-q-label">Q:</strong>;
                  }
                  if (React.isValidElement(child) && child.type === 'em') {
                     const emContent = (child.props as any).children;
                     if (emContent === 'Answer:') {
                        return (
                          <React.Fragment key={idx}>
                            <div className="qa-a-break" />
                            <strong className="qa-a-label">A:</strong>
                          </React.Fragment>
                        );
                     }
                  }
                  if (typeof child === 'string' && child.includes('<br>')) {
                     const parts = child.split('<br>');
                     return (
                        <React.Fragment key={idx}>
                           {parts.map((part, pIdx) => (
                              <React.Fragment key={pIdx}>
                                 {part}
                                 {pIdx < parts.length - 1 && <div className="qa-a-break" />}
                              </React.Fragment>
                           ))}
                        </React.Fragment>
                     );
                  }
                  return child;
                })}
              </div>
           </div>
         );
      }
      return <p {...props}>{children}</p>;
    },
    a({ node, href, children, ...props }: any) {
      if (href && href.startsWith('/')) {
        const url = new URL(href, 'http://localhost');
        if (episodeSlug) {
          url.searchParams.set('returnUrl', `/podcast?episode=${episodeSlug}`);
        }
        return (
          <Link 
            href={`${url.pathname}${url.search}${url.hash}`} 
            style={{ 
              color: '#6d28d9', 
              background: 'rgba(139, 92, 246, 0.1)', 
              padding: '2px 8px', 
              borderRadius: '6px', 
              textDecoration: 'none', 
              fontWeight: 700,
              borderBottom: '2px dotted #8b5cf6',
              transition: 'all 0.2s',
              margin: '0 2px'
            }}
          >
            {children}
          </Link>
        );
      }
      return <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: '#8b5cf6', textDecoration: 'underline' }} {...props}>{children}</a>;
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', width: '100%' }}>

      {/* Audio Player — shown when MP3 exists */}
      {audioExists && episodeSlug && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(109,40,217,0.08) 100%)',
          border: '1px solid rgba(139,92,246,0.3)',
          borderRadius: 16,
          padding: '16px 20px',
          marginBottom: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 10
        }} className="hide-on-print">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: '1.2rem' }}>🎙️</span>
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#8b5cf6' }}>Listen to this Episode</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>Tanglish Audio • Mahi &amp; Thiru</span>
          </div>
          <audio
            controls
            style={{ width: '100%', borderRadius: 8, accentColor: '#8b5cf6', outline: 'none' }}
            src={`${basePath}/data/audio/${episodeSlug}.${episodeSlug.startsWith('aws/') ? 'm4a' : 'mp3'}`}
          >
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      {/* Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }} className="hide-on-print">
        
        <button 
           onClick={() => window.print()}
           style={{ 
             display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', 
             padding: '6px 14px', borderRadius: 12, height: 36,
             background: 'var(--bg-secondary)', border: '1px solid var(--border)',
             color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer',
             transition: 'all 0.2s'
           }}
           title="Download as PDF"
        >
          <span style={{ fontSize: '1.1rem' }}>📄</span>
          <span className="hide-on-mobile">Save PDF</span>
        </button>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 4, display: 'flex', gap: 4, border: '1px solid var(--border)' }}>
          <button
            onClick={() => setViewMode('chat')}
            style={{
              padding: '6px 16px', borderRadius: 8, border: 'none', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s',
              background: viewMode === 'chat' ? '#8b5cf6' : 'transparent',
              color: viewMode === 'chat' ? '#fff' : 'var(--text-secondary)'
            }}
          >
            💬 Chat Style
          </button>
          <button
            onClick={() => setViewMode('article')}
            style={{
              padding: '6px 16px', borderRadius: 8, border: 'none', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s',
              background: viewMode === 'article' ? '#8b5cf6' : 'transparent',
              color: viewMode === 'article' ? '#fff' : 'var(--text-secondary)'
            }}
          >
            📄 Article Style
          </button>
        </div>
      </div>

      <div className={`podcast-container ${viewMode}-mode`}>
        {viewMode === 'article' ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {content}
          </ReactMarkdown>
        ) : (
          chatSections.map((sec, i) => {
            if (!sec.speaker) {
              return (
                <ReactMarkdown key={i} remarkPlugins={[remarkGfm]} components={markdownComponents}>
                  {sec.text}
                </ReactMarkdown>
              );
            }
            const className = sec.speaker === 'Mahi' ? 'chat-bubble mahi' : 'chat-bubble thiru';
            return (
              <div key={i} className={className}>
                <div className="speaker-name">{sec.speaker === 'Mahi' ? '🧑‍🎓 Mahi' : '👨‍💻 Thiru'}</div>
                <div className="bubble-content">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                    {sec.text}
                  </ReactMarkdown>
                </div>
              </div>
            );
          })
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .podcast-container {
          color: var(--text-primary);
          line-height: 1.6;
          font-size: 1.05rem;
          width: 100%;
          box-sizing: border-box;
        }
        .podcast-container.article-mode p {
          margin-bottom: 1.2rem;
        }
        .podcast-container.chat-mode {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .podcast-container h1, .podcast-container h2, .podcast-container h3 {
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: var(--text-primary);
          word-wrap: break-word;
        }
        .podcast-container h1 { font-size: 1.8rem; font-weight: 800; border-bottom: 2px solid var(--border); padding-bottom: 8px; }
        .podcast-container h2 { font-size: 1.4rem; font-weight: 700; color: #8b5cf6; }
        .podcast-container hr { border: 0; height: 1px; background: var(--border); margin: 2rem 0; }
        
        .podcast-container code { font-family: 'JetBrains Mono', monospace; font-size: 0.9em; background: rgba(139, 92, 246, 0.1); padding: 2px 6px; border-radius: 4px; color: #8b5cf6; word-break: break-word; }
        .podcast-container pre code { background: transparent; padding: 0; color: inherit; word-break: normal; }
        
        /* Table Styling */
        .podcast-container table { 
          width: 100%; border-collapse: collapse; margin: 24px 0; font-size: 0.95rem; 
          border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); 
          display: block; overflow-x: auto; 
        }
        .podcast-container th { background: #8b5cf6; color: white; padding: 14px 16px; text-align: left; }
        .podcast-container td { padding: 14px 16px; border-bottom: 1px solid var(--border); background: var(--surface); color: var(--text-primary); }
        .podcast-container tr:last-child td { border-bottom: none; }
        
        /* Bold Text & Q&A */
        .podcast-container p strong { color: #8b5cf6; }
        .chat-bubble.thiru p strong { color: rgba(255,255,255,0.95); }
        
        .qa-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-left: 4px solid #f59e0b;
          border-radius: 12px;
          margin: 24px 0;
          padding: 20px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          line-height: 1.7;
        }
        .qa-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          font-weight: 800;
          color: #f59e0b;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 1px;
        }
        .qa-content { color: var(--text-primary); }
        .qa-q-label {
          color: #f59e0b !important;
          margin-right: 8px;
          font-size: 1.1rem;
        }
        .qa-a-label {
          color: #10b981 !important;
          margin-right: 8px;
          font-size: 1.1rem;
          display: inline-block;
        }
        .qa-a-break {
          display: block;
          height: 12px;
          width: 100%;
        }
        
        /* Lists (Quick Revision) */
        .podcast-container ul {
          background: var(--surface-raised);
          padding: 20px 20px 20px 40px;
          border-radius: 12px;
          border-left: 4px solid #8b5cf6;
          margin: 24px 0;
          list-style: none;
        }
        .podcast-container ul li {
          margin-bottom: 12px;
          position: relative;
        }
        .podcast-container ul li:last-child { margin-bottom: 0; }
        .podcast-container ul li::before {
          content: "✓";
          position: absolute;
          left: -24px;
          color: #8b5cf6;
          font-weight: bold;
        }
        
        .chat-bubble {
          display: flex;
          flex-direction: column;
          max-width: 90%;
          padding: 14px 18px;
          border-radius: 18px;
          margin-bottom: 8px;
          position: relative;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          box-sizing: border-box;
        }
        .chat-bubble.mahi {
          align-self: flex-start;
          background: var(--surface);
          border: 1px solid var(--border);
          border-bottom-left-radius: 4px;
        }
        .chat-bubble.thiru {
          align-self: flex-end;
          background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
          color: white;
          border-bottom-right-radius: 4px;
          margin-left: auto;
        }
        
        /* Inner chat bubble overrides */
        .chat-bubble ul {
          background: rgba(0,0,0,0.05);
          border-left-color: rgba(0,0,0,0.2);
          margin: 16px 0;
        }
        .chat-bubble.thiru ul {
          background: rgba(0,0,0,0.15);
          border-left-color: rgba(255,255,255,0.4);
        }
        .chat-bubble.thiru ul li::before { color: #fff; }
        .speaker-name {
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          margin-bottom: 6px;
          opacity: 0.8;
        }
        .chat-bubble.thiru .speaker-name { color: rgba(255,255,255,0.9); }
        .chat-bubble.mahi .speaker-name { color: #8b5cf6; }
        .chat-bubble.thiru code { background: #1e1e1e; color: #d4d4d4; padding: 2px 6px; border-radius: 4px; }
        
        .bubble-content p:last-child { margin-bottom: 0; }
        .bubble-content p:first-child { margin-top: 0; }

        @media (max-width: 600px) {
          .chat-bubble {
            max-width: 95%;
            padding: 12px 14px;
          }
          .podcast-container h1 { font-size: 1.5rem; }
          .podcast-container h2 { font-size: 1.2rem; }
        }
      `}} />
    </div>
  );
}
