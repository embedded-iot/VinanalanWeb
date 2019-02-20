import React, {Component} from "react";
import Select from "react-select";
import * as Service from "./MapsServices";
import { FormattedMessage } from 'react-intl';

const STRINGS = {
    SELECTED:  <FormattedMessage id="SELECT_DISTRICS"/>,
}

class Districts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listData: [],
            selected: '',
            defaultValue: ''
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.value !== nextProps.value) {
            this.onChangeData('', {name: 'districts'});
            this.getDistricts(nextProps.value);
        }

        if(!_.isEqual(nextProps.defaultValue,this.props.defaultValue)){
            this.setState({defaultValue: nextProps.defaultValue});
        }
    }

    getDistricts = (value) => {
        Service.getDistricts(value, response => {
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

    onChangeData = (optionSelected, select) => {
        const {onChangeCountry} = this.props;
        this.setState({selected: optionSelected, defaultValue: ''});
        onChangeCountry(optionSelected, select);
    }

    render() {
        const {listData, selected, defaultValue} = this.state;
        const {onChangeCountry} = this.props;
        return (
            <Select options={listData} onChange={this.onChangeData} name='districts'
                    value={defaultValue? defaultValue : selected} placeholder={STRINGS.SELECTED}/>
        );
    }
}

export default Districts;