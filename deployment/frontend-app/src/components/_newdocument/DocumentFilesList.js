import * as Yup from 'yup';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik, Form, FormikProvider } from 'formik';
import { motion } from 'framer-motion';
// material
import {
  Typography,
  Card,
  CardContent,
  Stack,
  List,
  ListItem,
  IconButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  FormGroup,
  FormControlLabel,
  Switch,
  InputAdornment,
  TextField
} from '@mui/material';
// icons
import { Icon } from '@iconify/react';
import trashFill from '@iconify/icons-eva/trash-fill';
import fileFill from '@iconify/icons-eva/file-fill';
import fileAddFill from '@iconify/icons-eva/plus-fill';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
// components
import { MotionContainer, varBounceIn } from '../animate';

DocumentFilesList.propTypes = {
  files: PropTypes.array,
  onFileAdd: PropTypes.func,
  onFileDelete: PropTypes.func,
  onListAccepted: PropTypes.func
};

export default function DocumentFilesList({ files, onFileAdd, onFileDelete, onListAccepted }) {
  const [filesEncrypted, setFilesEncrypted] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const DocumentPasswordSchema = Yup.object().shape({
    password: filesEncrypted ? Yup.string().required('Password is required') : Yup.string()
  });

  const formik = useFormik({
    initialValues: {
      password: ''
    },
    validationSchema: DocumentPasswordSchema,
    onSubmit: onListAccepted
  });

  const { errors, touched, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <FormikProvider value={formik}>
      <MotionContainer initial="initial" open>
        <motion.div variants={varBounceIn}>
          <Stack sx={{ mb: 5 }}>
            <Typography variant="h3" paragraph>
              Uploaded files
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              Continue using the following document
            </Typography>
          </Stack>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <List sx={{ ml: '-16px' }}>
                {files.map((item, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <IconButton onClick={() => onFileDelete(index)}>
                        <Icon icon={trashFill} />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <Icon icon={fileFill} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText>{item.path}</ListItemText>
                  </ListItem>
                ))}
              </List>
              <Button
                fullWidth
                variant="text"
                size="large"
                onClick={() => onFileAdd()}
                startIcon={<Icon icon={fileAddFill} />}
              >
                Add more
              </Button>
            </CardContent>
          </Card>
          <Form autoComplete="off" noValidate>
            <Stack spacing={2}>
              <Card>
                <CardContent>
                  <Stack spacing={4}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={filesEncrypted}
                            onClick={() => setFilesEncrypted(!filesEncrypted)}
                          />
                        }
                        label="Files encrypted"
                      />
                    </FormGroup>
                    {filesEncrypted && (
                      <TextField
                        type={showPassword ? 'text' : 'password'}
                        label="Password"
                        {...getFieldProps('password')}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={handleShowPassword} edge="end">
                                <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                        error={Boolean(touched.password && errors.password)}
                        helperText={touched.password && errors.password}
                      />
                    )}
                  </Stack>
                </CardContent>
              </Card>

              <Button
                fullWidth
                variant="contained"
                size="large"
                type="submit"
                // onClick={() => onListAccepted(values.password)}
                disabled={files.length === 0}
              >
                Continue
              </Button>
            </Stack>
          </Form>
        </motion.div>
      </MotionContainer>
    </FormikProvider>
  );
}
