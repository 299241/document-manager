import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
// material
import { Typography, Card, CardContent, Stack } from '@mui/material';
// components
import { MotionContainer, varBounceIn } from '../animate';

DocumentFilesDropzone.propTypes = {
  onFilesSubmit: PropTypes.func
};

export default function DocumentFilesDropzone({ onFilesSubmit }) {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      onFilesSubmit(acceptedFiles);
    }
  }, [acceptedFiles, onFilesSubmit]);

  return (
    <MotionContainer initial="initial" open>
      <motion.div variants={varBounceIn}>
        <Stack sx={{ mb: 5 }}>
          <Typography variant="h3" paragraph>
            Upload files
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            Drag and drop one or more files to the field or select files from your computer
          </Typography>
        </Stack>
        <Card>
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 150
            }}
          >
            <div {...getRootProps({ className: 'dropzone' })}>
              <input {...getInputProps()} />
              <p>Drop files here or click to upload</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </MotionContainer>
  );
}
