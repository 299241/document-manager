import * as Yup from 'yup';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik, Form, FormikProvider } from 'formik';
import { motion } from 'framer-motion/dist/framer-motion';
// material
import { Typography, Stack, IconButton, InputAdornment, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// icons
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
// components
import { MotionContainer, varBounceIn } from '../animate';

DocumentKeyForm.propTypes = {
  onFormSubmit: PropTypes.func
};

export default function DocumentKeyForm({ onFormSubmit }) {
  const [showPassword, setShowPassword] = useState(false);

  const DocumentPasswordSchema = Yup.object().shape({
    password: Yup.string().required('Password is required')
  });

  const formik = useFormik({
    initialValues: {
      password: ''
    },
    validationSchema: DocumentPasswordSchema,
    onSubmit: onFormSubmit
  });

  const { errors, touched, values, getFieldProps, isSubmitting } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <FormikProvider value={formik}>
      <MotionContainer initial="initial" open>
        <motion.div variants={varBounceIn}>
          <Stack sx={{ mb: 5 }}>
            <Typography variant="h3" paragraph>
              Encrypt file
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>Enter password to encrypt file</Typography>
          </Stack>

          <Form autoComplete="off" noValidate>
            <Stack spacing={2}>
              <TextField
                fullWidth
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
              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
                disabled={values.password.length === 0 || errors.password !== undefined}
              >
                Decrypt file
              </LoadingButton>
            </Stack>
          </Form>
        </motion.div>
      </MotionContainer>
    </FormikProvider>
  );
}
