import React from 'react';
import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';

const MainLayout = ({ children }) => {
    return (
        <div className="layout-container">
            <Navbar />
            <main className="main-content" style={{ paddingBottom: '80px' }}>
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
