import { Button } from '@mui/material';
import Link from 'next/link';
import React from 'react';

const Dashboard: React.FC = () => {
    return (
        <div>
            <h1>Dashboard</h1>
            <Link href="/withdraw">
                <Button variant="contained" color="primary">
                    Withdraw
                </Button>
            </Link>
        </div>
    );
}

export default Dashboard;