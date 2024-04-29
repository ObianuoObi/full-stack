import { Button } from '@mui/material';
import Link from 'next/link';
import React from 'react';
import Navbar from '../components/Navbar';

const Home: React.FC = () => {



    return (
        <div>
            <Navbar />
            <h1>Welcome to Our Bank</h1>
            <p>Please select an option:</p>
            <Link href="/register">
                <Button variant="contained" color="primary">
                    Register
                </Button>
            </Link>
            <Link href="/login">
                <Button variant="contained" color="primary">
                    Login
                </Button>
            </Link>

        </div>
    );
}

export default Home;