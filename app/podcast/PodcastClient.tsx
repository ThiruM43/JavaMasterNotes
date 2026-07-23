'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { PodcastScriptReader } from '@/components/content/PodcastScriptReader';

interface Episode {
  id: string;
  slug: string;
  title: string;
}

interface Module {
  id: string;
  title: string;
  episodes: Episode[];
}

interface PodcastIndex {
  modules: Module[];
}

import { useSearchParams } from 'next/navigation';

export default function PodcastClient() {
  const searchParams = useSearchParams();
  const [activeTrack, setActiveTrack] = useState<'java' | 'aws'>('java');
  const [index, setIndex] = useState<PodcastIndex | null>(null);
  const [activeModuleIdx, setActiveModuleIdx] = useState(0);
  const [activeEpisode, setActiveEpisode] = useState<Episode | null>(null);
  const [markdown, setMarkdown] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [mdLoading, setMdLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const indexFile = activeTrack === 'aws' ? 'aws-podcast-index.json' : 'podcast-index.json';
    fetch((process.env.NEXT_PUBLIC_BASE_PATH || '') + `/data/${indexFile}`)
      .then(res => res.json())
      .then((data: PodcastIndex) => {
        setIndex(data);
        
        const epSlug = searchParams.get('episode');
        let found = false;
        
        if (epSlug) {
          for (let mIdx = 0; mIdx < data.modules.length; mIdx++) {
            const mod = data.modules[mIdx];
            const ep = mod.episodes.find(e => e.slug === epSlug);
            if (ep) {
              setActiveModuleIdx(mIdx);
              handleSelectEpisode(ep);
              found = true;
              break;
            }
          }
        }

        if (!found && data.modules.length > 0 && data.modules[0].episodes.length > 0) {
          handleSelectEpisode(data.modules[0].episodes[0]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [searchParams, activeTrack]);

  const handleSelectEpisode = async (episode: Episode) => {
    setActiveEpisode(episode);
    setMdLoading(true);
    setMarkdown('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/data/podcasts/${episode.slug}.md`);
      if (res.ok) {
        const text = await res.text();
        setMarkdown(text);
      } else {
        setMarkdown(`> Episode content not found for **${episode.title}** yet.`);
      }
    } catch {
      setMarkdown(`> Error loading episode content.`);
    }
    setMdLoading(false);
  };

  if (loading) {
    return (
      <AppShell>
        <div style={{ padding: 40, textAlign: 'center' }}>Loading Podcast Engine...</div>
      </AppShell>
    );
  }

  if (!index) return <AppShell><div style={{ padding: 40 }}>Failed to load podcast index.</div></AppShell>;

  return (
    <AppShell>
      <style dangerouslySetInnerHTML={{__html: `
        .podcast-layout {
          display: flex;
          gap: 32px;
          flex-direction: row;
          padding: 24px 16px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .podcast-sidebar {
          flex: 1 1 300px;
          max-width: 350px;
        }
        .podcast-content {
          flex: 2 1 0;
          min-width: 0;
        }
        @media (max-width: 768px) {
          .podcast-layout {
            flex-direction: column;
            padding: 16px 12px;
          }
          .podcast-sidebar {
            max-width: 100%;
          }
          .podcast-sidebar > div:last-child {
            position: relative !important;
            top: 0 !important;
          }
        }
      `}} />
      <div className="podcast-layout">
        
        {/* Left Sidebar: Episode List */}
        <div className="podcast-sidebar">
          <div className="breadcrumb" style={{ marginBottom: 16 }}>
            <Link href="/">Home</Link>
            <span className="breadcrumb-sep">›</span>
            <span style={{ color: 'var(--text-primary)' }}>🎧 Podcast Studio</span>
          </div>

          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 16,
            padding: 16,
            position: 'sticky',
            top: 24,
            maxHeight: 'calc(100vh - 48px)',
            overflowY: 'auto'
          }}>
            
            <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: 12, padding: 4, marginBottom: 20 }}>
              <button
                onClick={() => setActiveTrack('java')}
                style={{
                  flex: 1, padding: '8px', borderRadius: 8, border: 'none', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s',
                  background: activeTrack === 'java' ? '#8b5cf6' : 'transparent',
                  color: activeTrack === 'java' ? '#fff' : 'var(--text-secondary)'
                }}
              >☕ Java</button>
              <button
                onClick={() => setActiveTrack('aws')}
                style={{
                  flex: 1, padding: '8px', borderRadius: 8, border: 'none', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s',
                  background: activeTrack === 'aws' ? '#f59e0b' : 'transparent',
                  color: activeTrack === 'aws' ? '#fff' : 'var(--text-secondary)'
                }}
              >☁️ AWS</button>
            </div>

            <h2 style={{ fontSize: '1.2rem', margin: '0 0 16px 0', color: '#8b5cf6', display: 'flex', alignItems: 'center', gap: 8 }}>
              🎧 All Episodes
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {index.modules.map((mod, mIdx) => (
                <div key={mod.id}>
                  <button
                    onClick={() => setActiveModuleIdx(mIdx)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      background: activeModuleIdx === mIdx ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                      border: 'none',
                      padding: '10px 12px',
                      borderRadius: 8,
                      fontWeight: 700,
                      color: activeModuleIdx === mIdx ? '#8b5cf6' : 'var(--text-primary)',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span>{mod.title}</span>
                    <span>{activeModuleIdx === mIdx ? '▼' : '▶'}</span>
                  </button>

                  {activeModuleIdx === mIdx && (
                    <div style={{ paddingLeft: 12, marginTop: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {mod.episodes.map((ep) => (
                        <button
                          key={ep.id}
                          onClick={() => handleSelectEpisode(ep)}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            background: activeEpisode?.id === ep.id ? 'var(--bg-secondary)' : 'transparent',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: 6,
                            fontSize: '0.9rem',
                            color: activeEpisode?.id === ep.id ? '#8b5cf6' : 'var(--text-secondary)',
                            fontWeight: activeEpisode?.id === ep.id ? 600 : 400,
                            cursor: 'pointer',
                            borderLeft: activeEpisode?.id === ep.id ? '3px solid #8b5cf6' : '3px solid transparent'
                          }}
                        >
                          {ep.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content: Player/Reader */}
        <div className="podcast-content">
          {activeEpisode && (
            <div style={{
              background: 'linear-gradient(135deg, var(--surface) 0%, rgba(139, 92, 246, 0.08) 100%)',
              border: '1px solid var(--border)',
              borderTop: '4px solid #8b5cf6',
              borderRadius: 16,
              padding: '24px',
              marginBottom: 24,
              boxShadow: '0 8px 30px rgba(0,0,0,0.04)'
            }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 8 }}>
                <div style={{ width: 60, height: 60, background: 'var(--surface-raised)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', border: '1px solid var(--border)' }}>
                  🎙️
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>
                    Now Playing
                  </div>
                  <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                    {activeEpisode.title}
                  </h1>
                </div>
              </div>
            </div>
          )}

          {mdLoading ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading episode script...</div>
          ) : (
            <div style={{ paddingBottom: 60 }}>
              <PodcastScriptReader content={markdown} episodeSlug={activeEpisode.slug} />
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
