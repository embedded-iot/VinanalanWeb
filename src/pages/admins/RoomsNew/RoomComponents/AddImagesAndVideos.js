import React, { Component } from "react";
import './AddImagesAndVideos.scss'
import PropTypes from "prop-types";
import {Modal, Checkbox, Row, Col, Upload, Icon } from "antd";
import {FormattedMessage, injectIntl} from "react-intl";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {spinActions} from "../../../../actions";
import * as UploadService from "../../../../components/commons/UploadService";
import * as HomesService from "../../../../pages/admins/Homes/HomesServices";


const CheckboxGroup = Checkbox.Group;

const STRINGS = {
  SELECT_AVATAR_FOR_ROOM: <FormattedMessage id="SELECT_AVATAR_FOR_ROOM" />,
  SETTING_HOME: <FormattedMessage id="SETTING_HOME" />,
  SAVE: <FormattedMessage id="SAVE" />,
  CLOSE: <FormattedMessage id="CLOSE" />
};


class AddImagesAndVideos extends Component {

  state = {
    previewVisible: false,
    previewImage: '',
    // fileList: [{
    //   uid: '-1',
    //   name: 'xxx.png',
    //   status: 'done',
    //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    // }],
    loading: false,
    fileList: []
  };

  componentWillMount() {
    const { selectedHome, dispatch } = this.props;
    dispatch(spinActions.showSpin());
    this.setState({loading: true});
    HomesService.getAllMediaHome(selectedHome.id, response => {
      dispatch(spinActions.hideSpin());
      let images = [];
      if (response.images && response.images.length > 0) {
        images = response.images.map((item, index) => (
          {
            uid: index,
            name: item.substring(item.lastIndexOf('/') + 1),
            status: 'done',
            url: item
          }
        ));
      }
      this.setState({fileList: images, loading: false})

    }, error => {
      dispatch(spinActions.hideSpin());
      this.setState({loading: false});
    });
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  saveUpload = () => {
    const { fileList, selectedIndex } = this.state;
    const { onOk, onCancel } = this.props;
    let images = [];
    if (selectedIndex >= 0) {
      images.push(fileList[selectedIndex].url);
      onOk(images);
    }
    onCancel();
  };

  goToEditHome = home => {
    const { history } = this.props;
    history.push('/Home/' + home.id + '/Edit');
  }

  onSelected = index => {
    this.setState({selectedIndex: index});
  };

  render() {
    const { onCancel, selectedHome, intl} = this.props;
    const { previewVisible, previewImage, fileList, selectedIndex, loading } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return(
      <Modal title={STRINGS.SELECT_AVATAR_FOR_ROOM}
             centered
             width="800px"
             visible={true}
             okText={ fileList && fileList.length > 0 ? STRINGS.SAVE : STRINGS.SETTING_HOME}
             cancelText={STRINGS.CLOSE}
             maskClosable={false}
             onOk={() => fileList && fileList.length > 0 ? this.saveUpload() : this.goToEditHome(selectedHome)}
             onCancel={() => onCancel()}
      >
        <div className="upload-images-videos-wrapper clearfix">
          { !loading && fileList.length === 0 && intl.formatMessage({ id: 'EMPTY_IMAGE_IN_HOME' }, {homeName: selectedHome.homeName})}
          {fileList.length > 0 && (
            <div className="ant-upload-list ant-upload-list-picture-card">
              {
                fileList.map((file, index) => {
                  return (
                    <div key={index} className={ index === selectedIndex ? 'ant-upload-list-item selected' : 'ant-upload-list-item'}
                         onClick={() => this.onSelected(index)}>
                      <div className='ant-upload-list-item-info'>
                        <span>
                          <a className='ant-upload-list-item-thumbnail'>
                            <img src={file.url} alt={file.name} />
                          </a>
                        </span>
                      </div>
                      <span className="ant-upload-list-item-actions" onClick={() => this.handlePreview(file)}><Icon type="eye" /></span>
                    </div>
                  );
                })
              }
            </div>
          )}

          <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </div>
      </Modal>
    );
  }
}

AddImagesAndVideos.propTypes = {
  selectedHome: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func
}

AddImagesAndVideos.defaultProps = {
  selectedHome: {},
  onOk: f => f,
  onCancel: f => f
}

export default injectIntl(withRouter(connect()(AddImagesAndVideos)));