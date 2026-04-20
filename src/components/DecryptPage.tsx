import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Unlock, Camera, Upload, Key } from 'lucide-react';
import { Page } from '../types';
import { decryptMessage } from '../utils/encryption';
import { decodeQRFromImage } from '../utils/qrcode';

interface DecryptPageProps {
  onNavigate: (page: Page) => void;
}

export default function DecryptPage({ onNavigate }: DecryptPageProps) {
  const [mode, setMode] = useState<'camera' | 'upload' | null>(null);
  const [cipherText, setCipherText] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [decryptedMessage, setDecryptedMessage] = useState('');
  const [error, setError] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<number | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
      }
    } catch (err) {
      setError('Failed to access camera. Please grant camera permissions.');
      console.error(err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    setIsScanning(false);
  };

  const scanQRCode = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context || video.readyState !== video.HAVE_ENOUGH_DATA) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const code = decodeQRFromImage(imageData);

    if (code) {
      setCipherText(code);
      stopCamera();
      setMode(null);
    }
  };

  useEffect(() => {
    if (isScanning) {
      scanIntervalRef.current = window.setInterval(scanQRCode, 300);
    }
    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
    };
  }, [isScanning]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleModeSelect = (selectedMode: 'camera' | 'upload') => {
    setMode(selectedMode);
    setError('');
    if (selectedMode === 'camera') {
      startCamera();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const context = canvas.getContext('2d');
        if (!context) return;

        context.drawImage(img, 0, 0);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = decodeQRFromImage(imageData);

        if (code) {
          setCipherText(code);
          setMode(null);
        } else {
          setError('No QR code found in the image. Please try another image.');
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDecrypt = () => {
    if (!cipherText.trim()) {
      setError('No cipher text available. Please scan or upload a QR code first.');
      return;
    }
    if (!secretKey.trim()) {
      setError('Please enter the secret key.');
      return;
    }

    try {
      const decrypted = decryptMessage(cipherText, secretKey);
      setDecryptedMessage(decrypted);
      setError('');
    } catch (err) {
      setError('Decryption failed. Please check your secret key and try again.');
      setDecryptedMessage('');
    }
  };

  const handleReset = () => {
    setCipherText('');
    setSecretKey('');
    setDecryptedMessage('');
    setError('');
    setMode(null);
    stopCamera();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => {
            stopCamera();
            onNavigate('home');
          }}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-pink-500/10 p-4 rounded-full">
                <Unlock className="w-10 h-10 text-pink-500" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2">Decrypt Message</h1>
            <p className="text-gray-400">Scan or upload a QR code to decrypt</p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-8">
            {!cipherText ? (
              <div className="space-y-6">
                {!mode ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    <button
                      onClick={() => handleModeSelect('camera')}
                      className="bg-gray-950 border border-gray-700 hover:border-pink-500 rounded-xl p-8 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20"
                    >
                      <div className="flex flex-col items-center text-center">
                        <Camera className="w-12 h-12 text-pink-500 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Scan with Camera</h3>
                        <p className="text-gray-400 text-sm">
                          Use your device camera to scan QR code
                        </p>
                      </div>
                    </button>

                    <button
                      onClick={() => handleModeSelect('upload')}
                      className="bg-gray-950 border border-gray-700 hover:border-pink-500 rounded-xl p-8 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20"
                    >
                      <div className="flex flex-col items-center text-center">
                        <Upload className="w-12 h-12 text-pink-500 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Upload Image</h3>
                        <p className="text-gray-400 text-sm">
                          Upload an image containing QR code
                        </p>
                      </div>
                    </button>
                  </div>
                ) : mode === 'camera' ? (
                  <div className="space-y-4">
                    <div className="relative bg-black rounded-xl overflow-hidden">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-auto"
                      />
                      <canvas ref={canvasRef} className="hidden" />
                      <div className="absolute inset-0 border-4 border-pink-500/50 pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-4 border-pink-500 rounded-xl"></div>
                      </div>
                    </div>
                    <p className="text-center text-gray-400">
                      Position the QR code within the frame
                    </p>
                    <button
                      onClick={() => {
                        stopCamera();
                        setMode(null);
                      }}
                      className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-semibold py-3 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-12 rounded-lg transition-all duration-300 flex flex-col items-center justify-center gap-3"
                    >
                      <Upload className="w-12 h-12" />
                      <span className="text-lg">Click to Upload Image</span>
                      <span className="text-sm opacity-80">PNG, JPG, or JPEG</span>
                    </button>
                    <button
                      onClick={() => setMode(null)}
                      className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-semibold py-3 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {error && (
                  <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 text-red-500">
                    {error}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Cipher Text (Scanned from QR)
                  </label>
                  <textarea
                    value={cipherText}
                    readOnly
                    className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-gray-400 min-h-[120px] resize-none font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Secret Key
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      value={secretKey}
                      onChange={(e) => setSecretKey(e.target.value)}
                      placeholder="Enter your secret key..."
                      className="w-full bg-gray-950 border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors"
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 text-red-500">
                    {error}
                  </div>
                )}

                {decryptedMessage && (
                  <div className="bg-green-500/10 border border-green-500 rounded-lg p-6">
                    <h3 className="font-semibold text-green-500 mb-3 flex items-center gap-2">
                      <Unlock className="w-5 h-5" />
                      Decrypted Message
                    </h3>
                    <p className="text-white whitespace-pre-wrap break-words">
                      {decryptedMessage}
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleDecrypt}
                    disabled={!secretKey.trim()}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Unlock className="w-5 h-5" />
                    Decrypt
                  </button>
                  <button
                    onClick={handleReset}
                    className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-semibold px-6 py-4 rounded-lg transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
