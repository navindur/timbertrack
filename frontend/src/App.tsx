import React from 'react';
import { Button } from '@mui/material';

const App: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-blue-600">
        Welcome to TimberTrack!
      </h1>
      <Button variant="contained" color="primary" className="mt-4">
        Material-UI Button
      </Button>
    </div>
  );
};

export default App;