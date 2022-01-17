import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useFormik, Form, FormikProvider } from 'formik';
import { motion } from 'framer-motion';
// material
import { Stack, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { MotionContainer, varBounceIn } from '../animate';

// ----------------------------------------------------------------------

DocumentNameForm.propTypes = {
  onFormSubmit: PropTypes.func,
  prevName: PropTypes.string
};

export default function DocumentNameForm({ onFormSubmit, prevName }) {
  const DocumentNameSchema = Yup.object().shape({
    documentName: Yup.string()
      .min(3, 'Document name must be at least 3 characters')
      .max(30, 'Document name must be at most 30 characters')
      .required('Document name is required')
  });

  const formik = useFormik({
    initialValues: {
      documentName: prevName || ''
    },
    validationSchema: DocumentNameSchema,
    onSubmit: onFormSubmit
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <MotionContainer initial="initial" open>
        <motion.div variants={varBounceIn}>
          <Stack sx={{ mb: 5 }}>
            <Typography variant="h4" gutterBottom>
              Enter document name
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>Enter your document name below</Typography>
          </Stack>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                autoFocus
                type="text"
                label="Document name"
                {...getFieldProps('documentName')}
                error={Boolean(touched.documentName && errors.documentName)}
                helperText={touched.documentName && errors.documentName}
              />
              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
                disabled={values.documentName.length === 0 || errors.documentName !== undefined}
              >
                Confirm
              </LoadingButton>
            </Stack>
          </Form>
        </motion.div>
      </MotionContainer>
    </FormikProvider>
  );
}
