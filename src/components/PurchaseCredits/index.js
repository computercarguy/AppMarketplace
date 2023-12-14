import { Component, Fragment } from 'react';
import '../../App.css';
import { DataGrid } from '@mui/x-data-grid';
import settings from '../../Settings.json';
import questionCircle from '../../images/question-circle.svg';
import Cart from './Cart';
import useFetchGet from '../../hooks/useFetchGet';

function GetPaymentMethods() {
    let url = process.env.REACT_APP_apiUrl + settings.stripe.paymentMethods;
    const token = sessionStorage.getItem('token');

    useFetchGet(url, token, (resJson) => {
        console.log("useFetchGet");
        console.log(resJson);
    });
}

class PurchaseCredits extends Component {
    constructor(props) {
        super(props);

        this.state = {
            SelectedOptions: [],
            UtilityOptions: [],
            Checkout: false,
            CheckoutTotal: 0,
            Loading: true,
            PaymentSuccess: false,
            Stripekey: null
        };
    }

    UpdateTotals = () => {
        let qty = document.getElementById("quantity0").value;
        let price0 = document.getElementById("price0").innerText.substring(1);

        document.getElementById("subTotal0").innerText = "$" + (parseFloat(price0) * parseInt(qty));
        document.getElementById("totalPrice").innerText = "$" + (parseFloat(price0) * parseInt(qty));
    }

    FindOption = (row) => {
        return this.state.SelectedOptions.find(s => s.Id === row.Id);
    }

    AddOption = (row) => {
        let option = this.FindOption(row);

        if (option){
            option.Qty++;
            this.setState({SelectedOptions: this.state.SelectedOptions});
        }
        else {
            row.Qty = 1;
            this.setState({SelectedOptions: this.state.SelectedOptions.concat(row)});
        }
    }

    CalculateTotal = () => {
        let total = 0;
        this.state.SelectedOptions.forEach(option => {
            total += option.Price * option.Qty;
        });

        return total;
    }

    GetOptions = (token)  => {
        const url = process.env.REACT_APP_apiUrl + settings.urls.utilities.getUtilitites;
        const me = this;

        useFetchGet(url, token, (resJson) => {
            if (resJson.message) {
                resJson.message.sort((a,b) => a.Name > b.Name ? 1 : -1);
                me.setState({UtilityOptions: resJson.message, Loading: false});
            }
            else {
                console.log(resJson);
            }
        });
    }

    GetStripeKey = (token) => {
        if (!this.state.Stripekey) {
            const me = this;
            const url = process.env.REACT_APP_apiUrl + settings.stripe.key;

            useFetchGet(url, token, (resJson) => {
                if (resJson.message) {
                    me.setState({Stripekey: resJson.message});
                }
            });
        }
    }
    componentDidMount() {
        const token = sessionStorage.getItem('token');
        
        this.GetOptions(token);
        this.GetStripeKey(token);
    }

    UpdateQty = (row, value) => {
        let option = this.FindOption(row);

        if (value > 0) {
            option.Qty = value;
            this.setState({SelectedOptions: this.state.SelectedOptions});
        }
        else {
            let options = [];
            this.state.SelectedOptions.forEach(opt => {
                if (opt.Id !== option.Id){
                    options.push(opt);
                }
            });
            this.setState({SelectedOptions: options});
        }
    }
    
    Checkout = () => {
        let total = this.CalculateTotal();

        if (total > 0) {
            this.setState({Checkout: true, CheckoutTotal: total});
        }
    }

    TotalFooter = () => {
        return <Fragment>
            <hr style={{width:"100%"}}/>
            <div style={{marginLeft: "auto", marginRight: "70px"}}>
                <b>Taxes:</b> $0.00
                <br />
                <b>Total:</b> <label id="totalPrice">${this.CalculateTotal().toFixed(2)}</label>
            </div>
            </Fragment>;
    }

    PaymentComplete = () => {
        this.setState({PaymentSuccess: true});
    }

    RenderCell = (params) => {
        if (this.state.PaymentSuccess) {
            return params.row.Qty;
        }
        else {
            return <input type="number" value={params.row.Qty} style={{ width: 50 }} onChange={(e) => {this.UpdateQty(params.row, e.target.value);}}/>;
        }
    }

    render() {
        return (
            <div className="column" style={{width:"550px"}}>
                <h3>Purchase Credits:</h3>
                {!this.state.Checkout && !this.state.PaymentSuccess &&
                    <>
                        <DataGrid
                            pageSize={10}
                            autoHeight={true}
                            getRowId={(row) => row.Id}
                            rowSelection={false}
                            paginationMode="server"
                            filterMode="server"
                            loading={this.state.Loading}
                            columns={[
                                { field:"Name", headerName: 'Available Utility', width: 325 },
                                { field:"Price", headerName: 'Price', width: 75, renderCell: (params) => { return "$" + (+params.row.Price).toFixed(2) }}, 
                                { field:"Add", width: 50, renderCell: (params) => {return <button type="button" onClick={() => {
                                    this.AddOption(params.row);
                                }}>+</button>;} },
                                { width: 25, renderCell: (params) => {return <img src={questionCircle} title={params.row.Description} alt={params.row.Description} />}}
                            ]}
                            rows={this.state.UtilityOptions}
                            onCellDoubleClick={(params) => {
                                this.AddOption(params.row);
                            }}
                        />
                        <br />
                        <h4>Shopping Cart:</h4>
                    </>
                }
                <DataGrid
                    autoHeight={true}
                    getRowId={(row) => row.Id}
                    rowSelection={false}
                    hideFooterPagination
                    columns={[
                        { field:"Name", headerName: 'Utility', width: 275 }, 
                        { field:"Price", headerName: 'Price', width: 75, renderCell: (params) => { return "$" + params.row.Price.toFixed(2) }}, 
                        { field:"Qty", headerName: 'Qty', width: 75, renderCell: this.RenderCell }, 
                        { field:"SubTotal", headerName: 'SubTotal', width: 100, renderCell: (params) => { return "$" + (params.row.Price * params.row.Qty).toFixed(2) } }
                    ]}
                    rows={this.state.SelectedOptions}
                    pagination={false}
                    slots={{footer:this.TotalFooter}}
                />
                {!this.state.Checkout && !this.state.PaymentSuccess &&
                    <div>
                        <button type="button" onClick={this.Checkout}>Continue</button>
                    </div>
                }
                {this.state.Checkout && !this.state.PaymentSuccess &&
                    <div className="fill100" >
                        <Cart items={this.state.SelectedOptions} total={this.state.CheckoutTotal} calculateTotal={this.CalculateTotal} paymentMethods={GetPaymentMethods()} paymentComplete={this.PaymentComplete} stripekey={this.state.Stripekey}/>
                    </div>
                }
                {this.state.PaymentSuccess &&
                    <div className="fill100" >
                        <b>Your payment was a success.</b>
                    </div>
                }
            </div>
        );
    }
}

export default PurchaseCredits;
