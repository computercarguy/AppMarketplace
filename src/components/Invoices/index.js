import { Component } from 'react';
import '../../App.css';

class Invoices extends Component {
    render() {
        return (
            <div className="column">
                <h3>Invoices:</h3>
                <div className='row'>
                    <div className='leftColumn'><label htmlFor="email" >Email Address:</label></div>
                    <div className='rightColumn'><input type="text" id="email" /></div>
                </div>
                <br />
            </div>
        );
    }
}

export default Invoices;
