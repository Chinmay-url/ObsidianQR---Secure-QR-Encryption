import { useState } from 'react';
import { ArrowLeft, Lock, Download, Key, Copy, Check } from 'lucide-react';
import { Page } from '../types';
import { encryptMessage, generateSecretKey } from '../utils/encryption';
import { generateQRCode, downloadQRCode } from '../utils/qrcode';

interface EncryptPageProps {
  onNavigate: (page: Page) => void;
}

export default function EncryptPage({ onNavigate }: EncryptPageProps) {
  const [message, setMessage] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleEncrypt = async () => {
    if (!message.trim()) {
      alert('Please enter a message to encrypt');
      return;
    }

    setIsProcessing(true);
    try {
      const key = generateSecretKey();
      setSecretKey(key);

      const encrypted = encryptMessage(message, key);
      const qrUrl = await generateQRCode(encrypted);
      setQrCodeUrl(qrUrl);
    } catch (error) {
      alert('Encryption failed. Please try again.');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (qrCodeUrl) {
      downloadQRCode(qrCodeUrl);
    }
  };

  const handleCopyKey = async () => {
    if (secretKey) {
      await navigator.clipboard.writeText(secretKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setMessage('');
    setSecretKey('');
    setQrCodeUrl('');
    setCopied(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-purple-500/10 p-4 rounded-full">
                <Lock className="w-10 h-10 text-purple-500" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2">Encrypt Message</h1>
            <p className="text-gray-400">Create a secure QR code from your message</p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-8">
            {!qrCodeUrl ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Your Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your secret message here..."
                    className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors min-h-[200px] resize-none"
                  />
                </div>

                <button
                  onClick={handleEncrypt}
                  disabled={isProcessing || !message.trim()}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Lock className="w-5 h-5" />
                  {isProcessing ? 'Encrypting...' : 'Encrypt & Generate QR'}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col items-center">
                  <div className="bg-white p-6 rounded-xl mb-4">
                    <img src={qrCodeUrl} alt="Encrypted QR Code" className="w-full max-w-sm" />
                  </div>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    Download QR Code
                  </button>
                </div>

                <div className="bg-gray-950 border border-gray-700 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Key className="w-5 h-5 text-yellow-500" />
                    <span className="font-semibold text-yellow-500">Secret Key</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-gray-900 border border-gray-800 rounded px-4 py-3 text-sm break-all font-mono text-gray-300">
                      {secretKey}
                    </code>
                    <button
                      onClick={handleCopyKey}
                      className="bg-gray-800 hover:bg-gray-700 border border-gray-700 p-3 rounded-lg transition-colors"
                      title="Copy to clipboard"
                    >
                      {copied ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <Copy className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <p className="text-yellow-500 text-sm mt-3 flex items-start gap-2">
                    <span className="text-lg">⚠️</span>
                    <span>Save this key securely! You'll need it to decrypt the message.</span>
                  </p>
                </div>

                <button
                  onClick={handleReset}
                  className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Encrypt Another Message
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
