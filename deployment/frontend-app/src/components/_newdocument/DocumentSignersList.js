import * as Yup from 'yup';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik, Form, FormikProvider } from 'formik';
import { motion } from 'framer-motion/dist/framer-motion';
import { List as ReorderList, arrayMove } from 'react-movable';
import Web3 from 'web3';
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
  Button,
  FormGroup,
  FormControlLabel,
  TextField,
  Switch
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useTheme } from '@mui/material/styles';
// icons
import { Icon } from '@iconify/react';
import trashFill from '@iconify/icons-eva/trash-fill';
// components
import { MotionContainer, varBounceIn } from '../animate';

DocumentSignersList.propTypes = {
  actualSigners: PropTypes.array,
  signersOrderImportant: PropTypes.bool,
  onSignersUpdate: PropTypes.func
};

export default function DocumentSignersList({
  actualSigners,
  signersOrderImportant,
  onSignersUpdate
}) {
  const theme = useTheme();

  const [signers, setSigners] = useState(actualSigners);
  const [importantOrder, setImportantOrder] = useState(signersOrderImportant);

  const onSignerDelete = (deleteIndex) => {
    setSigners(signers.filter((item, index) => index !== deleteIndex));
  };

  const SignersSchema = Yup.object().shape({
    signerAddress: Yup.string()
      .test({
        name: 'valid_address',
        message: 'Signer must be valid Ethereum account address',
        test: (value) => Web3.utils.isAddress(value)
      })
      .test({
        name: 'not_exist_address',
        message: 'A signer with this address already exists on the list',
        test: (value) => !signers.includes(value)
      })
  });

  const formik = useFormik({
    initialValues: {
      signerAddress: ''
    },
    validationSchema: SignersSchema,
    onSubmit: (form) => {
      setSigners(signers.concat([form.signerAddress]));
      resetForm({ signerAddress: '' });
    }
  });

  const { errors, touched, values, isSubmitting, resetForm, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <MotionContainer initial="initial" open>
        <motion.div variants={varBounceIn}>
          <Stack sx={{ mb: 5 }}>
            <Typography variant="h3" paragraph>
              Document signers
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>Enter a list of signers</Typography>
          </Stack>
          <FormGroup sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={importantOrder}
                  onClick={() => setImportantOrder(!importantOrder)}
                />
              }
              label="Is the order of signatories important?"
            />
          </FormGroup>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Stack spacing={2} sx={{ mb: 2 }}>
              <TextField
                fullWidth
                type="text"
                label="Signer address"
                {...getFieldProps('signerAddress')}
                error={Boolean(
                  values.signerAddress.length > 0 && touched.signerAddress && errors.signerAddress
                )}
                helperText={
                  values.signerAddress.length > 0 && touched.signerAddress && errors.signerAddress
                }
              />
              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="outlined"
                loading={isSubmitting}
                disabled={values.signerAddress.length === 0 || errors.signerAddress !== undefined}
              >
                Add signer
              </LoadingButton>
            </Stack>
          </Form>
          {signers.length > 0 && (
            <>
              <Card sx={{ mb: 5 }}>
                <CardContent>
                  <ReorderList
                    sx={{ zIndex: 1000 }}
                    values={signers}
                    onChange={({ oldIndex, newIndex }) =>
                      setSigners(arrayMove(signers, oldIndex, newIndex))
                    }
                    renderList={({ children, props }) => <List {...props}>{children}</List>}
                    renderItem={({ value, props, isDragged }) => (
                      <ListItem
                        {...props}
                        sx={{
                          backgroundColor: isDragged ? theme.palette.grey[500_16] : 'inherit'
                        }}
                        secondaryAction={
                          // eslint-disable-next-line react/prop-types
                          <IconButton onClick={() => onSignerDelete(props.key)}>
                            <Icon icon={trashFill} />
                          </IconButton>
                        }
                      >
                        <ListItemText>{value}</ListItemText>
                      </ListItem>
                    )}
                  />
                </CardContent>
              </Card>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={() => onSignersUpdate(signers, importantOrder)}
                disabled={signers.length === 0}
              >
                Continue
              </Button>
            </>
          )}
        </motion.div>
      </MotionContainer>
    </FormikProvider>
  );
}
