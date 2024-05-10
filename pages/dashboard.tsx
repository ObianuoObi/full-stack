import { Box, Button, TextField, Tab, Tabs, Container, Avatar } from '@mui/material';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3002'
});

const DashboardContent: React.FC = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [deposit, setDeposit] = useState(0);
    const [withdraw, setWithdraw] = useState(0);


    const handleUpdateAccountDetails = async (event: React.FormEvent) => {
        event.preventDefault();
        const token = localStorage.getItem('token');
        await api.post('/updateAccountDetails', { first_name: firstName, last_name: lastName, account_number: accountNumber }, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    };

    const handleDeposit = async (event: React.FormEvent) => {
        event.preventDefault();
        const token = localStorage.getItem('token');
        await api.post('/deposit', { deposit }, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    };

    const handleWithdraw = async (event: React.FormEvent) => {
        event.preventDefault();
        const token = localStorage.getItem('token');
        await api.post('/withdraw', { withdraw }, {
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

interface ProfileContentProps {
    firstName: string;
    setFirstName: React.Dispatch<React.SetStateAction<string>>;
    lastName: string;
    setLastName: React.Dispatch<React.SetStateAction<string>>;
}

const ProfileContent: React.FC<ProfileContentProps> = ({ firstName, setFirstName, lastName, setLastName }) => {
    const [accountNumber, setAccountNumber] = useState('');

    useEffect(() => {
        const fetchUserDetails = async () => {
            const token = localStorage.getItem('token');
            const response = await api.get('/getUserDetails', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setFirstName(response.data.first_name);
            setLastName(response.data.last_name);
            setAccountNumber(response.data.account_number);
        };
        fetchUserDetails();
    }, []);

    const handleUpdateProfile = async (event: React.FormEvent) => {
        event.preventDefault();
        const token = localStorage.getItem('token');
        await api.post('/updateAccountDetails', { first_name: firstName, last_name: lastName, account_number: accountNumber }, {
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
                mt: { xs: 0, sm: 12 },
                overflow: 'hidden',
            }}
        >
            <form onSubmit={handleUpdateProfile}>
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
                <Button type="submit">Update Profile</Button>
            </form>
        </Container>
    );
}

const Dashboard: React.FC = () => {
    const [tabValue, setTabValue] = useState(0);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

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
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab label="Dashboard" />
                    <Tab label="Profile" />
                </Tabs>
                <Avatar>{`${firstName[0]}${lastName[0]}`}</Avatar>
            </Box>
            {tabValue === 0 && <DashboardContent />}
            {tabValue === 1 && <ProfileContent firstName={firstName} setFirstName={setFirstName} lastName={lastName} setLastName={setLastName} />}
        </>
    );
}

export default Dashboard;




































































































