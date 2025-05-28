import { Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import type { Product } from "../../app/models/product";
import { Link } from "react-router-dom";

type Props = {
  product: Product;
}

export default function ProductCard({product}: Props) {
  return (
    <Card elevation={3} sx={{width: 280, borderRadius: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
      <Link to={`/products/${product.id}`}>
        <CardMedia sx={{height: 240, backgroundSize: 'cover'}} image={product.imageUrl} title={product.name}/>
      </Link>
      <CardContent>
        <Typography gutterBottom variant="subtitle2" sx={{textTransform: 'uppercase'}}>
          {product.name}
        </Typography>
        <Typography variant="h6" sx={{color: 'secondary.main'}}>
          £{(product.price / 100).toFixed(2)}
        </Typography>
      </CardContent>
      <CardActions sx={{justifyContent: 'space-between'}}>
        <Button>Add to cart</Button>
        <Button component={Link} to={`/products/${product.id}`}>View details</Button>
      </CardActions>
    </Card>
  )
}