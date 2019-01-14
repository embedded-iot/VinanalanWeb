import React, {Component} from "react";
import Select from "react-select";
import * as Service from "./MapsServices";

class Wards extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listData: [],
            selected: ''
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.value !== nextProps.value) {
            this.onChangeData('', {name: 'wards'});
            this.getWards(nextProps.value);
        }
    }

    getWards = (value) => {
        Service.getWards(value, response => {
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
        this.setState({selected: optionSelected});
        onChangeCountry(optionSelected, select);
    }

    render() {
        const {listData, selected} = this.state;
        return (
            <Select options={listData} onChange={this.onChangeData} name='wards'
                    value={selected} placeholder='Select Wards....'/>
        );
    }
}

export default Wards;