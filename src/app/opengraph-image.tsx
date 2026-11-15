import { ImageResponse } from 'next/og';

import { siteConfig } from '@/shared/lib/site-config';

/**
 * Imagen por defecto al compartir Vagando en redes sociales (1200×630).
 * Se genera una sola vez en el build. Las fichas de cada país la reemplazan por su bandera.
 * Sin emojis: `ImageResponse` tendría que descargarlos durante el build.
 */
export const alt = `${siteConfig.name} · ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: 'linear-gradient(135deg, #0f766e 0%, #134e4a 100%)',
          color: '#ffffff',
        }}
      >
        <div style={{ display: 'flex', fontSize: 32, letterSpacing: 6, textTransform: 'uppercase', color: '#fdba74' }}>
          {siteConfig.tagline}
        </div>
        <div style={{ display: 'flex', fontSize: 120, fontWeight: 700, marginTop: 16 }}>{siteConfig.name}</div>
        <div style={{ display: 'flex', fontSize: 40, marginTop: 24, maxWidth: 900, opacity: 0.9 }}>
          Volcanes, playas y selva: información, clima y lugares turísticos de los 7 países del istmo.
        </div>
        <div style={{ display: 'flex', marginTop: 48, height: 10, width: 220, borderRadius: 5, background: '#e8613c' }} />
      </div>
    ),
    size,
  );
}
