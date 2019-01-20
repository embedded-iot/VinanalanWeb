import React, {Component} from 'react';
import * as CONSTANTS from '../../../constants/commonConstant';
import './ReportManament.scss';
import {Tabs, Tab} from 'react-bootstrap';
import Table from '../../../components/commons/ReactTable/RactTable';
import * as Service from './ReportService';

const columnsRevertion = [
    {
        Header: '#BK',
        accessor: 'booking_code',
        width: 150
    },
    {
        Header: 'Room Type',
        accessor: 'catalogName',
    },
    {
        Header: 'Room',
        accessor: 'catalogName',
    },
    {
        Header: 'Tower',
        accessor: 'catalogName',
    },
    {
        Header: 'Customer',
        accessor: 'catalogName',
    },
    {
        Header: 'Booking Source',
        accessor: 'bookingSource',
    },
    {
        Header: 'Booking Date',
        accessor: 'catalogName',
    },
    {
        Header: 'From',
        accessor: 'checkin',
        Cell: props => <span>{(new Date(props.original.checkin)).toLocaleDateString()}</span>
    },
    {
        Header: 'To',
        accessor: 'checkout',
        Cell: props => <span>{(new Date(props.original.checkout)).toLocaleDateString()}</span>

    },
    {
        Header: 'Total',
        accessor: 'totalMoney',
    },
    {
        Header: 'Paid',
        accessor: 'catalogName',
    },
]

const listStatus = [
    {label: "Today", value: 1},
    {label: "3 Days", value: 3},
    {label: "Weekly", value: 7},
    {label: "Monthly", value: 30},
]

class ReportManament extends Component {
    _is = false;
    constructor(props) {
        super(props);
        this.state = {
            key: 1,
            numDays: 1,
            listRevertion: [],
        }
    }

    componentWillMount() {
        if(!this._is){
            this._is = true;
            this.handleSelect(1);
        }
    }

    onChangeData = (value) => {
        this.setState({numDays: value})
    }
    handleSelect = (key) => {
        const data = {
            numDays: this.state.numDays,
            status: key
        }
        if (key === 2) {
            data.numDays = 1;
        }
        Service.getReportByStatus(data, res => {
            this.setState({
                key,
                listRevertion: res.data.data
            });
        })
    }

    render() {
        const state = this.state;
        const props = this.props;
        return (
            <div className="report_management">
                <div className="row">
                    <div className="col-lg-6 title">{CONSTANTS.REPORT_MANAMENT}</div>
                    <div className="col-lg-6 date_time">
                        {listStatus.map((item, key) => {
                            return <span key={key} onClick={() => this.onChangeData(item.value)}
                                         className={state.numDays === item.value ? 'active_span' : ''}
                            >{item.label}</span>
                        })}
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-4">
                        <div className="content-number">
                            <div className="number">35.000</div>
                            <div>{CONSTANTS.CHECK_IN}</div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="content-number">
                            <div className="number" style={{color: '#ff0000'}}>15.000</div>
                            <div>{CONSTANTS.CHECK_OUT}</div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="content-number">
                            <div className="number" style={{color: '#0e9aff'}}>45%</div>
                            <div>{CONSTANTS.ROOM_IS_BE_FILLED}</div>
                        </div>
                    </div>

                </div>

                <Tabs
                    activeKey={this.state.key}
                    onSelect={this.handleSelect}
                    id="controlled-tab-example"
                    className="myClass"
                >
                    <Tab eventKey={1} title={CONSTANTS.RESERVITON}>
                        <Table
                            data={state.listRevertion}
                            columns={columnsRevertion}
                            // defaultPageSize={5}
                        />
                    </Tab>

                    <Tab eventKey={2} title={CONSTANTS.LIVING}>
                        <Table
                            data={state.listRevertion}
                            columns={columnsRevertion}
                            defaultPageSize={5}/>
                    </Tab>

                    <Tab eventKey={3} title={CONSTANTS.CHECK_IN}>
                        <Table
                            data={state.listRevertion}
                            columns={columnsRevertion}
                            defaultPageSize={5}/>
                    </Tab>

                    <Tab eventKey={4} title={CONSTANTS.CHECK_OUT}>
                        <Table
                            data={state.listRevertion}
                            columns={columnsRevertion}
                            defaultPageSize={5}/>
                    </Tab>

                    <Tab eventKey={5} title={CONSTANTS.CANCELED}>
                        <Table
                            data={state.listRevertion}
                            columns={columnsRevertion}
                            defaultPageSize={5}/>
                    </Tab>
                </Tabs>
            </div>
        );
    }
}

export default ReportManament;