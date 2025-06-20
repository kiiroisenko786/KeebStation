import { Grid, Typography } from "@mui/material";
import ProductList from "./ProductList";
import { useFetchFiltersQuery, useFetchProductsQuery } from "./productApi";
import Filters from "./Filters";
import { useAppDispatch, useAppSelector } from "../../app/store/store";
import AppPagination from "../../app/shared/components/AppPagination";
import { setPageNumber } from "./productslice";

export default function Products() {
  const productParams = useAppSelector(state => state.product);
  const {data, isLoading} = useFetchProductsQuery(productParams);
  const {data: filtersData, isLoading: filtersLoading} = useFetchFiltersQuery();
  const dispatch = useAppDispatch();

  if (isLoading || !data || filtersLoading || !filtersData) return <div>Loading...</div>

  return (
    <Grid container spacing={4}>
      <Grid size={3}>
        <Filters filtersData={filtersData}/>
      </Grid>
      <Grid size={9}>
        {data.items && data.items.length > 0 ? (
          <>
            <ProductList products={data.items} />
            <AppPagination metadata={data.pagination} onPageChange={(page: number) => {
              dispatch(setPageNumber(page));
              window.scrollTo({top: 0, behavior: 'smooth'})
            }}/>
          </>
        ) : (
          <Typography variant="h5">
            There are no results for this filter
          </Typography>
        )}
      </Grid>
    </Grid>
  )
}


/* useEffect is a hook that runs after the component renders
have to give it an array of dependencies, if empty, it will only run once after the first render
when the dependencies change, then the useeffect will run again to sycnhronise with the new state
JS fetch returns a promise, so we can use .then to get the response
set the products state to the data returned from the API */