import React, { Component } from "react";
import Select from "react-select";
import * as Service from "../../../pages/config/RoomsCatalog/RoomsCatalogServices";
import './HomeDropDown.scss';
import { FormattedMessage } from 'react-intl';

const STRINGS = {
    SELECT_ROOM_CATALOG: <FormattedMessage id="SELECT_ROOM_CATALOG" />,
}
class DropDownRoomCatalog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listData: [],
            selected: '',
        }
    }

    componentWillMount() {
        this.getListData();
    }

    getListData = () => {
        Service.getRoomsCatalog(response => {
            if (response.data.isSucess) {
                let listData = response.data.data.map(item => {
                    const data = {};
                    data.label = item.catalogName;
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
    onChangeData = (optionSelected, e) => {
        const { onChangeData } = this.props;
        this.setState({ selected: optionSelected });
        const data = { target: { value: optionSelected.value, name: e.name } };
        onChangeData(data);
    }

    render() {
        const { listData, selected } = this.state;
        const { name } = this.props;
        return (
            <Select options={listData} onChange={this.onChangeData} name={name} className='home-select'
                value={selected} placeholder={STRINGS.SELECT_ROOM_CATALOG} />
        );
    }
}

export default DropDownRoomCatalog;