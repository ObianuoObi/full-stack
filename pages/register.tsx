import { Box, Button, Container, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Navbar from '../components/Navbar';
import axios from 'axios';

const Register: React.FC = () => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:3002/register', {
                first_name: firstName,
                last_name: lastName,
                phone_number: phoneNumber,
                password: password,
                confirm_password: confirmPassword,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            // Handle successful registration
            if (response.status === 201) {
                // Redirect to login page
                window.location.href = '/login';
            }
        } catch (error) {
            console.error(error);
            // Handle registration error
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
                mt: { xs: 0, sm: 12 }, // Remove top margin on extra-small screens
                overflow: 'hidden',
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
                <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }} // smaller font size on small screens
                >
                    Create Account
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleRegister}
                    sx={{
                        '& .MuiTextField-root': {
                            m: 1,
                            width: { xs: '100%', sm: '50ch' } // 90% width on small screens, 50ch on larger screens
                        },
                    }}

                    noValidate
                    autoComplete="off"
                >
                    <Box>
                        <TextField
                            variant="outlined"
                            required
                            id="filled-required-first-name"
                            label="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </Box>
                    <Box>
                        <TextField
                            variant="outlined"
                            required
                            id="filled-required-last-name"
                            label="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </Box>
                    <Box>
                        <TextField
                            variant="outlined"
                            required
                            id="filled-required-phone-number"
                            label="Phone Number"
                            type="tel"
                            value={phoneNumber}
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
                    <Box>
                        <FormControl sx={{ m: 1, width: { xs: '100%', sm: '50ch' } }} required variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-confirm-password">Confirm Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-confirm-password"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowConfirmPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Confirm Password"
                            />
                        </FormControl>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            sx={{ padding: { xs: '6px 16px', sm: '9px 22px' } }} // smaller padding on small screens
                        >
                            Register
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Container >
    );
}

export default Register;