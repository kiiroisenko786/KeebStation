import { useState } from "react"
import { Box, Container, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

function App() {
  // [state that we want to change, function to change it], (initial value)
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
  

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Navbar toggleDarkMode={toggleDarkMode} darkMode={darkMode}/>
      <Box sx={{minHeight: '100vh', background: darkMode ? 'radial-gradient(circle, #1e3aba, #111b27)' : 'radial-gradient(circle, #baecf9, #f0f9ff)', py: 6}}>
        <Container maxWidth="xl" sx={{marginTop: 8}}>
          <Outlet/>
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
