import { Box, Button, Container, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from '@mui/material';
import React from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Navbar from '../components/Navbar';

const Register: React.FC = () => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

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
                minHeight: 'calc(100vh - 100px)',
                mt: 12,
            }}
        >
            <Navbar />
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                style={{ minHeight: '100vh' }}
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
                        />
                    </Box>
                    <Box>
                        <TextField
                            variant="outlined"
                            required
                            id="filled-required-last-name"
                            label="Last Name"
                        />
                    </Box>
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
                    <Box>
                        <FormControl sx={{ m: 1, width: { xs: '100%', sm: '50ch' } }} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-confirm-password">Confirm Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-confirm-password"
                                type={showConfirmPassword ? 'text' : 'password'}
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
        </Container>
    );
}

export default Register;