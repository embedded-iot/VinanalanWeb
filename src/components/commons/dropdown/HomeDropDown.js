import React, { Component } from "react";
import Select from "react-select";
import * as Service from "../../../pages/admins/home/HomeServices";
import './HomeDropDown.scss';
import { FormattedMessage } from 'react-intl';

const STRINGS = {
    SELECT_HOME: <FormattedMessage id="SELECT_HOME" />,
}
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
        if (this.props.defaultValue) {
            this.setState({ defaultValue: this.props.defaultValue });
        }
    }

    getListData = (data) => {
        Service.getListHome(data, response => {
            if (response.data.isSucess) {
                let listData = [];
                response.data.data.map(item => {
                    if (item.homeStatus === 1) {
                        const data = {};
                        data.label = item.homeName;
                        data.value = item.id;
                        return listData.push(data);
                    } else {
                        return null;
                    }
                });
                this.setState({
                    listData: listData
                })
            }
        }, error => {
            // this.props.error(error);
        })
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(this.props.data, nextProps.data)) {
            this.getListData(nextProps.data);
        }
        const data = nextProps.defaultValue;
        if (data !== this.props.defaultValue && !this.state.selected.length) {
            this.setState({ defaultValue: data });
        }

    }
    onChangeData = (optionSelected, e) => {
        const { onChangeData } = this.props;
        this.setState({ selected: optionSelected, defaultValue: '' });
        const data = { target: { value: optionSelected.value, name: e.name, label: optionSelected.label } };
        onChangeData(data);
    }

    render() {
        const { listData, selected, defaultValue } = this.state;
        let data = defaultValue;
        if (defaultValue && defaultValue.label === 'Selected Home ...') {
            data.label = STRINGS.SELECT_HOME;
        }

        const { name } = this.props;
        return (
            <Select options={listData} onChange={this.onChangeData} name={name} className='home-select'
                value={data ? data : selected}
                placeholder={STRINGS.SELECT_HOME} />
        );
    }
}

export default HomeDropDown;