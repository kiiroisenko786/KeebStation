import { Box, Button, Checkbox, FormControlLabel, Paper, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { AddressElement, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react"
import Review from "./Review";
import { useFetchAddressQuery, useUpdateAddressMutation } from "../account/accountApi";
import type { Address } from "../../app/models/user";
import type { ConfirmationToken, StripeAddressElementChangeEvent, StripePaymentElementChangeEvent } from "@stripe/stripe-js";
import { useBasket } from "../../lib/hooks/useBasket";
import { currencyFormat } from "../../lib/Util";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { useCreateOrderMutation } from "../orders/orderApi";

const steps = ['Address', 'Payment', 'Review'];

export default function CheckoutStepper() {
  const [activeStep, setActiveStep] = useState(0);
  // Get name, and spread the rest of the address data so it's separate
  // If data is undefined, provide a default empty object to avoid errors
  // Also make sure this isn't loading before returning the stripe element or it won't fill the address
  const {data: {name, ...restAddress} = {} as Address, isLoading} = useFetchAddressQuery();
  const [createOrder] = useCreateOrderMutation();
  const {basket, clearBasket} = useBasket();
  const [updateAddress] = useUpdateAddressMutation();
  const [saveAddressChecked, setSaveAddressChecked] = useState(false);
  const elements = useElements();
  const stripe = useStripe();
  const [addressComplete, setAddressComplete] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const {total} = useBasket();
  const navigate = useNavigate();
  const [confirmationToken, setConfirmationToken] = useState<ConfirmationToken | null>(null);
  
  const handleNext = async () => {
    // If on the first step, update the address if the checkbox is checked
    if (activeStep === 0 && saveAddressChecked && elements) {
      const address = await getStripeAddress();
      if (address) await updateAddress(address);
    }
    if (activeStep === 1) {
      if (!elements || !stripe) return;
      const result = await elements.submit();
      if (result.error) return toast.error(result.error.message);

      const stripeResult = await stripe.createConfirmationToken({elements});
      if (stripeResult.error) return toast.error(stripeResult.error.message);
      setConfirmationToken(stripeResult.confirmationToken);
    }
    if (activeStep === 2) {
      await confirmPayment();
    }
    if (activeStep < 2) setActiveStep(step => step + 1);
  }

  const confirmPayment = async () => {
    setSubmitting(true);
    try {
      // Defensive check to ensure we have a confirmation token
      if (!confirmationToken || !basket?.clientSecret) throw new Error("Unable to confirm payment");

      const orderModel = await createOrderModel();
      const orderResult = await createOrder(orderModel);
      
      const paymentResult = await stripe?.confirmPayment({
        clientSecret: basket.clientSecret,
        redirect: 'if_required',
        confirmParams: {
          confirmation_token: confirmationToken.id
        }
      });

      if (paymentResult?.paymentIntent?.status === 'succeeded') {
        navigate('/checkout/success', {state: orderResult});
        clearBasket();
      } else if (paymentResult?.error) {
        throw new Error(paymentResult.error.message);
      } else {
        throw new Error("Payment confirmation failed");
      }
    } catch (error) {
      // Because error will be of type unknown, we need to check if it's an instance of Error
      if (error instanceof Error) {
        toast.error(error.message);
      }
      // Move back a step if payment confirmation fails
      setActiveStep(step => step - 1);
    } finally {
      setSubmitting(false);
    }
  }

  const createOrderModel = async () => {
    const shippingAddress = await getStripeAddress();
    const paymentSummary = confirmationToken?.payment_method_preview.card;

    if (!shippingAddress || !paymentSummary) throw new Error("Problem creating order");

    return {shippingAddress, paymentSummary};
  }

  const getStripeAddress = async () => {
    const addressElement = elements?.getElement('address');
    if (!addressElement) return null;
    const {value: {name, address}} = await addressElement.getValue();

    if (name && address) return {...address, name};

    return null;
  }

  const handleBack = () => {
    setActiveStep(step => step - 1);
  }

  const handleAddressChange = (event: StripeAddressElementChangeEvent) => {
    setAddressComplete(event.complete);
  }
  const handlePaymentChange = (event: StripePaymentElementChangeEvent) => {
    setPaymentComplete(event.complete);
  }

  if (isLoading) return <Typography variant="h6">Loading checkout ...</Typography>

  return (
    <Paper sx={{ p: 3, borderRadius: 3}}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          return (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          )
    })}
      </Stepper>
      <Box sx={{mt: 2}}>
        <Box sx={{display: activeStep === 0 ? 'block' : 'none'}}>
          <AddressElement options={{
            mode: 'shipping',
            defaultValues: {
              name: name,
              address: restAddress
            }
          }}
          onChange={handleAddressChange}/>
          <FormControlLabel sx={{display: 'flex', justifyContent: 'end'}}
          control={<Checkbox
            checked={saveAddressChecked}
            onChange={e => setSaveAddressChecked(e.target.checked)}
          />} label='Save as default address'/>
        </Box>
        <Box sx={{display: activeStep === 1 ? 'block' : 'none'}}>
          <PaymentElement onChange={handlePaymentChange} options={{
            wallets: {
              applePay: 'never',
              googlePay: 'never'
            }
          }}/>
        </Box>
        <Box sx={{display: activeStep === 2 ? 'block' : 'none'}}>
          <Review confirmationToken={confirmationToken}/>
        </Box>
      </Box>

      <Box display='flex' paddingTop={2} justifyContent='space-between'>
        <Button onClick={handleBack}>Back</Button>
        <LoadingButton onClick={handleNext} disabled={
          (activeStep === 0 && !addressComplete) ||
          (activeStep === 1 && !paymentComplete) ||
          submitting
        } loading={submitting}>
          {activeStep === steps.length - 1 ? `Pay ${currencyFormat(total)}` : 'Next'}
        </LoadingButton>
      </Box>
    </Paper>
  )
}
