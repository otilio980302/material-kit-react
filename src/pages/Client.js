import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
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
  TableHead
} from '@mui/material';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../components/_dashboard/user';
//
import USERLIST from '../_mocks_/client';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'company', label: 'Company', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false },
  { id: 'isVerified', label: 'Verified', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '' }
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Client() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  const [Journeys, setJourneys] = useState([]);
  const [Getcost, setGetcost] = useState([]);
  const [TableState, setTableState] = useState([]);

  useEffect(() => {
    const run = async () => {
      await axios.get(`https://backendtrucks1.herokuapp.com/getjourney`).then((res) => {
        setJourneys(res.data);
      });
    };

    const PromiseGetCost = async () => {
      await axios.get(`https://backendtrucks1.herokuapp.com/getStartDestiny`).then((res) => {
        setGetcost(res.data);
      });
    };
    run();
    PromiseGetCost();
  }, []);

  const tableconvert = () => {
    const row = [...Journeys];
    setTableState({ row });
  };

  return (
    <Page title="User | Minimal-UI">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Viajes
          </Typography>
        </Stack>

        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell>id</TableCell>
                    <TableCell align="right">Origen</TableCell>
                    <TableCell align="right">Destinos</TableCell>
                    <TableCell align="right">Fecha</TableCell>
                    <TableCell align="right">Condicion</TableCell>
                    <TableCell align="right">Porcentaje</TableCell>
                    <TableCell align="right">SubTotal</TableCell>
                    <TableCell align="right">Total</TableCell>
                    {/* <TableCell align="right">action</TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Journeys.map((s) => (
                    <TableRow key={s.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component="th" scope="row">
                        {s.id}
                      </TableCell>
                      <TableCell align="right">{s.start_point}</TableCell>
                      <TableCell align="right">{s.destiny.map((s) => s.concat(','))}</TableCell>
                      <TableCell align="right">{s.date}</TableCell>
                      <TableCell align="right">{s.total_payment}</TableCell>
                      <TableCell align="right">
                        {Getcost.map((g) =>
                          g.id_startpoint === '8100' && g.id_destiny === s.destiny[1]
                            ? g.coldcost
                            : ''
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {s.destiny.map((desti, a = desti) =>
                          s.total_payment === 'Frio'
                            ? Getcost.reduce(
                                (acc, x) => (acc = acc > x.coldcost ? acc : x.coldcost),
                                0
                              )
                            : ''
                        )}

                        {/* {Getcost.map((cost) =>
                          cost.id_startpoint === '8100' && s.total_payment === 'Frio'
                            ? s.destiny.reduce((acc, item) => (acc = acc > item ? acc : item))
                            : ''
                        )} */}
                      </TableCell>
                      <TableCell align="right">
                        {Getcost.map((g) =>
                          g.id_startpoint === '8100' && g.id_destiny === '1400' ? g.coldcost : ''
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={USERLIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
