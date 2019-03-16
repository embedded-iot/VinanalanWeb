import PropTypes from "prop-types";
import React, {Component} from "react";
import {Modal, Row, Col, Input, Select, Button, notification} from "antd";
import * as Services from "./RoomsServices";
import {connect} from "react-redux";
import {FormattedMessage, injectIntl} from "react-intl";
import {spinActions} from "../../../actions";
import * as CONSTANTS from "../../Constants";
import InputText from "../../../components/commons/InputText/InputText";
import DropdownList from "../../../components/commons/DropdownList/DropdownList";
import SubTitle from "../../../components/commons/SubTitle/SubTitle";
import DropdownInputSearch from "../../../components/commons/DropdownInputSearch/DropdownInputSearch";
import InputTextArea from "../../../components/commons/InputTextArea/InputTextArea";
import InputNumber from "../../../components/commons/InputNumber/InputNumber";
import OutputText from "../../../components/commons/OutputText/OutputText";
import ViewUtilities from "./RoomComponents/ViewUtilities";
import AddUtilities from "./RoomComponents/AddUtilities";
import AddImagesAndVideos from "./RoomComponents/AddImagesAndVideos";
import ButtonList from "../../../components/commons/ButtonList/ButtonList";
import './AddRoom.scss'
import {getRoomDetails} from "./RoomsServices";
import {getRoomsCatalog} from "../../config/RoomsCatalog/RoomsCatalogServices";
import {getHomes} from "../Homes/HomesServices";
import EditFurniture from "./RoomComponents/EditFurniture";

const Option = Select.Option;
const {TextArea} = Input;

const STRINGS = {
  ADD_HOME_SUCCESS: <FormattedMessage id="ADD_HOME_SUCCESS"/>,
  ADD_HOME_FAIL: <FormattedMessage id="ADD_HOME_FAIL"/>,
  EDIT_HOME_SUCCESS: <FormattedMessage id="EDIT_HOME_SUCCESS"/>,
  HOME_CATALOG_NAME: <FormattedMessage id="HOME_CATALOG_NAME"/>,
  DESCRIPTION: <FormattedMessage id="DESCRIPTION"/>,
  STATUS: <FormattedMessage id="STATUS"/>,
  ACTION_ACTIVE: <FormattedMessage id="ACTION_ACTIVE"/>,
  ACTION_DEACTIVE: <FormattedMessage id="ACTION_DEACTIVE"/>,
  REQUIRED_ALERT: <FormattedMessage id="REQUIRED_ALERT"/>,
  CREATE: <FormattedMessage id="CREATE"/>,
  SAVE: <FormattedMessage id="SAVE"/>,
  CLOSE: <FormattedMessage id="CLOSE"/>
};

const status = [
  {title: STRINGS.ACTION_ACTIVE, value: 1},
  {title: STRINGS.ACTION_DEACTIVE, value: 0}
];

const MAX_GUEST = 10;

class AddRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: {
        roomName: '',
        roomDescription: '',
        roomArea: 0,
        homeId: '',
        roomTypeId	: '',
        isActive: true,
        roomMedia: {
          images: []
        },
        maxGuest: 1,
        roomDatePrice: 0,
        roomMonthPrice: 0,
        inFurnitures: [],
        room_utilities: []
      },
      homes: [],
      roomCatalogs: [],
      inFurnituresAll: [],
      room_utilities_all: [],
      isEdit: false,
      isSubmitted: false,
      utilitiesModal: {
        type: "",
        visible: false,
        selected: []
      },
      isShowUploadModal: false,
      numberGuest: [...Array(MAX_GUEST)].map((item, index) => ({ text: (index + 1).toString(), value: (index + 1)}))
    };
  }

  componentWillMount() {
    const { roomId, mode } = this.props.match.params;
    if (roomId) {
      this.getRoomDetails(roomId, this.getInnitData);
    } else {
      this.getInnitData();
    }
    if (mode === 'Edit') {
      this.setState({isEdit: true})
    }
    if (mode === 'View') {
      this.setState({isView: true})
    }
  }

  getRoomDetails = (id, callback)  => {
    const { dispatch } = this.props;
    dispatch(spinActions.showSpin());
    getRoomDetails(id, response => {
      dispatch(spinActions.hideSpin());
      if (response.data && response.data.room) {
        let room = response.data.room;
        room.inFurnitures = room.inFurnitures.map(item => ({...item, cost: item.cost || 0}))
        let selected = { ...this.state.selected, ...room};
        let { room_utilities, inFurnitures} = room;
        selected.room_utilities = room_utilities.map(item => item.id);
        selected.inFurnitures = inFurnitures.map(item => item.id);
        this.setState({selected: selected, room_utilities_all: room_utilities, inFurnituresAll: inFurnitures});
        callback();
      }
    }, error => {
      dispatch(spinActions.hideSpin());
    })
  }

  getInnitData = () => {
    let param = {skip: 0, limit: 100};
    getHomes(param, response => {
      if (response.data && response.data.length) {
        const homes = response.data.map(item => ({
          text: item.homeName,
          value: item.id
        }));
        this.setState({homes: homes});
      }
    });
    getRoomsCatalog(param, response => {
      if (response.data && response.data.length) {
        const roomCatalogs = response.data.map(item => ({
          text: item.catalogName,
          value: item.id
        }));
        this.setState({roomCatalogs: roomCatalogs});
      }
    });
  };

  openNotification = (type, message, description) => {
    notification[type]({
      message: message,
      description: description
    });
  };


  isDisabled = () => {
    const {roomName, roomDescription, roomArea, homeId, roomTypeId, roomDatePrice, roomMonthPrice} = this.state.selected;
    return !roomName || roomArea === undefined || !homeId || !roomTypeId || roomDatePrice === undefined || roomMonthPrice === undefined;
  }

  handleSubmit = () => {
    let {selected, isEdit, inFurnituresAll} = this.state;
    const {intl, dispatch, user, history} = this.props;
    this.setState({isSubmitted: true});
    if (this.isDisabled()) {
      return;
    }

    selected.inFurnitures = inFurnituresAll.map(item => ({ id: item.id, cost: item.cost}));
    dispatch(spinActions.showSpin());
    if (isEdit) {
      var id =
        typeof selected.create_by === "object" ? selected.create_by.id : "";
      selected.create_by = id;
      Services.editRoom(selected,
        response => {
          dispatch(spinActions.hideSpin());
          this.openNotification(
            "success",
            intl.formatMessage({id: "EDIT_HOME_SUCCESS"})
          );
          history.push('/Room')
        },
        error => {
          dispatch(spinActions.hideSpin());
          this.openNotification(
            "error",
            intl.formatMessage({id: "EDIT_HOME_FAIL"})
          );
        }
      );
    } else {
      Services.createNewRoom(
        {...selected, userId: user.id},
        response => {
          dispatch(spinActions.hideSpin());
          this.openNotification(
            "success",
            intl.formatMessage({id: "ADD_HOME_SUCCESS"})
          );
          history.push('/Room');
        },
        er => {
          dispatch(spinActions.hideSpin());
          this.openNotification(
            "error",
            intl.formatMessage({id: "ADD_HOME_FAIL"})
          );
        }
      );
    }
  };

  showUtilitiesModal = type => {
    const {inFurnitures, room_utilities} = this.state.selected;
    let selected;
    switch (type) {
      case 'inFurnitures':
        selected = inFurnitures;
        break;
      case 'room_utilities':
        selected = room_utilities;
        break;
    }
    this.setState({
      utilitiesModal: {
        ...this.state.utilitiesModal,
        type: type,
        selected: selected,
        visible: true
      }
    });
  };

  hideUtilitiesModal = () => {
    this.setState({
      utilitiesModal: {...this.state.utilitiesModal, visible: false}
    });
  };

  toggleAddUploadModal = () => {
    this.setState({isShowUploadModal: !this.state.isShowUploadModal});
  };

  onChangeDropdown = (name, value) => {
    let selected = {...this.state.selected};
    selected[name] = value;
    this.setState({selected: selected});
  }

  onChangeInput = (name, value) => {
    let selected = {...this.state.selected};
    selected[name] = value;
    this.setState({selected: selected});
  };

  onChangeInputCostFurniture = (name, value) => {
    let inFurnituresAll = [...this.state.inFurnituresAll];
    inFurnituresAll[Number(name)].cost = value;
    this.setState({inFurnituresAll: inFurnituresAll});
  };

  goBackPage = () => {
    const { history } = this.props;
    history.goBack();
  }

  buttonListTwoViewMode = [
    { title: "Quay lại", onClick: () => this.goBackPage()}
  ];

  buttonListTwo = [
    { title: "Quay lại", onClick: () => this.goBackPage()},
    { title: "Lưu phòng", type: "primary",  icon: "save", onClick: () => this.handleSubmit()}
  ];

  onOkAddUtilities = (type, selectedIdList, selectedList) => {
    const { inFurnituresAll } = this.state;
    let selected = { ...this.state.selected};
    selected[type] = selectedIdList;
    switch (type) {
      case 'inFurnitures':
        const inFurnituresAllNew = selectedList.map(item => {
          let existFurniture = inFurnituresAll.find(furniture => furniture.id === item.id);
          return {
            ...item, cost: existFurniture && existFurniture.cost ? existFurniture.cost : 0
          }
        });
        this.setState({ selected: selected, inFurnituresAll: inFurnituresAllNew });
        break;
      case 'room_utilities':
        this.setState({ selected: selected, room_utilities_all: selectedList});
        break;
    }
  }

  saveImages = images => {
    this.setState({selected: { ...this.state.selected, roomMedia: { ...this.state.selected.roomMedia, images: images}}})
  }

  render() {
    const {selected, isSubmitted, homes, roomCatalogs, utilitiesModal, isShowUploadModal, numberGuest, inFurnituresAll, room_utilities_all} = this.state;
    const {roomName, roomDescription, roomArea, homeId, roomTypeId, roomMedia, maxGuest, roomDatePrice, roomMonthPrice, inFurnitures, room_utilities, isActive} = selected;
    const { images} = roomMedia;
    const [...status] = CONSTANTS.STATUS.map(item => ({ ...item, value: Number(item.value)}));
    const { isEdit, isView} = this.state;
    let title;
    if (isEdit) {
      title = 'Chỉnh sửa thông tin phòng';
    } else if (isView) {
      title = 'Thông tin chi tiết phòng';
    } else {
      title = 'Thêm mới phòng';
    }
    return (
      <div className="page-wrapper add-room-page-wrapper">
        <div className="page-headding">
          {title}
        </div>
        <div className="steps-wrapper">
          <div className='images-wrapper'>
            <div className='home-image'>
              <img src={ images && images.length > 0 ? images[0] : ''} alt="Ảnh tòa nhà"/>
            </div>
            <div className='home-details'>
              <div className="group-box">
                <div className="group-sub-heading">Loại phòng</div>
                <div className="group-content">
                  <InputText
                    title="Tên phòng"
                    titleInfo="Đây là tên mà khách sẽ nhìn thấy trên website"
                    value={roomName}
                    isSubmitted={isSubmitted}
                    name="roomName"
                    isRequired={true}
                    onChange={this.onChangeInput}
                    disabled={isView}
                  />
                  <DropdownInputSearch
                    name="homeId"
                    title="Chọn tòa nhà"
                    list={homes}
                    value={homeId}
                    isSubmitted={isSubmitted}
                    isRequired='true'
                    onChange={this.onChangeDropdown}
                    disabled={isView}
                  />
                  <DropdownInputSearch
                    name="roomTypeId"
                    title="Chọn loại phòng"
                    list={roomCatalogs}
                    value={roomTypeId}
                    isSubmitted={isSubmitted}
                    isRequired='true'
                    onChange={this.onChangeDropdown}
                    disabled={isView}
                  />
                  <DropdownList
                    name="isActive"
                    title="Trạng thái"
                    list={status}
                    value={Number(isActive)}
                    isSubmitted={isSubmitted}
                    isRequired='true'
                    onChange={this.onChangeDropdown}
                    disabled={isView}
                  />
                  <InputNumber
                    title="Diện tích phòng"
                    titleInfo="Không bắt buộc. Phòng sẽ được hiển thị tốt hơn nếu chọn mục này."
                    description='(Đơn vị: m2)'
                    name="roomArea"
                    value={roomArea}
                    onChange={this.onChangeInput}
                    disabled={isView}
                  />
                </div>
              </div>
            </div>
          </div>
          { !isView && <div style={{marginBottom: '15px'}}>
              <Button onClick={this.toggleAddUploadModal}>
                Chọn ảnh đại diện
              </Button>
            </div>
          }
          <div className="group-box">
            <div className="group-sub-heading">
              Khách
            </div>
            <div className="group-content">
              <DropdownList
                name="maxGuest"
                title="Số lượng khách tối đa"
                list={numberGuest}
                value={maxGuest}
                isSubmitted={isSubmitted}
                isRequired='true'
                onChange={this.onChangeDropdown}
                disabled={isView}
              />
            </div>
          </div>
          <div className="group-box">
            <div className="group-sub-heading">
              Giá phòng
            </div>
            <div className="group-content">
              <Row>
                <Col span={12}>
                  <InputNumber
                    title="Giá cơ bản cho một đêm nghỉ"
                    name="roomDatePrice"
                    description="(VNĐ/phòng/đêm)"
                    value={roomDatePrice}
                    isSubmitted={isSubmitted}
                    isRequired='true'
                    onChange={this.onChangeInput}
                    disabled={isView}
                  />
                </Col>
                <Col span={12}>
                  <InputNumber
                    title="Giá cho nghỉ dài ngày (trên 30 ngày)"
                    name="roomMonthPrice"
                    description="(VNĐ/phòng/đêm)"
                    value={roomMonthPrice}
                    isSubmitted={isSubmitted}
                    isRequired='true'
                    onChange={this.onChangeInput}
                    disabled={isView}
                  />
                </Col>
              </Row>
            </div>
          </div>
          <div className="group-box">
            <div className="group-header">
              <div className="group-title">Tiện ích phòng</div>
              { !isView && ( <div className="group-action">
                <a onClick={() => this.showUtilitiesModal("room_utilities")}>
                  Chỉnh sửa
                </a>
              </div>
              )}
            </div>
            <div className="group-content">
              <ViewUtilities
                list={room_utilities_all}
                emptyMessage='Tòa nhà chưa gắn với tiện ích phòng nào. Chọn nút "Chỉnh sửa" để tiện ích.'/>
            </div>
          </div>
          <div className="group-box">
            <div className="group-header">
              <div className="group-title">Dịch vụ và giá đi kèm</div>
              { !isView && ( <div className="group-action">
                <a onClick={() => this.showUtilitiesModal("inFurnitures")}>Chỉnh sửa</a>
              </div>)}
            </div>
            <div className="group-content">
                <EditFurniture emptyMessage='Tòa nhà chưa gắn với dịch vụ phòng nào. Chọn nút "Chỉnh sửa" để thêm dịch vụ.'
                               list={inFurnituresAll} onChange={this.onChangeInputCostFurniture} disabled={isView}/>
            </div>
          </div>
          <div className="group-box">
            <div className="group-header">
              <div className="group-title">Lưu ý</div>
            </div>
            <div className="group-content">
              <InputTextArea
                title="Xin mời nhập lưu ý ở đây"
                name="roomDescription"
                value={roomDescription}
                isSubmitted={isSubmitted}
                isRequired='true'
                onChange={this.onChangeInput}
                style={{maxWidth: "none"}}
                disabled={isView}
              />
            </div>
          </div>
          <div className='button-list-wrapper'>
            <ButtonList list={ isView ? this.buttonListTwoViewMode : this.buttonListTwo}/>
          </div>
          {utilitiesModal.visible && (
            <AddUtilities
              {...utilitiesModal}
              onCancel={this.hideUtilitiesModal}
              onOk={this.onOkAddUtilities}
            />
          )}
          {isShowUploadModal && (
            <AddImagesAndVideos onCancel={this.toggleAddUploadModal} onOk={this.saveImages}/>
          )}
        </div>
      </div>
    );
  }
}

AddRoom.propTypes = {
  onOk: PropTypes.func,
  onCancel: PropTypes.func
};

const mapStateToProps = function (state) {
  return {
    user: state.authentication.user
  };
};

export default injectIntl(connect(mapStateToProps)(AddRoom));
