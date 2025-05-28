import { Box } from "@mui/material";
import type { Product } from "../../app/models/product";
import ProductCard from "./ProductCard";

type Props = {
  products: Product[];
}

export default function ProductList({products}: Props) {
  return (
    <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center'}}>
      {/*products is the array to loop over, item is the iterable, => denotes function to execute on it. in this case, map over products, for each item, display a new product card component of that item*/}
      {products.map(product => (
        <ProductCard key={product.id} product={product}/>
      ))}
    </Box>
  )
}