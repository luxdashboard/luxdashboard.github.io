import moment from 'moment';
import { v4 as uuid } from 'uuid';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip
} from '@material-ui/core';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

const orders = [
  {
    id: uuid(),
    ref: '0x2df44271',
    amount: 30.5,
    customer: {
      name: 'Daniel K. Kimbrough'
    },
    createdAt: 1629039127000,
    status: 'pending'
  },
  {
    id: uuid(),
    ref: '0xcb2221c4',
    amount: 25.1,
    customer: {
      name: 'Toronto Water Holdings, LLC'
    },
    createdAt: 1628693527000,
    status: 'pending'
  },
  {
    id: uuid(),
    ref: '0x5c7ac5ae',
    amount: 10.99,
    customer: {
      name: 'Miguel Lyons'
    },
    createdAt: 1628691127000,
    status: 'confirmed'
  },
  {
    id: uuid(),
    ref: '0xa97246b5d',
    amount: 96.43,
    customer: {
      name: 'Mary M. Robbins'
    },
    createdAt: 1628434327000,
    status: 'confirmed'
  },
  {
    id: uuid(),
    ref: '0x900289af',
    amount: 32.54,
    customer: {
      name: 'Dale Wright'
    },
    createdAt: 1627568047000,
    status: 'failed'
  },
  {
    id: uuid(),
    ref: '0x5d175c6a',
    amount: 16.76,
    customer: {
      name: 'Excel Trust, Inc.'
    },
    createdAt: 1616422447000,
    status: 'confirmed'
  }
];

const LatestOrders = (props) => (
  <Card {...props}>
    <CardHeader title="Latest Orders" />
    <Divider />
    <PerfectScrollbar>
      <Box sx={{ minWidth: 800 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                Order Ref
              </TableCell>
              <TableCell>
                Counterparty
              </TableCell>
              <TableCell sortDirection="desc">
                <Tooltip
                  enterDelay={300}
                  title="Sort"
                >
                  <TableSortLabel
                    active
                    direction="desc"
                  >
                    Date
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
              <TableCell>
                Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow
                hover
                key={order.id}
              >
                <TableCell>
                  {order.ref}
                </TableCell>
                <TableCell>
                  {order.customer.name}
                </TableCell>
                <TableCell>
                  {moment(order.createdAt).format('MM/DD/YYYY')}
                </TableCell>
                <TableCell>
                  <Chip
                    color="primary"
                    label={order.status}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </PerfectScrollbar>
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        p: 2
      }}
    >
      <Button
        color="primary"
        endIcon={<ArrowRightIcon />}
        size="small"
        variant="text"
      >
        View all
      </Button>
    </Box>
  </Card>
);

export default LatestOrders;
