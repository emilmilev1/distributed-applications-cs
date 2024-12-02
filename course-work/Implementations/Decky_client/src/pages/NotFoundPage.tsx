import React from "react";
import { Box, Typography } from "@mui/material";

const NotFoundPage = () => {
    return (
        <Box sx={{ textAlign: "center", padding: 4 }}>
            <Typography variant="h4" color="textPrimary">
                404 - Page Not Found
            </Typography>
            <Typography variant="h6" color="textSecondary">
                Sorry, the page you're looking for does not exist.
            </Typography>
        </Box>
    );
};

export default NotFoundPage;
