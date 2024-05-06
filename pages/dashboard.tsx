import { Box, Button, FormControl, InputLabel, OutlinedInput, TextField } from '@mui/material';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard: React.FC = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [deposit, setDeposit] = useState(0);
    const [withdraw, setWithdraw] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login';
        }
    }, []);

    const handleUpdateAccountDetails = async (event: React.FormEvent) => {
        event.preventDefault();
        const token = localStorage.getItem('token');
        await axios.post('/updateAccountDetails', { first_name: firstName, last_name: lastName, account_number: accountNumber }, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    };

    const handleDeposit = async (event: React.FormEvent) => {
        event.preventDefault();
        const token = localStorage.getItem('token');
        await axios.post('/deposit', { deposit }, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    };

    const handleWithdraw = async (event: React.FormEvent) => {
        event.preventDefault();
        const token = localStorage.getItem('token');
        await axios.post('/withdraw', { withdraw }, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    };

    return (
        <Box
            component="form"
            onSubmit={handleUpdateAccountDetails}
            sx={{
                '& .MuiTextField-root': {
                    m: 1,
                    width: { xs: '100%', sm: '50ch' } // 90% width on small screens, 50ch on larger screens
                },
            }}
            noValidate
            autoComplete="off"
        >
            <h1>Dashboard</h1>
            <Button type="submit">Update Account Details</Button>
            <TextField
                variant="outlined"
                required
                id="filled-required-first-name"
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
                variant="outlined"
                required
                id="filled-required-last-name"
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
            />
            <TextField
                variant="outlined"
                required
                id="filled-required-account-number"
                label="Account Number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
            />

            <TextField
                variant="outlined"
                required
                id="filled-required-deposit"
                label="Deposit"
                value={deposit}
                onChange={(e) => setDeposit(Number(e.target.value))}
            />
            <Button type="submit" onClick={handleDeposit}>Deposit</Button>
            <TextField
                variant="outlined"
                required
                id="filled-required-withdraw"
                label="Withdraw"
                value={withdraw}
                onChange={(e) => setWithdraw(Number(e.target.value))}
            />
            <Button type="submit" onClick={handleWithdraw}>Withdraw</Button>
        </Box>
    );
}

export default Dashboard;



