import { Box, Container, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import Navbar from "./Navbar.tsx";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { useAppSelector } from "../store/store";


function App() {
  // [state that we want to change, function to change it], (initial value)
  // No longer using useState, instead using Redux to manage state but will keep that here for reference
  const {darkMode} = useAppSelector(state => state.ui);
  const palleteType = darkMode ? 'dark' : 'light';

  const theme = createTheme({
    palette: {
      mode: palleteType,
      background: {
        default: (palleteType === 'light') ? '#eaeaea' : '#121212'
      }
    }
  });

  
  /* updating state
  provide previous state to function, spread it into new array that will replace previous state
  In this case, using the function form of the state setter, React automatically passes the current state value (prevState) to that function when it runs the update */
  

  return (
    <ThemeProvider theme={theme}>
      <ScrollRestoration/>
      <CssBaseline/>
      <Navbar/>
      <Box sx={{minHeight: '100vh', background: darkMode ? 'radial-gradient(circle, #1e3aba, #111b27)' : 'radial-gradient(circle, #baecf9, #f0f9ff)', py: 6}}>
        <Container maxWidth="xl" sx={{marginTop: 8}}>
          <Outlet/>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default App
