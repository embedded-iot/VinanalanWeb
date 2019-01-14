import React, {Component} from "react";
import Select from "react-select";
import * as Service from "./MapsServices";

class Provinces extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listData: []
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value && this.props.value !== nextProps.value)
            this.getListProvinces(nextProps.value);
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

    render() {
        const {listData} = this.state;
        const {onChangeCountry} = this.props;
        return (
            <Select options={listData} onChange={onChangeCountry} name='provinces'
                    placeholder='Select Provinces....'/>
        );
    }
}

export default Provinces;