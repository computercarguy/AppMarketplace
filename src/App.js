import './App.css';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import CreateAccount from './components/CreateAccount';
import Account from './components/Account';
import React, { Component } from "react";
import ForgotUsername from './components/ForgotUsername';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activePage: "default",
            queryParams: new URLSearchParams(window.location.search)
        };
    }

    SetActivePage = (title) => {
        this.setState({ activePage: title, queryParams: null });
    }

    render () {
        let content;

        if (this.state.queryParams && this.state.queryParams.size > 0){
            let email = this.state.queryParams.get("email");
            let guid = this.state.queryParams.get("guid");

            if (this.state.activePage === "default" && email && email !== "" && guid && guid !== "") {
                content = <ResetPassword setActivePage={this.SetActivePage} redirect="Login" email={email} guid={guid}/>;
            }
        }
        else {
            switch (this.state.activePage) {
                case "ForgotPassword" :
                    content = <ForgotPassword setActivePage={this.SetActivePage}/>;
                    break;
                case "ForgotUsername" :
                    content = <ForgotUsername setActivePage={this.SetActivePage}/>;
                    break;
                case "CreateAccount" :
                    content = <CreateAccount setActivePage={this.SetActivePage} pageType="0"/>;
                    break;
                case "Account" :
                    content = <Account setActivePage={this.SetActivePage}/>;
                    break;
                case "Login" : 
                default:
                    content = <Login setActivePage={this.SetActivePage} />;
                    break;
            }
        }
        
        return (
            <div className="center">
                {content}
            </div>
        );
    }
}

export default App;
