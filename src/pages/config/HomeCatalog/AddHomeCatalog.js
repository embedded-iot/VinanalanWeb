import PropTypes from "prop-types";
import React, { Component } from "react";
import { Modal } from "antd";
import { Input, Textarea } from "../HomeCatalog/ComponentSetting";
import * as Services from "./HomeCatalogServices";
import { connect } from "react-redux";
import { success } from "../../../actions";
import * as CONSTANTS from "../../../constants/commonConstant";
import { FormattedMessage } from "react-intl";

const STRINGS = {
  HOME_CATALOG_NAME: <FormattedMessage id="HOME_CATALOG_NAME" />,
  DESCRIPTION: <FormattedMessage id="DESCRIPTION" />,
  CREATE_NEW_HOME_CATALOG: <FormattedMessage id="CREATE_NEW_HOME_CATALOG" />,
  CREATE: <FormattedMessage id="CREATE" />,
  EDIT: <FormattedMessage id="EDIT" />,
  CLOSE: <FormattedMessage id="CLOSE" />
};


class AddHomeCatalog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: {
        ...props.data
      },
      visible: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.setState({
        selected: nextProps.data || {},
      });
    }
    if (nextProps.visible !== this.props.visible) {
      this.setState({
        visible: nextProps.visible
      });
    }
  }

  onCancel = (close) => {
    this.props.onCancel(close);
  };

  onChangeData = (e) => {
    const { target } = e;
    const { name } = target;
    this.setState({ selected: { ...this.state.selected, [name]: target.value } })
  }

  handleSubmit = () => {
    const { selected } = this.state;
    const { onOk, onCancel, data } = this.props;
    if (data) {
      let value = { ...selected };
      value.update_by = this.props.user;
      value.update_at = new Date().toISOString();
      Services.editHomeCatalog(
        value,
        res => {
          onOk();
        },
        er => {}
      );
    } else {
      Services.createHomeCatalog(
        selected,
        res => {
          showAlert("Success");
          handleClosePopUp(true);
        },
        er => {
          showAlert(er.message);
        }
      );
    }
  };

  render() {
    const { selected, visible} = this.state;
    return (
      <Modal title="ADD HOME CATEGORY"
             centered
             visible={this.state.visible}
             onOk={() => this.handleSubmit()}
             onCancel={() => this.onCancel()}>
        <Input
          value={selected.catalogName || ''}
          title={STRINGS.HOME_CATALOG_NAME}
          name="catalogName"
          onChangeData={this.onChangeData}
        />
        <Textarea
          value={selected.catalogDescription || ''}
          title={STRINGS.DESCRIPTION}
          name="catalogDescription"
          style={{ height: "80px" }}
          onChangeData={this.onChangeData}
        />
      </Modal>
    );
  }
}

AddHomeCatalog.propTypes = {
  onOk: PropTypes.func,
  onCancel: PropTypes.func
};

const mapStateToProps = state => {
  return {
    user: state.authentication.user.userName
  };
};

export default connect(mapStateToProps)(AddHomeCatalog);
