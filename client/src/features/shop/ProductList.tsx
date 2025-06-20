import { Grid } from "@mui/material";
import type { Product } from "../../app/models/product";
import ProductCard from "./ProductCard";

type Props = {
  products: Product[];
}

export default function ProductList({products}: Props) {
  return (
    <Grid container spacing={3}>
      {/*products is the array to loop over, item is the iterable, => denotes function to execute on it. in this case, map over products, for each item, display a new product card component of that item*/}
      {products.map(product => (
        <Grid size={3} key={product.id} display={"flex"}>
          <ProductCard product={product}/>
        </Grid>
      ))}
    </Grid>
  )
}