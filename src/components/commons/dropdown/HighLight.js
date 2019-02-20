import React, { Component } from "react";
import Select from "react-select";
import './HomeDropDown.scss';
import { FormattedMessage } from 'react-intl';

const STRINGS = {
    SELECT_ROOM_MEDIA: <FormattedMessage id="SELECT_ROOM_MEDIA" />,
}
const listRoomMedia = [
    { value: 'Highlight 1', label: 'Highlight 1' },
    { value: 'Highlight 2', label: 'Highlight 2' },
    { value: 'Highlight 3', label: 'Highlight 2' },
    { value: 'Highlight 4', label: 'Highlight 3' },
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
        const data = { target: { value: optionSelected, name: e.name } };
        onChangeData(data);
    }

    render() {
        const { listData, selected, defaultValue } = this.state;
        const { name } = this.props;
        return (
            <Select options={listRoomMedia} onChange={this.onChangeData} name={name} className='home-select'
                isMulti={true} value={defaultValue ? defaultValue : selected} placeholder={STRINGS.SELECT_ROOM_MEDIA} />
        );
    }
}

export default HighLight;