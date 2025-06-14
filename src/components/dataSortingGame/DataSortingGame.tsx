import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Snackbar, Alert, Button } from '@mui/material';
import { styled, Theme } from '@mui/material/styles';
import { useTheme, useMediaQuery } from '@mui/material';

// Define the data types and their corresponding colors
const DATA_TYPES = {
  public: {
    label: 'Öffentlich zugängliche Daten',
    color: '#2e7d32',
    description: 'Daten, die für die Allgemeinheit bestimmt sind'
  },
  personal: {
    label: 'Personenbezogene Daten',
    color: '#f57c00',
    description: 'Persönliche Informationen, die sensibel werden können'
  },
  sensitive: {
    label: 'Personenbezogene Daten spezieller Kategorien',
    color: '#d32f2f',
    description: 'Daten, die nach DSGVO einen höheren Schutz erfordern'
  }
} as const;

type DataType = keyof typeof DATA_TYPES;

type DataItem = {
  id: number;
  text: string;
  type: keyof typeof DATA_TYPES;
};

interface DataSortingGameProps {
  onCompletion: () => void;
}

// Sample data items to sort
const DATA_ITEMS: DataItem[] = [
  // Sensitive data examples
  { id: 1, text: 'Gesundheitsdaten (z.B. Krankheitsgeschichte)', type: 'sensitive' },
  { id: 2, text: 'Biometrische Daten (z.B. Fingerabdruck)', type: 'sensitive' },
  { id: 3, text: 'Genetische Daten', type: 'sensitive' },
  { id: 4, text: 'Religiöse Überzeugungen', type: 'sensitive' },
  { id: 5, text: 'Politische Meinungen', type: 'sensitive' },
  { id: 6, text: 'Gewerkschaftszugehörigkeit', type: 'sensitive' },
  { id: 7, text: 'Rassische und ethnische Herkunft', type: 'sensitive' },

  // Personal data examples
  { id: 8, text: 'Name und Adresse', type: 'personal' },
  { id: 9, text: 'E-Mail-Adresse', type: 'personal' },
  { id: 10, text: 'Telefonnummer', type: 'personal' },
  { id: 11, text: 'Geburtsdatum', type: 'personal' },
  { id: 12, text: 'Bankverbindung', type: 'personal' },
  { id: 13, text: 'IP-Adresse', type: 'personal' },
  { id: 14, text: 'Standortdaten', type: 'personal' },

  // Public data examples
  { id: 15, text: 'Öffentliche Veranstaltungshinweise', type: 'public' },
  { id: 16, text: 'Amtliche Bekanntmachungen', type: 'public' },
  { id: 17, text: 'Öffentliche Verkehrsinformationen', type: 'public' },
  { id: 18, text: 'Wetterdaten', type: 'public' },
  { id: 19, text: 'Öffentliche Statistiken', type: 'public' },
  { id: 20, text: 'Öffentliche Karten', type: 'public' }
];

const StyledBox = styled(Paper)(({ theme }: { theme: Theme }) => ({
  padding: theme.spacing(1),
  margin: theme.spacing(0.5),
  minHeight: '40px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backgroundColor: '#dcc08e',
  border: '3px solid #5d3c1a',
  borderRadius: '5px',
  '&:hover': {
    transform: 'scale(1.02)',
    backgroundColor: '#e1d0b0',
  },
}));

const DropZone = styled(Paper)(({ theme }: { theme: Theme }) => ({
  padding: theme.spacing(0.5),
  margin: theme.spacing(0.25),
  minHeight: '40px',
  maxHeight: '50px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  border: '3px solid #3f556b',
  borderRadius: '5px',
  transition: 'all 0.3s ease',
  '&.drag-over': {
    borderColor: '#5d3c1a',
    backgroundColor: 'rgba(220, 192, 142, 0.2)',
  },
}));

// Function to shuffle array using Fisher-Yates algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const DataSortingGame: React.FC<DataSortingGameProps> = ({ onCompletion }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  // Calculate responsive sizes
  const getResponsiveSize = (baseSize: number) => {
    if (isMobile) return baseSize * 0.7;
    if (isTablet) return baseSize * 0.85;
    return baseSize;
  };

  const [currentItem, setCurrentItem] = useState<DataItem | null>(null);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [remainingItems, setRemainingItems] = useState<DataItem[]>(shuffleArray(DATA_ITEMS));
  const [draggedItem, setDraggedItem] = useState<DataItem | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    if (remainingItems.length > 0) {
      setCurrentItem(remainingItems[0]);
    } else if (currentItem) {
      // Show summary when all items are sorted
      setShowSummary(true);
    }
  }, [remainingItems, currentItem]);

  const handleDragStart = (e: React.DragEvent, item: DataItem) => {
    setDraggedItem(item);
    e.dataTransfer.setData('text/plain', JSON.stringify(item));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, type: keyof typeof DATA_TYPES) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    const item = e.dataTransfer.getData('text/plain');
    const data = JSON.parse(item) as DataItem;
    
    if (data.type === type) {
      setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
      setFeedback({
        type: 'success',
        message: `Richtig! "${data.text}" gehört zu ${DATA_TYPES[type].label.toLowerCase()}.`
      });
    } else {
      setScore(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
      const correctExample = DATA_ITEMS.find(item => item.type === type);
      let explanation = '';
      
      switch(type) {
        case 'sensitive':
          explanation = 'Personenbezogene Daten spezieller Kategorien (rot) erfordern nach DSGVO einen höheren Schutz. Dazu gehören genetische, biometrische und Gesundheitsdaten sowie Daten zu rassischer und ethnischer Herkunft, politischen Meinungen, religiösen Überzeugungen oder Gewerkschaftszugehörigkeit.';
          break;
        case 'personal':
          explanation = 'Personenbezogene Daten (orange) sind persönliche Informationen, die nicht in die speziellen Kategorien fallen. Sie können sensibel werden, wenn sie mit anderen Informationen verknüpft werden.';
          break;
        case 'public':
          explanation = 'Öffentlich zugängliche Daten (grün) sind Informationen, die für die Allgemeinheit bestimmt sind und keinen besonderen Schutz erfordern.';
          break;
      }
      
      setFeedback({
        type: 'error',
        message: `Falsch! "${data.text}" gehört zu ${DATA_TYPES[data.type].label.toLowerCase()}.\n\n${explanation}\n\nEin Beispiel für ${DATA_TYPES[type].label.toLowerCase()} wäre "${correctExample?.text}".`
      });
    }
    
    setRemainingItems(prev => prev.slice(1));
    setDraggedItem(null);
  };

  const handleCloseFeedback = () => {
    setFeedback(null);
  };

  const totalItems = DATA_ITEMS.length;
  const isSolved = score.correct > totalItems / 2;

  if (showSummary) {
    return (
      <Box sx={{ 
        p: { xs: 2, sm: 3, md: 4 },
        width: '100%', 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        backgroundColor: '#d87f20',
        fontFamily: 'micro5, monospace',
        textAlign: 'center'
      }}>
        <Typography variant="h4" sx={{ 
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
          color: '#ffffff',
          mb: 2
        }}>
          {isSolved ? 'Glückwunsch!' : 'Versuch es noch einmal!'}
        </Typography>

        <Box sx={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: 2,
          p: 3,
          maxWidth: '600px',
          width: '90%'
        }}>
          <Typography variant="h6" sx={{ 
            fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.6rem' },
            color: '#5d3c1a',
            mb: 2
          }}>
            Zusammenfassung
          </Typography>

          <Typography sx={{ 
            fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.4rem' },
            color: '#5d3c1a',
            mb: 3
          }}>
            Richtig sortiert: {score.correct} von {totalItems}
          </Typography>

          <Typography sx={{ 
            fontSize: { xs: '1rem', sm: '1.2rem', md: '1.3rem' },
            color: '#5d3c1a',
            mb: 4
          }}>
            {isSolved 
              ? 'Du hast mehr als die Hälfte der Daten korrekt sortiert. Das Smart Home Hub ist jetzt entsperrt!'
              : 'Du musst mehr als die Hälfte der Daten korrekt sortieren, um das Smart Home Hub zu entsperren.'}
          </Typography>

          <Box sx={{ 
            display: 'flex',
            justifyContent: 'center',
            gap: 2
          }}>
            <Button
              variant="contained"
              onClick={() => {
                setShowSummary(false);
                setRemainingItems(shuffleArray(DATA_ITEMS));
                setScore({ correct: 0, incorrect: 0 });
                setCurrentItem(shuffleArray(DATA_ITEMS)[0]);
              }}
              sx={{
                backgroundColor: '#5d3c1a',
                '&:hover': {
                  backgroundColor: '#4a2f15'
                }
              }}
            >
              Noch einmal spielen
            </Button>
            {isSolved && (
              <Button
                variant="contained"
                onClick={() => {
                  if (onCompletion) {
                    onCompletion();
                  }
                }}
                sx={{
                  backgroundColor: '#2e7d32',
                  '&:hover': {
                    backgroundColor: '#1b5e20'
                  }
                }}
              >
                Fertig
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: { xs: 2, sm: 3, md: 4 },
      width: '100%', 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: { xs: 2, sm: 3, md: 4 },
      backgroundColor: '#d87f20',
      fontFamily: 'micro5, monospace',
      position: 'relative'
    }}>
      {/* Draggable item container - fixed height */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        width: '100%',
        height: '120px',
        mt: { xs: 2, sm: 4, md: 6 }
      }}>
        {currentItem && (
          <StyledBox
            draggable
            onDragStart={(e) => handleDragStart(e, currentItem)}
            sx={{
              width: { xs: '90%', sm: '70%', md: '60%' },
              maxWidth: '600px',
              cursor: 'grab',
              padding: { xs: '0.75rem', sm: '1rem', md: '1.25rem' },
              color: '#5d3c1a'
            }}
          >
            <Typography variant="h6" sx={{ 
              fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.5rem' },
              fontFamily: 'micro5, monospace'
            }}>
              {currentItem.text}
            </Typography>
          </StyledBox>
        )}
      </Box>

      {/* Spacer to push buckets down */}
      <Box sx={{ flex: 1 }} />

      {/* Buckets container - fixed position */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        gap: { xs: 1, sm: 2 },
        flexWrap: 'wrap',
        width: '100%',
        minHeight: { xs: '140px', sm: '160px', md: '180px' },
        mb: { xs: 4, sm: 6, md: 8 }
      }}>
        {(['public', 'personal', 'sensitive'] as const).map((type) => (
          <DropZone
            key={type}
            sx={{ 
              bgcolor: DATA_TYPES[type].color, 
              color: '#ffffff', 
              flex: '1 1 0',
              minWidth: { xs: '120px', sm: '150px', md: '180px' },
              maxWidth: { xs: '200px', sm: '250px', md: '300px' },
              minHeight: { xs: '90px', sm: '110px', md: '120px' },
              opacity: 0.8,
              '&:hover': {
                opacity: 1,
              },
              '&.drag-over': {
                opacity: 1,
                transform: 'scale(1.05)',
                transition: 'all 0.2s ease'
              }
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, type)}
          >
            <Typography variant="h6" sx={{ 
              textAlign: 'center',
              fontSize: { xs: '1rem', sm: '1.2rem', md: '1.3rem' },
              fontFamily: 'micro5, monospace',
              textTransform: 'uppercase'
            }}>
              {DATA_TYPES[type].label}
            </Typography>
          </DropZone>
        ))}
      </Box>

      {/* Score container - fixed position */}
      <Box sx={{ 
        textAlign: 'center',
        width: '100%',
        mb: { xs: 2, sm: 3, md: 4 }
      }}>
        <Typography variant="h6" sx={{ 
          fontSize: { xs: '1rem', sm: '1.2rem', md: '1.3rem' },
          fontFamily: 'micro5, monospace',
          color: '#ffffff',
          textTransform: 'uppercase'
        }}>
          Punkte: {score.correct} richtig | {score.incorrect} falsch
        </Typography>
      </Box>

      <Snackbar
        open={!!feedback}
        onClose={handleCloseFeedback}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseFeedback}
          severity={feedback?.type}
          sx={{ 
            width: { xs: '95%', sm: '90%', md: '85%' },
            minHeight: { xs: '120px', sm: '140px', md: '160px' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'micro5, monospace',
            fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.3rem' },
            whiteSpace: 'pre-line',
            '& .MuiAlert-message': {
              width: '100%',
              textAlign: 'center',
              fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.3rem' },
              lineHeight: 1.5
            }
          }}
        >
          {feedback?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DataSortingGame; 