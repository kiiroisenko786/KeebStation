import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import type { Product } from "../../app/models/product";
import { Button, Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material";

export default function ProductDetails() {
  // Specify that we want to get id from useparams
  const {id} = useParams();
  // Use union type to allow for null
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetch(`https://localhost:5001/api/products/${id}`)
      .then(response => response.json())
      .then(data => setProduct(data))
      .catch(error => console.log(error));
  }, [id])
  
  if (!product) return <div>Loading...</div>

  const productDetails = [
    {label: "Name", value: product.name},
    {label: "Description", value: product.description},
    {label: "Type", value: product.type},
    {label: "Brand", value: product.brand},
    {label: "Quantity in stock", value: product.quantityInStock},

  ]

  return (
    <Grid container spacing={6} maxWidth={"lg"} sx={{mx: "auto"}}>
      <Grid size={6}>
        <img src={product?.imageUrl} alt={product.name} style={{width: '100%'}} />
      </Grid>
      <Grid size={6}>
        <Typography variant="h3">{product.name}</Typography>
        <Divider sx={{mb: 2}}/>
        <Typography variant="h4" color="secondary">£{(product.price / 100).toFixed(2)}</Typography>
        <TableContainer>
          {/* td is table delimiter for each of the table cells */}
          <Table sx={{'& td': {fontSize: '1rem'}}}>
            <TableBody>
              {productDetails.map((detail, index) => (
                <TableRow key={index}>
                  <TableCell sx={{fontWeight: 'bold'}}>{detail.label}</TableCell>
                  <TableCell>{detail.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Grid container spacing={2} marginTop={2}>
          <Grid size={6}>
            <TextField variant="outlined" type="number" label="Quantity in basket" fullWidth defaultValue={1}/>
          </Grid>
          <Grid size={6}>
            <Button color="primary" size="large" variant="contained" fullWidth sx={{height: '55px'}}>Add to basket</Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}