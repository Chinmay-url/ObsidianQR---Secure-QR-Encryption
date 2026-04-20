# ObsidianQR - Secure QR Encryption

A modern web application for secure QR code encryption and decryption using AES encryption. Transform your messages into encrypted QR codes and decrypt them with a secret key.

## Features

- **🔐 AES Encryption**: Military-grade AES encryption for secure message protection
- **📱 QR Code Generation**: Convert encrypted messages into scannable QR codes
- **📷 QR Code Scanning**: Built-in camera and file upload for QR code decryption
- **🔑 Secret Key Management**: Generate and manage cryptographic keys
- **🎨 Modern UI**: Beautiful, responsive interface built with Tailwind CSS
- **⚡ Real-time Processing**: Instant encryption and decryption
- **🌐 End-to-End Encrypted**: No data stored on servers

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom gradients
- **Encryption**: CryptoJS (AES-256 ECB mode)
- **QR Codes**: jsQR for scanning, qrcode for generation
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Backend**: Express.js (for development server)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/obsidian-qr.git
cd obsidian-qr
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

## Usage

### Encrypting Messages

1. Click "Encrypt Message" on the home page
2. Enter your secret message
3. Click "Encrypt & Generate QR"
4. Save the generated QR code and secret key
5. Share both with your recipient

### Decrypting Messages

1. Click "Decrypt Message" on the home page
2. Choose to scan with camera or upload QR image
3. Enter the secret key provided by the sender
4. View the decrypted message

## Security Features

- **AES-256 Encryption**: Uses industry-standard AES encryption
- **Client-Side Processing**: All encryption/decryption happens in your browser
- **No Data Storage**: Messages are never stored on servers
- **Secure Key Generation**: Cryptographically secure random key generation
- **Base64 Encoding**: Safe QR code data encoding

## Project Structure

```
src/
├── components/
│   ├── HomePage.tsx          # Landing page with navigation
│   ├── EncryptPage.tsx       # Message encryption interface
│   └── DecryptPage.tsx       # QR code scanning & decryption
├── utils/
│   ├── encryption.ts         # AES encryption/decryption functions
│   └── qrcode.ts            # QR code generation utilities
├── types/
│   └── index.ts             # TypeScript type definitions
├── App.tsx                  # Main application component
└── main.tsx                 # Application entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Security Considerations

- This application uses AES in ECB mode for compatibility with mobile apps
- Secret keys are generated randomly and should be shared securely
- All processing happens client-side - no data is transmitted to servers
- QR codes contain only encrypted data, never plaintext messages

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgments

- Built with modern web technologies for maximum security and performance
- Inspired by the need for secure, offline-capable communication tools
- Special thanks to the open-source libraries that make this project possible
