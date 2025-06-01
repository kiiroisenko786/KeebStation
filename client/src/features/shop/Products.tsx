import ProductList from "./ProductList";
import { useFetchProductsQuery } from "./productApi";

export default function Products() {
  const {data, isLoading} = useFetchProductsQuery();

  if (isLoading || !data) return <div>Loading...</div>

  return (
    <>
      <ProductList products={data} />
    </>
  )
}


/* useEffect is a hook that runs after the component renders
have to give it an array of dependencies, if empty, it will only run once after the first render
when the dependencies change, then the useeffect will run again to sycnhronise with the new state
JS fetch returns a promise, so we can use .then to get the response
set the products state to the data returned from the API */
// This hasn't been needed since we started using RTK Query but is left here for reference