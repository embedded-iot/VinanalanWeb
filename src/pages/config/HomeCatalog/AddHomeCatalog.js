import PropTypes from "prop-types";
import React, { Component } from "react";
import {Modal, Row, Col, Input, Select, Button, notification} from "antd";
import * as Services from "./HomeCatalogServices";
import { connect } from "react-redux";
import {FormattedMessage, injectIntl} from "react-intl";
import {spinActions} from "../../../actions";

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

class AddHomeCatalog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: {
        catalogName: '',
        catalogDescription: '',
        isActive: true,
        ...props.selected
      },
      isEdit: Object.getOwnPropertyNames(props.selected).length,
      isSubmitted: false
    };
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

  handleSubmit = () => {
    const { selected, isEdit } = this.state;
    const { onChangeVisible, intl, dispatch, user } = this.props;
    this,this.setState({isSubmitted: true});
    if (!selected.catalogName || !selected.catalogDescription) return;

    dispatch(spinActions.showSpin());
    if (isEdit) {
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

  render() {
    const {selected, isEdit, isSubmitted} = this.state;
    const { catalogName, catalogDescription, isActive} = selected;
    const { onChangeVisible} = this.props;
    return (
      <Modal title={ isEdit ? STRINGS.EDIT_HOME_CATALOG : STRINGS.ADD_HOME_CATALOG}
             centered
             width="600px"
             visible={true}
             okText={isEdit ? STRINGS.SAVE : STRINGS.CREATE}
             cancelText={STRINGS.CLOSE}
             maskClosable={false}
             onOk={() => this.handleSubmit()}
             onCancel={() => onChangeVisible()}
      >
        <Row>
          <Col span={8}>{STRINGS.HOME_CATALOG_NAME}</Col>
          <Col span={16}>
            <Input value={catalogName} onChange={this.onChangeName} />
            { isSubmitted && !catalogName && <span style={{color: 'red'}}>{STRINGS.REQUIRED_ALERT}</span>}
          </Col>
        </Row>
        <Row>
          <Col span={8}>{ STRINGS.DESCRIPTION}</Col>
          <Col span={16}>
            <TextArea value={catalogDescription} autosize={{ minRows: 2, maxRows: 6 }}
                      onChange={this.onChangeDescription}/>
            { isSubmitted && !catalogDescription && <span style={{color: 'red'}}>{STRINGS.REQUIRED_ALERT}</span>}
          </Col>
        </Row>
        <Row>
          <Col span={8}>{STRINGS.STATUS}</Col>
          <Col span={16}>
            <Select defaultValue={Number(isActive)} onChange={this.setStatus}>
              {status.map((item, index) => <Option key={index} value={item.value}>{item.title}</Option>)}
            </Select>
          </Col>
        </Row>
      </Modal>
    );
  }
}

AddHomeCatalog.propTypes = {
  onOk: PropTypes.func,
  onCancel: PropTypes.func
};

const mapStateToProps = function (state) {
  return {
    user: state.authentication.user
  }
}


export default injectIntl(connect(mapStateToProps)(AddHomeCatalog));
