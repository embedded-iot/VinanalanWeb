import React, {Component} from 'react'
import {Button} from "../HomeCatalog/ComponentSetting";
import Table from '../../../components/commons/ReactTable/RactTable';
import * as Services from './RoomsCatalogServices';
import AddRomCatalogModal from './AddRoomsCatalogModal'
import SearchBox from "../../../components/commons/searchBox/SearchBox";
import ic_edit from "../../../public/images/icons/ic_edit.png";
import ic_delete from "../../../public/images/icons/ic_delete.png";
import ic_checkout from "../../../public/images/icons/ic_checkin.png";
import * as CONSTANTS from '../../../constants/commonConstant';


class HomeCatalog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listCatalog: [],
            isShowModal: false,
            searchText: '',
            data: {}
        }
    }

    componentWillMount() {
        this.getHomeCatalog();
    }

    getHomeCatalog = () => {
        Services.getRoomsCatalog(response => {
            this.setState({listCatalog: response.data.data});
        }, er => {
            console.log(er);
        })
    }
    onchangeData = (e) => {
        const {target} = e;
        const name = {target}
        this.setState({[name]: target.value})
    }

    onFetchData = (state, instance) => {

    }

    handleShowPopUp = () => {
        this.setState({
            isShowModal: true,
            data: null
        });
    }
    handleClosePopUp = (isUpdate) => {
        if (isUpdate) this.getHomeCatalog();
        this.setState({isShowModal: false});
    }
    handleSearch = () => {
        alert("Should do search: " + this.state.searchText);
    }

    onChangeSearch = (value) => {
        this.setState({
            searchText: value
        })
    }

    onHandleCheckout = () => { }
    onHandleCheckin = () => { }

    onHandleEdit = (data) => {
        this.setState({
            data: data,
            isShowModal: true
        })
    }

    onHandleDelete = () =>{ }
    render() {
        const {listCatalog, isShowModal, searchText, data} = this.state;
        const columns = [
            {
                Header: 'Title',
                width: 200,
                id: "row",
                Cell: (row) => <div>{row.index + 1}</div>
            },
            {
                Header: 'Catalog Name',
                accessor: 'catalogName',
                width: 300
            },
            {
                Header: 'Description',
                accessor: 'catalogDescription',
                minWidth: 300,
                maxWidth: 574
            },
            {
                Header: 'Create By',
                accessor: 'create_by',
                maxWidth: 300
            },
            {
                Header: 'Last Update',
                accessor: 'update_by',
                maxWidth: 200
            },
            {
                Header: 'Action',
                Cell: props => <div className="action">
                    <div className="cus-tooltip">
                        {
                            // item.status ? <img src={ic_checkin} onClick={() => this.onHandleCheckout()}/> :
                            <img src={ic_checkout} style={styleIcon} onClick={() => this.onHandleCheckin()}/>
                        }
                        <span className="tooltiptext">Active/Deactive</span>
                    </div>
                    <div className="cus-tooltip">
                        <img src={ic_edit} style={styleIcon} onClick={() => this.onHandleEdit(props.original)}/>
                        <span className="tooltiptext">Update</span>
                    </div>

                    <div className="cus-tooltip">
                        <img src={ic_delete} style={styleIcon} onClick={() => this.onHandleDelete()}/>
                        <span className="tooltiptext">Delete</span>
                    </div>
                </div>,
                maxWidth: 200
            }
        ]
        return (
            <div className="rom_catalog" style={styles}>
                <div className="row" style={{marginBottom: '25px'}}>
                    <div className="col-lg-9"><span style={{fontSize: '28px', fontWeight: 'bold'}}>{CONSTANTS.ROOMS_CATALOG}</span></div>
                    <div className="col-lg 3">  <SearchBox placeholder="Search" value={searchText} onChangeSearch={this.onChangeSearch} onSearch={this.handleSearch} /></div>
                </div>
                <div className="row">
                    <div className="col-lg-8"
                         style={{fontSize: '20px', fontWeight: 'bold', fontFamily: 'AvenirNext', marginBottom: '16px'}}
                    >{CONSTANTS.LIST_ROOMS_CATALOG}
                    </div>
                    <div className="col-lg-4">
                        <Button
                            style={styleButton}
                            onclick={this.handleShowPopUp}
                            title="Create"
                        /></div>
                </div>
                <Table
                    data={listCatalog}
                    columns={columns}
                    defaultPageSize={5}
                    // onFetchData={this.onFetchData}
                />
                <AddRomCatalogModal
                    isShowModal={isShowModal}
                    handleClosePopUp={this.handleClosePopUp}
                    data={data}
                />
            </div>
        );
    }
}


const styleIcon = {
    height: '20px',
    marginLeft: '20px',
}
const styleButton = {
    float: 'right',
    minWidth: '200px'
}

const styles = {
    padding: '10px 16px',
    fontFamily: 'AvenirNext-Bold',
};

export default HomeCatalog;