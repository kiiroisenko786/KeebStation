import { decrement, increment } from "./counterReducer"
import { Button, ButtonGroup, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/store";

export default function ContactPage() {

  // Data is in curly brackets because we are using a selector to get the data from the state
  const {data} = useAppSelector(state => state.counter);
  const dispatch = useAppDispatch();

  return (
    <>
      <Typography variant="h2">
        Contact Page
      </Typography>
      <Typography variant="body1">
        Data is: {data}
      </Typography>
      <ButtonGroup>
        {/* After using redux toolkit, the dispatch functions no longer have default values, so they have to be supplied */}
        <Button onClick={() => dispatch(decrement(1))} color="error">Decrement</Button>
        <Button onClick={() => dispatch(increment(1))} color="secondary">Increment</Button>
        <Button onClick={() => dispatch(increment(5))} color="primary">Add 5</Button>
      </ButtonGroup>
    </>
  )
}