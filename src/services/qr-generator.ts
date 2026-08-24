import QRCode from 'qrcode';

/**
 * Generates a base64 encoded PNG data URI for a given text (like a URL).
 */
export async function generateQrCode(text: string): Promise<string> {
  try {
    const dataUrl = await QRCode.toDataURL(text, {
      margin: 1,
      width: 150,
      color: {
        dark: '#0A192F',  // CodeInternX navy blue
        light: '#FFFFFF'
      }
    });
    return dataUrl;
  } catch (error) {
    console.error('Error generating QR code', error);
    throw new Error('Failed to generate QR code');
  }
}
