import React, { Component, Fragment } from 'react';
import '../../App.css';
import settings from '../../Settings.json';
import useCheckPasswords from '../../hooks/useCheckPasswords';
import PasswordValidation from './PasswordValidation';

const requiredFields = [
    {Name: "firstName", Value:"First Name"}, 
    {Name: "lastName", Value:"Last Name"}, 
    {Name: "username", Value:"User Name"}, 
    {Name: "email", Value:"Email"}, 
    {Name: "address1", Value:"Address 1"}, 
    {Name: "city", Value:"City"}, 
    {Name: "state", Value:"State"}, 
    {Name: "zipcode", Value:"Zip/Postal Code"},
    {Name: "country", Value:"Country"}
];
const token = sessionStorage.getItem('token');
const passwordOptionsDefault = {
    minLength: 8,
    hasUpperCase: true,
    hasLowerCase: true,
    hasNumbers: true,
    hasNonalphas: true
};

export default class CreateAccount extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            SetActivePage: props.setActivePage,
            Business: true,
            PageType: Number(props.pageType),
            PasswordsValidation: {},
            FormMessage: "",
            Logout: props.logout,
            PasswordOptions: passwordOptionsDefault,
            CountryCodes: [],
            SelectedCountry: "US"
        };
    }

    GetPasswordComplexity() {
        let me = this;
        fetch(settings.urls.auth.getPasswordComplexity, { 
            method: 'get', 
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        }).then(function(res) {
            return res.json();
        })
        .then(function(resJson) {
            if (resJson.message) {
                me.setState({PasswordOptions: resJson.message});
            }
        });
    }

    GetCountryCodes(me, countryCodes) {
        fetch(settings.urls.countryCodes + "&offset=" + countryCodes.length, { 
            method: 'get', 
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        }).then(function(res) {
            return res.json();
        })
        .then(function(resJson) {
            if (resJson && resJson.results) {
                if (resJson.results.length < 100) {
                    me.setState({CountryCodes: countryCodes.concat(resJson.results)});
                }
                else {
                   me.GetCountryCodes(me, countryCodes.concat(resJson.results)); 
                }
            }
        });
    }

    UpdateBusinessNameRow = () => {
        let isBusiness = document.getElementById("business").checked;
        this.setState({Business: isBusiness});
    }

    CheckPasswords = () => {
        const password = document.getElementById("password").value;
        const password2 = document.getElementById("password2").value;

        let validPasswords = useCheckPasswords(password, password2, this.state.PasswordOptions);
        this.setState({PasswordsValidation: validPasswords});
    }

    ValidateForm = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const formProps = Object.fromEntries(formData);
        let missingFields = [];

        if (!this.state.Business) {
            formProps["businessName"] = "";
        }
        if (this.state.PageType === 0) {
            let validPasswords = useCheckPasswords(formProps["password"], formProps["password2"], this.state.PasswordOptions);

            if (!validPasswords.valid) {
                this.setState({PasswordsValidation: validPasswords});
                return;
            }

            requiredFields.push({Name: "password", Value:"Password"});
        }

        requiredFields.forEach(field => {
            if (!formProps[field.Name] || formProps[field.Name] === "") {
                missingFields.push(field.Value);
            }
        });

        if (missingFields.length !== 0) {
            this.setState({FormMessage: missingFields.join(", ")});
            return;
        }

        this.SubmitForm(formProps);
    }

    SubmitForm = (formProps) => {
        const url = (this.state.PageType === 0 ? settings.urls.auth.register : settings.urls.user.updateUser);
        const me = this;

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
            if (resJson.message.toLowerCase() === "success") {
                if (me.state.PageType === 0) {
                    me.state.SetActivePage("Login");
                }
            }
            else {
                alert("There was a problem with creating your account. Your username or email address may already have been used.")
            }
        })
        .catch(error => {
            alert("There was a problem with creating your account. Your username or email address may already have been used.")
        });
    }

    PasswordOrPage = () => {
        if (this.state.PageType === 0) {
            return <Fragment>
                <div className='row'>
                    <div className='leftColumn'><label htmlFor="password">Password*:</label></div>
                    <div className='rightColumn'><input type="password" onKeyUp={this.CheckPasswords} id="password" name="password" required /></div>
                </div>

                <div className='row'>
                    <div className='leftColumn'><label htmlFor="password2" >Re-type Password*:</label></div>
                    <div className='rightColumn'><input type="password" onKeyUp={this.CheckPasswords} id="password2" name="password2" required /></div>
                </div>

                <PasswordValidation PasswordsValidation={this.state.PasswordsValidation} MinLength={this.state.PasswordOptions.minLength}/>
            </Fragment>;
        }
        else {
            return <Fragment>
                <div className='row'>
                    <div className='leftColumn'></div>
                    <div className='rightColumn'>
                        <button type="button" onClick={this.ResetPasswod}>Reset Password</button>
                    </div>
                </div>
            </Fragment>;
        }
    }

    ResetPasswod = () => {
        this.state.SetActivePage("ResetPassword");
    }

    GetUser = () => {
        const me = this;
        const token = sessionStorage.getItem('token');
        const url = settings.urls.user.getUser;

        fetch(url, { 
            method: 'get', 
            headers: new Headers({
                'Authorization': token
            })
        }).then(function(res) {
            return res.json();
        })
        .then(function(resJson) {
            if (resJson.message !== "") {
                const data = resJson.message;

                Object.keys(data).forEach(key => {
                    let name = key.charAt(0).toLowerCase() + key.slice(1);

                    if (name === "business") {
                        document.getElementById("business").checked = data[key];
                        document.getElementById("personal").checked = !data[key];
                    }
                    else if (name === "country") {
                        me.setState({SelectedCountry:data[key]});
                    }
                    else {
                        let input = document.getElementById(name);

                        if (input) {
                            input.value = decodeURIComponent(data[key]);
                        }
                    }
                });

                me.UpdateBusinessNameRow();
            }
        });
    }

    DisableAccount = () => {
        let result = window.confirm('Are you sure you want to disable your account?');
        let me = this;

        if (result) {
            const url = settings.urls.user.disableUser;

            fetch(url, { 
                method: 'post', 
                headers: new Headers({
                    'Authorization': token
                })
            }).then(function(res) {
                return res.json();
            })
            .then(function(resJson) {
                if (resJson.message === "Success") {
                    alert("User disabled.");
                    me.state.Logout();
                }
            });
        }
    }

    HandleCountryChange = event => {
        this.setState({ SelectedCountry: event.target.value });
      };

    componentDidMount() {
        if (this.state.PageType === 1) {
            this.GetUser();
        }

        if (this.state.CountryCodes.length === 0) {
            this.GetCountryCodes(this, []);
        }

        this.GetPasswordComplexity();
    }

    render() {
        return (
            <form id="createAccount" className="column" onSubmit={this.ValidateForm}>
                <h3>{this.state.PageType === 0 ? "Create Account" : "Account" }:</h3>

                <div className={'row' + (this.state.FormMessage === "" ? " hidden" : " visible redWarning")}>
                    Please fill in the following fields: {this.state.FormMessage}.
                </div>

                <div className='row'>
                    <div className='leftColumn'><label htmlFor="firstName" >First Name*:</label></div>
                    <div className='rightColumn'><input type="text" id="firstName" name="firstName" required /></div>
                </div>

                <div className='row'>
                    <div className='leftColumn'><label htmlFor="lastName" >Last Name*:</label></div>
                    <div className='rightColumn'><input type="text" id="lastName" name="lastName" required /></div>
                </div>

                <div className='row'>
                    <div className='leftColumn'><label htmlFor="username" >User Name*:</label></div>
                    <div className='rightColumn'><input type="text" id="username" name="username" required /></div>
                </div>

                {this.PasswordOrPage()}

                <div className='row'>
                    <div className='leftColumn'><input type="radio" name="business" id="business" value="Business" checked={this.state.Business} onChange={this.UpdateBusinessNameRow}/> <label htmlFor="business" >Business</label></div>
                    <div className='rightColumn'><input type="radio" name="business" id="personal" value="Personal" checked={!this.state.Business} onChange={this.UpdateBusinessNameRow}/> <label htmlFor="personal" >Personal</label></div>
                </div>

                <div className='row'>
                    <div className='leftColumn'><label htmlFor="businessName">Business Name:</label></div>
                    <div className='rightColumn'><input type="text" disabled={!this.state.Business} id="businessName" name="businessName" /></div>
                </div>

                <div className='row'>
                    <div className='leftColumn'><label htmlFor="email" >Email*:</label></div>
                    <div className='rightColumn'><input type="text" id="email" name="email" required /></div>
                </div>

                <div className='row'>
                    <div className='leftColumn'><label htmlFor="address1" >Address 1*:</label></div>
                    <div className='rightColumn'><input type="text" id="address1" name="address1" required /></div>
                </div>

                <div className='row'>
                    <div className='leftColumn'><label htmlFor="address2" >Address 2:</label></div>
                    <div className='rightColumn'><input type="text" id="address2" name="address2" /></div>
                </div>

                <div className='row'>
                    <div className='leftColumn'><label htmlFor="city" >City*:</label></div>
                    <div className='rightColumn'><input type="text" id="city" name="city" required /></div>
                </div>

                <div className='row'>
                    <div className='leftColumn'><label htmlFor="state" >State*:</label></div>
                    <div className='rightColumn'><input type="text" id="state" name="state" required /></div>
                </div>

                <div className='row'>
                    <div className='leftColumn'><label htmlFor="zipcode" >Zip/Postal Code*:</label></div>
                    <div className='rightColumn'><input type="text" id="zipcode" name="zipcode" required /></div>
                </div>

                <div className='row'>
                    <div className='leftColumn'><label htmlFor="country" >Country*:</label></div>
                    <div className='rightColumn'>
                        <select id="country" name="country" value={this.state.SelectedCountry} onChange={this.HandleCountryChange}>
                            <option value="">Select the country</option>
                            {this.state.CountryCodes.map((country) => (
                                <option key={country.iso2_code} value={country.iso2_code}>
                                {country.label_en}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                
                <br />
                <button type="submit">{this.state.PageType === 0 ? "Create Account" : "Update Account"}</button>
                <br />
                <button type="button" className={"hyperlink" + (this.state.PageType === 0 ? " visible" : " hidden")} onClick={() => this.state.SetActivePage("Login")}>Go to Login page</button>
                {this.state.PageType !== 0 &&
                    <>
                        <button type="button" onClick={this.DisableAccount}>Disable Account</button>
                    </>
                }
            </form>
        );
    }
}
