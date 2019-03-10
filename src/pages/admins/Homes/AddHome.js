import PropTypes from "prop-types";
import React, { Component } from "react";
import {Modal, Row, Col, Input, Select, Button, notification} from "antd";
import * as Services from "./HomesServices";
import { connect } from "react-redux";
import {FormattedMessage, injectIntl} from "react-intl";
import {spinActions} from "../../../actions";
import * as CONSTANTS from '../../Constants';
import ButtonList from "./Homes";
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

const Option = Select.Option;
const { TextArea } = Input;

const STRINGS = {
  ADD_HOME_CATALOG: <FormattedMessage id="ADD_HOME_CATALOG" />,
  EDIT_HOME_CATALOG: <FormattedMessage id="EDIT_HOME_CATALOG" />,
  HOME_CATALOG_NAME: <FormattedMessage id="HOME_CATALOG_NAME" />,
  DESCRIPTION: <FormattedMessage id="DESCRIPTION" />,
  STATUS: <FormattedMessage id="STATUS" />,
  ACTION_ACTIVE: <FormattedMessage id="ACTION_ACTIVE" />,
  ACTION_DEACTIVE: <FormattedMessage id="ACTION_DEACTIVE" />,
  REQUIRED_ALERT: <FormattedMessage id="REQUIRED_ALERT" />,
  CREATE: <FormattedMessage id="CREATE" />,
  SAVE: <FormattedMessage id="SAVE" />,
  CLOSE: <FormattedMessage id="CLOSE" />
};


const status = [
  { title: STRINGS.ACTION_ACTIVE, value: 1},
  { title: STRINGS.ACTION_DEACTIVE, value: 0}
];

class AddHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: {
        catalogName: '',
        catalogDescription: '',
        isActive: true,
        ...props.selected
      },
      homeCatalogs : [],
      users: [],
      isEdit: props.selected && Object.getOwnPropertyNames(props.selected).length,
      isSubmitted: false,
      utilitiesModal: {
        type: '',
        visible: false,
        selected: []
      },
      isShowUploadModal: false
    };
  }

  componentWillMount() {
    this.getInnitData ();
  }

  getInnitData = () => {
    let param = {skip: 0, limit: 100};
    getHomeCatalog(param, response => {
      if (response.data && response.data.length) {
        const homeCatalogs = response.data.map(item => ({ text: item.catalogName, value: item.id}));
        this.setState({homeCatalogs: homeCatalogs})
      }
    })
    getUsers(param, response => {
      if (response.data && response.data.length) {
        const users = response.data.map(item => ({ text: item.userName, value: item.id}));
        this.setState({users: users})
      }
    })
  }

  onChangeName = (e) => {
    const { value } = e.target;
    const selected = {...this.state.selected, catalogName: value };
    this.setState({ selected: selected});
  }

  onChangeDescription = (e) => {
    const { value } = e.target;
    const selected = {...this.state.selected, catalogDescription: value };
    this.setState({ selected: selected});
  }

  setStatus = status => {
    const selected = {...this.state.selected, isActive: !!status };
    this.setState({ selected: selected});
  }

  openNotification = (type, message, description) => {
    notification[type]({
      message: message,
      description: description,
    });
  };

  onChangeInput = (name, value) => {
    console.log(name + ':' + value);
  }

  handleSubmit = () => {
    const { selected, isEdit } = this.state;
    const { onChangeVisible, intl, dispatch, user } = this.props;
    this,this.setState({isSubmitted: true});
    if (!selected.catalogName || !selected.catalogDescription) return;

    dispatch(spinActions.showSpin());
    if (isEdit) {
      var id = typeof selected.create_by === "object" ? selected.create_by.id : '';
      selected.create_by = id;
      Services.editHomeCatalog(selected.id, selected, response => {
        dispatch(spinActions.hideSpin());
        this.openNotification('success', intl.formatMessage({ id: 'EDIT_HOME_CATALOG_SUCCESS' }));
        onChangeVisible(true);
      }, error => {
        dispatch(spinActions.hideSpin());
        this.openNotification('error', intl.formatMessage({ id: 'EDIT_HOME_CATALOG_FAIL' }));
      });
    } else {
      Services.createHomeCatalog({...selected, userId: user.id},response => {
          dispatch(spinActions.hideSpin());
          this.openNotification('success', intl.formatMessage({ id: 'ADD_HOME_CATALOG_SUCCESS' }));
          onChangeVisible(true);
        },
        er => {
          dispatch(spinActions.hideSpin());
          this.openNotification('error', intl.formatMessage({ id: 'ADD_HOME_CATALOG_FAIL' }));
        }
      );
    }
  };

  onChangeDropdown = (name, value) => {
    console.log(name + ':' + value)
  }

  showUtilitiesModal = type => {
    this.setState({ utilitiesModal: {...this.state.utilitiesModal, type: type, visible: true}});
  }

  hideUtilitiesModal = () => {
    this.setState({ utilitiesModal: {...this.state.utilitiesModal, visible: false}});
  }

  toggleAddUploadModal = () => {
    this.setState({ isShowUploadModal: !this.state.isShowUploadModal});
  }

  render() {
    const {selected, isEdit, isSubmitted, homeCatalogs, users, utilitiesModal, isShowUploadModal} = this.state;
    const { catalogName, catalogDescription, isActive} = selected;
    const { onChangeVisible} = this.props;
    const [...status] = CONSTANTS.STATUS;
    return (
      <div className="page-wrapper">
        <div className="page-headding">
          Thêm mới tòa nhà
        </div>
        <div className="steps-wrapper">
          <div className='group-box'>
            <div className='group-sub-heading'>Thông tin "Khách sạn"</div>
            <div className='group-content'>
              <SubTitle title='Tên chỗ nghỉ của bạn?' titleInfo="Tên này sẽ được hiển thị tới khách hàng khi họ tìm kiếm chỗ nghỉ." />
              <InputText title='Tên tiếng việt' name="name" isRequired={true} onChange={this.onChangeInput}/>
              <SubTitle title='Loại hình chỗ nghỉ của bạn?'/>
              <DropdownList name='homeTypeId' list={homeCatalogs} />
              <SubTitle title='Địa chỉ chỗ nghỉ' titleInfo="Địa chỉ chỗ nghỉ của bạn là quan trọng! Vui lòng cung cấp đầy đủ thông tin về địa chỉ chỗ nghỉ của bạn." />
              <DropdownInputSearch title='Quốc gia' isRequired="true"/>
              <DropdownInputSearch title='Tỉnh/Thành phố' isRequired="true"/>
              <DropdownInputSearch title='Quận/Huyện' isRequired="true"/>
              <InputText title='Tên đường, phường, xã' name="name" onChange={this.onChangeInput}/>
              <InputTextArea title='Số nhà, tầng, tòa nhà,...' name='lat' onChange={this.onChangeInput}/>
              <InputNumber title='Lat' name='lat' onChange={this.onChangeInput}/>
              <InputNumber title='Long' name='long' onChange={this.onChangeInput}/>
              <InputText title='Hot line' name="name" isRequired='true' onChange={this.onChangeInput}/>
              <InputNumber title='Số tầng' name='long' onChange={this.onChangeInput}/>
            </div>
          </div>
          <div className='group-box'>
            <div className='group-sub-heading'>Thông tin người quản lý toàn</div>
            <div className='group-content'>
              <DropdownInputSearch title='Tên người quản lý' isRequired="true" list={users}/>
              <OutputText title='Số điện thoại'/>
              <OutputText title='Email'/>
            </div>
          </div>
        </div>
        <div className="steps-wrapper">
          <Button onClick={ this.toggleAddUploadModal}>Chỉnh sửa thư viện ảnh</Button>
          <div className='group-box'>
            <div className='group-header'>
              <div className='group-title'>Tiện nghi nổi bật</div>
            </div>
            <div className='group-content'>
              Chưa có tiện nghi nào.
            </div>
          </div>
          <div className='group-box'>
            <div className='group-header'>
              <div className='group-title'>Tiện ích ngoài</div>
              <div className='group-action'><a onClick={ () => this.showUtilitiesModal('outcome_utilities')}>Chỉnh sửa</a></div>
            </div>
            <div className='group-content'>
              <ViewUtilities emptyMessage='Tòa nhà chưa gắn với tiện ích ngoài nào. Chọn nút "Chỉnh sửa" để thêm tiện ích.'/>
            </div>
          </div>
          <div className='group-box'>
            <div className='group-header'>
              <div className='group-title'>Tiện ích trong</div>
              <div className='group-action'><a onClick={ () => this.showUtilitiesModal('income_utilities')}>Chỉnh sửa</a></div>
            </div>
            <div className='group-content'>
              <ViewUtilities emptyMessage='Tòa nhà chưa gắn với tiện ích trong nào. Chọn nút "Chỉnh sửa" để thêm tiện ích.'/>
            </div>
          </div>
          <div className='group-box'>
            <div className='group-header'>
              <div className='group-title'>Giới thiệu "Khách sạn"</div>
            </div>
            <div className='group-content'>
              <InputTextArea title='Hãy mô tả ngắn gọn chỗ nghỉ của bạn' name='lat' onChange={this.onChangeInput} style={{maxWidth: 'none'}}/>
            </div>
          </div>
          <div className='group-box'>
            <div className='group-header'>
              <div className='group-title'>Dịch vụ đi kèm</div>
              <div className='group-action'><a onClick={ () => this.showUtilitiesModal('extra_fees')}>Chỉnh sửa</a></div>
            </div>
            <div className='group-content'>
              <ViewUtilities emptyMessage='Tòa nhà chưa gắn với phụ phí nào nào. Chọn nút "Chỉnh sửa" để thêm tiện ích.'/>
            </div>
          </div>
          { utilitiesModal.visible &&  <AddUtilities {...utilitiesModal} onCancel={this.hideUtilitiesModal}/> }
          { isShowUploadModal &&  <AddImagesAndVideos onCancel={this.toggleAddUploadModal}/> }
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
  }
}


export default injectIntl(connect(mapStateToProps)(AddHome));
