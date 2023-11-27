import { Component } from 'react';
import '../../App.css';

class StripeAccount extends Component {
    render() {
        return (
            <div className="column">
                <h3>Create Stripe Account:</h3>
                <div className='row'>
                    <div className='leftColumn'><label htmlFor="email" >Email Address:</label></div>
                    <div className='rightColumn'><input type="text" id="email" /></div>
                </div>
                <br />
                <button type="button">Create Stripe Account</button>
            </div>
        );
    }
}

export default StripeAccount;
