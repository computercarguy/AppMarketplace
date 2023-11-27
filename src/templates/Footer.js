import React, { Component } from "react";

class Footer extends Component {
    render() {
        return (
            <div className="center">
                <small>&copy; Copyright @{new Date().getFullYear()}, Eric's Gear, All Rights Reserved.</small> 
            </div>
        );
    };
}

export default Footer;