import React, { Component } from "react";
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import "../styles/Admin.scss";
import "./Home.scss";
import SearchBox from "../../../components/commons/searchBox/SearchBox";
import Dropdown from "../../../components/commons/dropdown/Dropdown";
import * as HomeServices from "./HomeServices";
import DataTable from "../../../components/commons/dataTable/DataTable";
import ic_add_images from "../../../public/images/icons/ic_add-images.png";
import * as LocationServices from "../../../services/LocationService";
import { success, error, showModal } from "../../../actions";
import UploadImage from "../../../components/commons/uploadImage/UploadImage";
import { extend } from 'lodash';

class Home extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);

    this.state = {
      openAddModal: false,

      isUpdate: false,
      isValid: true,
      id: "",
      homeName: "",
      homeDescription: "",
      location: {
        country_code: "",
        province_code: "",
        district_code: "",
        ward_code: "",
        address_text: ""
      },
      media: {
        images: []
      },
      homeStatus: 1,

      searchText: "",
      selectedHome: [],
      listHome: [],
      selectedCountry: null,
      listCountry: [],
      selectedProvince: null,
      listProvince: [],
      selectedDistrict: null,
      listDistrict: [],
      selectedWard: null,
      listWard: [],
      selectedCountryHome: null,
      selectedProvinceHome: null,
      selectedDistrictHome: null,
      selectedWardHome: null
    }
  }
  componentDidMount() {
    this.getListHome();
    this.getListContries();
    this._isMounted = true;
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  openModal = () => {
    this.setState({
      openAddModal: true
    });
  };

  hideModal = () => {
    this.setState({
      openAddModal: false
    });
  };

  getListHome = () => {
      const data = {
          province_code: '',
          district_code: '',
      }
    HomeServices.getListHome(null, response => {
      if (response.data.isSucess) {
        let data = [];
        for (let i = 0; i < response.data.data.length; i++) {
          const item = {
            Id: response.data.data[i].id,
            Title: response.data.data[i].homeName,
            Description: response.data.data[i].homeDescription,
            Status: response.data.data[i].homeStatus
          }
          data.push(item);
        }
        if (this._isMounted) {
          this.setState({
            listHome: data
          })
        }
      }
    }, error => {
      console.log(error);
    })
  }
  handleSearch = () => {
    alert("Should do search: " + this.state.searchText);
  }
  onChangeSearch = (value) => {
    this.setState({
      searchText: value
    })
  }
  getContries = () => {
    return new Promise((resolse, reject) => {
      LocationServices.getContries(response => {
        resolse(response);
      }, error => {
        reject(error);
      })
    })
  }

  getProvinces = (contryId) => {
    return new Promise((resolse, reject) => {
      LocationServices.getProvinces(contryId, response => {
        resolse(response);
      }, error => {
        reject(error);
      })
    })
  }

  getDistricts = (provinceCode) => {
    return new Promise((resolse, reject) => {
      LocationServices.getDistricts(provinceCode, response => {
        resolse(response);
      }, error => {
        reject(error);
      })
    })
  }

  getWards = (districtCode) => {
    return new Promise((resolse, reject) => {
      LocationServices.getWards(districtCode, response => {
        resolse(response);
      }, error => {
        reject(error);
      })
    })
  }
  getListContries = () => {
    LocationServices.getContries(response => {
      if (response.data.isSucess) {
        let listCountry = response.data.data.map(item => {
          item.title = item.name || item.countryName;
          return item;
        });
        this.setState({
          listCountry: listCountry
        })
      }
    }, error => {
      this.props.error(error);
    })
  }
  getListProvinces = (contryId) => {
    LocationServices.getProvinces(contryId, response => {
      if (response.data.isSucess) {
        let listProvince = response.data.data.map(item => {
          item.title = item.name_with_type;
          return item;
        });
        this.setState({
          listProvince: listProvince
        })
      }
    }, error => {
      this.props.error(error);
    })
  }
  getListDistricts = (provinceCode) => {
    LocationServices.getDistricts(provinceCode, response => {
      if (response.data.isSucess) {
        let listDistrict = response.data.data.map(item => {
          item.title = item.name_with_type;
          return item;
        })
        this.setState({
          listDistrict: listDistrict
        })
      }
    }, error => {
      this.props.error(error);
    })
  }
  getListWards = (districtCode) => {
    LocationServices.getWards(districtCode, response => {
      if (response.data.isSucess) {
        let listWard = response.data.data.map(item => {
          item.title = item.name_with_type;
          return item;
        })
        this.setState({
          listWard: listWard
        })
      }
    }, error => {
      this.props.error(error);
    })
  }
  onSelectCountry = (item) => {
    this.setState({
      selectedCountry: item,
      listProvince: [],
      selectedProvince: null,
      listDistrict: [],
      selectedDistrict: null,
      listWard: [],
      selectedWard: null
    })
    this.getListProvinces(item.countryCode);
  }
  onSelectProvince = (item) => {
    this.setState({
      selectedProvince: item,
      listDistrict: [],
      selectedDistrict: null,
      listWard: [],
      selectedWard: null
    })
    this.getListDistricts(item.code);
  }
  onSelectDistrict = (item) => {
    this.setState({
      selectedDistrict: item,
      listWard: [],
      selectedWard: null
    })
    this.getListWards(item.code);
  }
  onSelectWard = (item) => {
    this.setState({
      selectedWard: item
    })
  }
  onSelectItem = (value, checked) => {
    let state = this.state;
    if (value === "ALL") {
      if (checked) {
        state.selectedHome = state.listHome;
      } else {
        state.selectedHome = []
      }
    } else {
      let selectedHome = state.selectedHome;

      if (checked) {
        selectedHome = state.selectedHome.filter(item => item.Id !== state.listHome[value].Id);
        selectedHome.push(state.listHome[value]);
      } else {
        selectedHome = state.selectedHome.filter(item => item.Id !== state.listHome[value].Id);
      }
      state.selectedHome = selectedHome;
    }
    this.setState(state);
  }

  onHandleView = (value) => {
      this.props.history.push(`Room/${value}`);
  }

  onHandleAcive = (id, status) => {
      HomeServices.changeStatus({id: id, status: status}, res =>{
          this.getListHome();
      })
  }
  onHandleEdit = (home) => {
    this.setState({
      isUpdate: true
    })
    if (home) {
      HomeServices.getHomeById(home.Id, response => {
        if (response.data.isSucess) {
          const data = response.data.data;
          data.location.address_text = data.location.address_text.split(",")[0];
          this.setState({
            id: data.id,
            homeName: data.homeName,
            homeDescription: data.homeDescription,
            media: data.media,
            location: data.location
          })
          Promise.all([
            this.getContries(),
            this.getProvinces(data.location.country_code),
            this.getDistricts(data.location.province_code),
            this.getWards(data.location.district_code)])
            .then((response) => {
              const listCountry = response[0].data.data;
              const listProvince = response[1].data.data;
              const listDistrict = response[2].data.data;
              const listWard = response[3].data.data;

              for (let i = 0; i < listCountry.length; i++) {
                if (listCountry[i].countryCode == data.location.country_code) {
                  const selectedItem = extend(listCountry[i], { "title": listCountry[i].name });
                  this.onSelectCountryHome(selectedItem);
                  break;
                }
              }
              for (let i = 0; i < listProvince.length; i++) {
                if (listProvince[i].code == data.location.province_code) {
                  const selectedItem = extend(listProvince[i], { "title": listProvince[i].name_with_type });
                  this.onSelectProvinceHome(selectedItem);
                  break;
                }
              }
              for (let i = 0; i < listDistrict.length; i++) {
                if (listDistrict[i].code == data.location.district_code) {
                  const selectedItem = extend(listDistrict[i], { "title": listDistrict[i].name_with_type });
                  this.onSelectDistrictHome(selectedItem);
                  break;
                }
              }
              for (let i = 0; i < listWard.length; i++) {
                if (listWard[i].code == data.location.ward_code) {
                  const selectedItem = extend(listWard[i], { "title": listWard[i].name_with_type });
                  this.onSelectWardHome(selectedItem);
                  break;
                }
              }

              this.setState({
                listCountry: listCountry,
                listProvince: listProvince,
                listDistrict: listDistrict,
                listWard: listWard
              })
            })
          $('#add-new-home').modal('show');
        } else {
          this.props.error(response.data.message);
        }
      }, error => {
        this.props.error(error);
      })
    }
  }
  onHandleDelete = (home) => {
    if (home) {
      this.props.showModal("Do you want delete  " + home.Title + " ?", confirm => {
        HomeServices.deleteHome(home.Id, response => {
          if (response.data.isSucess) {
            this.props.success("Delete successful");
            this.getListHome();
          } else {
            this.props.error("Something were wrong!")
          }
        })
      }, error => {
        this.props.error(error);
      })
    } else {
      this.props.showModal("Do you want delete selected homes?", confirm => {
        const selectedHome = this.state.selectedHome;
        let countDelete = 0;
        for (let i = 0; i < selectedHome.length; i++) {
          HomeServices.deleteHome(selectedHome[i].Id, response => {
            countDelete++;
            if (response.data.isSucess) {
              this.setState({
                selectedHome: selectedHome.filter(item => item.Id !== selectedHome[i].Id)
              })
            }

            if (countDelete === selectedHome.length) {
              this.props.success("Delete success " + countDelete + " homes");
              this.getListHome();
            }
          }, error => {
            countDelete++;
            if (countDelete === 0) {
              this.props.error("Something were wrong!");
            } else if (countDelete === selectedHome.length) {
              this.props.success("Delete success " + countDelete + " homes");
              this.getListHome();
            }
          })
        }
      })
    }
  }
  handleUpdateHome = () => {
    let state = this.state;
    if (this.formValidate()) {
      let location = state.location;
      location.address_text = location.address_text.replace(",", " - ") + ", "
        + state.selectedWardHome.title + ","
        + state.selectedDistrictHome.title + ", "
        + state.selectedProvinceHome.title + ", "
        + state.selectedCountryHome.title;
      const data = {
        homeName: this.state.homeName,
        homeDescription: this.state.homeDescription,
        location: location,
        media: this.state.media,
      }
      if (state.isUpdate) {
        HomeServices.updateHome(state.id, data, response => {
          if (response.data.isSucess) {
            $('#add-new-home').modal('hide');
            this.props.success("Update successfull");
            this.setState({
              isUpdate: false
            })
            this.getListHome();
          }
        }, error => {
          this.props.error(error);
        })
      } else {
        HomeServices.createHome(data, response => {
          $('#add-new-home').modal('hide');
          if (response.status === 200) {
            this.props.success("Add home successfully!")
            this.resetData();
            this.getListHome();
          } else {
            this.props.error("Something were wrong!");
          }
        }, error => {
          this.props.error(error);
        })
      }

    }
  }
  closeModalAddHome = () => {
    // $('#add-new-home').modal('hide');
    this.resetData();
  }

  formValidate = () => {
    const state = this.state;
    let check = state.homeName !== "" && state.homeDescription !== "" && state.selectedWardHome !== null
      && state.location.address_text !== "" && state.media.images.length > 0;
    this.setState({
      isValid: check
    });
    return check;
  };

  onChangeData = (key, value) => {
    this.setState({
      [key]: value
    })
  }

  onClickUploadImage = () => {
    if ($("#inputFile")) {
      $("#inputFile").click();
    }
  }

  onDeleteImage = (index) => {
    let state = this.state;
    state.media.images.splice(index, 1);
    this.setState(state);
  }

  uploadImage = (uploadedImages) => {
    let state = this.state;
    state.media.images.push(...uploadedImages);
    this.setState(state);
  };

  resetData = () => {
    this.setState({
      isUpdate: false,
      isValid: true,
      homeName: "",
      homeDescription: "",
      location: {
        country_code: "",
        province_code: "",
        district_code: "",
        ward_code: "",
        address_text: ""
      },
      media: {
        images: []
      },
      homeStatus: 1,
      selectedCountryHome: null,
      selectedProvinceHome: null,
      selectedDistrictHome: null,
      selectedWardHome: null,
    })
  }

  onSelectCountryHome = (item) => {
    let location = this.state.location;
    location.country_code = item.countryCode;
    this.setState({
      selectedCountryHome: item,
      listProvince: [],
      selectedProvinceHome: null,
      listDistrict: [],
      selectedDistrictHome: null,
      listWard: [],
      selectedWardHome: null,

      location: location
    })
    this.getListProvinces(item.countryCode);
  }
  onSelectProvinceHome = (item) => {
    let location = this.state.location;
    location.province_code = item.code;
    this.setState({
      selectedProvinceHome: item,
      listDistrict: [],
      selectedDistrictHome: null,
      listWard: [],
      selectedWardHome: null,

      location: location
    })
    this.getListDistricts(item.code);
  }
  onSelectDistrictHome = (item) => {
    let location = this.state.location;
    location.district_code = item.code;
    this.setState({
      selectedDistrictHome: item,
      listWard: [],
      selectedWardHome: null,

      location: location
    })
    this.getListWards(item.code);
  }
  onSelectWardHome = (item) => {
    let location = this.state.location;
    location.ward_code = item.code;
    this.setState({
      selectedWardHome: item,

      location: location
    })
  }
  onChangeStreetHome = (e) => {
    let location = this.state.location;
    location.address_text = e.target.value;
    this.setState({
      location: location
    })
  }

  render() {
    const {
      openAddModal,
      isValid,
      homeName,
      homeDescription,
      location,
      media,
      homeStatus,
      searchText,
      selectedHome,
      listHome,
      selectedCountry,
      listCountry,
      selectedProvince,
      listProvince,
      selectedDistrict,
      listDistrict,
      selectedWard,
      listWard,
      selectedCountryHome,
      selectedProvinceHome,
      selectedDistrictHome,
      selectedWardHome
    } = this.state;
    return (
      <div className="admin-container">
        <div className="title-row">
          <div className="title-admin-page">Home</div>
          <SearchBox placeholder="Search" value={searchText} onChangeSearch={this.onChangeSearch} onSearch={this.handleSearch} />
        </div>

        <div className="actions-row">
          <Dropdown title="Select country" listDropdown={listCountry} selected={selectedCountry} onSelect={this.onSelectCountry} />
          <Dropdown title="Select province" listDropdown={listProvince} selected={selectedProvince} onSelect={this.onSelectProvince} />
          <Dropdown title="Select district" listDropdown={listDistrict} selected={selectedDistrict} onSelect={this.onSelectDistrict} />
          <Dropdown title="Select ward" listDropdown={listWard} selected={selectedWard} onSelect={this.onSelectWard} />
          <button type="button" className="btn btn-add-new" data-toggle="modal" data-target="#add-new-home" onClick={this.resetData}>Add new</button>
        </div>



        <DataTable id="home-data-table" selected={selectedHome} data={listHome} onSelect={this.onSelectItem}
          action={true} onHandleView={this.onHandleView} onHandleAcive={this.onHandleAcive}
                   onHandleEdit={this.onHandleEdit} onHandleDelete={this.onHandleDelete} />

        <div className="modal fade" id="add-new-home" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog add-home-modal" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Create New Home</h5>
              </div>
              <div className="modal-body">
                <div className="modal-row">
                  <div className="add-modal-title">Title</div>
                  <input className="form-control" name="homeName" value={homeName} type="text"
                    onChange={(e) => this.onChangeData(e.target.name, e.target.value)} />
                  {!isValid && homeName === '' && <span className="help-block">Field is required</span>}
                </div>
                <div className="modal-row">
                  <div className="add-modal-title">Description</div>
                  <input className="form-control" type="text" name="homeDescription"
                    value={homeDescription} type="text" onChange={(e) => this.onChangeData(e.target.name, e.target.value)} />
                  {!isValid && homeDescription === '' && <span className="help-block">Field is required</span>}
                </div>
                <div className="modal-row-double">
                  <div className="modal-row">
                    <div className="add-modal-title">Country</div>
                    <Dropdown title="Select country" listDropdown={listCountry} selected={selectedCountryHome} onSelect={this.onSelectCountryHome} />
                  </div>
                  <div className="modal-row">
                    <div className="add-modal-title">Province</div>
                    <Dropdown title="Select province" listDropdown={listProvince} selected={selectedProvinceHome} onSelect={this.onSelectProvinceHome} />
                  </div>
                </div>
                <div className="modal-row-double">
                  <div className="modal-row">
                    <div className="add-modal-title">District</div>
                    <Dropdown title="Select district" listDropdown={listDistrict} selected={selectedDistrictHome} onSelect={this.onSelectDistrictHome} />
                  </div>
                  <div className="modal-row">
                    <div className="add-modal-title">Ward</div>
                    <Dropdown title="Select ward" listDropdown={listWard} selected={selectedWardHome} onSelect={this.onSelectWardHome} />
                    {!isValid && selectedWardHome === null && <span className="help-block">Field is required</span>}
                  </div>
                </div>
                <div className="modal-row">
                  <div className="add-modal-title">Street</div>
                  <input className="form-control" value={location.address_text} type="text" onChange={this.onChangeStreetHome} />
                  {!isValid && location.address_text === '' && <span className="help-block">Field is required</span>}
                </div>
                <div className="modal-row">
                  <div className="add-modal-title">Images</div>
                  <div className="box-add-images">
                    {
                      media.images && <div className="image-box">
                        {
                          media.images.map((image, index) => {
                            return <div className="image-item" key={index}>
                              <i className="far fa-times-circle" onClick={(e) => this.onDeleteImage(index)}></i>
                              <img className="img_item" src={image} />
                            </div>
                          })
                        }
                        {
                          media.images.length > 0 ? <div className="add-image" onClick={this.onClickUploadImage}>
                            <i className="fas fa-plus"></i>
                          </div> : <img className="add-images-btn" onClick={this.onClickUploadImage} src={ic_add_images} />
                        }

                      </div>
                    }
                    <UploadImage onUpload={this.uploadImage} />
                    {!isValid && media.images.length === 0 && <span className="help-block">Field is required</span>}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-close" data-dismiss="modal" onClick={this.closeModalAddHome}>Close</button>
                <button type="button" className="btn btn-finish" onClick={this.handleUpdateHome}>Save</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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
    showModal: (message, confirm) => {
      dispatch(showModal(message, confirm))
    }
  }
};
export default connect(null, mapDispatchToProps)(Home);