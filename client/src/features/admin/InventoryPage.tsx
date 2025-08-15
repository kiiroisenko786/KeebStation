import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/store"
import { useFetchProductsQuery } from "../shop/productApi";
import { currencyFormat } from "../../lib/Util";
import { Delete, Edit } from "@mui/icons-material";
import AppPagination from "../../app/shared/components/AppPagination";
import { setPageNumber } from "../shop/productSlice";
import { useState } from "react";
import ProductForm from "./ProductForm";

export default function InventoryPage() {
  const productParams = useAppSelector(state => state.product);
  const {data} = useFetchProductsQuery(productParams);
  const dispatch = useAppDispatch();
  const [editMode, setEditMode] = useState(false);

  if (editMode) return <ProductForm/>


  return (
    <>
      <Box display={"flex"} justifyContent={"space-between"}>
        <Typography sx={{p: 2}} variant="h4">Inventory</Typography>
        <Button onClick={() => setEditMode(true)} sx={{m: 2}} size="large" variant="contained">Create</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{minWidth: 650}}>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell align="left">Product</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="center">Type</TableCell>
              <TableCell align="center">Brand</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data && data.items.map(product => (
              <TableRow key={product.id} sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                <TableCell component={"th"} scope="row">{product.id}</TableCell>
                <TableCell align="left">
                  <Box display={"flex"} alignItems={"center"}>
                    <img src={product.imageUrl} alt={product.name} style={{height: 50, marginRight: 20}}/>
                    <span>{product.name}</span>
                  </Box>
                </TableCell>
                <TableCell align="right">{currencyFormat(product.price)}</TableCell>
                <TableCell align="center">{product.type}</TableCell>
                <TableCell align="center">{product.brand}</TableCell>
                <TableCell align="center">{product.quantityInStock}</TableCell>
                <TableCell align="right">
                  <Button startIcon={<Edit/>}/>
                  <Button startIcon={<Delete/>} color="error"/>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Box>
          {data?.pagination && data.items.length > 0 && (
            <AppPagination metadata={data.pagination} onPageChange={(page) => dispatch(setPageNumber(page))}/>
          )}
        </Box>
      </TableContainer>
    </>
  )
}