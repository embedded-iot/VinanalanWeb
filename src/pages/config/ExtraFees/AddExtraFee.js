import PropTypes from "prop-types";
import React, { Component } from "react";
import {Modal, Row, Col, Input, Select, Button, notification} from "antd";
import * as Services from "./ExtraFeesServices";
import { connect } from "react-redux";
import {FormattedMessage, injectIntl} from "react-intl";
import {spinActions} from "../../../actions";
import * as CONSTANTS from '../../Constants';
import UploadImageList from "../../../components/commons/UploadImageList/UploadImageList";
import * as UploadService from "../../../components/commons/UploadService";
import InputTextArea from "../../../components/commons/InputTextArea/InputTextArea";

const Option = Select.Option;

const STRINGS = {
  ADD_EXTRA_FEE: <FormattedMessage id="ADD_EXTRA_FEE" />,
  EDIT_EXTRA_FEE: <FormattedMessage id="EDIT_EXTRA_FEE" />,
  EXTRA_FEE_NAME: <FormattedMessage id="EXTRA_FEE_NAME" />,
  DESCRIPTION: <FormattedMessage id="DESCRIPTION" />,
  UNIT: <FormattedMessage id="UNIT" />,
  STATUS: <FormattedMessage id="STATUS" />,
  ACTION_ACTIVE: <FormattedMessage id="ACTION_ACTIVE" />,
  ACTION_DEACTIVE: <FormattedMessage id="ACTION_DEACTIVE" />,
  REQUIRED_ALERT: <FormattedMessage id="REQUIRED_ALERT" />,
  CREATE: <FormattedMessage id="CREATE" />,
  SAVE: <FormattedMessage id="SAVE" />,
  CLOSE: <FormattedMessage id="CLOSE" />
};


class AddExtraFee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: {
        name: '',
        description: '',
        icon_link: '',
        unit: '',
        isActive: true,
        ...props.selected
      },
      isEdit: props.selected && Object.getOwnPropertyNames(props.selected).length,
      fileList: [],
      isSubmitted: false
    };
  }

  onChangeName = (e) => {
    const { value } = e.target;
    const selected = {...this.state.selected, name: value };
    this.setState({ selected: selected});
  }

  onChangeUnit = (e) => {
    const { value } = e.target;
    const selected = {...this.state.selected, unit: value };
    this.setState({ selected: selected});
  }

  onChangeIconLink = (e) => {
    const { value } = e.target;
    const selected = {...this.state.selected, icon_link: value };
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

  handleSubmit = () => {
    const { selected, isEdit } = this.state;
    const { onChangeVisible, intl, dispatch, user } = this.props;

    this.setState({isSubmitted: true});
    if (!selected.name || !selected.icon_link) return;

    const data = {
      name: selected.name,
      description: selected.description,
      unit: selected.unit,
      icon_link: selected.icon_link,
      isActive: selected.isActive,
      userId: user.id
    };
    dispatch(spinActions.showSpin());
    if (isEdit) {

      Services.editExtraFee(selected.id, data, response => {
        dispatch(spinActions.hideSpin());
        this.openNotification('success', intl.formatMessage({ id: 'EXTRA_FEE_SUCCESS' }));
        onChangeVisible(true);
      }, error => {
        dispatch(spinActions.hideSpin());
        if (error.status === 422) {
          this.openNotification('error', intl.formatMessage({ id: 'EXTRA_FEE_NAME_EXIST' }));
        } else {
          this.openNotification('error', intl.formatMessage({id: 'EDIT_EXTRA_FEE_FAIL'}));
        }
      });
    } else {
      Services.createExtraFee(data,response => {
          dispatch(spinActions.hideSpin());
          this.openNotification('success', intl.formatMessage({ id: 'ADD_EXTRA_FEE_SUCCESS' }));
          onChangeVisible(true);
        },
        error => {
          dispatch(spinActions.hideSpin());
          if (error.data.indexOf('existed') > 0) {
            this.openNotification('error', intl.formatMessage({ id: 'EXTRA_FEE_NAME_EXIST' }));
          } else {
            this.openNotification('error', intl.formatMessage({id: 'ADD_EXTRA_FEE_FAIL'}));
          }
        }
      );
    }
  };

  handleUpload = (fileList, callback) => {
    const { dispatch } = this.props;
    const formData = new FormData();
    const { selected } = this.state;

    if (fileList.length) {
      const uploadedFileList = fileList.filter(file => {
        return file.status === 'done';
      });
      if (uploadedFileList.length === fileList.length) {
        callback();
        return;
      }
      fileList.forEach((file) => {
        formData.append('file', file);
      });
      dispatch(spinActions.showSpin());
      UploadService.postIcon(formData, response => {
        dispatch(spinActions.hideSpin());
        var icon_link = response.file  && response.file.length ? response.file[0].name : '';
        const select = {...selected, icon_link: icon_link};
        this.setState({selected: select}, () => callback())
      }, errors => {
        dispatch(spinActions.hideSpin());
        this.openNotification('error', "Tải hình ảnh thất bại. Vui lòng chọn hình ảnh khác!");
      })
    } else {
      this.setState({ selected: { ... selected, icon_link: ''} }, () => {
        callback();
      });
    }
  }

  onChangeUpload = fileList => {
    this.setState({fileList: fileList});
  };

  onChangeInput = (name, value) => {
    let selected = {...this.state.selected};
    selected[name] = value;
    this.setState({selected: selected});
  };

  render() {
    const {selected, isEdit, isSubmitted, fileList } = this.state;
    const { name, description, icon_link, isActive, unit} = selected;
    const { onChangeVisible} = this.props;
    const [...status] = CONSTANTS.STATUS;
    return (
      <Modal title={ isEdit ? STRINGS.EDIT_EXTRA_FEE : STRINGS.ADD_EXTRA_FEE}
             centered
             width="600px"
             visible={true}
             okText={isEdit ? STRINGS.SAVE : STRINGS.CREATE}
             cancelText={STRINGS.CLOSE}
             maskClosable={false}
             onOk={() => this.handleUpload(fileList, this.handleSubmit)}
             onCancel={() => onChangeVisible()}
      >
        <Row>
          <Col span={8}>{STRINGS.EXTRA_FEE_NAME}<span className="is-required">*</span></Col>
          <Col span={16}>
            <Input value={name} onChange={this.onChangeName} />
            { isSubmitted && !name && <span style={{color: 'red'}}>{STRINGS.REQUIRED_ALERT}</span>}
          </Col>
        </Row>
        <Row>
          <Col span={8}>{ STRINGS.DESCRIPTION}</Col>
          <Col span={16}>
            <InputTextArea
              value={description}
              name="description"
              style={{margin: 0}}
              onChange={this.onChangeInput}
              />
          </Col>
        </Row>
        <Row>
          <Col span={8}>{STRINGS.UNIT}</Col>
          <Col span={16}>
            <Input value={unit} onChange={this.onChangeUnit} />
          </Col>
        </Row>
        <Row>
          <Col span={8}>Icon<span className="is-required">*</span></Col>
          <Col span={16}>
            <UploadImageList onChange={this.onChangeUpload} list={icon_link ? [icon_link] : []}/>
            { isSubmitted && !fileList.length && <span style={{color: 'red'}}>{STRINGS.REQUIRED_ALERT}</span>}
          </Col>
        </Row>
        <Row>
          <Col span={8}>{STRINGS.STATUS}</Col>
          <Col span={16}>
            <Select defaultValue={Number(isActive)} onChange={this.setStatus}>
              {status.map((item, index) => <Option key={index} value={Number(item.value)}>{item.text}</Option>)}
            </Select>
          </Col>
        </Row>
      </Modal>
    );
  }
}

AddExtraFee.propTypes = {
  onOk: PropTypes.func,
  onCancel: PropTypes.func
};

const mapStateToProps = function (state) {
  return {
    user: state.authentication.user
  }
}


export default injectIntl(connect(mapStateToProps)(AddExtraFee));
