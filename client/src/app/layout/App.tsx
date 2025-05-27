import { useEffect, useState } from "react"
import type { Product } from "../models/product";
import Catalog from "../../features/catalog/Catalog";
import { Box, Container, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import Navbar from "./navbar";

function App() {
  // [state that we want to change, function to change it], (initial value)
  const [products, setProducts] = useState<Product[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const palleteType = darkMode ? 'dark' : 'light';

  const theme = createTheme({
    palette: {
      mode: palleteType,
      background: {
        default: (palleteType === 'light') ? '#eaeaea' : '#121212'
      }
    }
  });

  function toggleDarkMode() {
    setDarkMode(!darkMode);
  }
  
  /* updating state
  provide previous state to function, spread it into new array that will replace previous state
  In this case, using the function form of the state setter, React automatically passes the current state value (prevState) to that function when it runs the update */
  
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
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Navbar toggleDarkMode={toggleDarkMode} darkMode={darkMode}/>
      <Box sx={{minHeight: '100vh', background: darkMode ? 'radial-gradient(circle, #1e3aba, #111b27)' : 'radial-gradient(circle, #baecf9, #f0f9ff)', py: 6}}>
        <Container maxWidth="xl" sx={{marginTop: 8}}>
          <Catalog products={products}/>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

{/* <Box display='flex' justifyContent='center' gap={3} marginY={3}>
        <Typography variant="h4">KeebStation</Typography>
        <Button variant="contained" onClick={addProduct}>Add Product</Button>
</Box> */}

export default App
