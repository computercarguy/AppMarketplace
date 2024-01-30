import React, { Component } from 'react';
import logo from '../images/EricsGearLogo.webp';

class Header extends Component {
    render() {
        return (
            <div className='center'>
                <img src={logo} className="logo" alt="logo" />
                <h2>App Marketplace</h2>
            </div>
        );
    };
}

export default Header;