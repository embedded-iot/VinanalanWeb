import React, {Component} from "react";
import Select from "react-select";
import * as Service from "../../../pages/admins/home/HomeServices";
import './HomeDropDown.scss';

class HomeDropDown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listData: [],
            selected: '',
            defaultValue: ''
        }
    }

    componentWillMount() {
        this.getListData(null);
    }

    getListData = (data) => {
        Service.getListHome(data, response => {
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

    componentWillReceiveProps(nextProps){
        if(!_.isEqual(this.props.data,nextProps.data)){
            this.getListData(nextProps.data);
        }
        const data = nextProps.defaultValue;
        if (data !== this.props.defaultValue && !this.state.selected.length) {
            this.setState({defaultValue: data});
        }
    }
    onChangeData = (optionSelected, e) =>{
        const {onChangeData} = this.props;
        this.setState({selected: optionSelected, defaultValue: ''});
        const data = { target: {value: optionSelected.value, name: e.name, label: optionSelected.label}};
        onChangeData(data);
    }

    render() {
        const {listData, selected, defaultValue} = this.state;
        const {name} = this.props;
        return (
            <Select options={listData} onChange={this.onChangeData} name={name} className='home-select'
                    value={defaultValue ? defaultValue : selected}
                      placeholder='Select Home....'/>
        );
    }
}

export default HomeDropDown;