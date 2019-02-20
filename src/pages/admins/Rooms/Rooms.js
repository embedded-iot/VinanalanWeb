import React, { Component } from 'react';
import Provinces from '../../../components/Maps/Provinces';
import Districts from '../../../components/Maps/Districts';
import { connect } from 'react-redux';
import * as CONSTANTS from "../../../constants/commonConstant";
import SearchBox from "../../../components/commons/searchBox/SearchBox";
import TableListRoom from './TableListRoom';
import './Rooms.scss';
import * as Services from './RoomServices'
import Select from "react-select";
import { Button } from "../../config/HomeCatalog/ComponentSetting";
import AddRoomModal from './AddRoomModal'
import { injectIntl } from 'react-intl';
import HomeDropDown from '../../../components/commons/dropdown/HomeDropDown';
import { getHomeById } from '../home/HomeServices';
import { FormattedMessage } from 'react-intl';

const STRINGS = {
    ALL: <FormattedMessage id="ALL" />,
    EMPTY: <FormattedMessage id="EMPTY" />,
    BOOKING: <FormattedMessage id="BOOKING" />,
    STAYING: <FormattedMessage id="STAYING" />,
    CLOSE: <FormattedMessage id="CLOSE" />,
    ADD_NEW: <FormattedMessage id="ADD_NEW" />,
    LOOK_ROOM: <FormattedMessage id="LOOK_ROOM" />,
}

class Rooms extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedMap: {
                provinces: '',
                districts: '',
                // wards: ''
            },
            homeId: '',
            defaultHomeId: '',
            searchText: '',
            listRooms: [],
            isShowModal: false,
            listCount: [],
            pageSize: this.props.locale === 'en' ? { label: 'Row 3', value: 24 } : { label: 'Số hàng 3', value: 24 },
            currentPage: 1,
            defaultProvince: {},
            defaultDistrict: {}
        }
        this.status = '',
            this.homeName = JSON.parse(localStorage.getItem("home")) ? JSON.parse(localStorage.getItem("home")).label : 'Select Home...',
            this.page = 0
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.locale !== this.props.locale)
            if (nextProps.locale === "en") {
                this.setState({
                    pageSize: { label: 'Row 3', value: 24 }
                })
            } else {
                this.setState({
                    pageSize: { label: 'Số hàng 3', value: 24 }
                })
            }
    }
    componentDidMount() {
        if (this.props.match.params.homeId) {
            const { homeId } = this.props.match.params;

            Services.getLocationByHomeId(homeId, res => {
                const { data } = res;
                this.setState({
                    selectedMap: {
                        provinces: { value: data.home.location.province_code },
                        districts: { value: data.home.location.district_code }
                    },
                    defaultProvince: { value: data.home.location.province_code, label: data.provinceName },
                    defaultDistrict: { value: data.home.location.district_code, label: data.districtName }
                });
            });
            getHomeById(homeId, res => {
                this.setState({
                    defaultHomeId: { value: res.data.data.id, label: res.data.data.homeName },
                    homeId: res.data.data.id,
                });
                this.getCountRoomByStatus(res.data.data.id);
                const { pageSize } = this.state;
                const data = {
                    status: 0,
                    page: 0,
                    pageSize: pageSize.value,
                    homeId: res.data.data.id
                }
                this.getRoomByStatus(data);
                let item = data;
                item.label = res.data.data.homeName;
                this.homeName = res.data.data.homeName;
                window.localStorage.setItem("home", JSON.stringify(item));
            })
        } else {
            if (JSON.parse(localStorage.getItem("home"))) {
                const home = JSON.parse(localStorage.getItem("home"));
                this.setState({
                    defaultHomeId: { value: home.value, label: home.label },
                    homeId: home.value,
                });
                this.getCountRoomByStatus(home.value);
                this.getRoomByStatus(home)
            } else {
                this.setState({
                    defaultHomeId: { value: '', label: 'Selected Home ...' },
                    homeId: '',
                    listRooms: []
                });
            }
        }
    }

    getCountRoomByStatus = (homeId) => {
        Services.getCountRoomByStatus(homeId, res => {
            this.setState({ listCount: res.data.data });
        })
    }

    onChangeSelectedMap = (key, value) => {
        this.setState({ selectedMap: { ...this.state.selectedMap, [key]: value } });
    }
    onChangeMaps = (optionSelected, select) => {
        let selected = {};
        if (optionSelected) {
            selected = {
                value: optionSelected.value,
                label: optionSelected.label
            }
        }
        this.onChangeSelectedMap(select.name, selected);
    }
    onChangeSearch = () => {
    }

    handleSearch = () => {
        alert("Should do search: " + this.state.searchText);
    }

    handleShowPopUp = () => {
        this.setState({ isShowModal: true });
    }

    handleClosePopUp = () => {
        this.setState({ isShowModal: false });
    }

    onChangeSeacrhRoom = (value) => {
        const { pageSize, homeId } = this.state;
        const data = {
            status: value,
            page: 0,
            pageSize: pageSize.value,
            homeId: homeId
        }
        this.status = value;
        this.getRoomByStatus(data);
        let item = data;
        item.label = this.homeName;
        window.localStorage.setItem("home", JSON.stringify(item));
    }
    onUpdate = () => {
        const { pageSize, homeId } = this.state;
        const data = {
            status: this.status,
            page: pageSize.value * (this.state.currentPage - 1),
            pageSize: pageSize.value,
            homeId: homeId
        }
        this.getCountRoomByStatus(homeId);
        this.getRoomByStatus(data);
    }

    onChangeHome = (e) => {
        this.setState({
            homeId: e.target.value,
        });
        this.getCountRoomByStatus(e.target.value);
        const { pageSize } = this.state;
        const data = {
            status: 0,
            page: 0,
            pageSize: pageSize.value,
            homeId: e.target.value
        }
        this.getRoomByStatus(data);
        this.homeName = e.target.label;
        let item = data;
        item.label = e.target.label;
        this.homeName = e.target.label;
        window.localStorage.setItem("home", JSON.stringify(item));
    }

    getRoomByStatus = (data) => {
        const { pageSize } = this.state;
        Services.getRoomByStatus(data, res => {
            const count = res.data.count;
            if (res.data.count > 0) {
                const currentPage = Math.ceil(count / pageSize.value) !== 0 ? Math.ceil(count / pageSize.value) : 1;
                this.setState({
                    listRooms: res.data.data,
                    totalPage: currentPage,
                    currentPage: this.state.currentPage > currentPage ? 1 : this.state.currentPage
                });
            } else {
                this.setState({ listRooms: [] });
            }
        }, er => {
        })
    }

    handleChangePage = (pageNum) => {
        this.setState({ currentPage: pageNum });
        const { pageSize, homeId } = this.state;
        const data = {
            status: this.status,
            page: pageSize.value * (pageNum - 1),
            pageSize: pageSize.value,
            homeId: homeId
        }
        this.getRoomByStatus(data);
    }

    onChanPageSize = (e) => {
        const { homeId } = this.state;
        this.setState({ pageSize: e }, () => {
            const data = {
                status: this.status,
                page: 0,
                pageSize: e.value,
                homeId: homeId
            }
            this.getRoomByStatus(data);
        });
    }

    render() {
        const { provinces, districts } = this.state.selectedMap;
        const dataMaps = { provinces: provinces.value, districts: districts.value }
        const {
            searchText, listRooms, isShowModal, listCount, pageSize, totalPage,
            currentPage, homeId, defaultHomeId, defaultProvince, defaultDistrict
        } = this.state;

        const listRow = this.props.locale === 'en' ? [
            { label: 'Row 1', value: 8 },
            { label: 'Row 2', value: 16 },
            { label: 'Row 3', value: 24 },
            { label: 'Row 4', value: 32 },
        ]
            :
            [
                { label: 'Số hàng 1', value: 8 },
                { label: 'Số Hàng 2', value: 16 },
                { label: 'Số hàng 3', value: 24 },
                { label: 'Số hàng 4', value: 32 },
            ]
        return (
            <div className='rooms' style={styles}>
                <div className="row" style={{ marginBottom: '25px' }}>
                    <div className="col-lg-8"><span
                        style={{ fontSize: '28px', fontWeight: 'bold' }}>{CONSTANTS.ROOM}</span></div>
                    <div className="col-lg 3"><SearchBox value={searchText}
                        onChangeSearch={this.onChangeSearch}
                        onSearch={this.handleSearch} /></div>
                    <div className="col-lg-1 padding-left-0">
                        <Button
                            style={styleButton}
                            onclick={this.handleShowPopUp}
                            title={STRINGS.ADD_NEW}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-2">
                        <Provinces onChangeCountry={this.onChangeMaps} defaultProvince={defaultProvince} value="VN" />
                    </div>
                    <div className="col-lg-2">
                        <Districts onChangeCountry={this.onChangeMaps} defaultValue={defaultDistrict}
                            value={provinces.value} />
                    </div>
                    {/*<div className="col-lg-2">*/}
                    {/*<Wards onChangeCountry={this.onChangeMaps} value={districts.value}/>*/}
                    {/*</div>*/}
                    <div className="col-lg-2">
                        <HomeDropDown onChangeData={this.onChangeHome} name="homeId"
                            defaultValue={defaultHomeId} data={dataMaps} />
                    </div>
                    <div className="col-lg-5"></div>
                    <div className="col-lg-1">
                        <Select options={listRow} onChange={this.onChanPageSize}
                            value={pageSize} placeholder='Select Row'></Select>
                    </div>
                </div>

                <div className='imfomation-room'>
                    <button type="button" onClick={() => this.onChangeSeacrhRoom(0)} className="btn button-all">
                        {STRINGS.ALL} &nbsp;<span className="badge badge-light">{listCount[0]}</span>
                    </button>
                    <button type="button" onClick={() => this.onChangeSeacrhRoom(1)} className="btn button-empty">
                        {STRINGS.EMPTY} &nbsp; <span className="badge badge-dark">{listCount[1]}</span>
                    </button>
                    <button type="button" onClick={() => this.onChangeSeacrhRoom(2)} className="btn button-booking">
                        {STRINGS.BOOKING}&nbsp;<span className="badge badge-light">{listCount[2]}</span>
                    </button>
                    <button type="button" onClick={() => this.onChangeSeacrhRoom(3)} className="btn  button-staying">
                        {STRINGS.STAYING}&nbsp;<span className="badge badge-light">{listCount[3]}</span>
                    </button>
                    <button type="button" onClick={() => this.onChangeSeacrhRoom(4)} className="btn button-close">
                        {STRINGS.LOOK_ROOM} &nbsp;<span className="badge badge-light">{listCount[4]}</span>
                    </button>
                </div>
                <TableListRoom listRooms={listRooms}
                    onUpdate={this.onUpdate}
                    handleChangePage={this.handleChangePage}
                    totalPage={totalPage}
                    currentPage={currentPage}
                />
                <AddRoomModal isShowModal={isShowModal}
                    onUpdate={this.onUpdate} handleClosePopUp={this.handleClosePopUp} />
            </div>
        );
    }
}

const styleButton = {
    float: 'right',
    width: '100%',
    maxWidth: '150px'
}
const styles = {
    padding: '10px 16px',
    fontFamily: 'AvenirNext-Bold',
};



const mapStateToProps = (state) => ({
    locale: state.translation.locale
});

export default connect(mapStateToProps, null)(Rooms);