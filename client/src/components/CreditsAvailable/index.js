import { Component } from 'react';
import '../../App.css';
import { DataGrid } from '@mui/x-data-grid';
import settings from '../../Settings.json';

class CreditsAvailable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            SetActivePage: props.setActivePage,
            AvailableCredits: []
        };
    }

    AccountPage = () => {
        this.state.SetActivePage("Account");
    };

    componentDidMount() {
        const token = sessionStorage.getItem('token');
        const url = process.env.REACT_APP_apiUrl + settings.urls.credits.getCredits;
        const me = this;

        fetch(url, { 
            method: 'get', 
            headers: new Headers({
                'Authorization': token
            })
        }).then(function(res) {
            return res.json();
        })
        .then(function(resJson) {
            if (resJson && resJson.message) {
                resJson.message.sort((a,b) => a.Name > b.Name ? 1 : -1);
                me.setState({AvailableCredits: resJson.message});
            }
            else {
                console.log(resJson);
            }
        })
        .catch(error => {
            console.log(error);
        });
    }

    render() {
        return (
            <div className="column">
                <h3>Credits by Utility:</h3>
                <DataGrid
                    pageSize={10}
                    autoHeight={true}
                    getRowId={(row) => row.Id}
                    columns={[{ field: 'Name', headerName: "Name", width: 300 }, 
                        { field: 'Available', headerName: "Available", width: 75 }, 
                        { field: 'QuantityUsed', headerName: "Used", width: 50 }
                    ]}
                    rows={this.state.AvailableCredits}
                />
            </div>
        );
    }
}

export default CreditsAvailable;
