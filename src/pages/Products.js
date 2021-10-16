import { useFormik, Form, Formik } from 'formik';
import React, { useState } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
// material
import {
  Container,
  Stack,
  Typography,
  Button,
  Modal,
  Box,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';
import axios from 'axios';
import { Icon } from '@iconify/react';
import { LoadingButton } from '@mui/lab';
// components
import Page from '../components/Page';
import {
  ProductSort,
  ProductList,
  ProductCartWidget,
  ProductFilterSidebar
} from '../components/_dashboard/products';
//
// import PRODUCTS from '../_mocks_/products';

// ----------------------------------------------------------------------

export default function EcommerceShop() {
  const [openFilter, setOpenFilter] = useState(false);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const num = Math.floor(Math.random() * 24) + 1;

  const [PRODUCTS, setPRODUCTS] = useState([]);

  const run = async () => {
    await axios.get(`https://backendomacore.herokuapp.com/getProduct`).then((res) => {
      setPRODUCTS(res.data);
    });
  };
  run();

  const formik = useFormik({
    initialValues: {
      gender: '',
      category: '',
      colors: '',
      priceRange: '',
      rating: ''
    },
    onSubmit: () => {
      setOpenFilter(false);
    }
  });

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,

    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
  };

  const { resetForm, handleSubmit } = formik;

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleResetFilter = () => {
    handleSubmit();
    resetForm();
  };

  return (
    <Page title="Dashboard: Products | Minimal-UI">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" sx={{ mb: 5 }}>
            Products
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="#"
            startIcon={<Icon icon={plusFill} />}
            onClick={handleOpen}
          >
            New Product
          </Button>
        </Stack>

        <Stack
          direction="row"
          flexWrap="wrap-reverse"
          alignItems="center"
          justifyContent="flex-end"
          sx={{ mb: 5 }}
        >
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <ProductFilterSidebar
              formik={formik}
              isOpenFilter={openFilter}
              onResetFilter={handleResetFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
            />
            <ProductSort />
          </Stack>
        </Stack>

        <ProductList products={PRODUCTS} />
        <ProductCartWidget />
      </Container>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h10" component="h2">
            New Product
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <Formik
              initialValues={{
                id: '5',
                cover: `/static/mock-images/products/product_${num}.jpg`,
                name: '',
                cost: '',
                price: '',
                priceSale: '0',
                price2: '',
                price3: '',
                colors: '#00AB55',
                quantity: ''
              }}
              onSubmit={(value) => {
                axios
                  .post('https://backendomacore.herokuapp.com/addProduct', value)
                  .then((response) => console.log(response))
                  .catch((error) => {
                    console.log(error);
                  });
              }}
            >
              {({ values, handleSubmit, handleBlur, getFieldProps }) => (
                <Form onSubmit={handleSubmit}>
                  <Stack spacing={3}>
                    <TextField
                      fullWidth
                      label="Product Name"
                      {...getFieldProps('name')}
                      onBlur={handleBlur}
                    />
                    <TextField
                      fullWidth
                      label="cost"
                      {...getFieldProps('cost')}
                      onBlur={handleBlur}
                    />
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <TextField
                        fullWidth
                        autoComplete="username"
                        label="price"
                        {...getFieldProps('price')}
                      />
                      <TextField fullWidth label="price2" {...getFieldProps('price2')} />
                      <TextField fullWidth label="price3" {...getFieldProps('price3')} />
                    </Stack>

                    <TextField
                      fullWidth
                      label="quantity"
                      {...getFieldProps('quantity')}
                      onBlur={handleBlur}
                    />

                    <LoadingButton fullWidth size="large" type="submit" variant="contained">
                      Insert
                    </LoadingButton>
                  </Stack>
                </Form>
              )}
            </Formik>
          </Typography>
        </Box>
      </Modal>
    </Page>
  );
}
