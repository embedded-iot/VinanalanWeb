import PropTypes from "prop-types";
import React, {Component} from "react";
import {Modal, Row, Col, Input, Select, Button, notification, Tooltip} from "antd";
import * as Services from "./HomesServices";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {FormattedMessage, injectIntl} from "react-intl";
import {spinActions} from "../../../actions";
import * as CONSTANTS from "../../Constants";
import InputText from "../../../components/commons/InputText/InputText";
import DropdownList from "../../../components/commons/DropdownList/DropdownList";
import {getHomeCatalog} from "../../config/HomeCatalog/HomeCatalogServices";
import SubTitle from "../../../components/commons/SubTitle/SubTitle";
import DropdownInputSearch from "../../../components/commons/DropdownInputSearch/DropdownInputSearch";
import InputTextArea from "../../../components/commons/InputTextArea/InputTextArea";
import InputNumber from "../../../components/commons/InputNumber/InputNumber";
import OutputText from "../../../components/commons/OutputText/OutputText";
import {getUsers} from "../../config/Users/UsersServices";
import ViewUtilities from "./HomeComponents/ViewUtilities";
import AddUtilities from "./HomeComponents/AddUtilities";
import AddIncomeUtility from "../../config/IncomeUtilities/AddIncomeUtility";
import AddImagesAndVideos from "./HomeComponents/AddImagesAndVideos";
import {
  getAllContries,
  getDistrictsByProvince,
  getProvincesByCountry,
  getWardsByDistrict
} from "./LocationService";
import ButtonList from "../../../components/commons/ButtonList/ButtonList";
import './AddHome.scss'
import {getIncomeUtilities} from "../../config/IncomeUtilities/IncomeUtilitiesServices";
import {getOutcomeUtilities} from "../../config/OutcomeUtilities/OutcomeUtilitiesServices";
import {getExtraFees} from "../../config/ExtraFees/ExtraFeesServices";
import {getHomeDetails} from "./HomesServices";
import ReactSlick from "../../../components/commons/ReactSlick/ReactSlick";
import {GoogleMapSearchBox} from "../../../components/GoogleMaps/GoogleMapSearchBox";
import InputDatePicker from "../../../components/commons/InputDatePicker/InputDatePicker";
import camera from "../../../public/images/icons/camera.png";
import no_image from "../../../public/images/icons/no-image.png";
import no_video from "../../../public/images/icons/no-video.png";
import AddFees from "../RoomsNew/RoomComponents/AddFees";

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

class AddHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: {
        homeName: '',
        homeDescription: '',
        homeTypeId: '',
        address: {},
        location: {
          lat: 0,
          lng: 0
        },
        media: {
          images: [],
          videos: []
        },
        numFloor: 0,
        numRoom: 0,
        hotline: '',
        managerId: '',
        startDate: '',
        orientation: '',
        isActive: true,
        outcome_service: [],
        income_service: [],
        extra_service: [],
        home_out_furniture: []
      },
      homeCatalogs: [],
      users: [],
      countries: [],
      provinces: [],
      districts: [],
      wards: [],
      outcome_service: [],
      income_service: [],
      extra_service: [],
      out_furniture: [],
      isEdit: false,
      isSubmitted: false,
      isShowUploadModal: false,
      homeManager: {},
      selectedStep: 0,
      loading: false
    };
  }

  componentWillMount() {
    const { homeId, mode } = this.props.match.params;
    if (homeId) {
      this.getHomeDetails(homeId, this.getInnitData);
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

  getHomeDetails = (id, callback)  => {
    const { dispatch } = this.props;
    dispatch(spinActions.showSpin());
    this.setState({loading: true});
    getHomeDetails(id, response => {
      dispatch(spinActions.hideSpin());
      if (response.data) {
        let selected = { ...this.state.selected, ...response.data};
        let { extraFees, outcomeUtilities, incomeUtilities, outFurniture} = response.data;
        selected.income_service = incomeUtilities.map(item => item.id);
        selected.outcome_service = outcomeUtilities.map(item => item.id);
        selected.extra_service = extraFees.map(item => item.id);
        selected.home_out_furniture = outFurniture && outFurniture.map(item => item.id);
        this.setState({selected: selected, outcome_service: outcomeUtilities, income_service: incomeUtilities, extra_service: extraFees, out_furniture: outFurniture || [] }, () => {
          this.setState({loading: false});
        });
        const { address_text, country_code, district_code, province_code, ward_code } = selected.address;
        this.getProvincesByCountry(country_code);
        this.getDistrictsByProvince(province_code);
        this.getWardsByDistrict(district_code);
        callback();
      }
    }, error => {
      dispatch(spinActions.hideSpin());
    })
  }

  getInnitData = () => {
    let param = {skip: 0, limit: 100};
    getHomeCatalog(param, response => {
      if (response.data && response.data.length) {
        const homeCatalogs = response.data.map(item => ({
          text: item.catalogName,
          value: item.id
        }));
        this.setState({homeCatalogs: homeCatalogs});
      }
    });
    getUsers(param, response => {
      if (response.data && response.data.length) {
        const users = response.data.map(item => ({
          email: item.email,
          phoneNumber: item.phoneNumber,
          text: item.userName,
          value: item.id
        }));
        this.setState({users: users}, () => {
          const { selected } = this.state;
          if (selected.managerId) {
            this.findHomeManageById(selected.managerId);
          }
        });

      }
    });

    getAllContries(response => {
      if (response.data && response.data.length) {
        const countries = response.data.map(item => ({
          text: item.name,
          value: item.countryCode
        }));
        this.setState({countries: countries});
      }
    });
  };

  onChangeName = e => {
    const {value} = e.target;
    const selected = {...this.state.selected, catalogName: value};
    this.setState({selected: selected});
  };

  onChangeDescription = e => {
    const {value} = e.target;
    const selected = {...this.state.selected, catalogDescription: value};
    this.setState({selected: selected});
  };

  setStatus = status => {
    const selected = {...this.state.selected, isActive: !!status};
    this.setState({selected: selected});
  };

  openNotification = (type, message, description) => {
    notification[type]({
      message: message,
      description: description
    });
  };

  
  handleSubmit = () => {
    const {selected, isEdit} = this.state;
    const {intl, dispatch, user} = this.props;
    this.setState({isSubmitted: true});
    if (!selected.homeDescription) return;
    selected.isActive = !!selected.isActive;
    dispatch(spinActions.showSpin());
    if (isEdit) {
      var id =
        typeof selected.create_by === "object" ? selected.create_by.id : "";
      selected.create_by = id;
      Services.editHome(selected,
        response => {
          dispatch(spinActions.hideSpin());
          this.openNotification(
            "success",
            intl.formatMessage({id: "EDIT_HOME_SUCCESS"})
          );
          this.goBackPage();
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
      Services.createNewHome(
        {...selected, userId: user.id},
        response => {
          dispatch(spinActions.hideSpin());
          this.openNotification(
            "success",
            intl.formatMessage({id: "ADD_HOME_SUCCESS"})
          );
          this.goBackPage();
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
    this.setState({isShowUploadModal: !this.state.isShowUploadModal});
  };

  getProvincesByCountry = countryCode => {
    getProvincesByCountry(countryCode, response => {
      if (response.data && response.data.length) {
        const provinces = response.data.map(item => ({
          text: item.name,
          value: item.code
        }));
        this.setState({provinces: provinces});
      }
    });
  };

  getDistrictsByProvince = countryCode => {
    getDistrictsByProvince(countryCode, response => {
      if (response.data && response.data.length) {
        const districts = response.data.map(item => ({
          text: item.name,
          value: item.code
        }));
        this.setState({districts: districts});
      }
    });
  };

  getWardsByDistrict = countryCode => {
    getWardsByDistrict(countryCode, response => {
      if (response.data && response.data.length) {
        const wards = response.data.map(item => ({
          text: item.name,
          value: item.code
        }));
        this.setState({wards: wards});
      }
    });
  };

  onChangeAddress = (name, value) => {
    let { countries, provinces, districts, wards} = this.state;
    let address = { ...this.state.selected.address};
    address[name] = value;
    switch (name) {
      case "country_code":
        address.province_code = null;
        address.district_code = null;
        address.ward_code = null;
        provinces: [];
        this.getProvincesByCountry(value);
        break;
      case "province_code":
        address.district_code = null;
        address.ward_code = null;
        districts: [];
        this.getDistrictsByProvince(value);
        break;
      case "district_code":
        address.ward_code = null;
        wards: [];
        this.getWardsByDistrict(value);
        break;
    }
    const selected = { ...this.state.selected, address: address};
    this.setState({ selected: { ...selected} , provinces: provinces, districts: districts});
  }

  findHomeManageById = id => {
    const {users} = this.state;
    const manager = users.find(item => (item.value === id));
    if (!manager) return;
    this.setState({ homeManager: manager});
  }

  onChangeDropdownManager = (name, value) => {
    const {users} = this.state;
    let selected = {...this.state.selected };
    selected[name] = value;
    const manager = users.find(item => (item.value === value));
    if (!manager) return;
    this.setState({ selected: selected, homeManager: manager});
  }

  onChangeDropdown = (name, value) => {
    let selected = {...this.state.selected};
    selected[name] = value;
    this.setState({selected: selected});
  }

  onChangeInputLatLong= (name, value) => {
    let location = { ...this.state.selected.location};
    location[name] = value;
    const selected = { ...this.state.selected, location: location};
    this.setState({ selected: { ...selected}})
  }

  onChangeInput = (name, value) => {
    let selected = {...this.state.selected};
    selected[name] = value;
    this.setState({selected: selected});
  };



  selectedStep = step => {
    const { selected } = this.state;
    const {homeName, homeDescription, homeTypeId, address, location, media, numFloor, numRoom, hotline, managerId,
      isActive} = selected;
    if (step === 1) {
      if (!homeName || !homeTypeId || !address.country_code || !address.province_code|| !address.district_code || !address.ward_code
        || numFloor === '' || numRoom === '' || location.lat === '' || location.lng === '' || !managerId || hotline === '') {
        this.setState({isSubmitted: true, selectedStep: 0});
      } else {
        this.setState({isSubmitted: false, selectedStep: 1});
      }
    } else {
      this.setState({isSubmitted: false, selectedStep: 0});
    }
  };

  goBackPage = () => {
    const { history } = this.props;
    history.goBack();
  };

  buttonListOne = [
    { title: "Quay lại", onClick: this.goBackPage},
    { title: "Tiếp theo", type: "primary", onClick: () => this.selectedStep(1)}
  ];

  buttonListTwo = [
    { title: "Quay lại", onClick: () => this.selectedStep(0)},
    { title: "Lưu tòa nhà", type: "primary",  icon: "save", onClick: () => this.handleSubmit()}
  ];

  buttonListTwoViewMode = [
    { title: "Quay lại", onClick: () => this.selectedStep(0)}
  ];

  onChangeAddUtilities = (type, selectedIdList, selectedList) => {
    let selected = { ...this.state.selected};
    selected[type] = selectedIdList;
    switch (type) {
      case 'income_service':
        this.setState({ selected: selected, income_service: selectedList});
        break;
      case 'outcome_service':
        this.setState({ selected: selected, outcome_service: selectedList});
        break;
      case 'out_furniture':
        this.setState({ selected: selected, home_out_furniture: selectedList});
        break;
      default:
        this.setState({ selected: selected, extra_service: selectedList});
    }
  }

  saveImages = images => {
    this.setState({selected: { ...this.state.selected, media: { ...this.state.selected.media, images: images}}})
  }


  onChangeLocation = (lat, lng, address_text) => {
    // console.log(lat + '-' + lng + '-' + address_text);
    let location = { ...this.state.selected.location};
    let address = { ...this.state.selected.address};
    location.lat = lat;
    location.lng = lng;
    if (address_text) {
      address.address_text = address_text;
    }
    const selected = { ...this.state.selected, location: location, address: address};
    this.setState({ selected: { ...selected}})
  };

  getMediaList = () => {
    const { images, videos} = this.state.selected.media;
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
    const {selected, isSubmitted, homeCatalogs, users, isShowUploadModal, countries, provinces, districts, wards, homeManager, selectedStep,
      outcome_service, income_service, extra_service, out_furniture, loading} = this.state;
    const {homeName, homeDescription, homeTypeId, address, location, media, numFloor, numRoom, hotline, managerId, isActive, startDate, orientation} = selected;
    const { images, videos} = media;
    const { address_text, country_code, district_code, province_code, ward_code } = address;
    const {phoneNumber, email} = homeManager;
    const {onChangeVisible} = this.props;
    const [...status] = CONSTANTS.STATUS.map(item => ({ ...item, value: Number(item.value)}));
    const orientations = CONSTANTS.ORIENTATIONS;
    const { isEdit, isView} = this.state;
    let title;
    if (isEdit) {
      title = 'Chỉnh sửa thông tin tòa nhà';
    } else if (isView) {
      title = 'Thông tin chi tiết tòa nhà';
    } else {
      title = 'Thêm mới tòa nhà';
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
      <div className="page-wrapper add-home-page-wrapper">
        <div className="page-headding">
          {selectedStep === 1 ? homeName : title}
        </div>
        <div className="steps-wrapper" style={{display: (selectedStep === 0 ? 'block' : 'none')}}>
          <div className="group-box">
            <div className="group-sub-heading">Thông tin chung</div>
            <div className="group-content">
              <Row>
                <Col span={12}>
                  <Row>
                    <InputText
                      title="Tên"
                      value={homeName}
                      isSubmitted={isSubmitted}
                      name="homeName"
                      isRequired={true}
                      onChange={this.onChangeInput}
                      disabled={isView}
                      style={{maxWidth: 'none'}}

                    />
                  </Row>
                  <Row>
                    <Col span={12} className="padding-right-30">
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
                      <DropdownList
                        title="Loại hình"
                        name="homeTypeId"
                        list={homeCatalogs}
                        value={homeTypeId}
                        isSubmitted={isSubmitted}
                        isRequired='true'
                        onChange={this.onChangeDropdown}
                        disabled={isView}
                      />
                      <DropdownList
                        title="Hướng"
                        name="orientation"
                        list={orientations}
                        value={orientation}
                        onChange={this.onChangeDropdown}
                        disabled={isView}
                      />
                      <DropdownInputSearch
                        title="Quốc gia"
                        isRequired="true"
                        isSubmitted={isSubmitted}
                        list={countries}
                        value={country_code}
                        name="country_code"
                        onChange={this.onChangeAddress}
                        disabled={isView}
                      />

                      <DropdownInputSearch
                        title="Quận/Huyện"
                        isRequired="true"
                        isSubmitted={isSubmitted}
                        list={districts}
                        value={district_code}
                        name="district_code"
                        onChange={this.onChangeAddress}
                        disabled={isView}
                      />

                    </Col>
                    <Col span={12} className="padding-left-30">
                      <InputDatePicker title="Ngày bắt đầu hoạt động"
                                       name="startDate"
                                       defaultValue={startDate}
                                       onChange={this.onChangeInput}
                      />
                      <InputNumber
                        title="Số tầng"
                        name="numFloor"
                        value={numFloor}
                        isRequired="true"
                        isSubmitted={isSubmitted}
                        onChange={this.onChangeInput}
                        disabled={isView}
                      />
                      <InputNumber
                        title="Hot line"
                        name="hotline"
                        type="phone"
                        value={hotline}
                        isSubmitted={isSubmitted}
                        isRequired="true"
                        onChange={this.onChangeInput}
                        disabled={isView}
                      />
                      <DropdownInputSearch
                        title="Tỉnh/Thành phố"
                        isRequired="true"
                        isSubmitted={isSubmitted}
                        list={provinces}
                        value={province_code}
                        name="province_code"
                        onChange={this.onChangeAddress}
                        disabled={isView}
                      />
                      <DropdownInputSearch
                        title="Đường/Phường/Xã"
                        isRequired="true"
                        isSubmitted={isSubmitted}
                        list={wards}
                        value={ward_code}
                        name="ward_code"
                        onChange={this.onChangeAddress}
                        disabled={isView}
                      />
                    </Col>
                    <Col span={24}>
                      <InputTextArea
                        title="Địa chỉ chi tiết"
                        value={address_text}
                        name="address_text"
                        onChange={this.onChangeAddress}
                        disabled={isView}
                        style={{maxWidth: 'none'}}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col span={12} className="padding-left-60">
                  { !loading && <GoogleMapSearchBox onChangeLocation={this.onChangeLocation} location={location} disabled={isView}/>}
                  <Col span={12} className="padding-right-30">
                    <InputNumber
                      title="Vĩ độ"
                      name="lat"
                      value={location.lat}
                      isRequired="true"
                      isSubmitted={isSubmitted}
                      onChange={this.onChangeInputLatLong}
                      disabled={isView}
                    />
                  </Col>
                  <Col span={12} className="padding-left-30">
                    <InputNumber
                      title="Kinh độ"
                      name="lng"
                      value={location.lng}
                      isRequired="true"
                      isSubmitted={isSubmitted}
                      onChange={this.onChangeInputLatLong}
                      disabled={isView}
                    />
                  </Col>
                </Col>
              </Row>
            </div>
          </div>
          <div className="group-box">
            <div className="group-sub-heading">
              Thông tin người quản lý toàn
            </div>
            <div className="group-content">
              <DropdownInputSearch
                title="Tên người quản lý"
                isRequired="true"
                isSubmitted={isSubmitted}
                list={users}
                value={managerId}
                name="managerId"
                onChange={this.onChangeDropdownManager}
                disabled={isView}
              />
              <Row>
                <Col span={2}>
                  <OutputText title="Số điện thoại" value={phoneNumber}/>
                </Col>
                <Col span={8}>
                  <OutputText title="Email" value={email}/>
                </Col>
              </Row>
            </div>
          </div>
          <div className='button-list-wrapper'>
            <ButtonList list={this.buttonListOne}/>
          </div>
        </div>
        <div className="steps-wrapper" style={{display: (selectedStep === 1 ? 'block' : 'none')}}>
          <div className='images-wrapper'>
            <div className='home-image'>
              <img src={ images && images.length > 0 ? images[0] : no_image} alt="Ảnh tòa nhà"/>
            </div>
            <div className='home-details'>
              <div className='home-description'>{address_text}</div>
              { !loading && <GoogleMapSearchBox onChangeLocation={this.onChangeLocation} location={location} disabled={true}/>}
            </div>
          </div>
          { !isView && (
          <div className='image-slick-wrapper'>
            <ReactSlick list={this.getMediaList()} settings={slickSettings}/>
            <div className="camera-icon" onClick={this.toggleAddUploadModal}>
              <Tooltip title="Thêm hình ảnh và video">
                <img src={camera} alt="Ảnh tòa nhà"/>
              </Tooltip>
            </div>
          </div>)
          }
          <InputTextArea
              title="Giới thiệu"
              placeholder="Mô tả thông tin chi tiết hơn về tòa nhà từ 300-500 chữ"
              name="homeDescription"
              className="input-text-area"
              value={homeDescription}
              isSubmitted={isSubmitted}
              isRequired='true'
              onChange={this.onChangeInput}
              style={{maxWidth: "none"}}
              disabled={isView}
          />
          <div className="group-box">
            <div className="group-header">
              <div className="group-title">Tiện ích xung quanh</div>
            </div>
            <div className="group-content">
              <AddUtilities type="outcome_service" selected={outcome_service} onChange={this.onChangeAddUtilities} />
            </div>
          </div>
          <div className="group-box">
            <div className="group-header">
              <div className="group-title">Dịch vụ tiện ích trong tòa nhà</div>
            </div>
            <div className="group-content">
              <AddUtilities type="income_service" selected={income_service} onChange={this.onChangeAddUtilities} />
            </div>
          </div>
          <div className="group-box">
            <div className="group-header">
              <div className="group-title">Trang thiết bị trong tòa nhà</div>
            </div>
            <div className="group-content">
              <AddUtilities type="out_furniture" selected={out_furniture} onChange={this.onChangeAddUtilities} />
            </div>
          </div>
          <div className="group-box">
            <div className="group-header">
              <div className="group-title">Loại phí và giá (vnđ)</div>
            </div>
            <div className="group-content">
              <AddFees type="extraFees" selected={extra_service} onChange={this.onChangeAddUtilities} />
            </div>
          </div>
          <InputTextArea
              title="Quy định đặt phòng và nội quy"
              placeholder="Mô tả các luật lệ về đặt phòng được sử dụng trong tòa nhà 1000 chữ"
              name="homeDescription"
              value={homeDescription}
              onChange={this.onChangeInput}
              style={{maxWidth: "none"}}
              disabled={isView}
          />
          <div className='button-list-wrapper'>
            <ButtonList list={ isView ? this.buttonListTwoViewMode : this.buttonListTwo}/>
          </div>
          {isShowUploadModal && (
            <AddImagesAndVideos onCancel={this.toggleAddUploadModal} onOk={this.saveImages} list={images}/>
          )}
        </div>
      </div>
    );
  }
}

AddHome.propTypes = {
  onOk: PropTypes.func,
  onCancel: PropTypes.func
};

const mapStateToProps = function (state) {
  return {
    user: state.authentication.user
  };
};

export default injectIntl(withRouter(connect(mapStateToProps)(AddHome)));
