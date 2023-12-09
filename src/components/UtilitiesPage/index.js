import '../../App.css';
import settings from '../../Settings.json';
import { Component } from 'react';

const token = sessionStorage.getItem('token');

class UtilitiesPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            UtilityOptions: [],
            Url: null,
            Title: null
        };
    }

    DisplayUtilities = () => {
        return this.state.UtilityOptions.map((element) => <div>
            <a href={element.Url} target="_blank" rel="noopener noreferrer" title={element.Description}>{element.Name}</a>
        </div>);
    }

    componentDidMount() {
        const url = settings.apiUrl + settings.urls.utilities.getUtilitites;
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
                me.setState({UtilityOptions: resJson.message, Loading: false});
            }
            else {
                console.log(resJson);
            }
        })
        .catch(error => {
            console.log(error);
        });
    }

    SetIFrame = (utility) => {
        this.setState({Url: utility.Url, Title: utility.Name});
    }

    render() {
        return (
            <div className="column" style={{width:"1200px"}}>
                <h3>Utilities:</h3>
                <div className='row'>
                    <div style={{width:"20%"}}>
                        {
                            this.state.UtilityOptions.map((element, i) => <div key={i}>
                                <button class="hyperlink" onClick={this.SetIFrame(element)} title={element.Description}>{element.Name}</button>
                            </div>)
                        }
                    </div>
                    <div style={{width:"80%"}}>
                        <iframe title={this.state.Title} src={this.state.Url} id="utilityIFrame" height="1000" width="1000"/>
                    </div>
                </div>
            </div>
        );
    }
}

export default UtilitiesPage;
