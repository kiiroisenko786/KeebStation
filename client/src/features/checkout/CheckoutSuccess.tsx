import { Box, Button, Container, Divider, Paper, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { Order } from "../../app/models/order";
import { currencyFormat, formatAddressString, formatPaymentString } from "../../lib/Util";

export default function CheckoutSuccess() {
  const {state} = useLocation();
  const order = state.data as Order;

  if (!order) return <Typography>Problem accessing order</Typography>

  // const addressString = () => {
  //   const address = order.shippingAddress;

  //   return `${address?.name}, ${address?.line1}, ${address?.city}, ${address?.state}, ${address?.postal_code}, ${address?.country}`
  // }

  // const paymentString = () => {
  //   const card = order.paymentSummary;

  //   return `${card?.brand?.toUpperCase()}, Ending in ${card?.last4}, Expires ${card?.exp_month}/${card?.exp_year}`;
  // }

  return (
    <Container maxWidth='md'>
      <>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Thank you for your (demo) order!
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Your order <strong>#{order.id}</strong> has been successfully processed (not really).
        </Typography>
        <Paper elevation={1} sx={{p: 2, mb: 2, display: 'flex', flexDirection: 'column', gap: 1.5}}>
          <Box display='flex' justifyContent='space-between'>
            <Typography variant="body2" color="textSecondary">
              Order date
            </Typography>
            <Typography variant="body2" fontWeight='bold'>
              {order.orderDate}
            </Typography>
          </Box>
          <Divider/>
          <Box display='flex' justifyContent='space-between'>
            <Typography variant="body2" color="textSecondary">
              Payment method
            </Typography>
            <Typography variant="body2" fontWeight='bold'>
              {formatPaymentString(order.paymentSummary)}
            </Typography>
          </Box>
          <Divider/>
          <Box display='flex' justifyContent='space-between'>
            <Typography variant="body2" color="textSecondary">
              Shipping Address
            </Typography>
            <Typography variant="body2" fontWeight='bold'>
              {formatAddressString(order.shippingAddress)}
            </Typography>
          </Box>
          <Divider/>
          <Box display='flex' justifyContent='space-between'>
            <Typography variant="body2" color="textSecondary">
              Amount
            </Typography>
            <Typography variant="body2" fontWeight='bold'>
              {currencyFormat(order.total)}
            </Typography>
          </Box>
        </Paper>
        <Box display='flex' justifyContent='flex-start' gap={2}>
          <Button variant="contained" color="primary" component={Link} to={`/orders/${order.id}`}>
            View Order
          </Button>
          <Button variant="outlined" color="primary" component={Link} to={`/products/`}>
            Back to Shop
          </Button>
        </Box>
      </>
    </Container>
  )
}