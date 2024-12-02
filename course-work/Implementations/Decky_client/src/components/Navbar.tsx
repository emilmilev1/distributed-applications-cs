import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Button, Box } from "@mui/material";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
    const { token, setToken, logout, user } = useContext(AuthContext);

    return (
        <AppBar position="static">
            <Toolbar>
                <Box sx={{ flexGrow: 1 }}>
                    <Button color="inherit" component={Link} to="/">
                        Home
                    </Button>
                    {token && (
                        <Button
                            color="inherit"
                            component={Link}
                            to="/dashboard"
                        >
                            Dashboard
                        </Button>
                    )}
                    {token && (
                        <Button color="inherit" component={Link} to="/decks">
                            Decks
                        </Button>
                    )}
                    {token && (
                        <Button color="inherit" component={Link} to="/admin">
                            Admin
                        </Button>
                    )}
                </Box>
                {!token ? (
                    <>
                        <Button color="inherit" component={Link} to="/login">
                            Login
                        </Button>
                        <Button color="inherit" component={Link} to="/register">
                            Register
                        </Button>
                    </>
                ) : (
                    <Button color="inherit" onClick={logout}>
                        Logout
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
