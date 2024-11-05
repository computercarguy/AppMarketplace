import React, { Component } from "react";

export default class Footer extends Component {
    render() {
        return (
            <div className="center">
                <small>
                    &copy; Copyright @{new Date().getFullYear()}, Eric's Gear,
                    All Rights Reserved.
                </small>
                <br />
                <a href="mailto:sales@ericsgear.com?subject=App Marketplace">
                    sales@ericsgear.com
                </a>
            </div>
        );
    }
}
