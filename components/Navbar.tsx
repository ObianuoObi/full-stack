import { AppBar, Toolbar, IconButton, Typography, Box, Button, Drawer, List, ListItem, ListItemIcon, ListItemButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import RegisterIcon from '@mui/icons-material/PersonAdd';
import WithdrawIcon from '@mui/icons-material/MoneyOff';
import Link from 'next/link';
import React, { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar: React.FC = () => {

    const navItems = [
        { name: 'Home', icon: <HomeIcon /> },
        { name: 'Login', icon: <LoginIcon /> },
        { name: 'Register', icon: <RegisterIcon /> },
        { name: 'Withdraw', icon: <WithdrawIcon /> },
    ];
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    return (
        <AppBar component="nav">
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
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
                        <Link href={`/${item.name.toLowerCase()}`} key={item.name}>
                            <Button sx={{ color: '#fff' }}>
                                {item.name}
                            </Button>
                        </Link>
                    ))}
                </Box>
                <Drawer
                    anchor="left"
                    open={drawerOpen}
                    onClose={handleDrawerToggle}
                >
                    <List>
                        {navItems.map((item, index) => (
                            <Link href={`/${item.name.toLowerCase()}`} key={item.name} passHref>
                                <ListItem
                                    disableGutters
                                    component="a"
                                    sx={{
                                        textDecoration: 'none',
                                        '&:hover': {
                                            textDecoration: 'none',
                                        },
                                    }}
                                >
                                    <ListItemButton
                                        disableRipple
                                        sx={{
                                            textDecoration: 'none',
                                            '&:hover': {
                                                textDecoration: 'none',
                                            },
                                        }}
                                    >
                                        {drawerOpen && <ListItemIcon>{item.icon}</ListItemIcon>}
                                        <Typography>{item.name}</Typography>
                                    </ListItemButton>
                                </ListItem>
                            </Link>
                        ))}
                    </List>
                </Drawer>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;