import React, { useState } from "react";
import {
  CssBaseline,
  Container,
  ThemeProvider,
  createTheme,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Paper,
  Divider,
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import BarChartIcon from "@mui/icons-material/BarChart";
import UrlShortener from "./components/UrlShortener";
import UrlStatistics from "./components/UrlStatistics";
import { Logger, FrontendPackage } from "./utils/logger";

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

// Page enum
enum Page {
  SHORTENER = "shortener",
  STATISTICS = "statistics",
}

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.SHORTENER);

  // Navigate to a page
  const navigateTo = (page: Page) => {
    Logger.info(FrontendPackage.COMPONENT, `Navigating to ${page} page`);
    setCurrentPage(page);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            URL Shortener App
          </Typography>
          <Button
            color="inherit"
            onClick={() => navigateTo(Page.SHORTENER)}
            startIcon={<LinkIcon />}
            sx={{
              mr: 1,
              backgroundColor:
                currentPage === Page.SHORTENER
                  ? "rgba(255,255,255,0.1)"
                  : "transparent",
            }}
          >
            Shortener
          </Button>
          <Button
            color="inherit"
            onClick={() => navigateTo(Page.STATISTICS)}
            startIcon={<BarChartIcon />}
            sx={{
              backgroundColor:
                currentPage === Page.STATISTICS
                  ? "rgba(255,255,255,0.1)"
                  : "transparent",
            }}
          >
            Statistics
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box>
          {currentPage === Page.SHORTENER ? (
            <UrlShortener />
          ) : (
            <UrlStatistics />
          )}
        </Box>

        <Divider sx={{ my: 4 }} />

        <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
          <Typography variant="body2" color="text.secondary" align="center">
            URL Shortener Application with Analytics &copy;{" "}
            {new Date().getFullYear()}
          </Typography>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default App;
