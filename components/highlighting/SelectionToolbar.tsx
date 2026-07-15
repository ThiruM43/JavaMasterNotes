'use client';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  x: number;
  y: number;
  onHighlight: (color: 'yellow' | 'green' | 'blue' | 'pink') => void;
  onClose: () => void;
}

export function SelectionToolbar({ x, y, onHighlight, onClose }: Props) {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.selection-toolbar')) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const style: React.CSSProperties = {
    left: `${x}px`,
    top: `${y}px`,
    transform: 'translate(-50%, -100%)',
  };

  const toolbar = (
    <div className="selection-toolbar" style={style} role="toolbar" aria-label="Highlight options">
      <button className="hl-btn hl-btn-yellow" onClick={() => onHighlight('yellow')} title="Yellow highlight" aria-label="Yellow highlight" />
      <button className="hl-btn hl-btn-green" onClick={() => onHighlight('green')} title="Green highlight" aria-label="Green highlight" />
      <button className="hl-btn hl-btn-blue" onClick={() => onHighlight('blue')} title="Blue highlight" aria-label="Blue highlight" />
      <button className="hl-btn hl-btn-pink" onClick={() => onHighlight('pink')} title="Pink highlight" aria-label="Pink highlight" />
      <div className="hl-divider" />
      <button className="hl-note-btn" onClick={onClose} title="Dismiss">✕</button>
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(toolbar, document.body);
}
