import "../../App.css";
import React, { Component } from "react";
import settings from "../../Settings.json";

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            SetActivePage: props.setActivePage
        };
    }

    TryLogin = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const formProps = Object.fromEntries(formData);
        const url = settings.urls.auth.login;
        const me = this;

        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams(formProps)
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.message) {
                    const token = `${data.message.token_type} ${data.message.access_token}`;
                    sessionStorage.setItem("token", token);
                    me.state.SetActivePage("Account");
                }
            });
    };

    render() {
        return (
            <form className="column" id="loginForm" onSubmit={this.TryLogin}>
                <p>
                    To use some utilities, credits are required.
                    <br /> Please login to purchase, manage, or use credits.
                </p>
                <div className="row">
                    <div className="leftColumn">
                        <label htmlFor="username">User Name:</label>
                    </div>
                    <div className="rightColumn">
                        <input
                            type="text"
                            id="username"
                            name="username"
                            required
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="leftColumn">
                        <label htmlFor="password">Password:</label>
                    </div>
                    <div className="rightColumn">
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                        />
                    </div>
                </div>

                <div className="row center">
                    <div className="leftColumn">
                        <button
                            type="button"
                            className="hyperlink"
                            onClick={() =>
                                this.state.SetActivePage("ForgotUsername")
                            }
                        >
                            Forgot User Name
                        </button>
                    </div>
                    <div className="spacer" />
                    <div className="leftColumn">
                        <button
                            type="button"
                            className="hyperlink"
                            onClick={() =>
                                this.state.SetActivePage("ForgotPassword")
                            }
                        >
                            Forgot Password
                        </button>
                    </div>
                    <div className="spacer" />
                    <div className="rightColumn">
                        <button
                            type="button"
                            className="hyperlink"
                            onClick={() =>
                                this.state.SetActivePage("CreateAccount")
                            }
                        >
                            Create Account
                        </button>
                    </div>
                </div>
                <button type="submit">Login</button>
            </form>
        );
    }
}
