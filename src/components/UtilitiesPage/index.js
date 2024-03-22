import '../../App.css';
import settings from '../../Settings.json';
import { Component } from 'react';

class UtilitiesPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            UtilityOptions: [],
            SearchOptions: [],
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
        const url = settings.urls.utilities.getUtilitites;
        const me = this;
        const token = sessionStorage.getItem('token');

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
                me.setState({UtilityOptions: resJson.message, SearchOptions: resJson.message, Loading: false});
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

    SearchNavigation = (term) => {
        console.log(term);
        if (term && term.length > 2) {
            let utilities = this.state.UtilityOptions.filter((item) => {return item.Name.toLowerCase().includes(term.toLowerCase())});

            this.setState({SearchOptions: utilities});
        }
        else {
            this.setState({SearchOptions: this.state.UtilityOptions});
        }
    }

    render() {
        return (
            <div className="column" style={{width:"1200px"}}>
                <h3>Utilities:</h3>
                <div className='row'>
                    <div className="column" style={{width:"20%"}} >
                        <div className='row'>
                            Search: <input type="text" onChange={(e) => this.SearchNavigation(e.target.value)}></input>
                        </div>
                        <div className='divScrollY'>
                            {
                                this.state.SearchOptions.map((element, i) => <div key={i}>
                                    <button class="hyperlink" onClick={() => this.SetIFrame(element)} title={element.Description}>{element.Name}</button>
                                </div>)
                            }
                        </div>
                    </div>
                    <div style={{width:"80%"}}>
                        <iframe title={this.state.Title} src={this.state.Url} id="utilityIFrame" height="600" width="1000"/>
                    </div>
                </div>
            </div>
        );
    }
}

export default UtilitiesPage;
