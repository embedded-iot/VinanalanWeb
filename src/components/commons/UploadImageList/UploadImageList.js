import React, { Component } from "react";
import {Upload, Button, Icon} from "antd";

export default class UploadImageList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fileList: []
    };
  }

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
