import { Box, Button, Container, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';

const Login: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [phone_number, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:3002/login', {
                phone_number: phone_number,
                password: password,
            });
            console.log(response);
            // Save the returned token for future authenticated requests
            localStorage.setItem('token', response.data.accessToken);
            router.push('/dashboard');
        } catch (error) {
            console.error(error);
            // Handle login error
        }
    };


    return (
        <Container
            maxWidth="xl"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                height: '100vh',
                mt: { xs: 0, sm: 12 },
            }}
        >
            <Navbar />
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                style={{ minHeight: '100%' }}
            >
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }} >
                    Login
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleLogin}
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: { xs: '100%', sm: '50ch' } },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <Box>
                        <TextField
                            variant="outlined"
                            required
                            id="filled-required-phone-number"
                            label="Phone Number"
                            type="tel"
                            value={phone_number}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </Box>
                    <Box>
                        <FormControl sx={{ m: 1, width: { xs: '100%', sm: '50ch' } }} required variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                            />
                        </FormControl>

                    </Box>
                    <Box sx={{ ml: 1 }}>
                        <Link href="/register" style={{ textDecoration: 'none', color: 'black', fontFamily: 'Helvetica' }}>Don't have an account? click here</Link>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                        <Button variant="contained" color="primary" type="submit" sx={{ padding: { xs: '6px 16px', sm: '9px 22px' } }}>
                            Sign In
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}

export default Login;