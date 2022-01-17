import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
// material
import { alpha } from '@mui/material/styles';
import { Box, Typography, Avatar, IconButton } from '@mui/material';
// components
import MenuPopover from '../../components/MenuPopover';

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const currentAccount = useSelector((state) => state.authStore.userAccount);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          padding: 0,
          width: 44,
          height: 44,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72)
            }
          })
        }}
      >
        <Avatar alt="account" />
      </IconButton>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 220 }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle1" sx={{ wordWrap: 'break-word' }}>
            {currentAccount}
          </Typography>
        </Box>
      </MenuPopover>
    </>
  );
}
