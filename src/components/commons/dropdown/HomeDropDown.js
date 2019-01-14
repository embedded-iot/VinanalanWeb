import React, {Component} from "react";
import Select from "react-select";
import * as Service from "../../../pages/admins/home/HomeServices";
import './HomeDropDown.scss';

class HomeDropDown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listData: [],
            selected: ''
        }
    }

    componentWillMount() {
        this.getListData();
    }

    getListData = () => {
        Service.getListHome(response => {
            if (response.data.isSucess) {
                let listData = response.data.data.map(item => {
                    const data = {};
                    data.label = item.homeName;
                    data.value = item.id;
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
        const {onChangeData} = this.props;
        this.setState({selected: optionSelected});
        const data = { target: {value: optionSelected.value, name: e.name}};
        onChangeData(data);
    }

    render() {
        const {listData, selected} = this.state;
        const {name} = this.props;
        return (
            <Select options={listData} onChange={this.onChangeData} name={name} className='home-select'
                    value={selected}   placeholder='Select Country....'/>
        );
    }
}

export default HomeDropDown;