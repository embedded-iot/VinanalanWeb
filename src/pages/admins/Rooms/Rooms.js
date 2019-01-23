import React, {Component} from 'react';
import Provinces from '../../../components/Maps/Provinces';
import Districts from '../../../components/Maps/Districts';
import Wards from '../../../components/Maps/Wards';
import * as CONSTANTS from "../../../constants/commonConstant";
import SearchBox from "../../../components/commons/searchBox/SearchBox";
import TableListRoom from './TableListRoom';
import './Rooms.scss';
import * as Services from './RoomServices'
import Select from "react-select";
import {Button} from "../../config/HomeCatalog/ComponentSetting";
import AddRoomModal from './AddRoomModal'
import {injectIntl} from 'react-intl';
import HomeDropDown from '../../../components/commons/dropdown/HomeDropDown';

const listRow = [
    {label: 'Row 1', value: 8},
    {label: 'Row 2', value: 16},
    {label: 'Row 3', value: 24},
    {label: 'Row 4', value: 32},
]

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
            searchText: '',
            listRooms: [],
            isShowModal: false,
            listCount: [],
            pageSize: {label: 'Row 3', value: 24},
            currentPage: 1
        }
        this.status = '',
            this.page = 0
    }

    componentDidMount() {
        Services.getCountRoomByStatus(res => {
            this.setState({listCount: res.data.data});
        })
    }


    onChangeSelectedMap = (key, value) => {
        this.setState({selectedMap: {...this.state.selectedMap, [key]: value}});
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
        this.setState({isShowModal: true});
    }

    handleClosePopUp = () => {
        this.setState({isShowModal: false});
    }

    onChangeSeacrhRoom = (value) => {
        const {pageSize} = this.state;
        const data = {
            status: value,
            page: 0,
            pageSize: pageSize.value
        }
        this.status = value;
        this.getRoomByStatus(data);
    }
    onUpdate = () => {
        this.getListRooms();
    }

    onChangeHome = (e) => {
        this.setState({homeId: e.target.value});
    }

    getRoomByStatus = (data) => {
        const {pageSize} = this.state;
        Services.getRoomByStatus(data, res => {
            const count = res.data.count;
            if (res.data.count > 0) {
                const currentPage = Math.ceil(count / pageSize.value) !== 0 ? Math.ceil(count / pageSize.value) : 1;
                this.setState({
                    listRooms: res.data.data,
                    totalPage: currentPage,
                    currentPage: this.state.currentPage > currentPage ? 1 : this.state.currentPage
                });
            }
        }, er => {
        })
    }

    handleChangePage = (pageNum) => {
        this.setState({currentPage: pageNum});
        const {pageSize} = this.state;
        const data = {
            status: this.status,
            page: pageSize.value * (pageNum - 1),
            pageSize: pageSize.value
        }
        this.getRoomByStatus(data);
    }

    onChanPageSize = (e) => {
        this.setState({pageSize: e}, () => {
            const data = {
                status: this.status,
                page: 0,
                pageSize: e.value
            }
            this.getRoomByStatus(data);
        });
    }

    render() {
        const {provinces, districts} = this.state.selectedMap;
        const dataMaps = {province_code: provinces.value, district_code: districts.value}
        const {searchText, listRooms, isShowModal, listCount, pageSize, totalPage, currentPage} = this.state;
        return (
            <div className='rooms' style={styles}>
                <div className="row" style={{marginBottom: '25px'}}>
                    <div className="col-lg-8"><span
                        style={{fontSize: '28px', fontWeight: 'bold'}}>{CONSTANTS.ROOM}</span></div>
                    <div className="col-lg 3"><SearchBox placeholder="Search" value={searchText}
                                                         onChangeSearch={this.onChangeSearch}
                                                         onSearch={this.handleSearch}/></div>
                    <div className="col-lg-1 padding-left-0">
                        <Button
                            style={styleButton}
                            onclick={this.handleShowPopUp}
                            title="Create"
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-2">
                        <Provinces onChangeCountry={this.onChangeMaps} value="VN"/>
                    </div>
                    <div className="col-lg-2">
                        <Districts onChangeCountry={this.onChangeMaps} value={provinces.value}/>
                    </div>
                    {/*<div className="col-lg-2">*/}
                    {/*<Wards onChangeCountry={this.onChangeMaps} value={districts.value}/>*/}
                    {/*</div>*/}
                    <div className="col-lg-2">
                        <HomeDropDown onChangeData={this.onChangeHome} name="homeId" data={dataMaps}/>
                    </div>
                    <div className="col-lg-5"></div>
                    <div className="col-lg-1">
                        <Select options={listRow} onChange={this.onChanPageSize}
                                value={pageSize} placeholder='Select Row'></Select>
                    </div>
                </div>

                <div className='imfomation-room'>
                    <button type="button" onClick={() => this.onChangeSeacrhRoom(0)} className="btn button-all">
                        All &nbsp;<span className="badge badge-light">{listCount[0]}</span>
                    </button>
                    <button type="button" onClick={() => this.onChangeSeacrhRoom(1)} className="btn button-empty">
                        Empty &nbsp; <span className="badge badge-dark">{listCount[1]}</span>
                    </button>
                    <button type="button" onClick={() => this.onChangeSeacrhRoom(2)} className="btn button-booking">
                        Booking&nbsp;<span className="badge badge-light">{listCount[2]}</span>
                    </button>
                    <button type="button" onClick={() => this.onChangeSeacrhRoom(3)} className="btn  button-staying">
                        Staying&nbsp;<span className="badge badge-light">{listCount[3]}</span>
                    </button>
                    <button type="button" onClick={() => this.onChangeSeacrhRoom(4)} className="btn button-close">
                        Close &nbsp;<span className="badge badge-light">{listCount[4]}</span>
                    </button>
                </div>
                <TableListRoom listRooms={listRooms}
                               onUpdate={this.onUpdate}
                               handleChangePage={this.handleChangePage}
                               totalPage={totalPage}
                               currentPage={currentPage}
                />
                <AddRoomModal isShowModal={isShowModal} handleClosePopUp={this.handleClosePopUp}/>
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

export default injectIntl(Rooms);