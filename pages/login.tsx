import { Box, Button, Container, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from '@mui/material';
import React from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Navbar from '../components/Navbar';

const Login: React.FC = () => {

    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    return (
        <Container
            maxWidth="xl"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                height: '100vh', // Set height to '100vh'
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
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }} >
                    Login
                </Typography>
                <Box
                    component="form"
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
                            id="filled-required-email"
                            label="Email"
                            type="email"
                        />
                    </Box>
                    <Box>
                        <FormControl sx={{ m: 1, width: { xs: '100%', sm: '50ch' } }} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type={showPassword ? 'text' : 'password'}
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