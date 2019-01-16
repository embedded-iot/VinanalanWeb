import React, {Component} from "react";
import Select from "react-select";
import './HomeDropDown.scss';

const listRoomMedia = [
    {value: 'Highlight 1', label: 'Highlight 1'},
    {value: 'Highlight 2', label: 'Highlight 2'},
    {value: 'Highlight 3', label: 'Highlight 2'},
    {value: 'Highlight 4', label: 'Highlight 3'},
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
        const data = { target: {value: optionSelected, name: e.name}};
        onChangeData(data);
    }

    render() {
        const {listData, selected} = this.state;
        const {name} = this.props;
        return (
            <Select options={listRoomMedia} onChange={this.onChangeData} name={name} className='home-select'
                    isMulti={true}    value={selected}   placeholder='Select Room Media....'/>
        );
    }
}

export default HighLight;