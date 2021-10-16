import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { Form, Formik } from 'formik';
import { LoadingButton } from '@mui/lab';
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  CardMedia,
  CardActions,
  CardContent,
  TextField,
  Paper,
  TableHead,
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../components/_dashboard/user';
//

// ----------------------------------------------------------------------

export default function Bill() {
  const [PRODUCTS, setPRODUCTS] = useState([]);
  const initialFormData = [];
  const [Rows, setRows] = useState(initialFormData);

  useEffect(() => {
    const run = async () => {
      await axios.get(`https://backendomacore.herokuapp.com/getProduct`).then((res) => {
        setPRODUCTS(res.data);
      });
    };
    run();
  }, []);

  return (
    <Page title="User | Minimal-UI">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Bill
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="#"
            startIcon={<Icon icon={plusFill} />}
          >
            New Bill
          </Button>
        </Stack>
        <Formik
          enableReinitialize
          initialValues={{
            product: '',
            price: '',
            quantity: '',
            amount: ''
          }}
          onSubmit={(value, { resetForm }) => {
            resetForm();
          }}
        >
          {({ values, handleSubmit, handleBlur, getFieldProps, onSelect }) => (
            <Form>
              <Card sx={{ maxWidth: 1200 }}>
                <CardContent>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      fullWidth
                      label="product"
                      {...getFieldProps('product')}
                      onBlur={handleBlur}
                      select
                    >
                      {PRODUCTS.map((s) => (
                        <MenuItem value={s.name}> {s.name}</MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      fullWidth
                      label="price"
                      {...getFieldProps('price')}
                      onBlur={handleBlur}
                    />
                    <TextField
                      fullWidth
                      label="quantity"
                      {...getFieldProps('quantity')}
                      onBlur={handleBlur}
                    />
                    <TextField
                      fullWidth
                      label="amount"
                      {...getFieldProps('amount')}
                      onBlur={handleBlur}
                    />
                    <LoadingButton fullWidth size="large" type="submit" variant="contained">
                      Insert
                    </LoadingButton>
                  </Stack>
                </CardContent>
              </Card>
            </Form>
          )}
        </Formik>

        <Card>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align="right">price</TableCell>
                  <TableCell align="right">quantity</TableCell>
                  <TableCell align="right">amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Rows.map((s) => (
                  <TableRow
                    key={s.product}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {s.product}
                    </TableCell>
                    <TableCell align="right">{s.price}</TableCell>
                    <TableCell align="right">{s.quantity}</TableCell>
                    <TableCell align="right">{s.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Container>
    </Page>
  );
}
