import React from 'react';
import { Box, Paper } from '@mui/material';
import { styled, Theme } from '@mui/material/styles';
import DataSortingGame from '../dataSortingGame/DataSortingGame';

const StyledPaper = styled(Paper)(({ theme }: { theme: Theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(2),
  backgroundColor: '#f5f5f5',
  borderRadius: '12px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  width: '100%',
  height: '100%',
  maxWidth: 'none',
}));

interface SmartHomeHubProps {
  onCompletion: (isCompleted: boolean) => void;
}

export const SmartHomeHub: React.FC<SmartHomeHubProps> = ({ onCompletion }) => {
  const handleGameComplete = () => {
    onCompletion(true);
  };

  return (
    <StyledPaper>
      <Box sx={{ 
        width: '100%',
        height: 'calc(100vh - 100px)',
        minHeight: '500px'
      }}>
        <DataSortingGame onCompletion={handleGameComplete} />
      </Box>
    </StyledPaper>
  );
}; 