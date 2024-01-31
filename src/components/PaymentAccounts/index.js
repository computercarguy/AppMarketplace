import { Component } from 'react';
import '../../App.css';
import settings from '../../Settings.json';
import { DataGrid } from '@mui/x-data-grid';
import PaymentMethodDetails from '../PaymentMethodDetails';
import LinkIcon from '../../images/icons/Link.webp';
import PaymentIcon from '../../images/icons/payment.webp';

class StripeAccount extends Component {
    constructor(props) {
        super(props);

        this.state = {
            PaymentMethods: [],
            PaymentMethodImages: [],
            Details: null
        }
    }

    UpdatePaymentMethod(paymentMethods, paymentMethodImages) {
        if (paymentMethods.length === 0 || paymentMethodImages.length === 0) {
            return;
        }

        paymentMethods.forEach(element => {
            let providerImage = paymentMethodImages.find(image => image.Name.toLowerCase() === element.Provider.toLowerCase());
            if (providerImage) {
                element.ProviderImage = providerImage.Url;
            }

            let paymentType = element.Type.toLowerCase();

            if (paymentType === "link") {
                element.TypeImage = LinkIcon;
            }
            else if (paymentType === "ach") {
                element.TypeImage = PaymentIcon;
            }
            else {
                if (element.Brand) {
                    let typeImage = paymentMethodImages.find(image => image.Name.toLowerCase() === element.Brand.toLowerCase());
                    if (typeImage) {
                        element.TypeImage = typeImage.Url;
                    }
                }
            }
        });
    }

    GetPaymentMethods(token) {
        let url = process.env.REACT_APP_apiUrl + settings.stripe.paymentMethods;
        let me = this;
    
        fetch(url, { 
            method: 'get', 
            headers: new Headers({
                'Authorization': token
            })
        }).then(function(res) {
            return res.json();
        })
        .then(function(resJson) {
            me.UpdatePaymentMethod(resJson.message, me.state.PaymentMethodImages);
            me.setState({PaymentMethods: resJson.message});
        })
        .catch(error => {
            alert(error)
        });
    }

    GetPaymentMethodImages(token) {
        let url = process.env.REACT_APP_apiUrl + settings.urls.paymentmethodimages.getPaymentMethodImages;
        let me = this;
    
        fetch(url, { 
            method: 'get', 
            headers: new Headers({
                'Authorization': token
            })
        }).then(function(res) {
            return res.json();
        })
        .then(function(resJson) {
            me.UpdatePaymentMethod(me.state.PaymentMethods, resJson.message);
            me.setState({PaymentMethodImages: resJson.message});
        })
        .catch(error => {
            alert(error)
        });
    }

    CapitalizeFirstLetter(word) {
        if (word) {
            return word[0].toUpperCase() + word.slice(1).toLowerCase();
        }
        else {
            return "";
        }
    }

    componentDidMount() {
        const token = sessionStorage.getItem('token');

        this.GetPaymentMethods(token);
        this.GetPaymentMethodImages(token);
    }

    render() {
        let me = this;

        return (
            <div className="column">
                <h3>Payment Accounts:</h3>
                <div className="row">
                    <DataGrid
                        pageSize={10}
                        autoHeight={true}
                        getRowId={(row) => row.Id}
                        columns={[
                            { field: 'Provider', width: 75, 
                                renderCell: (params) => {return (params && params.row.ProviderImage) ? 
                                    <img src={params.row.ProviderImage} height={25} alt={params.row.Provider} /> : 
                                    this.CapitalizeFirstLetter(params.row.Type)} }, 
                            { field: 'Type', width: 75,
                                renderCell: (params) => { return (params && params.row.TypeImage) ? 
                                    <img src={params.row.TypeImage} height={20} alt={params.row.Brand}/> : 
                                    this.CapitalizeFirstLetter(params.row.Type)} }, 
                            { field: 'Name', width: 150 },
                            { field: 'Details', width: 75, renderCell: (params) => {return <button type="button" onClick={() => {
                                me.setState({Details: me.state.PaymentMethods[params.row.Id]});
                            }}>Show</button>;} }
                        ]}
                        rows={this.state.PaymentMethods}
                    />

                    {this.state.Details &&
                        <PaymentMethodDetails details={this.state.Details}/>
                    }
                </div>
            </div>
        );
    }
}

export default StripeAccount;
