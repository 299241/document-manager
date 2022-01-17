import PropTypes from 'prop-types';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// material
import {
  Table,
  Avatar,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  TableContainer,
  TablePagination,
  Tooltip
} from '@mui/material';
// components
import Label from '../Label';
import Scrollbar from '../Scrollbar';
import SearchNotFound from '../SearchNotFound';
import { DocumentListHead, DocumentListToolbar } from '.';
// utils
import { fDateTime } from '../../utils/formatTime';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'author', label: 'Author', alignRight: false },
  { id: 'done', label: 'Done', alignRight: false },
  { id: 'date', label: 'Creation date', alignRight: false }
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

DocumentList.propTypes = {
  documents: PropTypes.array,
  showToolbar: PropTypes.bool,
  showPagination: PropTypes.bool
};

DocumentList.defaultProps = {
  showToolbar: true,
  showPagination: true
};

export default function DocumentList({ documents, showToolbar, showPagination }) {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('date');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const navigate = useNavigate();

  const DOCUMENTLIST = documents;

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleClick = (id) => {
    navigate(`/document/${id}`);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - DOCUMENTLIST.length) : 0;

  const filteredDocuments = applySortFilter(
    DOCUMENTLIST,
    getComparator(order, orderBy),
    filterName
  );

  const isDocumentNotFound = filteredDocuments.length === 0;

  const labelColor = (status) => {
    switch (status) {
      case 'EDITING':
        return 'warning';
      case 'SIGNING':
        return 'info';
      case 'FINISHED':
        return 'success';
      default:
        return 'error';
    }
  };

  return (
    <>
      {showToolbar && (
        <DocumentListToolbar filterName={filterName} onFilterName={handleFilterByName} />
      )}
      <Scrollbar>
        <TableContainer sx={{ minWidth: 800 }}>
          <Table>
            <DocumentListHead
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {filteredDocuments
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  const { id, name, status, author, done, date } = row;

                  return (
                    <TableRow hover key={id} tabIndex={-1} onClick={() => handleClick(id)}>
                      <TableCell>
                        <Typography variant="subtitle2" noWrap>
                          {name}
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Label variant="ghost" color={labelColor(status)}>
                          {sentenceCase(status)}
                        </Label>
                      </TableCell>
                      <TableCell align="left">
                        <Tooltip title={author}>
                          <Avatar alt={author} />
                        </Tooltip>
                      </TableCell>
                      <TableCell align="left">
                        {done.value}/{done.total}
                      </TableCell>
                      <TableCell align="left">{fDateTime(date)}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            {isDocumentNotFound && (
              <TableBody>
                <TableRow>
                  <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                    <SearchNotFound searchQuery={filterName} />
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Scrollbar>

      {showPagination && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredDocuments.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </>
  );
}
