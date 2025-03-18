import React from 'react';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

const BrowseTheRange: React.FC = () => {
  return (
    <div className="text-center py-12">
      {/* Heading */}
      <h2 className="text-4xl font-bold mb-4">Browse The Range</h2>

      {/* Description */}
      <p className="text-lg text-gray-600 mb-12">
        Browse through our latest collections
      </p>

      {/* Buttons with Images */}
      <div className="flex justify-center gap-8">
        {/* Dining */}
        <div className="flex flex-col items-center">
          <Button
            component={Link}
            to="/dining" // Add the link for Dining
            className="w-64 h-80 bg-cover bg-center rounded-lg mb-4 p-0" // Remove padding
            style={{ backgroundImage: "url('/Mask Group.png')" }} // Add your Dining image
            sx={{
              '&:hover': {
                opacity: 0.9, // Add hover effect
              },
            }}
          ></Button>
          <Button
            variant="text" // Use 'text' variant for no borders or shadows
            sx={{
              color: '#4b5563', // Gray text color
              fontSize: '1.08rem',
              fontWeight: '600',
              padding: '12px 24px',
              textTransform: 'none', // Prevent uppercase transformation
              '&:hover': {
                backgroundColor: 'transparent', // No background on hover
                color: '#C24507', // Change text color on hover
              },
            }}
          >
            Dining
          </Button>
        </div>

        {/* Living */}
        <div className="flex flex-col items-center">
          <Button
            component={Link}
            to="/living" // Add the link for Living
            className="w-64 h-80 bg-cover bg-center rounded-lg mb-4 p-0" // Remove padding
            style={{ backgroundImage: "url('/Image-living room.png')" }} // Add your Living image
            sx={{
              '&:hover': {
                opacity: 0.9, // Add hover effect
              },
            }}
          ></Button>
          <Button
            variant="text" // Use 'text' variant for no borders or shadows
            sx={{
              color: '#4b5563', // Gray text color
              fontSize: '1.08rem',
              fontWeight: '600',
              padding: '12px 24px',
              textTransform: 'none', // Prevent uppercase transformation
              '&:hover': {
                backgroundColor: 'transparent', // No background on hover
                color: '#C24507', // Change text color on hover
              },
            }}
          >
            Living
          </Button>
        </div>

        {/* Bedroom */}
        <div className="flex flex-col items-center">
          <Button
            component={Link}
            to="/bedroom" // Add the link for Bedroom
            className="w-64 h-80 bg-cover bg-center rounded-lg mb-4 p-0" // Remove padding
            style={{ backgroundImage: "url('/image 101.png')" }} // Add your Bedroom image
            sx={{
              '&:hover': {
                opacity: 0.9, // Add hover effect
              },
            }}
          ></Button>
          <Button
            variant="text" // Use 'text' variant for no borders or shadows
            sx={{
              color: '#4b5563', // Gray text color
              fontSize: '1.08rem',
              fontWeight: '600',
              padding: '12px 24px',
              textTransform: 'none', // Prevent uppercase transformation
              '&:hover': {
                backgroundColor: 'transparent', // No background on hover
                color: '#C24507', // Change text color on hover
              },
            }}
          >
            Bedroom
          </Button>
        </div>

        {/* Office */}
        <div className="flex flex-col items-center">
          <Button
            component={Link}
            to="/office" // Add the link for Office
            className="w-64 h-80 bg-cover bg-center rounded-lg mb-4 p-0" // Remove padding
            style={{ backgroundImage: "url('/Images.png')" }} // Add your Office image
            sx={{
              '&:hover': {
                opacity: 0.9, // Add hover effect
              },
            }}
          ></Button>
          <Button
            variant="text" // Use 'text' variant for no borders or shadows
            sx={{
              color: '#4b5563', // Gray text color
              fontSize: '1.08rem',
              fontWeight: '600',
              padding: '12px 24px',
              textTransform: 'none', // Prevent uppercase transformation
              '&:hover': {
                backgroundColor: 'transparent', // No background on hover
                color: '#C24507', // Change text color on hover
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