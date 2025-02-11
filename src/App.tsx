import { AppBar, Box, CssBaseline, Toolbar, Typography } from "@mui/material";

import "./App.css";
import { UsersList } from "./components/UsersList";

function App() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Github User Search</Typography>
        </Toolbar>
      </AppBar>

      <UsersList />
    </Box>
  );
}

export default App;
