import React, { useState, useEffect } from 'react';

// Define the data types and their corresponding colors and explanations
const DATA_TYPES = {
  public: {
    label: 'Öffentlich zugängliche Daten',
    color: 'bg-green-700',
    description: 'Daten, die für die Allgemeinheit bestimmt sind und keine persönlichen Informationen enthalten',
    explanation: 'Diese Daten sind öffentlich zugänglich und enthalten keine persönlichen Informationen. Sie können frei geteilt werden, da sie keine Privatsphäre-Bedenken aufwerfen.'
  },
  personal: {
    label: 'Personenbezogene Daten',
    color: 'bg-orange-600',
    description: 'Persönliche Informationen, die sensibel werden können, wenn sie mit anderen Daten kombiniert werden',
    explanation: 'Diese Daten sind persönlich, aber nicht hochsensibel. Sie können zu Identifikation führen und sollten geschützt werden, besonders wenn sie mit anderen Informationen kombiniert werden.'
  },
  sensitive: {
    label: 'Personenbezogene Daten spezieller Kategorien',
    color: 'bg-red-700',
    description: 'Daten, die nach DSGVO einen höheren Schutz erfordern',
    explanation: 'Diese Daten sind besonders sensibel und erfordern höchsten Schutz nach DSGVO. Sie umfassen genetische, biometrische und Gesundheitsdaten sowie Informationen über rassische und ethnische Herkunft, politische Meinungen, religiöse Überzeugungen oder Gewerkschaftszugehörigkeit.'
  }
} as const;

type DataItem = {
  id: number;
  text: string;
  type: keyof typeof DATA_TYPES;
  explanation: string;
};

// Sample data items to sort
const DATA_ITEMS: DataItem[] = [
  // Sensitive data examples
  { 
    id: 1, 
    text: 'Gesundheitsdaten (z.B. Krankheitsgeschichte)', 
    type: 'sensitive',
    explanation: 'Gesundheitsdaten sind besonders schützenswert nach DSGVO, da sie sehr persönliche Informationen enthalten und missbraucht werden könnten.'
  },
  { 
    id: 2, 
    text: 'Biometrische Daten (z.B. Fingerabdruck)', 
    type: 'sensitive',
    explanation: 'Biometrische Daten sind einzigartige Merkmale einer Person und können nicht geändert werden. Daher erfordern sie besonderen Schutz.'
  },
  { 
    id: 3, 
    text: 'Genetische Daten', 
    type: 'sensitive',
    explanation: 'Genetische Daten sind besonders sensibel, da sie nicht nur die betroffene Person, sondern auch deren Verwandte betreffen können.'
  },
  { 
    id: 4, 
    text: 'Religiöse Überzeugungen', 
    type: 'sensitive',
    explanation: 'Religiöse Überzeugungen sind besonders schützenswert, da sie zur Diskriminierung führen könnten.'
  },
  { 
    id: 5, 
    text: 'Politische Meinungen', 
    type: 'sensitive',
    explanation: 'Politische Meinungen sind besonders schützenswert, da sie zur Diskriminierung oder Beeinflussung führen könnten.'
  },
  { 
    id: 6, 
    text: 'Gewerkschaftszugehörigkeit', 
    type: 'sensitive',
    explanation: 'Die Gewerkschaftszugehörigkeit ist besonders schützenswert, da sie zur Diskriminierung am Arbeitsplatz führen könnte.'
  },
  { 
    id: 7, 
    text: 'Rassische und ethnische Herkunft', 
    type: 'sensitive',
    explanation: 'Diese Daten sind besonders schützenswert, da sie zur Diskriminierung führen könnten.'
  },

  // Personal data examples
  { 
    id: 8, 
    text: 'Name und Adresse', 
    type: 'personal',
    explanation: 'Name und Adresse sind persönliche Daten, die zur Identifikation einer Person führen können.'
  },
  { 
    id: 9, 
    text: 'E-Mail-Adresse', 
    type: 'personal',
    explanation: 'E-Mail-Adressen sind persönliche Daten, die zur Identifikation und Kontaktaufnahme dienen können.'
  },
  { 
    id: 10, 
    text: 'Telefonnummer', 
    type: 'personal',
    explanation: 'Telefonnummern sind persönliche Daten, die zur Identifikation und Kontaktaufnahme dienen können.'
  },
  { 
    id: 11, 
    text: 'Geburtsdatum', 
    type: 'personal',
    explanation: 'Das Geburtsdatum ist eine persönliche Information, die zur Identifikation beitragen kann.'
  },
  { 
    id: 12, 
    text: 'Bankverbindung', 
    type: 'personal',
    explanation: 'Bankverbindungen sind persönliche Daten, die besonderen Schutz erfordern, da sie für finanzielle Transaktionen verwendet werden.'
  },
  { 
    id: 13, 
    text: 'IP-Adresse', 
    type: 'personal',
    explanation: 'IP-Adressen sind persönliche Daten, die zur Identifikation eines Geräts und damit indirekt einer Person dienen können.'
  },
  { 
    id: 14, 
    text: 'Standortdaten', 
    type: 'personal',
    explanation: 'Standortdaten sind persönliche Informationen, die Aufschluss über Bewegungsmuster und Aufenthaltsorte geben können.'
  },

  // Public data examples
  { 
    id: 15, 
    text: 'Öffentliche Veranstaltungshinweise', 
    type: 'public',
    explanation: 'Öffentliche Veranstaltungshinweise sind für alle zugänglich und enthalten keine persönlichen Informationen.'
  },
  { 
    id: 16, 
    text: 'Amtliche Bekanntmachungen', 
    type: 'public',
    explanation: 'Amtliche Bekanntmachungen sind öffentliche Informationen, die für alle Bürger zugänglich sind.'
  },
  { 
    id: 17, 
    text: 'Öffentliche Verkehrsinformationen', 
    type: 'public',
    explanation: 'Öffentliche Verkehrsinformationen sind für alle zugänglich und enthalten keine persönlichen Daten.'
  },
  { 
    id: 18, 
    text: 'Wetterdaten', 
    type: 'public',
    explanation: 'Wetterdaten sind öffentliche Informationen, die keine persönlichen Bezüge enthalten.'
  },
  { 
    id: 19, 
    text: 'Öffentliche Statistiken', 
    type: 'public',
    explanation: 'Öffentliche Statistiken sind aggregierte Daten ohne persönlichen Bezug.'
  },
  { 
    id: 20, 
    text: 'Öffentliche Karten', 
    type: 'public',
    explanation: 'Öffentliche Karten enthalten keine persönlichen Informationen und sind für alle zugänglich.'
  }
];

interface DataSortingGameProps {
  onCompletion: () => void;
}

export const DataSortingGame: React.FC<DataSortingGameProps> = ({ onCompletion }) => {
  const [currentItem, setCurrentItem] = useState<DataItem | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string; explanation: string } | null>(null);
  const [remainingItems, setRemainingItems] = useState<DataItem[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [firstTrySuccesses, setFirstTrySuccesses] = useState<DataItem[]>([]);
  const [attemptedItems, setAttemptedItems] = useState<Set<number>>(new Set());
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize game
  useEffect(() => {
    if (!isInitialized) {
      const shuffled = [...DATA_ITEMS].sort(() => Math.random() - 0.5);
      setRemainingItems(shuffled);
      setCurrentItem(shuffled[0]);
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Update current item when remaining items change
  useEffect(() => {
    if (remainingItems.length > 0) {
      setCurrentItem(remainingItems[0]);
    } else if (remainingItems.length === 0 && isInitialized) {
      setShowSummary(true);
    }
  }, [remainingItems, isInitialized]);

  const handleDragStart = (e: React.DragEvent, item: DataItem) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(item));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-amber-800', 'bg-amber-100');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('border-amber-800', 'bg-amber-100');
  };

  const handleDrop = (e: React.DragEvent, type: keyof typeof DATA_TYPES) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-amber-800', 'bg-amber-100');
    
    const item = JSON.parse(e.dataTransfer.getData('text/plain')) as DataItem;
    const isCorrect = item.type === type;
    
    if (isCorrect) {
      setRemainingItems(prev => prev.filter(i => i.id !== item.id));
      
      // Check if this was the first attempt for this item
      if (!attemptedItems.has(item.id)) {
        setFirstTrySuccesses(prev => [...prev, item]);
      }
    }

    // Add to attempted items
    setAttemptedItems(prev => new Set([...prev, item.id]));

    setFeedback({
      type: isCorrect ? 'success' : 'error',
      message: isCorrect ? 'Richtig!' : 'Falsch! Versuche es noch einmal.',
      explanation: isCorrect ? item.explanation : DATA_TYPES[type].explanation
    });
  };

  const handleCloseFeedback = () => {
    setFeedback(null);
  };

  if (!isInitialized) {
    return null; // Don't show anything until initialized
  }

  if (showSummary) {
    return (
      <div className="p-4 md:p-6 lg:p-8 w-full h-full flex flex-col items-center justify-center gap-8 bg-amber-600 font-mono text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl text-white mb-4">
          Glückwunsch!
        </h2>

        <div className="bg-white/90 rounded-xl p-6 max-w-[600px] w-[90%]">
          <h3 className="text-xl sm:text-2xl md:text-3xl text-amber-900 mb-4">
            Zusammenfassung
          </h3>

          <p className="text-lg sm:text-xl md:text-2xl text-amber-900 mb-6">
            Alle Fragen wurden erfolgreich beantwortet!
          </p>

          {firstTrySuccesses.length > 0 && (
            <p className="text-base sm:text-lg text-amber-900 mb-6">
              Auf Anhieb richtig beantwortet: {firstTrySuccesses.length} von {DATA_ITEMS.length}
            </p>
          )}

          <p className="text-base sm:text-lg md:text-xl text-amber-900 mb-8">
            Das Smart Home Hub ist jetzt entsperrt!
          </p>

          <div className="flex justify-center">
            <button
              onClick={onCompletion}
              className="px-6 py-3 bg-green-700 hover:bg-green-800 text-white rounded-xl transition-colors"
            >
              Fertig
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 w-full h-full flex flex-col gap-4 md:gap-6 lg:gap-8 bg-amber-600 font-mono relative">
      <div className="flex justify-center w-full h-32 mt-4 md:mt-6 lg:mt-8">
        {currentItem && (
          <div
            draggable
            onDragStart={(e) => handleDragStart(e, currentItem)}
            className="w-[90%] sm:w-[70%] md:w-[60%] max-w-[600px] cursor-grab p-3 sm:p-4 md:p-5 text-amber-900 bg-white rounded-lg shadow-md"
          >
            <h6 className="text-lg sm:text-xl md:text-2xl font-mono">
              {currentItem.text}
            </h6>
          </div>
        )}
      </div>

      {feedback && (
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 rounded-lg shadow-lg z-10 ${
          feedback.type === 'success' ? 'bg-green-100' : 'bg-red-100'
        }`}>
          <p className={`text-lg font-semibold ${
            feedback.type === 'success' ? 'text-green-800' : 'text-red-800'
          }`}>
            {feedback.message}
          </p>
          <p className="text-sm mt-2 text-gray-700 max-w-md">
            {feedback.explanation}
          </p>
          <button
            onClick={handleCloseFeedback}
            className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded w-full"
          >
            Schließen
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6 lg:gap-8 mt-4 md:mt-6 lg:mt-8">
        {Object.entries(DATA_TYPES).map(([type, { label, color, description }]) => (
          <div
            key={type}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, type as keyof typeof DATA_TYPES)}
            className={`w-full md:w-1/3 p-4 rounded-lg ${color} text-white min-h-[200px] flex flex-col items-center justify-center text-center`}
          >
            <h3 className="text-xl font-bold mb-2">{label}</h3>
            <p className="text-sm">{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};