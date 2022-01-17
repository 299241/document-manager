import { motion } from 'framer-motion';
// material
import { Stack, Typography, CircularProgress } from '@mui/material';
// components
import { MotionContainer, varBounceIn } from '../animate';

// ----------------------------------------------------------------------

export default function DocumentAwaiting() {
  return (
    <MotionContainer initial="initial" open>
      <motion.div variants={varBounceIn}>
        <Stack sx={{ mb: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Addition on blockchain in progress
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>Please wait</Typography>
        </Stack>
      </motion.div>
    </MotionContainer>
  );
}
