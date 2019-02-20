import React, { Component } from "react";
import Select from "react-select";
import './HomeDropDown.scss';

const optionData = [
    { value: 'Day', label: 'Day' },
    { value: 'Week', label: 'week' },
    { value: 'Month', label: 'Month' },
    { value: 'Cash', label: 'Cash' },
]


class DropdownPayMethod extends Component {
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
            this.setState({ defaultValue: { value: data, label: data } });
        }
    }


    onChangeData = (optionSelected, e) => {
        const { onChangeData } = this.props;
        this.setState({ selected: optionSelected });
        const data = { target: { value: optionSelected.value, name: e.name } };
        onChangeData(data);
    }

    render() {
        const { selected, defaultValue } = this.state;
        const { name } = this.props;
        return (
            <Select options={optionData} onChange={this.onChangeData} name={name} className='home-select'
                value={defaultValue ? defaultValue : selected} placeholder='Select Pay Method...' />
        );
    }
}

export default DropdownPayMethod;