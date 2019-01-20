import React, {Component} from 'react';
import Country from '../../../components/Maps/Country';
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

const listRow = [
    {label: 'Row 8', value: 8},
    {label: 'Row 10', value: 10},
    {label: 'Row 15', value: 15},
]

class Rooms extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedMap: {
                country: {value: '', label: ''},
                provinces: '',
                districts: '',
                wards: ''
            },
            searchText: '',
            listRooms: [],
            selectRow: {label: 'Row 8', value: 8},
            isShowModal: false,
            listCount: []
        }
    }

    componentDidMount() {
        this.getListRooms();
    }

    getListRooms = () => {
        Services.getListRooms(res => {
            if (res.data.isSucess)
                this.setState({listRooms: res.data.data})
        }, er => {
        });

        Services.getCountRoomByStatus(res =>{
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
    onChanRow = (optionSelected) => {
        this.setState({selectRow: optionSelected});
    }
    handleShowPopUp = () => {
        this.setState({isShowModal: true});
    }

    handleClosePopUp = (isUpdate) => {
        if (isUpdate) this.getListRooms();
        this.setState({isShowModal: false});
    }

    onChangeSeacrhRoom = (value) => {
        Services.getRoomByStatus(value, res => {
            this.setState({listRooms: res.data.data});
        }, er => {

        })
    }
    onUpdate = () =>{
        this.getListRooms();
    }
    render() {

        const {country, provinces, districts, wards} = this.state.selectedMap;
        const {searchText, listRooms, selectRow, isShowModal, listCount} = this.state;

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
                        <Country onChangeCountry={this.onChangeMaps}/>
                    </div>
                    <div className="col-lg-2">
                        <Provinces onChangeCountry={this.onChangeMaps} value={country.value}/>
                    </div>
                    <div className="col-lg-2">
                        <Districts onChangeCountry={this.onChangeMaps} value={provinces.value}/>
                    </div>
                    <div className="col-lg-2">
                        <Wards onChangeCountry={this.onChangeMaps} value={districts.value}/>
                    </div>
                    <div className="col-lg-3"></div>
                    <div className="col-lg-1">
                        <Select options={listRow} onChange={this.onChanRow}
                                value={selectRow} placeholder='Select Row'></Select>
                    </div>
                </div>

                <div className='imfomation-room'>
                    <button type="button" onClick={this.getListRooms} className="btn button-all">
                        All &nbsp;<span className="badge badge-light"></span>
                    </button>
                    <button type="button" onClick={() => this.onChangeSeacrhRoom(1)} className="btn button-empty">
                        Empty &nbsp; <span className="badge badge-dark">{listCount[0]}</span>
                    </button>
                    <button type="button" onClick={() => this.onChangeSeacrhRoom(2)} className="btn button-booking">
                        Booking&nbsp;<span className="badge badge-light">{listCount[1]}</span>
                    </button>
                    <button type="button" onClick={() => this.onChangeSeacrhRoom(3)} className="btn  button-staying">
                         Staying&nbsp;<span className="badge badge-light">{listCount[2]}</span>
                    </button>
                    <button type="button" onClick={() => this.onChangeSeacrhRoom(4)} className="btn button-close">
                        Close &nbsp;<span className="badge badge-light">{listCount[3]}</span>
                    </button>
                </div>
                <TableListRoom listRooms={listRooms} row={selectRow.value} onUpdate={this.onUpdate}/>
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

export default Rooms;