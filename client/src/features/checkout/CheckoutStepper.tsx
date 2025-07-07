import { Box, Button, Checkbox, FormControlLabel, Paper, Step, StepLabel, Stepper } from "@mui/material";
import { AddressElement, PaymentElement } from "@stripe/react-stripe-js";
import { useState } from "react"
import Review from "./Review";
import { useFetchAddressQuery } from "../account/accountApi";
import type { Address } from "../../app/models/user";

const steps = ['Address', 'Payment', 'Review'];

export default function CheckoutStepper() {
  const [activeStep, setActiveStep] = useState(0);
  // Get name, and spread the rest of the address data so it's separate
  // If data is undefined, provide a default empty object to avoid errors
  const {data: {name, ...restAddress} = {} as Address} = useFetchAddressQuery();
  
  const handleNext = () => {
    setActiveStep(step => step + 1);
  }

  const handleBack = () => {
    setActiveStep(step => step - 1);
  }

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
          }}/>
          <FormControlLabel sx={{display: 'flex', justifyContent: 'end'}} control={<Checkbox/>} label='Save as default address'/>
        </Box>
        <Box sx={{display: activeStep === 1 ? 'block' : 'none'}}>
          <PaymentElement/>
        </Box>
        <Box sx={{display: activeStep === 2 ? 'block' : 'none'}}>
          <Review/>
        </Box>
      </Box>

      <Box display='flex' paddingTop={2} justifyContent='space-between'>
        <Button onClick={handleBack}>Back</Button>
        <Button onClick={handleNext}>Next</Button>
      </Box>
    </Paper>
  )
}