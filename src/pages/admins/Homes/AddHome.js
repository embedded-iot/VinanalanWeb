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

const Option = Select.Option;
const {TextArea} = Input;

const STRINGS = {
  ADD_HOME_SUCCESS: <FormattedMessage id="ADD_HOME_SUCCESS"/>,
  ADD_HOME_FAIL: <FormattedMessage id="ADD_HOME_FAIL"/>,
  EDIT_HOME_CATALOG: <FormattedMessage id="EDIT_HOME_CATALOG"/>,
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
          long: 0
        },
        media: {},
        numFloor: 0,
        numRoom: 0,
        hotline: '',
        managerId: '',
        isActive: true,
        outcome_service: [],
        income_service: [],
        extra_service: [],
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
      isEdit: props.selected && Object.getOwnPropertyNames(props.selected).length,
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
    this.getInnitData();
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
        this.setState({users: users});
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
    const {onChangeVisible, intl, dispatch, user} = this.props;
    this.setState({isSubmitted: true});
    // if (!selected.catalogName || !selected.catalogDescription) return;

    dispatch(spinActions.showSpin());
    if (isEdit) {
      var id =
        typeof selected.create_by === "object" ? selected.create_by.id : "";
      selected.create_by = id;
      Services.editHomeCatalog(
        selected.id,
        selected,
        response => {
          dispatch(spinActions.hideSpin());
          this.openNotification(
            "success",
            intl.formatMessage({id: "EDIT_HOME_CATALOG_SUCCESS"})
          );
          onChangeVisible(true);
        },
        error => {
          dispatch(spinActions.hideSpin());
          this.openNotification(
            "error",
            intl.formatMessage({id: "EDIT_HOME_CATALOG_FAIL"})
          );
        }
      );
    } else {
      Services.createHomeCatalog(
        {...selected, userId: user.id},
        response => {
          dispatch(spinActions.hideSpin());
          this.openNotification(
            "success",
            intl.formatMessage({id: "ADD_HOME_SUCCESS"})
          );
          onChangeVisible(true);
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

  findHomeManagerById = id => {
    const {users} = this.state;
    const manager = users.find(item => (item.value = id));
    if (!manager) return;
    this.setState({homeManager: manager});
  };

  onChangeAddress = (name, value) => {
    let address = { ...this.state.selected.address};
    address[name] = value;
    const selected = { ...this.state.selected, address: address};
    this.setState({ selected: { ...selected}});
    switch (name) {
      case "country":
        this.getProvincesByCountry(value);
        break;
      case "province":
        this.getDistrictsByProvince(value);
        break;
      case "district":
        this.getWardsByDistrict(value);
        break;
    }
  }

  onChangeDropdownManager = (name, value) => {
    let selected = {...this.state.selected, name: value };
    selected[name] = value;
    this.findHomeManagerById(value);
  }

  onChangeDropdown = (name, value) => {
    let selected = {...this.state.selected, name: value };
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
    this.setState({selectedStep: step});
  }

  buttonListOne = [
    { title: "Lưu và tiếp tục", type: "primary", onClick: () => this.selectedStep(1)}
  ];

  buttonListTwo = [
    { title: "Quay lại", onClick: () => this.selectedStep(0)},
    { title: "Lưu tòa nhà", type: "primary",  icon: "save", onClick: () => this.handleSubmit()}
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

  render() {
    const {selected, isEdit, isSubmitted, homeCatalogs, users, utilitiesModal, isShowUploadModal, countries, provinces, districts, wards, homeManager, selectedStep,
      outcome_service, income_service, extra_service} = this.state;
    const {homeName, homeDescription, homeTypeId, address, location, media, numFloor, numRoom, hotline, managerId,
      isActive} = selected;
    const {phoneNumber, email} = homeManager;
    const {onChangeVisible} = this.props;
    const [...status] = CONSTANTS.STATUS;
    return (
      <div className="page-wrapper add-home-page-wrapper">
        <div className="page-headding">
          Thêm mới tòa nhà
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
                name="homeName"
                isRequired={true}
                onChange={this.onChangeInput}
              />
              <SubTitle title="Loại hình chỗ nghỉ của bạn?"/>
              <DropdownList name="homeTypeId" list={homeCatalogs} onChange={this.onChangeDropdown}/>
              <SubTitle
                title="Địa chỉ chỗ nghỉ"
                titleInfo="Địa chỉ chỗ nghỉ của bạn là quan trọng! Vui lòng cung cấp đầy đủ thông tin về địa chỉ chỗ nghỉ của bạn."
              />
              <DropdownInputSearch
                title="Quốc gia"
                isRequired="true"
                list={countries}
                name="country"
                onChange={this.onChangeAddress}
              />
              <DropdownInputSearch
                title="Tỉnh/Thành phố"
                isRequired="true"
                list={provinces}
                name="province"
                onChange={this.onChangeAddress}
              />
              <DropdownInputSearch
                title="Quận/Huyện"
                isRequired="true"
                list={districts}
                name="district"
                onChange={this.onChangeAddress}
              />
              <DropdownInputSearch
                title="Tên đường, phường, xã"
                isRequired="true"
                list={wards}
                name="ward"
                onChange={this.onChangeAddress}
              />
              <InputTextArea
                title="Số nhà, tầng, tòa nhà,..."
                name="address_text"
                onChange={this.onChangeAddress}
              />
              <InputNumber
                title="Lat"
                name="lat"
                defaultValue={location.lat}
                onChange={this.onChangeInputLatLong}
              />
              <InputNumber
                title="Long"
                name="long"
                defaultValue={location.long}
                onChange={this.onChangeInputLatLong}
              />
              <InputText
                title="Hot line"
                name="hotline"
                isRequired="true"
                onChange={this.onChangeInput}
              />
              <InputNumber
                title="Số tầng"
                name="numFloor"
                defaultValue={numFloor}
                onChange={this.onChangeInput}
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
                list={users}
                name="homeManager"
                onChange={this.onChangeDropdownManager}
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
          <Button onClick={this.toggleAddUploadModal}>
            Chỉnh sửa thư viện ảnh
          </Button>
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
              <div className="group-action">
                <a onClick={() => this.showUtilitiesModal("outcome_service")}>
                  Chỉnh sửa
                </a>
              </div>
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
              <div className="group-action">
                <a onClick={() => this.showUtilitiesModal("income_service")}>
                  Chỉnh sửa
                </a>
              </div>
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
                onChange={this.onChangeInput}
                style={{maxWidth: "none"}}
              />
            </div>
          </div>
          <div className="group-box">
            <div className="group-header">
              <div className="group-title">Dịch vụ đi kèm</div>
              <div className="group-action"><a onClick={() => this.showUtilitiesModal("extra_service")}>Chỉnh sửa</a></div>
            </div>
            <div className="group-content">
              <ViewUtilities
                list={extra_service}
                emptyMessage='Tòa nhà chưa gắn với phụ phí nào nào. Chọn nút "Chỉnh sửa" để thêm tiện ích.'/>
            </div>
          </div>
          <div className='button-list-wrapper'>
            <ButtonList list={this.buttonListTwo}/>
          </div>
          {utilitiesModal.visible && (
            <AddUtilities
              {...utilitiesModal}
              onCancel={this.hideUtilitiesModal}
              onOk={this.onOkAddUtilities}
            />
          )}
          {isShowUploadModal && (
            <AddImagesAndVideos onCancel={this.toggleAddUploadModal}/>
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
