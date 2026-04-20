import { Lock, Unlock, Shield } from 'lucide-react';
import { Page } from '../types';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Shield className="w-16 h-16 text-purple-500" />
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            ObsidianQR
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Secure QR Code Encryption & Decryption System powered by AES
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <button
            onClick={() => onNavigate('encrypt')}
            className="group bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-8 hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-purple-500/10 p-4 rounded-full mb-4 group-hover:bg-purple-500/20 transition-colors">
                <Lock className="w-12 h-12 text-purple-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Encrypt Message</h2>
              <p className="text-gray-400">
                Transform your message into a secure QR code with AES encryption
              </p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('decrypt')}
            className="group bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-8 hover:border-pink-500 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-pink-500/10 p-4 rounded-full mb-4 group-hover:bg-pink-500/20 transition-colors">
                <Unlock className="w-12 h-12 text-pink-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Decrypt Message</h2>
              <p className="text-gray-400">
                Scan QR codes and decrypt messages with your secret key
              </p>
            </div>
          </button>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 bg-gray-800/50 border border-gray-700 rounded-lg px-6 py-3">
            <Shield className="w-5 h-5 text-green-500" />
            <span className="text-gray-300">End-to-end encrypted • No data stored</span>
          </div>
        </div>
      </div>
    </div>
  );
}
