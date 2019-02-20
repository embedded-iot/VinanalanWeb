import React, { Component } from 'react'
import { Button } from "../HomeCatalog/ComponentSetting";
import Table from '../../../components/commons/ReactTable/RactTable';
import * as Services from './RoomsCatalogServices';
import AddRomCatalogModal from './AddRoomsCatalogModal'
import SearchBox from "../../../components/commons/searchBox/SearchBox";
import ic_edit from "../../../public/images/icons/ic_edit.png";
import ic_delete from "../../../public/images/icons/ic_delete.png";
import ic_checkin from "../../../public/images/icons/ic_checkin.png";
import ic_checkout from "../../../public/images/icons/ic_checkout.png";
import * as CONSTANTS from '../../../constants/commonConstant';
import { showModal, success, error } from "../../../actions";
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';

const STRINGS = {
    ROOM_CATALOG_NAME: <FormattedMessage id="ROOM_CATALOG_NAME" />,
    DESCRIPTION: <FormattedMessage id="DESCRIPTION" />,
    CREATE_BY: <FormattedMessage id="CREATE_BY" />,
    LAST_UPDATE: <FormattedMessage id="LAST_UPDATE" />,
    CREATE: <FormattedMessage id="CREATE" />,
    ACTION: <FormattedMessage id="ACTION" />,
    ACTIVE_AND_DEACTIVE: <FormattedMessage id="ACTIVE_AND_DEACTIVE" />,
    ACTION_UPDATE: <FormattedMessage id="ACTION_UPDATE" />,
    ACTION_DELETE: <FormattedMessage id="ACTION_DELETE" />,
    ROOM_CATALOG: <FormattedMessage id="ROOM_CATALOG" />,
    LIST_ROOM_CATALOG: <FormattedMessage id="LIST_ROOM_CATALOG" />,
}

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
            this.setState({ listCatalog: response.data.data });
        }, er => {
            console.log(er);
        })
    }
    onchangeData = (e) => {
        const { target } = e;
        const name = { target }
        this.setState({ [name]: target.value })
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
        this.setState({ isShowModal: false });
    }
    handleSearch = () => {
        alert("Should do search: " + this.state.searchText);
    }

    onChangeSearch = (value) => {
        this.setState({
            searchText: value
        })
    }

    onHandleCheckout = () => {
    }
    onHandleCheckin = () => {
    }

    onHandleEdit = (data) => {
        this.setState({
            data: data,
            isShowModal: true
        })
    }

    onHandleDelete = (id) => {
        const { showModal, success, error } = this.props;
        showModal("Are you sure you want to delete ?", confirm => {
            Services.deleteRoomCatalog(id, res => {
                this.getHomeCatalog();
                success("Success");
            }, er => {
                error(er.message);
            });
        })
    }

    render() {
        const { listCatalog, isShowModal, searchText, data } = this.state;
        const columns = [
            {
                Header: STRINGS.ROOM_CATALOG_NAME,
                accessor: 'catalogName',
                width: 300
            },
            {
                Header: STRINGS.DESCRIPTION,
                accessor: 'catalogDescription',
                minWidth: 300,
                maxWidth: 574
            },
            {
                Header: STRINGS.CREATE_BY,
                accessor: 'create_by',
                maxWidth: 300
            },
            {
                Header: STRINGS.LAST_UPDATE,
                accessor: 'update_by',
                maxWidth: 200
            },
            {
                Header: STRINGS.ACTION,
                Cell: props => <div className="action">
                    <div className="cus-tooltip">
                        <img src={ic_checkout} style={styleIcon} onClick={() => this.onHandleCheckin()} />
                        <span className="tooltiptext">{STRINGS.ACTIVE_AND_DEACTIVE}</span>
                    </div>
                    <div className="cus-tooltip">
                        <img src={ic_edit} style={styleIcon} onClick={() => this.onHandleEdit(props.original)} />
                        <span className="tooltiptext">{STRINGS.LAST_UPDATE}</span>
                    </div>

                    <div className="cus-tooltip">
                        <img src={ic_delete} style={styleIcon} onClick={() => this.onHandleDelete(props.original.id)} />
                        <span className="tooltiptext">{STRINGS.ACTION_DELETE}</span>
                    </div>
                </div>,
                maxWidth: 200
            }
        ]
        return (
            <div className="rom_catalog" style={styles}>
                <div className="row" style={{ marginBottom: '25px' }}>
                    <div className="col-lg-9"><span
                        style={{ fontSize: '28px', fontWeight: 'bold' }}>{STRINGS.ROOM_CATALOG}</span></div>
                    <div className="col-lg 3"><SearchBox value={searchText}
                        onChangeSearch={this.onChangeSearch}
                        onSearch={this.handleSearch} /></div>
                </div>
                <div className="row">
                    <div className="col-lg-8"
                        style={{ fontSize: '20px', fontWeight: 'bold', fontFamily: 'AvenirNext', marginBottom: '16px' }}
                    >{STRINGS.LIST_ROOM_CATALOG}
                    </div>
                    <div className="col-lg-4">
                        <Button
                            style={styleButton}
                            onclick={this.handleShowPopUp}
                            title={STRINGS.CREATE}
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


const mapDispatchToProps = dispatch => {
    return {
        error: (message) => {
            dispatch(error(message));
        },
        success: (message) => {
            dispatch(success(message));
        },
        showModal: (message, confirm) => {
            dispatch(showModal(message, confirm))
        }
    }
};

export default connect(null, mapDispatchToProps)(HomeCatalog);