import { debounce, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/store";
import { setSearchTerm } from "./productSlice";
import { useEffect, useState } from "react";

export default function Search() {
  const {searchTerm} = useAppSelector(state => state.product);
  const dispatch = useAppDispatch();
  const [term, setTerm] = useState(searchTerm);

  useEffect(() => {
    setTerm(searchTerm);
  }, [searchTerm]);

  // Debounce the search input to reduce api calls and let the user type without lag
  const debouncedSearch = debounce(event => {
    dispatch(setSearchTerm(event.target.value));
  }, 500)

  return (
    <TextField label="Search products" variant="outlined" fullWidth type="search" value={term} 
    onChange={e => {
      setTerm(e.target.value);
      debouncedSearch(e);
    }}/>
  )
}