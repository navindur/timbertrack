import React from 'react';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

const BrowseTheRange: React.FC = () => {
  return (
     // Main wrapper with vertical spacing and centered text
    <div className="text-center py-12">
     
      <h2 className="text-4xl font-bold mb-4">Browse The Range</h2>

      <p className="text-lg text-gray-600 mb-12">
        Browse through our latest collections
      </p>

      <div className="flex justify-center gap-8">
       
        <div className="flex flex-col items-center">
          <Button
            component={Link}
            to="categories/dining" 
            className="w-64 h-80 bg-cover bg-center rounded-lg mb-4 p-0" 
            style={{ backgroundImage: "url('/Mask Group.png')" }} 
            sx={{
              '&:hover': {
                opacity: 0.9,  // Slight hover effect
              },
            }}
          ></Button>
          <Button
            variant="text" 
            sx={{
              color: '#4b5563', 
              fontSize: '1.08rem',
              fontWeight: '600',
              padding: '12px 24px',
              textTransform: 'none', 
              '&:hover': {
                backgroundColor: 'transparent', 
                color: '#C24507', //Highlight on hover
              },
            }}
          >
            Dining
          </Button>
        </div>

        <div className="flex flex-col items-center">
          <Button
            component={Link}
            to="categories/living" 
            className="w-64 h-80 bg-cover bg-center rounded-lg mb-4 p-0" 
            style={{ backgroundImage: "url('/Image-living room.png')" }} 
            sx={{
              '&:hover': {
                opacity: 0.9,
              },
            }}
          ></Button>
          <Button
            variant="text" 
            sx={{
              color: '#4b5563',
              fontSize: '1.08rem',
              fontWeight: '600',
              padding: '12px 24px',
              textTransform: 'none', 
              '&:hover': {
                backgroundColor: 'transparent', 
                color: '#C24507',
              },
            }}
          >
            Living
          </Button>
        </div>

        <div className="flex flex-col items-center">
          <Button
            component={Link}
            to="categories/bedroom" 
            className="w-64 h-80 bg-cover bg-center rounded-lg mb-4 p-0" 
            style={{ backgroundImage: "url('/image 101.png')" }} 
            sx={{
              '&:hover': {
                opacity: 0.9, 
              },
            }}
          ></Button>
          <Button
            variant="text" 
            sx={{
              color: '#4b5563', 
              fontSize: '1.08rem',
              fontWeight: '600',
              padding: '12px 24px',
              textTransform: 'none', 
              '&:hover': {
                backgroundColor: 'transparent',
                color: '#C24507', 
              },
            }}
          >
            Bedroom
          </Button>
        </div>

        <div className="flex flex-col items-center">
          <Button
            component={Link}
            to="categories/office" 
            className="w-64 h-80 bg-cover bg-center rounded-lg mb-4 p-0" 
            style={{ backgroundImage: "url('/Images.png')" }} 
            sx={{
              '&:hover': {
                opacity: 0.9, 
              },
            }}
          ></Button>
          <Button
            variant="text" 
            sx={{
              color: '#4b5563', 
              fontSize: '1.08rem',
              fontWeight: '600',
              padding: '12px 24px',
              textTransform: 'none', 
              '&:hover': {
                backgroundColor: 'transparent', 
                color: '#C24507', 
              },
            }}
          >
            Office
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BrowseTheRange;