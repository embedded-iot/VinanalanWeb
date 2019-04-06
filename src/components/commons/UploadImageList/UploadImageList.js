import React, { Component } from "react";
import {Upload, Button, Icon} from "antd";
import {openNotification} from "../../../utils/utils";

class UploadImageList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fileList: []
    };
  }

  componentWillMount() {
    const { list, onChange } = this.props;
    let images = list.map((item, index) => (
      {
        uid: index,
        name: item.substring(item.lastIndexOf('/') + 1),
        status: 'done',
        url: item
      }
    ));
    this.setState({fileList: images});
    onChange(images);
  }

  validateFile = (file) => {
    const isJPG = file.type.toLowerCase() === 'image/jpeg' || file.type.toLowerCase() === 'image/png';
    if (!isJPG) {
      openNotification('error','Bạn chỉ có thể tải ảnh định dạng PNG hoặc JPEG!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      openNotification('error','File bạn chọn đã vượt quá 2MB!');
    }
    return isJPG && isLt2M;
  };

  render() {
    const { onChange, multiFile} = this.props;
    const { fileList} = this.state;
    const props = {
      onRemove: (file) => {
        const index = fileList.indexOf(file);
        const newFileList = fileList.slice();
        newFileList.splice(index, 1);

        this.setState({ fileList: newFileList }, onChange(newFileList));
      },
      beforeUpload: (file) => {
        let newFileList ;
        if (!this.validateFile(file)) {
          return false;
        }
        if (multiFile) {
          newFileList = [...fileList, file];
        } else {
          newFileList = [file];
        }
        this.setState({fileList: newFileList}, onChange(newFileList));
        return false;
      },
      fileList: fileList,
    };

    return (
      <Upload {...props}>
        <Button>
          <Icon type="upload" /> Select File
        </Button>
      </Upload>
    );
  }
}

UploadImageList.defaultProps = {
  list: [],
  onChange: f => f,
  multiFile: false
};

export default UploadImageList;
