import React from "react";
import { Typography, Box, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Home = () => (
    <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h2" gutterBottom>
            Welcome to Decky
        </Typography>
        <Typography variant="h6" gutterBottom>
            A service for Clash Royale players to generate optimized card decks
            and manage them with ease!
        </Typography>
    </Box>
);

export default Home;
