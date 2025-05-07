import React from "react";
import { Button, Typography, Box } from "@mui/material";

interface FileUploadProps {
  label: string;
  onFileChange: (file: File) => void;
  accept?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ label, onFileChange, accept }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileChange(e.target.files[0]);
    }
  };

  return (
    <Box>
      <Typography variant="body1" gutterBottom>
        {label}
      </Typography>
      <Button variant="contained" component="label">
        Choose File
        <input
          type="file"
          hidden
          onChange={handleFileChange}
          accept={accept}
        />
      </Button>
    </Box>
  );
};

export default FileUpload;