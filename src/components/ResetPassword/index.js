import React, { Component } from 'react';
import '../../App.css';
import settings from '../../Settings.json';

class ResetPassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            SetActivePage: props.setActivePage,
            email: props.email,
            guid: props.guid,
            PasswordsMatch: true,
            FormMessage: ""
        };
    }

    CheckPasswords = () => {
        const password = document.getElementById("password").value;
        const password2 = document.getElementById("password2").value;

        this.setState({PasswordsMatch: password === password2});
    }

    PasswordOrGuid = () => {
        if (this.state.guid && this.state.guid.trim() !== "") {
            return <div className='row hidden'>
                <input name="guid" value={this.state.guid} readOnly/>
                <input name="email" value={this.state.email} readOnly/>
            </div>;
        }
        else {
            return <div className='row'>
                <div className='leftColumn'><label htmlFor="current" >Current Password:</label></div>
                <div className='rightColumn'><input type="text" id="current" name="current" /></div>
            </div>;
        }
    }

    ValidateForm = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const formProps = Object.fromEntries(formData);

        if (formProps["password"] !== formProps["password2"]) {
            this.setState({PasswordsMatch: false});
            return;
        }

        if (formProps["password"] === "") {
            this.setState({FormMessage: "missingFields"});
            return;
        }

        this.SubmitForm(formProps);
    }

    SubmitForm = (formProps) => {
        const url = settings.apiUrl + (this.state.guid && this.state.guid.trim() !== "" ? settings.urls.user.doPasswordReset : settings.urls.user.updatePassword);
        const me = this;
        const token = sessionStorage.getItem('token');

        fetch(url, { 
            method: 'post', 
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': token
            }),
            body: new URLSearchParams(formProps)
        }).then(function(res) {
            return res.json();
        })
        .then(function(resJson) {
            if (resJson.message !== "") {
                const accountPage = (me.state.guid && me.state.guid.trim() !== "") ? "Login" : "AccountPage";
                me.state.SetActivePage(accountPage);
            }
            else {
                alert("There was a problem resetting your password.")
            }
        })
        .catch(error => {
            alert("There was a problem resetting your password.")
        });
    }

    render() {
        return (
            <form className="column" onSubmit={this.ValidateForm}>
                <h3>Reset Password:</h3>
                
                <div className={'row' + (this.state.FormMessage === "" ? " hidden" : " visible redWarning")}>
                    Please fill in the password fields.
                </div>

                {this.PasswordOrGuid()}

                <div className='row'>
                    <div className='leftColumn'><label htmlFor="password" >Password*:</label></div>
                    <div className='rightColumn'><input type="password" onKeyUp={this.CheckPasswords} id="password" name="password" required /></div>
                </div>

                <div className='row'>
                    <div className='leftColumn'><label htmlFor="password2" >Re-type Password*:</label></div>
                    <div className='rightColumn'><input type="password" onKeyUp={this.CheckPasswords} id="password2" name="password2" required /></div>
                </div>

                <div className={'row' + (!this.state.PasswordsMatch ? " visible redWarning" : " hidden")}>
                    Passwords must match!
                </div>

                <br />
                <button type="submit">Reset Password</button>
                <br />
                <button type="button" className="hyperlink" onClick={() => this.state.SetActivePage("Login")}>Go to Login page</button>
            </form>
        );
    }
}

export default ResetPassword;
