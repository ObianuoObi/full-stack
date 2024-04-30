import { AppBar, Toolbar, IconButton, Typography, Box, Button } from '@mui/material';
import Link from 'next/link';
import React from 'react';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar: React.FC = () => {

    const navItems = ['Home', 'Login', 'Register', 'Withdraw'];

    return (
        <AppBar component="nav">
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"

                    sx={{ mr: 2, display: { sm: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography
                    variant="h6"
                    component="div"
                    sx={{ flexGrow: 1, display: { xs: 'block', sm: 'block' } }}
                >
                    MUI
                </Typography>
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                    {navItems.map((item) => (
                        <Link href={`/${item.toLowerCase()}`} key={item}>
                            <Button sx={{ color: '#fff' }}>
                                {item}
                            </Button>
                        </Link>
                    ))}
                </Box>
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;