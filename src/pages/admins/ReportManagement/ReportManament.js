import React, { Component } from 'react';
import * as CONSTANTS from '../../../constants/commonConstant';
import './ReportManament.scss';
import { Tabs, Tab } from 'react-bootstrap';
import Table from '../../../components/commons/ReactTable/RactTable';
import * as Service from './ReportService';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

const STRINGS = {
    CHECK_IN: <FormattedMessage id="CHECK_IN" />,
    CHECK_OUT: <FormattedMessage id="CHECK_OUT" />,
    TODAY: <FormattedMessage id="TODAY" />,
    ONE_WEEK: <FormattedMessage id="ONE_WEEK" />,
    THREE_DAYS: <FormattedMessage id="THREE_DAYS" />,
    ONE_MONTH: <FormattedMessage id="ONE_MONTH" />,
    ROOM_OCCUPIED: <FormattedMessage id="ROOM_OCCUPIED" />,
    REVERVATION: <FormattedMessage id="REVERVATION" />,
    LIVING: <FormattedMessage id="LIVING" />,
    CANCELED: <FormattedMessage id="CANCELED" />,
    FROM: <FormattedMessage id="FROM" />,
    TO: <FormattedMessage id="TO" />,
    BOOKING_DATE: <FormattedMessage id="BOOKING_DATE" />,
    ROOM_NAME: <FormattedMessage id="ROOM_NAME" />,
    CUSTOMER: <FormattedMessage id="CUSTOMER" />,
    SOURCE: <FormattedMessage id="SOURCE" />,
    ROOM_CATALOG: <FormattedMessage id="ROOM_CATALOG" />,
    TOWER: <FormattedMessage id="TOWER" />,
    TOTAL_COST: <FormattedMessage id="TOTAL_COST" />,
    PAID: <FormattedMessage id="PAID" />,
    REPORT_MANAGAMENT: <FormattedMessage id="REPORT_MANAGAMENT" />,
    ROOM_IS: <FormattedMessage id="ROOM_IS" />,
    CHECK_IN_ROOM: <FormattedMessage id="CHECK_IN_ROOM" />,
    CHECK_OUT_ROOM: <FormattedMessage id="CHECK_OUT_ROOM" />,
}

const columnsRevertion = [
    {
        Header: '#BK',
        accessor: 'booking_code',
        width: 150
    },
    {
        Header: STRINGS.ROOM_CATALOG,
        id: 'roomType',
        accessor: d => d.room.roomCatalog.catalogName,
    },
    {
        Header: STRINGS.ROOM_NAME,
        id: 'roomName',
        accessor: d => d.room.roomName,
    },
    {
        Header: STRINGS.TOWER,
        id: 'roomHomeName',
        accessor: d => d.room.homes.homeName,
    },
    {
        Header: STRINGS.CUSTOMER,
        id: 'customer',
        accessor: d => d.customer.customerName,
    },
    {
        Header: STRINGS.SOURCE,
        accessor: 'bookingSource',
    },
    {
        Header: STRINGS.BOOKING_DATE,
        accessor: 'create_at',
        Cell: props => <span>{(new Date(props.original.create_at)).toLocaleDateString()}</span>
    },
    {
        Header: STRINGS.FROM,
        accessor: 'checkin',
        Cell: props => <span>{(new Date(props.original.checkin)).toLocaleDateString()}</span>
    },
    {
        Header: STRINGS.TO,
        accessor: 'checkout',
        Cell: props => <span>{(new Date(props.original.checkout)).toLocaleDateString()}</span>

    },
    {
        Header: STRINGS.TOTAL_COST,
        accessor: 'totalMoney',
        Cell: props => <span> {props.original.totalMoney.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}
            &nbsp;Vnd</span>
    },
    {
        Header: STRINGS.PAID,
        Cell: props => <span>{(props.original.totalMoney - props.original.remainMoney).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}&nbsp;
    Vnd</span>
    },
]

class ReportManament extends Component {
    _is = false;
    constructor(props) {
        super(props);
        this.state = {
            key: 1,
            numDays: 1,
            listRevertion: [],
            checkin: 0,
            checkout: 0,
            circle: 0
        }
    }

    componentWillMount() {
        if (!this._is) {
            this._is = true;
            this.handleSelect(1, 1);
            this.getCountReservation(1);
        }
    }

    getCountReservation = (day) => {
        Service.getCountReservation(day, res => {
            const { data } = res.data;
            this.setState({
                checkin: data[0],
                checkout: data[1],
                circle: Math.round(data[2] / data[3] * 100),
            });
        })
    }
    onChangeData = (value) => {
        this.setState({ numDays: value });
        this.handleSelect(this.state.key, value);
        this.getCountReservation(value);
    }

    handleSelect = (key, numDays) => {
        const data = {
            numDays: numDays,
            status: key
        }
        Service.getReportByStatus(data, res => {
            this.setState({ key, listRevertion: res.data.data });
        })
    }

    render() {
        const state = this.state;
        const props = this.props;
        const listStatus = this.props.locale === 'en' ? [
            { label: "Today", value: 1 },
            { label: "3 Days", value: 3 },
            { label: "Weekly", value: 7 },
            { label: "Monthly", value: 30 },
        ]
            :
            [
                { label: "Hôm nay", value: 1 },
                { label: "Ba ngày qua", value: 3 },
                { label: "Tuần qua", value: 7 },
                { label: "Tháng qua", value: 30 },
            ]


        return (
            <div className="report_management">
                <div className="row">
                    <div className="col-lg-6 title">{STRINGS.REPORT_MANAGAMENT}</div>
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
                            <div className="number">{state.checkin}</div>
                            <div>{STRINGS.CHECK_IN_ROOM}</div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="content-number">
                            <div className="number" style={{ color: '#ff0000' }}>{state.checkout}</div>
                            <div>{STRINGS.CHECK_OUT_ROOM}</div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="content-number">
                            <div className="number" style={{ color: '#0e9aff' }}>{state.circle}%</div>
                            <div>{STRINGS.ROOM_IS}</div>
                        </div>
                    </div>

                </div>

                <Tabs
                    activeKey={this.state.key}
                    onSelect={(e) => this.handleSelect(e, state.numDays)}
                    id="controlled-tab-example"
                    className="myClass"
                >
                    <Tab eventKey={1} title={STRINGS.REVERVATION}></Tab>

                    <Tab eventKey={2} title={STRINGS.LIVING}></Tab>

                    <Tab eventKey={3} title={STRINGS.CHECK_IN_ROOM}></Tab>

                    <Tab eventKey={4} title={STRINGS.CHECK_OUT_ROOM}></Tab>

                    <Tab eventKey={5} title={STRINGS.CANCELED}></Tab>
                    <Table
                        data={state.listRevertion}
                        columns={columnsRevertion}
                        defaultPageSize={5} />
                </Tabs>
            </div>
        );
    }
}


const mapStateToProps = (state) => ({
    locale: state.translation.locale
});



export default connect(mapStateToProps, null)(ReportManament);