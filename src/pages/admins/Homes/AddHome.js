import PropTypes from "prop-types";
import React, {Component} from "react";
import {Modal, Row, Col, Input, Select, Button, notification} from "antd";
import * as Services from "./HomesServices";
import {connect} from "react-redux";
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
import ViewTopUtilities from "./HomeComponents/ViewTopUtilities";
import {getHomeDetails} from "./HomesServices";

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
          images: []
        },
        numFloor: 0,
        numRoom: 0,
        hotline: '',
        managerId: '',
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
      isEdit: false,
      isSubmitted: false,
      utilitiesModal: {
        type: "",
        visible: false,
        selected: []
      },
      isShowUploadModal: false,
      homeManager: {},
      selectedStep: 0
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
    getHomeDetails(id, response => {
      dispatch(spinActions.hideSpin());
      if (response.data) {
        let selected = { ...this.state.selected, ...response.data};
        let { extraFees, outcomeUtilities, incomeUtilities} = response.data;
        selected.income_service = incomeUtilities.map(item => item.id);
        selected.outcome_service = outcomeUtilities.map(item => item.id);
        selected.extra_service = extraFees.map(item => item.id);
        this.setState({selected: selected, outcome_service: outcomeUtilities, income_service: incomeUtilities, extra_service: extraFees });
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
    const {intl, dispatch, user, history} = this.props;
    this.setState({isSubmitted: true});
    if (!selected.homeDescription) return;

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
          history.push('/Home');
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
          history.push('/Home');
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
    const {outcome_service, income_service, extra_service} = this.state.selected;
    let selected;
    switch (type) {
      case 'outcome_service':
        selected = outcome_service;
        break;
      case 'income_service':
        selected = income_service;
        break;
      default:
        selected = extra_service;
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
    let address = { ...this.state.selected.address};
    address[name] = value;
    const selected = { ...this.state.selected, address: address};
    this.setState({ selected: { ...selected}});
    switch (name) {
      case "country_code":
        this.getProvincesByCountry(value);
        break;
      case "province_code":
        this.getDistrictsByProvince(value);
        break;
      case "district_code":
        this.getWardsByDistrict(value);
        break;
    }
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
        || numFloor === undefined || numRoom === undefined || location.lat === undefined || location.lng === undefined || !managerId) {
        this.setState({isSubmitted: true, selectedStep: 0});
      } else {
        this.setState({isSubmitted: false, selectedStep: 1});
      }
    } else {
      this.setState({isSubmitted: false, selectedStep: 0});
    }
  }

  buttonListOne = [
    { title: "Tiếp theo", type: "primary", onClick: () => this.selectedStep(1)}
  ];

  buttonListTwo = [
    { title: "Quay lại", onClick: () => this.selectedStep(0)},
    { title: "Lưu tòa nhà", type: "primary",  icon: "save", onClick: () => this.handleSubmit()}
  ];

  buttonListTwoViewMode = [
    { title: "Quay lại", onClick: () => this.selectedStep(0)}
  ];

  onOkAddUtilities = (type, selectedIdList, selectedList) => {
    let selected = { ...this.state.selected};
    selected[type] = selectedIdList;
    switch (type) {
      case 'income_service':
        this.setState({ selected: selected, income_service: selectedList});
        break;
      case 'outcome_service':
        this.setState({ selected: selected, outcome_service: selectedList});
        break;
      default:
        this.setState({ selected: selected, extra_service: selectedList});
    }
  }

  saveImages = images => {
    this.setState({selected: { ...this.state.selected, media: { ...this.state.selected.media, images: images}}})
  }

  render() {
    const {selected, isSubmitted, homeCatalogs, users, utilitiesModal, isShowUploadModal, countries, provinces, districts, wards, homeManager, selectedStep,
      outcome_service, income_service, extra_service} = this.state;
    const {homeName, homeDescription, homeTypeId, address, location, media, numFloor, numRoom, hotline, managerId,
      isActive} = selected;
    const { images, videos} = media;
    const { address_text, country_code, district_code, province_code, ward_code } = address;
    const {phoneNumber, email} = homeManager;
    const {onChangeVisible} = this.props;
    const [...status] = CONSTANTS.STATUS;
    const { isEdit, isView} = this.state;
    let title;
    if (isEdit) {
      title = 'Chỉnh sửa thông tin tòa nhà';
    } else if (isView) {
      title = 'Thông tin chi tiết tòa nhà';
    } else {
      title = 'Thêm mới tòa nhà';
    }
    return (
      <div className="page-wrapper add-home-page-wrapper">
        <div className="page-headding">
          {title}
        </div>
        <div className="steps-wrapper" style={{display: (selectedStep === 0 ? 'block' : 'none')}}>
          <div className="group-box">
            <div className="group-sub-heading">Thông tin "Khách sạn"</div>
            <div className="group-content">
              <SubTitle
                title="Tên chỗ nghỉ của bạn?"
                titleInfo="Tên này sẽ được hiển thị tới khách hàng khi họ tìm kiếm chỗ nghỉ."
              />
              <InputText
                title="Tên tiếng việt"
                value={homeName}
                isSubmitted={isSubmitted}
                name="homeName"
                isRequired={true}
                onChange={this.onChangeInput}
                disabled={isView}
              />
              <SubTitle title="Loại hình chỗ nghỉ của bạn?" isRequired='true'/>
              <DropdownList
                name="homeTypeId"
                list={homeCatalogs}
                value={homeTypeId}
                isSubmitted={isSubmitted}
                isRequired='true'
                onChange={this.onChangeDropdown}
                disabled={isView}
              />
              <SubTitle
                title="Địa chỉ chỗ nghỉ"
                titleInfo="Địa chỉ chỗ nghỉ của bạn là quan trọng! Vui lòng cung cấp đầy đủ thông tin về địa chỉ chỗ nghỉ của bạn."
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
                title="Quận/Huyện"
                isRequired="true"
                isSubmitted={isSubmitted}
                list={districts}
                value={district_code}
                name="district_code"
                onChange={this.onChangeAddress}
                disabled={isView}
              />
              <DropdownInputSearch
                title="Tên đường, phường, xã"
                isRequired="true"
                isSubmitted={isSubmitted}
                list={wards}
                value={ward_code}
                name="ward_code"
                onChange={this.onChangeAddress}
                disabled={isView}
              />
              <InputTextArea
                title="Số nhà, tầng, tòa nhà,..."
                value={address_text}
                name="address_text"
                onChange={this.onChangeAddress}
                disabled={isView}
              />
              <InputNumber
                title="Lat"
                name="lat"
                value={location.lat}
                isRequired="true"
                isSubmitted={isSubmitted}
                onChange={this.onChangeInputLatLong}
                disabled={isView}
              />
              <InputNumber
                title="Long"
                name="lng"
                value={location.lng}
                isRequired="true"
                isSubmitted={isSubmitted}
                onChange={this.onChangeInputLatLong}
                disabled={isView}
              />
              <InputText
                title="Hot line"
                name="hotline"
                value={hotline}
                isSubmitted={isSubmitted}
                isRequired="true"
                onChange={this.onChangeInput}
                disabled={isView}
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
              <OutputText title="Số điện thoại" value={phoneNumber}/>
              <OutputText title="Email" value={email}/>
            </div>
            <div className='button-list-wrapper'>
              <ButtonList list={this.buttonListOne}/>
            </div>
          </div>
        </div>
        <div className="steps-wrapper" style={{display: (selectedStep === 1 ? 'block' : 'none')}}>
          <div className='images-wrapper'>
            <div className='home-image'>
              <img src={ images && images.length > 0 ? images[0] : ''} alt="Ảnh tòa nhà"/>
            </div>
            <div className='home-details'>
              <div className='home-title'>{homeName}</div>
              <div className='home-description'>{address_text}</div>
            </div>
          </div>
          { !isView && (
            <Button onClick={this.toggleAddUploadModal}>
              Chỉnh sửa thư viện ảnh
            </Button>)
          }
          <div className="group-box">
            <div className="group-header">
              <div className="group-title">Tiện nghi nổi bật</div>
            </div>
            <div className="group-content">
              <ViewTopUtilities
                list={extra_service}
                emptyMessage='Chưa có tiện nghi nào.'/>
            </div>
          </div>
          <div className="group-box">
            <div className="group-header">
              <div className="group-title">Tiện ích ngoài</div>
              { !isView && (
              <div className="group-action">
                <a onClick={() => this.showUtilitiesModal("outcome_service")}>
                  Chỉnh sửa
                </a>
              </div>
              )}
            </div>
            <div className="group-content">
              <ViewUtilities
                list={outcome_service}
                emptyMessage='Tòa nhà chưa gắn với tiện ích ngoài nào. Chọn nút "Chỉnh sửa" để thêm tiện ích.'/>
            </div>
          </div>
          <div className="group-box">
            <div className="group-header">
              <div className="group-title">Tiện ích trong</div>
              { !isView && ( <div className="group-action">
                <a onClick={() => this.showUtilitiesModal("income_service")}>
                  Chỉnh sửa
                </a>
              </div>
              )}
            </div>
            <div className="group-content">
              <ViewUtilities
                list={income_service}
                emptyMessage='Tòa nhà chưa gắn với tiện ích trong nào. Chọn nút "Chỉnh sửa" để thêm tiện ích.'/>
            </div>
          </div>
          <div className="group-box">
            <div className="group-header">
              <div className="group-title">Giới thiệu "Khách sạn"</div>
            </div>
            <div className="group-content">
              <InputTextArea
                title="Hãy mô tả ngắn gọn chỗ nghỉ của bạn"
                name="homeDescription"
                value={homeDescription}
                isSubmitted={isSubmitted}
                isRequired='true'
                onChange={this.onChangeInput}
                style={{maxWidth: "none"}}
                disabled={isView}
              />
            </div>
          </div>
          <div className="group-box">
            <div className="group-header">
              <div className="group-title">Dịch vụ đi kèm</div>
              { !isView && ( <div className="group-action">
                <a onClick={() => this.showUtilitiesModal("extra_service")}>Chỉnh sửa</a>
              </div>)}
            </div>
            <div className="group-content">
              <ViewUtilities
                list={extra_service}
                emptyMessage='Tòa nhà chưa gắn với phụ phí nào nào. Chọn nút "Chỉnh sửa" để thêm tiện ích.'/>
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

AddHome.propTypes = {
  onOk: PropTypes.func,
  onCancel: PropTypes.func
};

const mapStateToProps = function (state) {
  return {
    user: state.authentication.user
  };
};

export default injectIntl(connect(mapStateToProps)(AddHome));
