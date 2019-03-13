import React, { Component } from "react";
import './AddImagesAndVideos.scss'
import PropTypes from "prop-types";
import {Modal, Checkbox, Row, Col, Upload, Icon } from "antd";
import {FormattedMessage, injectIntl} from "react-intl";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {spinActions} from "../../../../actions";
import * as UploadService from "../../../../components/commons/UploadService";


const CheckboxGroup = Checkbox.Group;

const STRINGS = {
  ADD_INCOME_UTILITY_IN_HOME_PAGE: 'Xin mời chọn tiện ích trong cho toàn nhà',
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
    fileList: []
  };

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleChange = ({ fileList }) => {
    if (fileList.length > 0) {
      const endFile = fileList[fileList.length - 1];
      if (endFile.response && endFile.response.data) {
        fileList[fileList.length - 1].url = endFile.response.data.result.files.file[0].name;
      }
    }
    this.setState({ fileList });
}

  saveUpload = () => {
    const { fileList } = this.state;
    const { onOk, onCancel } = this.props;
    const images = fileList.map(item => item.url);
    onOk(images);
    onCancel();
  }

  render() {
    const { onCancel} = this.props;
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
//action='http://35.185.47.170:3300/api/container/images/upload'
    // action={file => UploadService.postIcon1(file, this.uploadSuccess, error => {})}
    return(
      <Modal title="Tải lên hình ảnh"
             centered
             width="800px"
             visible={true}
             okText={STRINGS.SAVE}
             cancelText={STRINGS.CLOSE}
             maskClosable={false}
             onOk={() => this.saveUpload()}
             onCancel={() => onCancel()}
      >
        <div className="upload-images-videos-wrapper clearfix">
          <Upload
            action={UploadService.url_upload_image}
            listType="picture-card"
            fileList={fileList}
            onPreview={this.handlePreview}
            onChange={this.handleChange}
          >
            {fileList.length >= 5 ? null : uploadButton}
          </Upload>
          <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </div>
      </Modal>
    );
  }
}

AddImagesAndVideos.propTypes = {
  onOk: PropTypes.func,
  onCancel: PropTypes.func
}

AddImagesAndVideos.defaultProps = {
  onOk: f => f,
  onCancel: f => f
}

export default injectIntl(withRouter(connect()(AddImagesAndVideos)));