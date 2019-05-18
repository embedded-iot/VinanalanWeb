import PropTypes from "prop-types";
import React, {Component} from "react";
import {Modal, Row, Col, Input, Select, Button, notification, Tooltip} from "antd";
import * as Services from "./RoomsServices";
import {connect} from "react-redux";
import {FormattedMessage, injectIntl} from "react-intl";
import {spinActions} from "../../../actions";
import * as CONSTANTS from "../../Constants";
import InputText from "../../../components/commons/InputText/InputText";
import DropdownList from "../../../components/commons/DropdownList/DropdownList";
import DropdownInputSearch from "../../../components/commons/DropdownInputSearch/DropdownInputSearch";
import InputTextArea from "../../../components/commons/InputTextArea/InputTextArea";
import InputNumber from "../../../components/commons/InputNumber/InputNumber";
import AddUtilities from "./RoomComponents/AddUtilities";
import AddImagesAndVideos from "./RoomComponents/AddImagesAndVideos";
import ButtonList from "../../../components/commons/ButtonList/ButtonList";
import './AddRoom.scss'
import {getRoomDetails} from "./RoomsServices";
import {getRoomsCatalog} from "../../config/RoomsCatalog/RoomsCatalogServices";
import {getHomes} from "../Homes/HomesServices";
import EditFurniture from "./RoomComponents/EditFurniture";
import no_image from "../../../public/images/icons/no-image.png";
import no_video from "../../../public/images/icons/no-video.png";
import ReactSlick from "../../../components/commons/ReactSlick/ReactSlick";
import camera from "../../../public/images/icons/camera.png";
import ViewUtilities from "./RoomComponents/ViewUtilities";


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
  CLOSE: <FormattedMessage id="CLOSE"/>,
  CHOICE_IMAGE_UPLOAD_BY_HOME_WARNING: 'Vui lòng chọn tòa nhà trước khi thực hiện chức năng này!'
};

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
          images: [],
          videos: []
        },
        maxGuest: 1,
        roomDatePrice: 0,
        roomMonthPrice: 0,
        inFurnitures: [],
        room_utilities: [],
        extraFees: []
      },
      homes: [],
      roomCatalogs: [],
      inFurnituresAll: [],
      room_utilities_all: [],
      isEdit: false,
      isView: false,
      isSubmitted: false,
      utilitiesModal: {
        type: "",
        visible: false,
        selected: []
      },
      selectedHome: {},
      isShowUploadModal: false,
      homeIdFromProps: '',
      numberGuest: [...Array(MAX_GUEST)].map((item, index) => ({ text: (index + 1).toString(), value: (index + 1)}))
    };
  }

  componentWillMount() {
    this.initState();
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const { mode } = this.props.match.params;
    if (nextProps.match.params && nextProps.match.params.mode !== mode) {
      console.log('componentWillReceiveProps');
      this.initState(nextProps);
    }
  }

  initState = (props) => {
    const { roomId, mode, homeId } = props ? props.match.params : this.props.match.params;
    if (roomId) {
      this.getRoomDetails(roomId, this.getInnitData);
    } else {
      this.getInnitData();
    }
    if (mode === 'Edit') {
      this.setState({isEdit: true, isView: false})
    }
    if (mode === 'View') {
      this.setState({isView: true, isEdit: false})
    }
    if (!!homeId) {
      let selected = this.state.selected;
      selected.homeId = homeId;
      this.setState({selected: selected, homeIdFromProps: homeId})
    }
  };

  getRoomDetails = (id, callback)  => {
    const { dispatch } = this.props;
    dispatch(spinActions.showSpin());
    getRoomDetails(id, response => {
      dispatch(spinActions.hideSpin());
      if (response.data && response.data.room) {
        let room = response.data.room;
        let roomDetails = {
          roomName: room.roomName,
          roomDescription: room.roomDescription,
          roomArea: room.roomArea,
          homeId: room.homeId,
          roomTypeId: room.roomTypeId,
          isActive: room.isActive,
          roomMedia: {
            images: room.roomMedia && room.roomMedia.images ? room.roomMedia.images : [],
            videos: room.roomMedia && room.roomMedia.videos ? room.roomMedia.videos : []
          },
          maxGuest: room.maxGuest,
          roomDatePrice: room.roomDatePrice,
          roomMonthPrice: room.roomMonthPrice,
          inFurnitures: room.inFurnitures.length ? room.inFurnitures.map(item => {
            const furniture = item.roomInfurnitures.find(fur => fur.inFurnitureId === item.id);
            return { icon_link: item.icon_link,
              id: item.id,
              name: item.name,
              cost: furniture && furniture.cost ? furniture.cost : 0}
          }) : [],
          room_utilities: room.room_utilities.length ? room.room_utilities.map(item => item.id) : [],
          extraFees: room.extraFees && room.extraFees.length ? room.extraFees.map(item => item.id) : [],
          create_by: room.create_by
        };

        this.setState({selected: {...roomDetails}, selectedHome: room.homes}, () => {
          callback();
        });
      }
    }, error => {
      dispatch(spinActions.hideSpin());
    })
  }

  getInnitData = () => {
    const { roomId, mode, homeId } = this.props.match.params;
    let param = {skip: 0, limit: 100};
    getHomes(param, response => {
      if (response.data && response.data.length) {
        const homes = response.data.map(item => ({
          ...item,
          text: item.homeName,
          value: item.id
        }));
        if (homeId) {
          let selectedHome = homes.find(item => item.id === homeId);
          this.setState({homes: homes, selectedHome});
        } else {
          this.setState({homes: homes, selected: { ...this.state.selected, homeId: homes.length && homes[0] ? homes[0].value : ''}});
        }
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
    return !roomName || roomArea === '' || !homeId || !roomTypeId || roomDatePrice === '' || roomMonthPrice === '' || !roomDescription;
  };

  handleSubmit = () => {
    let {selected, isEdit, inFurnituresAll} = this.state;
    const {intl, dispatch, user, history} = this.props;
    this.setState({isSubmitted: true});
    if (this.isDisabled()) {
      return;
    }

    if (selected.roomDatePrice <= 0 || selected.roomMonthPrice <= 0) {
      this.openNotification('error', intl.formatMessage({id: "INVALID_PRICE"}));
      return;
    }

    selected.inFurnitures = inFurnituresAll.map(item => ({ id: item.id, cost: item.cost}));
    selected.isActive = !!selected.isActive;
    selected.userId= user.id;

    console.log(selected);
    dispatch(spinActions.showSpin());
    if (isEdit) {
      selected.create_by = typeof selected.create_by === "object" ? selected.create_by.id : selected.create_by;
      Services.editRoom(selected,
        response => {
          dispatch(spinActions.hideSpin());
          this.openNotification(
            "success",
            intl.formatMessage({id: "EDIT_HOME_SUCCESS"})
          );
          history.goBack();
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
          selected,
        response => {
          dispatch(spinActions.hideSpin());
          this.openNotification(
            "success",
            intl.formatMessage({id: "ADD_HOME_SUCCESS"})
          );
          history.goBack();
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

  toggleAddUploadModal = () => {
    const { homeId } = this.state.selected;
    if (homeId) {
      this.setState({isShowUploadModal: !this.state.isShowUploadModal});
    } else {
      this.openNotification('info', STRINGS.CHOICE_IMAGE_UPLOAD_BY_HOME_WARNING);
    }
  };



  onChangeDropdown = (name, value) => {
    let selected = {...this.state.selected};
    selected[name] = value;
    if (name === 'homeId') {
      let selectedHome = this.state.homes.find(item => item.id === value);
      selected.roomMedia.images = [];
      this.setState({selected: selected, selectedHome});
    } else {
      this.setState({selected: selected});
    }
  };

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
  };

  editRoom = (id) => {
    const { history } = this.props;
    if (!id) {
      return;
    }
    history.push('/Room/Details/' + id + '/Edit');
  };

  buttonListTwoViewMode = [
    { title: "Quay lại", onClick: () => this.goBackPage()},
    { title: "Chỉnh sửa", type: "primary", onClick: () => this.editRoom(this.state.selected.id)},
  ];

  buttonListTwo = [
    { title: "Quay lại", onClick: () => this.goBackPage()},
    { title: "Lưu phòng", type: "primary",  icon: "save", onClick: () => this.handleSubmit()}
  ];

  onChangeAddUtilities = (type, selectedIdList, selectedList) => {
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
  };

  saveImages = images => {
    this.setState({selected: { ...this.state.selected, roomMedia: { ...this.state.selected.roomMedia, images: images}}})
  };

  getMediaList = () => {
    const { images, videos} = this.state.selected.roomMedia;
    let img = [...images];
    if (img.length < 3) {
      const countPush = 3 - img.length;
      for (let i = 0; i < countPush; i++) {
        img.push(no_image);
      }
    }
    const vd = videos && videos.length > 0 ? [videos] : [no_video];
    return [...img, ...vd]
  };

  render() {
    const {selected, isSubmitted, homes, selectedHome, roomCatalogs, utilitiesModal, isShowUploadModal, numberGuest, inFurnituresAll, room_utilities_all, homeIdFromProps} = this.state;
    const {roomName, roomDescription, roomArea, homeId, roomTypeId, roomMedia, maxGuest, roomDatePrice, roomMonthPrice, inFurnitures, room_utilities, extraFees, isActive} = selected;
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
    const slickSettings = {
      slidesToShow: 4,
      slidesToScroll: 4,
      initialSlide: 0,
      responsive: [
        {
          breakpoint: 1366,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3
          }
        }]
    };
    return (
      <div className="page-wrapper add-room-page-wrapper">
        <div className="page-headding">
          {title}
        </div>
        <div className="steps-wrapper">
          <div className='images-wrapper'>
            <div className='home-image'>
              <img src={ images && images.length > 0 ? images[0] : no_image} alt="Ảnh phòng"/>
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
                    disabled={isView || !!homeIdFromProps}
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
          <div className='image-slick-wrapper'>
            <ReactSlick list={this.getMediaList()} settings={slickSettings}/>
            {
              !isView && (
                  <div className="camera-icon" onClick={this.toggleAddUploadModal}>
                    <Tooltip title="Chọn ảnh từ thư viện ảnh tòa nhà">
                      <img src={camera} alt="Ảnh tòa nhà"/>
                    </Tooltip>
                  </div>
              )
            }
          </div>
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
            </div>
            <div className="group-content">
              { isView ? <ViewUtilities list={room_utilities_all} /> : <AddUtilities type="room_utilities" selected={room_utilities_all} onChange={this.onChangeAddUtilities} /> }
            </div>
          </div>

          <div className="group-box">
            <div className="group-header">
              <div className="group-title">Thiết bị phòng</div>
            </div>
            <div className="group-content">
              {
                isView ? <ViewUtilities list={inFurnituresAll} /> : <AddUtilities type="inFurnitures" selected={inFurnituresAll} onChange={this.onChangeAddUtilities} />
              }
            </div>
          </div>
          <div className="group-box">
            <div className="group-header">
              <div className="group-title">Dịch vụ và bảng giá</div>
            </div>
            <div className="group-content">
              {
                isView ? <ViewUtilities list={extraFees} /> : <AddUtilities type="extraFees" selected={extraFees} onChange={this.onChangeAddUtilities} />
              }
              {/*<EditFurniture emptyMessage='Tòa nhà chưa gắn với dịch vụ phòng nào. Chọn nút "Chỉnh sửa" để thêm dịch vụ.'
                             list={inFurnituresAll} onChange={this.onChangeInputCostFurniture} disabled={isView}/>*/}
            </div>
          </div>
          <InputTextArea
              title="Lưu ý"
              placeholder="Xin mời nhập lưu ý ở đây"
              name="roomDescription"
              value={roomDescription}
              isSubmitted={isSubmitted}
              isRequired='true'
              onChange={this.onChangeInput}
              style={{maxWidth: "none"}}
              disabled={isView}
          />
          <div className='button-list-wrapper'>
            <ButtonList list={ isView ? this.buttonListTwoViewMode : this.buttonListTwo}/>
          </div>
          {isShowUploadModal && (
            <AddImagesAndVideos onCancel={this.toggleAddUploadModal} onOk={this.saveImages} selectedHome={selectedHome}/>
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
