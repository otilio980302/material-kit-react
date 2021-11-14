import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { Form, Formik, Field } from 'formik';
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
  const [Bill, setBill] = useState([]);

  const saveBill = () => {
    const newBill = [
      {
        id: '1',
        // quantity: Rows.reduce((prev, next) => prev + next.quantity, 0),
        amount: Rows.reduce((prev, next) => prev + next.amount, 0),
        id_user: '1',
        id_account: '1'
      }
    ];
    // setBill(newBill);
    console.log(newBill);
    newBill.map((s) => {
      axios
        .post('https://backendomacore.herokuapp.com/addBill', s)
        .then((response) => console.log(response))
        .catch((error) => {
          console.log(error);
        });
      return 'yes';
    });
    // window.location.reload();
  };

  const CustomizedSelectForFormik = ({ children, form, field }) => {
    const { name, value } = field;
    const { setFieldValue } = form;

    return (
      <Select
        fullWidth
        variant="standard"
        name={name}
        value={value}
        onChange={(e) => {
          setFieldValue(name, e.target.value);

          setFieldValue(
            'price',
            PRODUCTS.map((s) => {
              if (s.name === e.target.value) {
                return s.price;
              }
              return '';
            })
              .toString()
              .replace(/,/g, '')
          );
        }}
      >
        {children}
      </Select>
    );
  };

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
            const newRows = [...Rows, value];
            setRows(newRows);

            resetForm();
          }}
        >
          {({ values, handleSubmit, handleBlur, getFieldProps, setFieldValue, handleChange }) => (
            <Form>
              <Card sx={{ maxWidth: 1200 }}>
                <CardContent>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">product</InputLabel>
                      <Field name="product" component={CustomizedSelectForFormik}>
                        {PRODUCTS.map((s) => (
                          <MenuItem value={s.name}>{s.name}</MenuItem>
                        ))}
                      </Field>
                    </FormControl>

                    <TextField
                      fullWidth
                      label="price"
                      variant="standard"
                      {...getFieldProps('price')}
                      onBlur={handleBlur}
                      inputProps={{ readOnly: true }}
                    />
                    <TextField
                      fullWidth
                      variant="standard"
                      label="quantity"
                      type="number"
                      autocomplete="off"
                      {...getFieldProps('quantity')}
                      onBlur={handleBlur}
                      onKeyUp={() => {
                        if (getFieldProps('quantity').value !== 0) {
                          setFieldValue(
                            'amount',
                            getFieldProps('price').value * getFieldProps('quantity').value
                          );
                        }
                      }}
                    />
                    <TextField
                      fullWidth
                      label="amount"
                      {...getFieldProps('amount')}
                      onBlur={handleBlur}
                      inputProps={{ readOnly: true }}
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
                  <TableCell align="right">action</TableCell>
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
                    <TableCell align="right">
                      <Button variant="contained" to="#">
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Stack direction="row" spacing={2} justifyContent="right" alignItems="center">
            <TextField
              xs={4}
              label="total quantity"
              variant="standard"
              inputProps={{ readOnly: true }}
              value={Rows.reduce((prev, next) => prev + next.quantity, 0)}
            />
            <TextField
              xs={4}
              label="total"
              variant="standard"
              style={{ textAlign: 'center' }}
              inputProps={{ readOnly: true }}
              value={Rows.reduce((prev, next) => prev + next.amount, 0)}
            />
          </Stack>
        </Card>
        <Button
          variant="contained"
          component={RouterLink}
          to="#"
          startIcon={<Icon icon={plusFill} />}
          onClick={() => {
            saveBill();
          }}
        >
          Save
        </Button>
      </Container>
    </Page>
  );
}
