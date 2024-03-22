import { Component } from 'react';
import '../../App.css';
import settings from '../../Settings.json';
import useLoginFetch from '../../hooks/useLoginFetch';

class ForgotUsername extends Component {
    constructor(props) {
        super(props);

        this.state = {
            SetActivePage: props.setActivePage,
            FormMessage: ""
        };
    }

    ValidateForm = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const formProps = Object.fromEntries(formData);

        if (!formProps["email"] || formProps["email"].trim() === "") {
            this.setState({FormMessage: "missingFields"});
            return;
        }

        this.SubmitForm(formProps);
    }

    SubmitForm = (formProps) => {
        const url = settings.urls.user.forgotUsername;

        useLoginFetch(url, formProps, "There was a problem sending the email.", this.state.SetActivePage);
    }

    render() {
        return (
            <form className="column" onSubmit={this.ValidateForm}>
                <h3>Forgot User Name:</h3>
                
                <div className={'row' + (this.state.FormMessage === "" ? " hidden" : " visible redWarning")}>
                    Please fill in the email address.
                </div>

                <div className='row'>
                    <div className='leftColumn'><label htmlFor="email" >Email Address*:</label></div>
                    <div className='rightColumn'><input type="text" id="email" name="email" required /></div>
                </div>
                <br />

                <button type="submit">Send User Name</button>
                <br />
                <button type="button" className="hyperlink" onClick={() => this.state.SetActivePage("Login")}>Go to Login page</button>
            </form>
        );
    }
}

export default ForgotUsername;
