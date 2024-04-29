import { Button, TextField } from '@mui/material';
import React from 'react';

const Register: React.FC = () => {
    return (
        <div>
            <h1>Register</h1>
            <form>
                <TextField label="Username" variant="outlined" />
                <TextField label="Email" variant="outlined" />
                <TextField label="Password" type="password" variant="outlined" />
                <Button variant="contained" color="primary">
                    Register
                </Button>
            </form>
        </div>
    );
}

export default Register;