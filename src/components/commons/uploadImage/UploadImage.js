import React, { Component } from 'react';
import './UploadImage.scss';
import * as UploadService from '../UploadService';
import { alertConstants } from "../../../constants";
import { connect } from "react-redux";
import { clear, error, success } from "../../../actions";
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';


class ImageUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: [],
      listPreviewUrl: [],
      listImgConverted: [],
      uploadedImgs: false,
      uploadingImg: false
    };
    this._handleImageChange = this._handleImageChange.bind(this);
  }

  handleCropImageSelected = () => {
    this.setState({
      uploadingImg: true
    })
    for (let i = 0; i < this.state.listPreviewUrl.length; i++) {
      if ($(`#crop-btn-${i}`)) {
        $(`#crop-btn-${i}`).click();
      }
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (!nextState.uploadedImgs && nextState.listImgConverted.length == nextState.listPreviewUrl.length) {
      this._handleSubmit();
    }
  }

  _handleSubmit = () => {
    const formData = new FormData();
    for (let i = 0; i < this.state.listImgConverted.length; i++) {
      formData.append('file', this.state.listImgConverted[i]);
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
          uploadingImg: false
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
        count++;
        if (count == files.length) {
          callback(filteredImage)
        }
      }
    });
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

  resizeImage = (img, callback) => {
    var image = new Image();

    image.onload = () => {
      var canvas = document.createElement("canvas");
      var context = canvas.getContext("2d");
      canvas.width = 640;
      canvas.height = 360;
      context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);

      context.canvas.toBlob((blob) => {

        if (blob.size > 200000) {
          const compress = 200000 / blob.size;
          context.canvas.toBlob((blob) => {
            const file_compressed = new File([blob], Date.now(), {
              type: 'image/jpeg',
              lastModified: Date.now()
            });

            const respone = {
              url: canvas.toDataURL(),
              file: file_compressed
            }
            callback(respone);
          }, 'image/jpeg', compress);
        } else {
          const file_compressed = new File([blob], Date.now(), {
            type: 'image/jpeg',
            lastModified: Date.now()
          });

          const respone = {
            url: canvas.toDataURL(),
            file: file_compressed
          }
          callback(respone);
        }
      }, 'image/jpeg', 0.8);

    }
    image.src = img;
  }

  _handleImageChange(e) {
    alert("HEllo");
    e.preventDefault();

    this.filterImage(e.target.files, files => {
      let listFile = [];
      let listPreviewUrl = [];

      let count = 0;
      if (files.length === 0) {
        this.props.error("Please select files(jpg|png)");
        return false;
      } else {
        this.props.clear();
      }

      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        const file = files[i];

        count++;
        reader.onloadend = () => {
          var image = new Image();

          image.onload = () => {
            var canvas = document.createElement("canvas");
            var context = canvas.getContext("2d");
            canvas.width = 640;
            canvas.height = 360;
            context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);

            context.canvas.toBlob((blob) => {
              const file_compressed = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              });

              listFile.push(file_compressed);
              listPreviewUrl.push(canvas.toDataURL());
              this.setState({
                file: listFile,
                listPreviewUrl: listPreviewUrl
              });

              if (count === files.length) {
                this._handleSubmit();
              }
            }, 'image/jpeg', 1);

          }
          image.src = reader.result;
        };
        reader.readAsDataURL(file)
      }
    });

  }

  onClickUpload = () => {
    $("#inputFile").click();
  }

  changeImage = (e) => {
    this.filterImage(e.target.files, files => {
      let listFile = [];
      let listPreviewUrl = [];

      let count = 0;
      if (files.length === 0) {
        this.props.error("Please select files(jpg|png) and dimension(16:9)");
        return false;
      } else {
        this.props.clear();
      }

      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        const file = files[i];

        reader.onloadend = () => {

          count++;
          listFile.push(file);
          let imgObj = {
            id: count,
            imgURL: reader.result,
            compressedImg: ""
          }
          listPreviewUrl.push(imgObj);
          if (count === files.length) {
            this.setState({
              file: listFile,
              listPreviewUrl: listPreviewUrl,
              listImgConverted: [],
              uploadedImgs: false,
              uploadingImg: false
            });
          }

        };
        reader.readAsDataURL(file);
      }
    });
  }

  cropImage = (img, cropper) => {
    if (typeof cropper.getCroppedCanvas() === 'undefined') {
      return;
    }

    let listConvertedFile = this.state.listImgConverted;
    for (let i = 0; i < this.state.listPreviewUrl.length; i++) {
      if (this.state.listPreviewUrl[i].id == img.id) {
        const url = cropper.getCroppedCanvas().toDataURL();
        this.resizeImage(url, resize => {
          const item = {
            id: img.id,
            imgURL: resize.url,
            compressedImg: resize.file
          }
          let convertedImg = this.state.listPreviewUrl.map(item => {
            if (item.id == img.id) {
              return {
                id: img.id,
                imgURL: resize.url,
                compressedImg: resize.file
              }
            } else {
              return item;
            }
          })
          listConvertedFile.push(resize.file);
          this.setState({
            listImgConverted: listConvertedFile,
            listPreviewUrl: convertedImg
          });
        })
      }
    }
  }

  render() {

    return (
      <div className="upload-images">
        <div className="form-input">
          <input id="inputFile" className="hidden" accept=".jpg, .png" type="file" multiple={true} onChange={this.changeImage} />
          {/* <button type="button" className="btn btn-info" onClick={this.onClickUpload}>Upload</button> */}
          {
            this.state.uploadingImg && <img className="loading-img" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
          }
          {
            this.state.listPreviewUrl.length > 0
            && !this.state.uploadedImgs
            && !this.state.uploadingImg
            && <button type="button" className="btn btn-outline-primary btn-upload-img" onClick={this.handleCropImageSelected}>Crop Images</button>
          }
        </div>

        {
          this.state.listPreviewUrl.length > 0 && !this.state.uploadedImgs && this.state.listPreviewUrl.map((img, index) => {
            let cropper_self;
            return <div className="crop-img-box" key={index}>
              {
                img.imgURL && img.compressedImg == "" && <Cropper
                  ref={cropper => {
                    this.cropper = cropper;
                    cropper_self = cropper;
                  }}
                  src={img.imgURL}
                  style={{ height: 396, width: 704, float: "left" }}
                  // Cropper.js options
                  minCropBoxHeight={360}
                  minCropBoxWidth={640}
                  minCanvasHeight={360}
                  minCanvasWidth={640}
                  //scaleble={false}
                  autoCrop={true}
                  cropBoxResizable={false}
                  aspectRatio={16 / 9} />
              }
              <button id={`crop-btn-${index}`} type="button" className="hidden" onClick={(e) => this.cropImage(img, cropper_self)}>Save</button>
              {/* {
                img.compressedImg && <img className="img-cropped" src={img.imgURL} alt="Cropped image" />
              } */}
            </div>
          })

        }
      </div>
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

export default connect(null, mapDispatchToProps)(ImageUpload);