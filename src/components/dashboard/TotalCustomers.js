import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography
} from '@material-ui/core';
import { grey, red } from '@material-ui/core/colors';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import DonutSmallIcon from '@material-ui/icons/DonutSmall';

const TotalCustomers = (props) => (
  <Card {...props}>
    <CardContent>
      <Grid
        container
        spacing={3}
        sx={{ justifyContent: 'space-between' }}
      >
        <Grid item>
          <Typography
            color="textSecondary"
            gutterBottom
            variant="h6"
          >
            TOKENS OWNED
          </Typography>
          <Typography
            color="textPrimary"
            variant="h3"
          >
            9,821
          </Typography>
        </Grid>
        <Grid item>
          <Avatar
            sx={{
              backgroundColor: grey[600],
              height: 56,
              width: 56
            }}
          >
            <DonutSmallIcon />
          </Avatar>
        </Grid>
      </Grid>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          pt: 2
        }}
      >
        <ArrowDownwardIcon sx={{ color: red[900] }} />
        <Typography
          variant="body2"
          sx={{
            color: red[900],
            mr: 1
          }}
        >
          .08%
        </Typography>
        <Typography
          color="textSecondary"
          variant="caption"
        >
          Since last month
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

export default TotalCustomers;
