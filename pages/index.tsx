import { Box } from '@mui/system';
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home: React.FC = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Box sx={{ flexGrow: 1 }}>
                {/* Your main content goes here */}
            </Box>
            <Footer />
        </Box>
    );
}

export default Home;