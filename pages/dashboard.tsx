import { Box, Button, TextField, Tab, Tabs, Container } from '@mui/material';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DashboardContent: React.FC = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [deposit, setDeposit] = useState(0);
    const [withdraw, setWithdraw] = useState(0);

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
            <Box
                component="div"
            >  <Box>
                    <Box>
                        <Button type="submit" onClick={handleUpdateAccountDetails} sx={{ mt: 2 }}>Update Account Details</Button>
                    </Box>
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
                        id="filled-required-account-number"
                        label="Account Number"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                    />
                </Box>
            </Box>
            <Box>
                <Box>
                    <Button type="submit" onClick={handleDeposit} sx={{ mt: 2 }}>Give Loan</Button>
                </Box>
                <TextField
                    variant="outlined"
                    required
                    id="filled-required-deposit"
                    label="Deposit"
                    value={deposit}
                    onChange={(e) => setDeposit(Number(e.target.value))}
                />
            </Box>


            <Box>
                <Box>
                    <Button type="submit" onClick={handleWithdraw} sx={{ mt: 2 }}>Receive Loan</Button>
                </Box>
                <TextField
                    variant="outlined"
                    required
                    id="filled-required-withdraw"
                    label="Withdraw"
                    value={withdraw}
                    onChange={(e) => setWithdraw(Number(e.target.value))}
                />

            </Box>
        </Container>
    );
}

const ProfileContent: React.FC = () => {
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
            {/* Profile content goes here */}
        </Container>
    );
}

const Dashboard: React.FC = () => {
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login';
        }
    }, []);

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setTabValue(newValue);
    };

    return (
        <>
            <h1>Dashboard</h1>
            <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="Dashboard" />
                <Tab label="Profile" />
            </Tabs>
            {tabValue === 0 && <DashboardContent />}
            {tabValue === 1 && <ProfileContent />}

        </>

    );
}

export default Dashboard;