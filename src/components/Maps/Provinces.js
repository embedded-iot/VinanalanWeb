import React, {Component} from "react";
import Select from "react-select";
import * as Service from "./MapsServices";
import { FormattedMessage } from 'react-intl';

const STRINGS = {
    SELECTED:  <FormattedMessage id="SELECT_PROVINCES"/>,
}
class Provinces extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listData: [],
            defaultProvince: '',
            value: ''
        }
    }
    componentWillMount(){
        if(this.props.value){
            this.getListProvinces(this.props.value);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value && this.props.value !== nextProps.value){
            this.onChangeData('', {name: 'provinces'});
            this.getListProvinces(nextProps.value);
        }

        if(!_.isEqual(nextProps.defaultProvince,this.props.defaultProvince)){
            this.setState({defaultProvince: nextProps.defaultProvince});
        }
    }

    getListProvinces = (contryId) => {
        Service.getProvinces(contryId, response => {
            if (response.data.isSucess) {
                let listData = response.data.data.map(item => {
                    const data = {};
                    data.label = item.name_with_type;
                    data.value = item.code;
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
    onChangeData = (optionSelected, e) =>{
        const {onChangeCountry} = this.props;
        this.setState({value: optionSelected, defaultProvince: ''});
        onChangeCountry(optionSelected, e);
    }

    render() {
        const {listData, value, defaultProvince} = this.state;

        return (
            <Select options={listData} onChange={this.onChangeData} name='provinces'
                 value={defaultProvince ? defaultProvince : value}   placeholder={STRINGS.SELECTED}/>
        );
    }
}

export default Provinces;