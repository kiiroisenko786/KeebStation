import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <Box maxWidth={"xl"} mx="auto" p={4} position={"relative"}>
      <Box display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"} position={"relative"}>
        <img src="/images/keyboard_background.jpg" alt="Keyboard Background" 
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "16px",
          zIndex: 0
        }}/>
        <Box display={"flex"} flexDirection={"column"} p={8} alignItems={"center"} position={"relative"} borderRadius={4}>
          <Typography variant="h1" color="white" fontWeight={"bold"} textAlign={"center"} sx={{my: 3}}>
            Welcome to KeebStation!
          </Typography>
          <Button variant="contained" size="large" component={Link} to="/products" sx={{mt: 8, backgroundImage: "linear-gradient(to right, #2563eb, #06b6d4)", fontWeight: "bold", color: "white", borderRadius: "16px", px: 8, py: 2, border: "2px solid transparent"}}>
            Explore Products
          </Button>
        </Box>
      </Box>
    </Box>
  )
}