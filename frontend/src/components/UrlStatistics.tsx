import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { urlApi, UrlStats } from "../services/api.service";
import { Logger, FrontendPackage } from "../utils/logger";

const UrlStatistics: React.FC = () => {
  const [stats, setStats] = useState<UrlStats[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all URL statistics on component mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        Logger.info(FrontendPackage.COMPONENT, "Fetching URL statistics");
        const urlStats = await urlApi.getAllUrlStats();
        setStats(urlStats);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch URL statistics";
        Logger.error(FrontendPackage.COMPONENT, errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Calculate total clicks across all URLs
  const totalClicks = stats.reduce((total, url) => total + url.clicks, 0);

  // Open URL in new tab
  const openUrl = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        URL Statistics
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : stats.length === 0 ? (
        <Alert severity="info">
          No shortened URLs found. Create some first!
        </Alert>
      ) : (
        <>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Summary
            </Typography>
            <Typography variant="body1">
              Total URLs: <strong>{stats.length}</strong>
            </Typography>
            <Typography variant="body1">
              Total Clicks: <strong>{totalClicks}</strong>
            </Typography>
          </Box>

          <Typography variant="h6" gutterBottom>
            URL Details
          </Typography>

          {stats.map((url, index) => (
            <Accordion key={index} sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{ width: "60%", flexShrink: 0 }}>
                    {url.shortCode} ({url.clicks} clicks)
                  </Typography>
                  <Chip
                    label={url.isExpired ? "Expired" : "Active"}
                    color={url.isExpired ? "error" : "success"}
                    size="small"
                    sx={{ mr: 2 }}
                  />
                </Box>
              </AccordionSummary>

              <AccordionDetails>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1">
                    Short URL: {url.shortUrl}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="subtitle1" sx={{ mr: 1 }}>
                      Original URL: {url.originalUrl}
                    </Typography>
                    <Button
                      size="small"
                      startIcon={<OpenInNewIcon />}
                      onClick={() => openUrl(url.originalUrl)}
                    >
                      Open
                    </Button>
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2">
                    Created: {formatDate(url.createdAt)}
                  </Typography>
                  <Typography variant="subtitle2">
                    Expires: {formatDate(url.expiresAt)}
                  </Typography>
                  <Typography variant="subtitle2">
                    Custom Code: {url.isCustom ? "Yes" : "No"}
                  </Typography>
                </Box>

                {url.clicks > 0 && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Click History
                    </Typography>
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Time</TableCell>
                            <TableCell>Referrer</TableCell>
                            <TableCell>Country</TableCell>
                            <TableCell>City</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {url.clickEvents.map((event, eventIndex) => (
                            <TableRow key={eventIndex}>
                              <TableCell>
                                {formatDate(event.timestamp)}
                              </TableCell>
                              <TableCell>{event.referrer}</TableCell>
                              <TableCell>
                                {event.geoInfo?.country || "Unknown"}
                              </TableCell>
                              <TableCell>
                                {event.geoInfo?.city || "Unknown"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}
              </AccordionDetails>
            </Accordion>
          ))}
        </>
      )}
    </Paper>
  );
};

export default UrlStatistics;
