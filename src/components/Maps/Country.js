import React, {Component} from "react";
import Select from "react-select";
import * as Service from "./MapsServices";

class Country extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listData: []
        }
    }

    componentWillMount() {
        this.getListContries();
    }

    getListContries = () => {
        Service.getContries(response => {
            if (response.data.isSucess) {
                let listData = response.data.data.map(item => {
                    const data = {};
                    data.label = item.name;
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

    render() {
        const {listData} = this.state;
        const {onChangeCountry} = this.props;
        return (
            <Select options={listData} onChange={onChangeCountry} name='country'
                    placeholder='Select Country....'/>
        );
    }
}


export default Country;