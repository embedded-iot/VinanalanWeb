import React, {Component} from "react";
import Select from "react-select";
import './HomeDropDown.scss';
import DatePicker from "../../../pages/admins/Rooms/BookRoom";

const optionData = [
    {value: 'Facebook', label: 'Facebook'},
    {value: 'Wechat', label: 'Wechat'},
    {value: '', label: 'Zalo'}
]


class BookingSoure extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listData: [],
            selected: '',
            defaultValue: ''
        }
    }

    componentWillReceiveProps(nextProps) {
            const data = nextProps.defaultValue;
            if (data !== this.props.defaultValue) {
                this.setState({defaultValue: {value: data, label: data}});
            }
    }


    onChangeData = (optionSelected, e) =>{
        const {onChangeData} = this.props;
        this.setState({selected: optionSelected});
        const data = { target: {value: optionSelected.value, name: e.name}};
        onChangeData(data);
    }

    render() {
        const {selected, defaultValue} = this.state;
        const {name, disabled} = this.props;
        return (
            <Select options={optionData} onChange={this.onChangeData} name={name} className='home-select' isDisabled={disabled}
                    value={defaultValue ? defaultValue : selected}   placeholder='Select Booking Soure...'/>
        );
    }
}

export default BookingSoure;