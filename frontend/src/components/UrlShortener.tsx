import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Paper,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { urlApi, UrlData } from "../services/api.service";
import { Logger, FrontendPackage } from "../utils/logger";
import {
  isValidUrl,
  isValidShortcode,
  isValidValidity,
} from "../utils/validation";

// Form data interface for a single URL
interface UrlFormData {
  url: string;
  validity?: number;
  shortcode?: string;
}

// Error state interface for form validation
interface UrlFormErrors {
  url?: string;
  validity?: string;
  shortcode?: string;
}

// Result interface for when a URL is shortened
interface UrlResult extends UrlFormData, UrlData {}

const UrlShortener: React.FC = () => {
  // State for forms, up to 5 URLs as per requirements
  const [urlForms, setUrlForms] = useState<UrlFormData[]>([{ url: "" }]);
  const [formErrors, setFormErrors] = useState<UrlFormErrors[]>([{}]);
  const [results, setResults] = useState<UrlResult[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Add new URL form (up to 5)
  const addUrlForm = () => {
    Logger.info(FrontendPackage.COMPONENT, "Adding new URL form");
    if (urlForms.length < 5) {
      setUrlForms([...urlForms, { url: "" }]);
      setFormErrors([...formErrors, {}]);
    } else {
      setGlobalError("Maximum of 5 URLs allowed");
    }
  };

  // Remove URL form
  const removeUrlForm = (index: number) => {
    Logger.info(
      FrontendPackage.COMPONENT,
      `Removing URL form at index ${index}`
    );
    const newForms = [...urlForms];
    const newErrors = [...formErrors];
    newForms.splice(index, 1);
    newErrors.splice(index, 1);
    setUrlForms(newForms);
    setFormErrors(newErrors);
  };

  // Update form data for a specific field
  const updateForm = (
    index: number,
    field: keyof UrlFormData,
    value: string | number
  ) => {
    const newForms = [...urlForms];
    const newErrors = [...formErrors];

    // Cast to number for validity field
    if (field === "validity" && typeof value === "string") {
      const numValue = value === "" ? undefined : parseInt(value, 10);
      newForms[index] = { ...newForms[index], [field]: numValue };

      // Validate validity
      if (numValue !== undefined && !isValidValidity(numValue)) {
        newErrors[index] = {
          ...newErrors[index],
          validity: "Validity must be a positive number",
        };
      } else {
        const { validity, ...rest } = newErrors[index];
        newErrors[index] = rest;
      }
    } else {
      newForms[index] = { ...newForms[index], [field]: value };

      // Validate URL
      if (field === "url") {
        if (!value) {
          newErrors[index] = { ...newErrors[index], url: "URL is required" };
        } else if (!isValidUrl(value as string)) {
          newErrors[index] = { ...newErrors[index], url: "Invalid URL format" };
        } else {
          const { url, ...rest } = newErrors[index];
          newErrors[index] = rest;
        }
      }

      // Validate shortcode
      if (field === "shortcode") {
        if (value && !isValidShortcode(value as string)) {
          newErrors[index] = {
            ...newErrors[index],
            shortcode: "Shortcode must be 4-12 alphanumeric characters",
          };
        } else {
          const { shortcode, ...rest } = newErrors[index];
          newErrors[index] = rest;
        }
      }
    }

    setUrlForms(newForms);
    setFormErrors(newErrors);
  };

  // Validate all forms
  const validateForms = (): boolean => {
    const newErrors = [...formErrors];
    let isValid = true;

    urlForms.forEach((form, index) => {
      const errors: UrlFormErrors = {};

      // Validate URL
      if (!form.url) {
        errors.url = "URL is required";
        isValid = false;
      } else if (!isValidUrl(form.url)) {
        errors.url = "Invalid URL format";
        isValid = false;
      }

      // Validate validity if provided
      if (form.validity !== undefined && !isValidValidity(form.validity)) {
        errors.validity = "Validity must be a positive number";
        isValid = false;
      }

      // Validate shortcode if provided
      if (form.shortcode && !isValidShortcode(form.shortcode)) {
        errors.shortcode = "Shortcode must be 4-12 alphanumeric characters";
        isValid = false;
      }

      newErrors[index] = errors;
    });

    setFormErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError(null);

    // Validate all forms
    if (!validateForms()) {
      Logger.warn(FrontendPackage.COMPONENT, "Form validation failed");
      return;
    }

    setIsSubmitting(true);
    Logger.info(FrontendPackage.COMPONENT, "Submitting URL forms");

    try {
      // Process each URL form
      const shortenPromises = urlForms.map((form) =>
        urlApi.createShortUrl(form.url, form.validity, form.shortcode)
      );

      // Wait for all requests to complete
      const responses = await Promise.all(shortenPromises);

      // Create results
      const newResults = responses.map((response, index) => ({
        ...urlForms[index],
        ...response,
      }));

      setResults(newResults);
      Logger.info(
        FrontendPackage.COMPONENT,
        `Successfully created ${newResults.length} short URLs`
      );

      // Save to local storage for history
      const shortCodes = responses.map((res) => res.shortCode);
      const existingCodes = localStorage.getItem("shortUrlHistory");
      const parsedCodes = existingCodes ? JSON.parse(existingCodes) : [];
      const allCodes = Array.from(new Set([...parsedCodes, ...shortCodes]));
      localStorage.setItem("shortUrlHistory", JSON.stringify(allCodes));
    } catch (error) {
      Logger.error(
        FrontendPackage.COMPONENT,
        `Error creating short URLs: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      setGlobalError(
        error instanceof Error ? error.message : "Failed to create short URLs"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Copy short URL to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        Logger.info(FrontendPackage.COMPONENT, "Short URL copied to clipboard");
      },
      (err) => {
        Logger.error(FrontendPackage.COMPONENT, `Could not copy URL: ${err}`);
      }
    );
  };

  // Format expiry date
  const formatExpiryDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        URL Shortener
      </Typography>

      {globalError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {globalError}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        {urlForms.map((form, index) => (
          <Box
            key={index}
            sx={{ mb: 3, p: 2, border: "1px solid #e0e0e0", borderRadius: 1 }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box>
                <TextField
                  fullWidth
                  label="URL to shorten"
                  variant="outlined"
                  value={form.url}
                  onChange={(e) => updateForm(index, "url", e.target.value)}
                  error={!!formErrors[index]?.url}
                  helperText={formErrors[index]?.url}
                  required
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    label="Validity (minutes, optional)"
                    variant="outlined"
                    type="number"
                    value={form.validity || ""}
                    onChange={(e) =>
                      updateForm(index, "validity", e.target.value)
                    }
                    error={!!formErrors[index]?.validity}
                    helperText={
                      formErrors[index]?.validity || "Default: 30 minutes"
                    }
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    label="Custom shortcode (optional)"
                    variant="outlined"
                    value={form.shortcode || ""}
                    onChange={(e) =>
                      updateForm(index, "shortcode", e.target.value)
                    }
                    error={!!formErrors[index]?.shortcode}
                    helperText={
                      formErrors[index]?.shortcode ||
                      "4-12 alphanumeric characters"
                    }
                  />
                </Box>
              </Box>

              {urlForms.length > 1 && (
                <Box sx={{ textAlign: "right" }}>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => removeUrlForm(index)}
                  >
                    Remove
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        ))}

        <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between" }}>
          {urlForms.length < 5 && (
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addUrlForm}
              disabled={isSubmitting}
            >
              Add another URL
            </Button>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting || urlForms.length === 0}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Shorten URLs"
            )}
          </Button>
        </Box>
      </form>

      {results.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Results
          </Typography>

          {results.map((result, index) => (
            <Paper
              key={index}
              elevation={1}
              sx={{ p: 2, mb: 2, backgroundColor: "#f5f5f5" }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Box>
                  <Typography variant="subtitle1" component="div">
                    Original URL: {result.originalUrl}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    variant="subtitle1"
                    component="div"
                    sx={{ flexGrow: 1 }}
                  >
                    Short URL: <strong>{result.shortUrl}</strong>
                  </Typography>

                  <Tooltip title="Copy to clipboard">
                    <IconButton
                      onClick={() => copyToClipboard(result.shortUrl)}
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Expires at: {formatExpiryDate(result.expiresAt)}
                  </Typography>
                </Box>

                {result.isCustom && (
                  <Box>
                    <Typography variant="body2" color="primary">
                      Custom shortcode: {result.shortCode}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default UrlShortener;
