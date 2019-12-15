import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <div className="header">
            <h2>OpenAir</h2>
            <div className="navbar">
                <Link to="/">Home</Link>
                <Link to="/features">Devices</Link>
            </div>
        </div>
    );
};

export default Header;
