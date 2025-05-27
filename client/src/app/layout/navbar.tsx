import { DarkMode, LightMode } from "@mui/icons-material";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";

type Props = {
  toggleDarkMode: () => void;
  darkMode: boolean;
}

export default function navbar({toggleDarkMode, darkMode}: Props) {
  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6">KeebStation</Typography>
        <IconButton onClick={toggleDarkMode}>
          {darkMode ? <DarkMode/> : <LightMode sx={{color: 'white'}}/>}
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}