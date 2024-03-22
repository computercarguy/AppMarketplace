import { Component } from 'react';
import '../../App.css';
import LinkIcon from '../../images/icons/Link.webp';
import PaymentIcon from '../../images/icons/payment.webp';
import settings from '../../Settings.json';
import { DataGrid } from '@mui/x-data-grid';
import PaymentMethodDetails from '../PaymentMethodDetails';
import InvoiceItems from './InvoiceItems';

class Invoices extends Component {
    constructor(props) {
        super(props);

        this.state = {
            PaymentMethods: [],
            PaymentMethodImages: [],
            Invoices: [],
            InvoiceItems: null,
            Details: null,
            PaymentMethodDetails: null,
            PaymentMethod: null
        }
    }

    UpdateInvoices(invoices, paymentMethodImages, paymentMethods) {
        if (invoices.length === 0 || paymentMethodImages.length === 0 || paymentMethods.length === 0) {
            return;
        }

        invoices.forEach(element => {
            if (!element.ProviderImage) {
                let providerImage = paymentMethodImages.find(image => image.Name.toLowerCase() === element.PaymentMethod.toLowerCase());
                if (providerImage) {
                    element.ProviderImage = providerImage.Url;
                }
            }
        });

        paymentMethods.forEach(element => {
            if (!element.ProviderImage) {
                let providerImage = paymentMethodImages.find(image => image.Name.toLowerCase() === element.Provider.toLowerCase());
                if (providerImage) {
                    element.ProviderImage = providerImage.Url;
                }
            }

            if (!element.TypeImage) {
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
            }
        });
    }

    GetPaymentMethods(token) {
        let url = settings.stripe.paymentMethods;
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
            me.UpdateInvoices(me.state.Invoices, me.state.PaymentMethodImages, resJson.message);
            me.setState({PaymentMethods: resJson.message});
        })
        .catch(error => {
            alert(error)
        });
    }

    GetPaymentMethodImages(token) {
        let url = settings.urls.paymentmethodimages.getPaymentMethodImages;
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
            me.UpdateInvoices(me.state.Invoices, resJson.message, me.state.PaymentMethods);
            me.setState({PaymentMethodImages: resJson.message});
        })
        .catch(error => {
            alert(error)
        });
    }

    GetInvoices(token) {
        let url = settings.urls.invoices.getInvoices;
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
            me.UpdateInvoices(resJson.message, me.state.PaymentMethodImages, me.state.PaymentMethods);
            me.setState({Invoices: resJson.message});
        })
        .catch(error => {
            alert(error)
        });
    }

    GetInvoiceItems(id, paymentMethod) {
        const token = sessionStorage.getItem('token');
        let url = settings.urls.invoices.getInvoiceItems + id;
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
            me.setState({
                InvoiceItems: resJson.message, 
                PaymentMethodDetails: null,
                PaymentMethod: me.state.PaymentMethods.find(item => item.Provider.toLowerCase() === paymentMethod.toLowerCase())
            });
        })
        .catch(error => {
            alert(error)
        });
    }

    UpdatePaymentMethodDetails(me, paymentMethod) {
        me.setState({PaymentMethodDetails: paymentMethod});
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

        this.GetInvoices(token);
        this.GetPaymentMethods(token);
        this.GetPaymentMethodImages(token);
    }

    render() {
        let me = this;

        return (
            <div className="column">
                <h3>Invoices:</h3>
                <div className="row">
                    <DataGrid
                        pageSize={10}
                        autoHeight={true}
                        getRowId={(row) => row.Id}
                        columns={[
                            { field: 'Payment Method', header: "PaymentMethod", width: 100, 
                                renderCell: (params) => {return (params && params.row.ProviderImage) ? 
                                    <img src={params.row.ProviderImage} height={25} alt={params.row.PaymentMethod} /> : 
                                    this.CapitalizeFirstLetter(params.row.PaymentMethod)} }, 
                            { field: 'Status', width: 100 }, 
                            { field: 'PurchasedDate', width: 150, renderCell: (params) => {return (new Date(params.row.PurchasedDate)).toLocaleDateString(); }},
                            { field: 'Total', width: 150, renderCell: (params) => {return "$"+(params.row.total/100).toFixed(2); }},
                            { field: 'Details', width: 75, renderCell: (params) => {return <button type="button" onClick={() => {
                                me.GetInvoiceItems(params.row.Id, params.row.PaymentMethod);
                            }}>Items</button>;} }
                        ]}
                        rows={this.state.Invoices}
                    />

                    {this.state.InvoiceItems && 
                        <InvoiceItems items={this.state.InvoiceItems} updatePaymentMethodDetails={this.UpdatePaymentMethodDetails} paymentMethod={this.state.PaymentMethod} me={this}/>
                    }

                    {this.state.PaymentMethodDetails &&
                        <PaymentMethodDetails details={this.state.PaymentMethodDetails}/>
                    }
                </div>
            </div>
        );
    }
}

export default Invoices;
