import { Modal, Button } from 'react-bootstrap';
import React from "react";
import { connect } from 'react-redux';
import "./Progress.scss"
import { Spin, Icon } from 'antd';

export class Progress extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const antIcon = <Icon type="loading" style={{ fontSize: 50 }} spin />;
    return (
      <div className="loader-element">
        <Spin indicator={antIcon} spinning={this.props.isShow} />
      </div>
    );
  }
}

const mapStateToProps = function (state) {
  return ({
    isShow: state.spinState.spinState.isShow
  });
};

const mapDispatchToProps = function (dispatch) {
  return ({
    hideModal: () => {
      dispatch(hideModal());
    }
  })
};

export default connect(mapStateToProps, mapDispatchToProps)(Progress);