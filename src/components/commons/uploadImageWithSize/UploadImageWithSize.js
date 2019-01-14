import React, { Component } from 'react';
import * as UploadService from '../UploadService';
import { connect } from "react-redux";
import "./UploadImageWithSize.scss";
import { clear, error, success } from "../../../actions";


class UploadImageWithSize extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: [],
      listPreviewUrl: [],
      uploadedImgs: false,
      uploadingImg: false
    };
    this._handleImageChange = this._handleImageChange.bind(this);
  }

  _handleSubmit = () => {
    const formData = new FormData();
    for (let i = 0; i < this.state.file.length; i++) {
      formData.append('file', this.state.file[i]);
    }

    UploadService.uploadImage(formData, response => {
      let uploaded = [];
      let files = response.data.data.result.files.file;
      if (response.data.isSucess) {
        for (let i = 0; i < files.length; i++) {
          uploaded.push(files[i].name)
        }
        this.setState({
          uploadedImgs: true,
          uploadingImg: false,
          listPreviewUrl: uploaded
        })
        this.props.onUpload(uploaded);
      }
    }, error => {
      this.props.error(error);
    });
  }

  filterImage = (files, callback) => {
    let filteredImage = [];
    let count = 0;
    Array.prototype.filter.call(files, file => {
      if ((file.type.includes('image/jpeg') || file.type.includes('image/png'))
        && (file.name.split('.').pop() === 'jpg'
          || file.name.split('.').pop() === 'JPG'
          || file.name.split('.').pop() === 'png'
          || file.name.split('.').pop() === 'PNG')) {

        this.validateImageSize(file, result => {
          if (result) {
            this.validateImageType(file, result => {
              count++;
              if (result) {
                filteredImage.push(file);
              }
              if (count == files.length) {
                callback(filteredImage)
              }
            })
          } else {
            this.props.error(`Please upload image (width = ${this.props.width} & height = ${this.props.height})`);
          }
        });
      } else {
        count++;
        if (count == files.length) {
          callback(filteredImage)
        }
      }
    });
  }

  validateImageSize = (file, callback) => {
    const reader = new FileReader();
    const { width, height } = this.props;
    reader.onloadend = () => {
      var img = new Image();
      img.onload = function () {
        if (this.width == width && this.height == height) {
          callback(true);
        } else {
          callback(false)
        }
      }
      img.src = reader.result;
    }
    reader.readAsDataURL(file);
  }

  validateImageType = (file, callback) => {
    var fileReader = new FileReader();
    fileReader.onloadend = function (e) {
      var arr = (new Uint8Array(e.target.result)).subarray(0, 4);
      var header = '';
      for (var i = 0; i < arr.length; i++) {
        header += arr[i].toString(16);
      }

      // Check the file signature against known types
      var type = 'unknown';
      switch (header) {
        case '89504e47':
          type = 'image/png';
          break;
        // case '47494638':
        //   type = 'image/gif';
        //   break;
        case 'ffd8ffe0':
        case 'ffd8ffe1':
        case 'ffd8ffe2':
          type = 'image/jpeg';
          break;
        // case '25504446':
        //   type = 'application/pdf';
        //   break;
      }
      if (type == 'unknown') {
        callback(false);
      } else {
        callback(true)
      }
    };
    fileReader.readAsArrayBuffer(file);
  }

  _handleImageChange(e) {
    this.filterImage(e.target.files, files => {

      let count = 0;
      if (files.length === 0) {
        this.props.error("Please select files(jpg|png)");
        return false;
      } else {
        this.props.clear();
      }

      this.setState({
        file: files,
        uploadingImg: true
      });
      this._handleSubmit();
    });

  }

  onClickUpload = () => {
    $(`#${this.props.id}`).click();
  }

  render() {
    return (
      <div className="upload-images-with-size">
        <div className="form-input">
          <input id={this.props.id} className="hidden" accept=".jpg, .png" type="file" multiple={this.props.multi} onChange={this._handleImageChange} />
          {
            this.state.uploadingImg && <img className="loading-img" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
          }
          {
            this.props.value ? <div className="image-item">
              <img className="img_logo" src={this.props.value} onClick={this.onClickUpload} />
            </div> : <div className="add-image" onClick={this.onClickUpload}>
                <i className="fas fa-plus"></i>
              </div>
          }
        </div>
      </div >
    )
  }

}

const mapDispatchToProps = dispatch => {
  return {
    error: (message) => {
      dispatch(error(message));
    },
    success: (message) => {
      dispatch(success(message));
    },
    clear: () => {
      dispatch(clear());
    }
  }
};

export default connect(null, mapDispatchToProps)(UploadImageWithSize);