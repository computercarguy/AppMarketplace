import '../../App.css';
import React, { Component, Fragment } from "react";

import StripeAccount from '../StripeAccount';
import PurchaseCredits from '../PurchaseCredits';
import CreateAccount from '../CreateAccount';
import CreditsAvailable from '../CreditsAvailable';
import ResetPassword from '../ResetPassword';
import useValidateLogin from '../../hooks/useValidateLogin';
import UtilitiesPage from '../UtilitiesPage';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            accountPage: "Utilities",
            SetActivePage: props.setActivePage,
            user: null
        };
    }

    SetAccountPage = (title) => {
        if (title.toLowerCase() !== "logout") {
            this.setState({ accountPage: title });
        }
        else {
           this.Logout();
        }
    }

    SetUser = (json) => {
        if (json) {
            this.setState({user: json.message});
        }
        else {
            this.Logout();
        }
    }

    Logout = () => {
        sessionStorage.setItem('token', null);
        this.state.SetActivePage("Login");
    }

    ValidateUser = () => {
        const token = sessionStorage.getItem('token');

        if (!this.state.user && token !== "") {
            useValidateLogin(token, this.SetUser);
        }
    }

    LoginOrUser = () => {
        if (this.state.user) {
            return <Fragment>
                <div class="dropdown">
                    <button class="dropbtn">{this.state.user.Username} &#9660;</button>
                    <div class="dropdown-content">
                    <button type="button" className="hyperlink" onClick={() => this.SetAccountPage("AccountPage")}>Account</button>
                    <br/>
                    <button type="button" class="hyperlink" onClick={this.Logout}>Logout</button>
                    </div>
                </div> 
            </Fragment>;
        }
        else {
            return <button type="button" className="hyperlink" onClick={this.Logout} >Login</button>;
        }
    }

    componentDidMount() {
        this.ValidateUser();
    }

    render () {
        let content;
        switch (this.state.accountPage) {
            case "Utilities" :
                content = <UtilitiesPage/>;
                break;
            case "StripeAccount" :
                content = <StripeAccount/>;
                break;
             case "PurchaseCredits" :
                content = <PurchaseCredits/>;
                break;
            case "AccountPage" :
                content = <CreateAccount pageType="1" setActivePage={this.SetAccountPage} logout={this.Logout}/>;
                break;
            case "ResetPassword" :
                content = <ResetPassword pageType="1" setActivePage={this.SetAccountPage}/>;
                break;
            case "CreditsAvailable" : 
            default:
                content = <CreditsAvailable/>;
                break;
        }

        return (
            <div className="center column">
                <div className='row'>
                    <div><button type="button" className="hyperlink" onClick={() => this.SetAccountPage("Utilities")}>Utilities</button></div>
                    <div className='spacer' />
                    <div><button type="button" className="hyperlink" onClick={() => this.SetAccountPage("CreditsAvailable")}>Credits Available</button></div>
                    <div className='spacer' />
                    <div><button type="button" className="hyperlink" onClick={() => this.SetAccountPage("PurchaseCredits")}>Purchase Credits</button></div>
                    <div className='spacer' />
                    <div>{this.LoginOrUser()}</div>
                </div>
                {content}
            </div>
        );
    }
}

export default App;
