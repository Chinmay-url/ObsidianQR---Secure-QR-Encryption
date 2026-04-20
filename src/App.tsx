import { useState } from 'react';
import { Page } from './types';
import HomePage from './components/HomePage';
import EncryptPage from './components/EncryptPage';
import DecryptPage from './components/DecryptPage';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'encrypt':
        return <EncryptPage onNavigate={setCurrentPage} />;
      case 'decrypt':
        return <DecryptPage onNavigate={setCurrentPage} />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return <>{renderPage()}</>;
}

export default App;
