import React, { useState } from 'react';
import { SUPPORTED_LANGUAGES } from '../../lib/language/detector';

interface LanguageIndicatorProps {
  language: string;
  onLanguageChange?: (language: string) => void;
  showFullName?: boolean;
}

const LanguageIndicator: React.FC<LanguageIndicatorProps> = ({
  language,
  onLanguageChange,
  showFullName = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Obtener lista de idiomas soportados
  const supportedLanguages = SUPPORTED_LANGUAGES;
  
  // Obtener el nombre del idioma actual
  const currentLanguageName = language in supportedLanguages 
    ? supportedLanguages[language as keyof typeof SUPPORTED_LANGUAGES] 
    : 'Desconocido';
  
  // Manejar clic en el indicador
  const handleClick = () => {
    setIsOpen(!isOpen);
  };
  
  // Manejar selección de idioma
  const handleLanguageSelect = (lang: string) => {
    if (onLanguageChange) {
      onLanguageChange(lang);
    }
    setIsOpen(false);
  };
  
  return (
    <div className="language-indicator relative">
      {/* Botón de idioma actual */}
      <button
        onClick={handleClick}
        className="flex items-center justify-center px-3 py-1 bg-gray-100 hover:bg-gray-200 
                   dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full text-xs font-medium 
                   text-gray-700 dark:text-gray-300 transition-colors"
        aria-label="Seleccionar idioma"
      >
        <span className="uppercase">{language}</span>
        {showFullName && (
          <span className="ml-1.5 hidden sm:inline-block">{currentLanguageName}</span>
        )}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-3 w-3 ml-1 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {/* Menú desplegable de idiomas */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 py-1 bg-white dark:bg-gray-900 rounded-md shadow-lg 
                        border border-gray-200 dark:border-gray-700 z-10">
          <div className="max-h-60 overflow-y-auto">
            {Object.entries(supportedLanguages).map(([code, name]) => (
              <button
                key={code}
                onClick={() => handleLanguageSelect(code)}
                className={`flex items-center px-4 py-2 text-sm w-full text-left hover:bg-gray-100 
                           dark:hover:bg-gray-800 ${code === language ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}
              >
                <span className="uppercase font-medium w-8">{code}</span>
                <span className="ml-2">{name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageIndicator; 