import { AppBar, Toolbar, IconButton, Typography, Box, Button, Drawer, List, ListItem, ListItemIcon, ListItemButton } from '@mui/material';
import Link from 'next/link';
import React, { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { Divider } from '@mui/material';

const Navbar: React.FC = () => {

    const navItems = [
        { name: 'Home' },
        { name: 'Login', },
        { name: 'Register', },
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
                    LoanPay
                </Typography>
                <Box sx={{ display: { xs: 'none', sm: 'block', } }}>
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
                            <React.Fragment key={item.name}>
                                <Link href={`/${item.name.toLowerCase()}`} style={{ textDecoration: 'none' }}>
                                    <ListItem disableGutters>
                                        <ListItemButton disableRipple sx={{ py: 0.5 }}> {/* Reduce vertical padding */}
                                            <Typography>{item.name}</Typography>
                                        </ListItemButton>
                                    </ListItem>
                                </Link>
                                {index < navItems.length - 0 && <Divider component="li" />} {/* Add Divider */}
                            </React.Fragment>
                        ))}
                    </List>
                </Drawer>
            </Toolbar>
        </AppBar >
    );
}

export default Navbar;