import React, {Component} from "react";
import Select from "react-select";
import './HomeDropDown.scss';

const optionData = [
    {value: 1, label: '1'},
    {value: 2, label: '2'},
    {value: 3, label: '3'},
    {value: 4, label: '4'},
    {value: 5, label: '5'},
]


class HighLight extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listData: [],
            selected: ''
        }
    }

    getListData = () => {

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
            <Select options={optionData} onChange={this.onChangeData} name={name} className='home-select'
                    value={selected}   placeholder='Select Bathroom...'/>
        );
    }
}

export default HighLight;