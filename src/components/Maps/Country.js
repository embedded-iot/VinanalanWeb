import React, {Component} from "react";
import Select from "react-select";
import * as Service from "./MapsServices";
import { FormattedMessage } from 'react-intl';

const STRINGS = {
    SELECTED_COUNTRY :  <FormattedMessage id="SELECT_COUNTRY"/>,
}

class Country extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            listData: [],
            defaultValue: '',
            value: ''
        }
    }

    componentWillMount() {
        this._isMounted = true;
        this.getListContries();
        if(this.props.defaultValue){
            this.setState({
                defaultValue: this.props.defaultValue
            });
        }
    }

    getListContries = () => {
        Service.getContries(response => {
            if (response.data.isSucess && response.data.data.length > 0 && this._isMounted) {
                let listData = response.data.data.map(item => {
                    const data = {};
                    data.label = item.name || item.countryName;
                    data.value = item.countryCode;
                    return data;
                });
                this.setState({
                    listData: listData
                })
            }
        }, error => {
            // this.props.error(error);
        })
    }

    onChangeCountry = (optionSelected, e) =>{
        const {onChangeCountry}  = this.props;
        this.setState({
            defaultValue: '',
            value: optionSelected
        })
        onChangeCountry(optionSelected, e);
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    render() {
        const {listData, defaultValue, value} = this.state;

        return (
            <Select options={listData} onChange={this.onChangeCountry} name='country'
                value={defaultValue ? defaultValue : value}   placeholder={STRINGS.SELECTED_COUNTRY}/>
        );
    }
}


export default Country;