import { Button, TextField } from '@mui/material';
import React from 'react';

const Login: React.FC = () => {
    return (
        <div>
            <h1>Login</h1>
            <form>
                <TextField label="Username" variant="outlined" />
                <TextField label="Password" type="password" variant="outlined" />
                <Button variant="contained" color="primary">
                    Login
                </Button>
            </form>
        </div>
    );
}

export default Login;