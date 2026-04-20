import QRCode from 'qrcode';
import jsQR from 'jsqr';

export const generateQRCode = async (data: string): Promise<string> => {
  try {
    const qrDataUrl = await QRCode.toDataURL(data, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 400,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
    return qrDataUrl;
  } catch (error) {
    throw new Error('Failed to generate QR code');
  }
};

export const decodeQRFromImage = (imageData: ImageData): string | null => {
  const code = jsQR(imageData.data, imageData.width, imageData.height);
  return code ? code.data : null;
};

export const downloadQRCode = (dataUrl: string, filename: string = 'encrypted-qr.png') => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
