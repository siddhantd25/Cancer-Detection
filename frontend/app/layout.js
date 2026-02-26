import './globals.css';

export const metadata = {
  title: 'CancerDetect— Medical Image Classification',
  description: 'Cancer type detection from medical images. Supports 8 cancer types using MobileNetV3Large deep learning model.',
  keywords: 'cancer detection, AI, medical imaging, MobileNetV3, deep learning',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
