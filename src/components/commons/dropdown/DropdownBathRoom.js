import React, { Component } from "react";
import Select from "react-select";
import './HomeDropDown.scss';
import { FormattedMessage } from 'react-intl';

const STRINGS = {
    SELECT_BATHROOM: <FormattedMessage id="SELECT_BATHROOM" />,
}
const optionData = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
    { value: 5, label: '5' },
]


class HighLight extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listData: [],
            selected: '',
            defaultValue: ''
        }
    }
    componentWillMount() {
        if (this.props.defaultValue) {
            this.setState({ defaultValue: this.props.defaultValue });
        }
    }
    getListData = () => {

    }
    onChangeData = (optionSelected, e) => {
        const { onChangeData } = this.props;
        this.setState({ selected: optionSelected, defaultValue: '' });
        const data = { target: { value: optionSelected.value, name: e.name } };
        onChangeData(data);
    }

    render() {
        const { selected, defaultValue } = this.state;
        const { name } = this.props;
        return (
            <Select options={optionData} onChange={this.onChangeData} name={name} className='home-select'
                value={defaultValue ? defaultValue : selected} placeholder={STRINGS.SELECT_BATHROOM} />
        );
    }
}

export default HighLight;