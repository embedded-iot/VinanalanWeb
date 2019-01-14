import React, {Component} from "react";
import Select from "react-select";
import './HomeDropDown.scss';

const listRoomMedia = [
    {value: 'Room Media 1', label: 'Room Media 1'},
    {value: 'Room Media 2', label: 'Room Media 2'},
    {value: 'Room Media 3', label: 'Room Media 3'},
    {value: 'Room Media 4', label: 'Room Media 4'},
]


class RoomMedia extends Component {
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

export default RoomMedia;