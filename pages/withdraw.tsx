import { Button, TextField } from '@mui/material';
import React from 'react';

const Withdraw: React.FC = () => {
    return (
        <div>
            <h1>Withdraw</h1>
            <form>
                <TextField label="Amount" variant="outlined" />
                <Button variant="contained" color="primary">
                    Withdraw
                </Button>
            </form>
        </div>
    );
}

export default Withdraw;