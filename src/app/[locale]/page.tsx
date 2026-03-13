'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Search, Download, Loader2, Music2, Globe, Zap } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  channel: string;
  duration: string;
  thumbnail: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const LOCALES = [
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
  { code: 'de', label: 'DE' },
];

export default function HomePage() {
  const t = useTranslations();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`${API_URL}/youtube/search?q=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (videoId: string, title: string) => {
    setDownloadingId(videoId);
    try {
      const res = await fetch(`${API_URL}/youtube/download/${videoId}`);
      if (!res.ok) throw new Error('failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title}.mp3`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert('Download failed.');
    } finally {
      setDownloadingId(null);
    }
  };

  const switchLocale = (code: string) => {
    window.location.href = `/${code}`;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800;900&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .sw {
          font-family: 'Poppins', sans-serif;
          background: #0a0f1e;
          color: #ffffff;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* ── NAV ── */
        .sw-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        @media (min-width: 640px) {
          .sw-nav { padding: 20px 40px; }
        }

        .sw-logo {
          font-size: 18px;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #ffffff;
        }
        @media (min-width: 640px) {
          .sw-logo { font-size: 22px; }
        }
        .sw-logo span { color: #1877f2; }
        .sw-logo-underscore {
          display: block;
          width: 24px;
          height: 3px;
          background: #1877f2;
          margin-top: 2px;
          border-radius: 2px;
        }

        .sw-lang {
          display: flex;
          gap: 4px;
        }
        .sw-lang-btn {
          padding: 5px 9px;
          border-radius: 4px;
          border: 1px solid rgba(255,255,255,0.12);
          background: transparent;
          font-family: 'Poppins', sans-serif;
          font-size: 11px;
          font-weight: 600;
          color: rgba(255,255,255,0.5);
          cursor: pointer;
          letter-spacing: 0.06em;
          transition: all 0.15s;
        }
        @media (min-width: 640px) {
          .sw-lang-btn { padding: 6px 12px; font-size: 12px; }
        }
        .sw-lang-btn:hover { color: #fff; border-color: rgba(255,255,255,0.3); }
        .sw-lang-btn.active { background: #1877f2; border-color: #1877f2; color: #fff; }

        /* ── MAIN ── */
        .sw-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 48px 16px 48px;
        }
        @media (min-width: 640px) {
          .sw-main { padding: 80px 24px 60px; }
        }

        /* ── HERO ── */
        .sw-hero {
          text-align: center;
          width: 100%;
          max-width: 600px;
          margin-bottom: 32px;
        }
        @media (min-width: 640px) {
          .sw-hero { margin-bottom: 48px; }
        }

        .sw-hero-label {
          display: inline-block;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #fff;
          background: #1877f2;
          padding: 4px 12px;
          border-radius: 2px;
          margin-bottom: 18px;
        }
        @media (min-width: 640px) {
          .sw-hero-label { font-size: 11px; padding: 5px 14px; margin-bottom: 24px; }
        }

        .sw-h1 {
          font-size: clamp(28px, 7vw, 62px);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.05;
          color: #ffffff;
          margin-bottom: 8px;
        }
        .sw-h1-blue {
          color: #1877f2;
          display: block;
        }
        .sw-sub {
          font-size: 13px;
          font-weight: 400;
          color: rgba(255,255,255,0.45);
          line-height: 1.75;
          margin-top: 14px;
          max-width: 380px;
          margin-left: auto;
          margin-right: auto;
        }
        @media (min-width: 640px) {
          .sw-sub { font-size: 14px; margin-top: 18px; max-width: 420px; }
        }

        /* ── SEARCH ── */
        .sw-search-wrap {
          width: 100%;
          max-width: 560px;
          margin-bottom: 28px;
        }
        @media (min-width: 640px) {
          .sw-search-wrap { margin-bottom: 40px; }
        }

        .sw-search-box {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 6px 6px 14px;
          background: #111827;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 6px;
          transition: border-color 0.2s;
        }
        .sw-search-box:focus-within { border-color: #1877f2; }

        .sw-search-icon { color: rgba(255,255,255,0.2); flex-shrink: 0; }

        .sw-input {
          flex: 1;
          min-width: 0;
          background: transparent;
          border: none;
          outline: none;
          font-family: 'Poppins', sans-serif;
          font-size: 13px;
          font-weight: 400;
          color: #ffffff;
          caret-color: #1877f2;
        }
        @media (min-width: 640px) {
          .sw-input { font-size: 14px; }
        }
        .sw-input::placeholder { color: rgba(255,255,255,0.2); }

        .sw-search-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-family: 'Poppins', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.04em;
          /* Mobile : juste une icône carrée */
          padding: 10px 12px;
          border-radius: 4px;
          border: none;
          background: #1877f2;
          color: #fff;
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
          transition: background 0.15s, transform 0.1s;
        }
        @media (min-width: 480px) {
          .sw-search-btn { padding: 11px 22px; }
        }
        .sw-search-btn:hover { background: #1565d8; }
        .sw-search-btn:active { transform: scale(0.98); }
        .sw-search-btn:disabled { opacity: 0.35; cursor: default; transform: none; }

        .sw-btn-label {
          display: none;
        }
        @media (min-width: 480px) {
          .sw-btn-label { display: inline; }
        }

        /* ── FEATURES ── */
        .sw-features {
          width: 100%;
          max-width: 560px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
        }
        @media (min-width: 480px) {
          .sw-features { grid-template-columns: repeat(3, 1fr); }
        }

        .sw-feat {
          padding: 16px;
          background: #111827;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 6px;
          border-left: 3px solid #1877f2;
          transition: background 0.15s;
        }
        .sw-feat:hover { background: #141d2e; }
        .sw-feat-icon { color: #1877f2; margin-bottom: 10px; }
        .sw-feat-title {
          font-size: 12px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 4px;
        }
        .sw-feat-desc {
          font-size: 11px;
          font-weight: 400;
          color: rgba(255,255,255,0.35);
          line-height: 1.6;
        }

        /* ── RESULTS ── */
        .sw-results {
          width: 100%;
          max-width: 560px;
        }
        .sw-results-count {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          margin-bottom: 10px;
        }

        /* SKELETON */
        .sw-skeleton {
          height: 70px;
          border-radius: 6px;
          background: #111827;
          border: 1px solid rgba(255,255,255,0.06);
          margin-bottom: 8px;
          overflow: hidden;
          position: relative;
        }
        .sw-skeleton::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(24,119,242,0.04), transparent);
          background-size: 200% 100%;
          animation: sw-shimmer 1.6s infinite;
        }
        @keyframes sw-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* CARD */
        .sw-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          background: #111827;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 6px;
          margin-bottom: 8px;
          transition: border-color 0.15s, background 0.15s;
          animation: sw-in 0.25s ease both;
        }
        @media (min-width: 480px) {
          .sw-card { gap: 14px; padding: 10px 14px; }
        }
        .sw-card:hover { border-color: rgba(24,119,242,0.3); background: #141d2e; }
        @keyframes sw-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .sw-thumb {
          position: relative;
          /* Plus petit sur mobile */
          width: 52px;
          height: 38px;
          border-radius: 4px;
          overflow: hidden;
          flex-shrink: 0;
          background: #1a2234;
        }
        @media (min-width: 480px) {
          .sw-thumb { width: 70px; height: 50px; }
        }

        .sw-thumb-duration {
          position: absolute;
          bottom: 2px; right: 2px;
          font-size: 8px;
          font-weight: 600;
          color: #fff;
          background: rgba(0,0,0,0.8);
          padding: 1px 4px;
          border-radius: 2px;
        }
        @media (min-width: 480px) {
          .sw-thumb-duration { font-size: 9px; bottom: 3px; right: 3px; }
        }

        .sw-card-info {
          flex: 1;
          min-width: 0;
        }
        .sw-card-title {
          font-size: 12px;
          font-weight: 600;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          letter-spacing: -0.01em;
        }
        @media (min-width: 480px) {
          .sw-card-title { font-size: 13px; }
        }
        .sw-card-channel {
          font-size: 10px;
          font-weight: 400;
          color: rgba(255,255,255,0.3);
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        @media (min-width: 480px) {
          .sw-card-channel { font-size: 11px; margin-top: 3px; }
        }

        .sw-dl-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          font-family: 'Poppins', sans-serif;
          font-size: 11px;
          font-weight: 700;
          /* Mobile : carré icône seule */
          padding: 7px 10px;
          border-radius: 4px;
          border: 1px solid rgba(24,119,242,0.3);
          background: rgba(24,119,242,0.08);
          color: #1877f2;
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
          transition: all 0.15s;
        }
        @media (min-width: 480px) {
          .sw-dl-btn { padding: 7px 14px; font-size: 12px; }
        }
        .sw-dl-btn:hover { background: #1877f2; border-color: #1877f2; color: #fff; }
        .sw-dl-btn:disabled { opacity: 0.35; cursor: default; }

        .sw-dl-label {
          display: none;
        }
        @media (min-width: 480px) {
          .sw-dl-label { display: inline; }
        }

        .sw-spin { animation: sw-spin 0.7s linear infinite; display: flex; }
        @keyframes sw-spin { to { transform: rotate(360deg); } }

        .sw-no-results {
          text-align: center;
          padding: 48px 0;
          font-size: 13px;
          font-weight: 400;
          color: rgba(255,255,255,0.2);
        }

        /* ── FOOTER ── */
        .sw-footer {
          padding: 16px 20px;
          border-top: 1px solid rgba(255,255,255,0.06);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.15);
          text-align: center;
        }
        @media (min-width: 640px) {
          .sw-footer { padding: 20px 40px; font-size: 11px; }
        }
      `}</style>

      <div className="sw">

        {/* NAV */}
        <nav className="sw-nav">
          <div>
            <div className="sw-logo">Sound<span>Wave</span></div>
            <span className="sw-logo-underscore" />
          </div>
          <div className="sw-lang">
            {LOCALES.map((l) => {
              const isActive = typeof window !== 'undefined' && window.location.pathname.startsWith(`/${l.code}`);
              return (
                <button
                  key={l.code}
                  className={`sw-lang-btn${isActive ? ' active' : ''}`}
                  onClick={() => switchLocale(l.code)}
                >
                  {l.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* MAIN */}
        <main className="sw-main">

          {/* HERO */}
          <div className="sw-hero">
            <span className="sw-hero-label">YouTube → MP3</span>
            <h1 className="sw-h1">
              {t('hero.titleLine1')}
              <span className="sw-h1-blue">{t('hero.titleLine2')}</span>
            </h1>
            <p className="sw-sub">{t('hero.subtitle')}</p>
          </div>

          {/* SEARCH */}
          <div className="sw-search-wrap">
            <div className="sw-search-box">
              <Search className="sw-search-icon" size={15} />
              <input
                ref={inputRef}
                className="sw-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder={t('hero.placeholder')}
              />
              <button
                className="sw-search-btn"
                onClick={handleSearch}
                disabled={loading || !query.trim()}
              >
                {loading
                  ? <span className="sw-spin"><Loader2 size={14} /></span>
                  : <>
                      <Search size={14} />
                      <span className="sw-btn-label">{t('hero.button')}</span>
                    </>
                }
              </button>
            </div>
          </div>

          {/* FEATURES or RESULTS */}
          {!searched ? (
            <div className="sw-features">
              <div className="sw-feat">
                <Zap className="sw-feat-icon" size={15} />
                <div className="sw-feat-title">{t('features.instantTitle')}</div>
                <div className="sw-feat-desc">{t('features.instantDesc')}</div>
              </div>
              <div className="sw-feat">
                <Music2 className="sw-feat-icon" size={15} />
                <div className="sw-feat-title">{t('features.qualityTitle')}</div>
                <div className="sw-feat-desc">{t('features.qualityDesc')}</div>
              </div>
              <div className="sw-feat">
                <Globe className="sw-feat-icon" size={15} />
                <div className="sw-feat-title">{t('features.multiTitle')}</div>
                <div className="sw-feat-desc">{t('features.multiDesc')}</div>
              </div>
            </div>
          ) : (
            <div className="sw-results">
              {loading ? (
                [...Array(5)].map((_, i) => <div key={i} className="sw-skeleton" />)
              ) : results.length === 0 ? (
                <div className="sw-no-results">{t('results.noResults')}</div>
              ) : (
                <>
                  <p className="sw-results-count">{results.length} {t('results.title')}</p>
                  {results.map((r, i) => (
                    <div
                      key={r.id}
                      className="sw-card"
                      style={{ animationDelay: `${i * 40}ms` }}
                    >
                      <div className="sw-thumb">
                        <Image src={r.thumbnail} alt={r.title} fill style={{ objectFit: 'cover' }} unoptimized />
                        <span className="sw-thumb-duration">{r.duration}</span>
                      </div>
                      <div className="sw-card-info">
                        <div className="sw-card-title">{r.title}</div>
                        <div className="sw-card-channel">{r.channel}</div>
                      </div>
                      <button
                        className="sw-dl-btn"
                        disabled={downloadingId === r.id}
                        onClick={() => handleDownload(r.id, r.title)}
                      >
                        {downloadingId === r.id
                          ? <span className="sw-spin"><Loader2 size={13} /></span>
                          : <>
                              <Download size={13} />
                              <span className="sw-dl-label">{t('results.download')}</span>
                            </>
                        }
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

        </main>

        {/* FOOTER */}
        <footer className="sw-footer">
          {t('footer.text')} · SoundWave © 2026
        </footer>

      </div>
    </>
  );
}