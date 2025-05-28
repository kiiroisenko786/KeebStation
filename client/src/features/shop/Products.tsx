import { useEffect, useState } from "react";
import type { Product } from "../../app/models/product";
import ProductList from "./ProductList";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);

  /* useEffect is a hook that runs after the component renders
  have to give it an array of dependencies, if empty, it will only run once after the first render
  when the dependencies change, then the useeffect will run again to sycnhronise with the new state
  JS fetch returns a promise, so we can use .then to get the response
  set the products state to the data returned from the API */
  useEffect(() => {
    fetch('https://localhost:5001/api/products')
      .then(response => response.json())
      .then(data => setProducts(data)) 
  }, [])
  
  return (
    <>
      <ProductList products={products} />
    </>
  )
}