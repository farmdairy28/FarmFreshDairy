import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 20,
          background: '#2D3A26',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FDFBF7',
          borderRadius: '8px',
          fontWeight: 700,
          fontFamily: 'serif',
          border: '1.5px solid #D97706',
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
