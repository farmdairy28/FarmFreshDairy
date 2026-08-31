import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 108,
          background: '#2D3A26',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FDFBF7',
          borderRadius: '36px',
          fontWeight: 700,
          fontFamily: 'serif',
          border: '8px solid #D97706',
        }}
      >
        P
      </div>
    ),
    {
      ...size,
    }
  );
}
