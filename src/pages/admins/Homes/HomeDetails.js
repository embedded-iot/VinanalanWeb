import PropTypes from "prop-types";
import React, {Component} from "react";
import {Col, notification, Row} from "antd";
import * as Services from "./HomesServices";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {FormattedMessage, injectIntl} from "react-intl";
import {spinActions} from "../../../actions";
import * as CONSTANTS from "../../Constants";
import OutputText from "../../../components/commons/OutputText/OutputText";
import ViewUtilities from "./HomeComponents/ViewUtilities";
import ButtonList from "../../../components/commons/ButtonList/ButtonList";
import './HomeDetails.scss'
import {getHomeDetails} from "./HomesServices";
import ReactSlick from "../../../components/commons/ReactSlick/ReactSlick";
import {GoogleMapSearchBox} from "../../../components/GoogleMaps/GoogleMapSearchBox";
import no_image from "../../../public/images/icons/no-image.png";
import no_video from "../../../public/images/icons/no-video.png";
import {getHomeCatalogDetails} from "../../config/HomeCatalog/HomeCatalogServices";
import {getUserDetails} from "../../config/Users/UsersServices";
import {convertDatetimeToString} from "../../../utils/utils";


const STRINGS = {
  ADD_HOME_SUCCESS: <FormattedMessage id="ADD_HOME_SUCCESS"/>,
  ADD_HOME_FAIL: <FormattedMessage id="ADD_HOME_FAIL"/>,
  EDIT_HOME_SUCCESS: <FormattedMessage id="EDIT_HOME_SUCCESS"/>,
  HOME_CATALOG_NAME: <FormattedMessage id="HOME_CATALOG_NAME"/>,
  DESCRIPTION: <FormattedMessage id="DESCRIPTION"/>,
  STATUS: <FormattedMessage id="STATUS"/>,
  ACTION_ACTIVE: <FormattedMessage id="ACTION_ACTIVE"/>,
  ACTION_DEACTIVE: <FormattedMessage id="ACTION_DEACTIVE"/>,
  REQUIRED_ALERT: <FormattedMessage id="REQUIRED_ALERT"/>,
  CREATE: <FormattedMessage id="CREATE"/>,
  SAVE: <FormattedMessage id="SAVE"/>,
  CLOSE: <FormattedMessage id="CLOSE"/>
};

const status = [
  {title: STRINGS.ACTION_ACTIVE, value: 1},
  {title: STRINGS.ACTION_DEACTIVE, value: 0}
];

class HomeDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: {
        homeName: '',
        homeDescription: '',
        homeTypeId: '',
        address: {},
        location: {
          lat: 0,
          lng: 0
        },
        media: {
          images: [],
          videos: []
        },
        numFloor: 0,
        numRoom: 0,
        hotline: '',
        managerId: '',
        startDate: '',
        orientation: '',
        isActive: true,
        outcomeUtilities: [],
        incomeUtilities: [],
        extraFees: [],
        outFurniture: []
      },
      homeCatalogs: {},
      homeManager: {},
      loading: false
    };
  }

  componentWillMount() {
    const { homeId} = this.props.match.params;
    this.getHomeDetails(homeId, this.getInnitData);
  }

  getHomeDetails = (id, callback)  => {
    if (!id) {
      return;
    }
    const { dispatch } = this.props;
    dispatch(spinActions.showSpin());
    this.setState({loading: true});
    getHomeDetails(id, response => {
      dispatch(spinActions.hideSpin());
      if (response.data) {
        let selected = { ...this.state.selected, ...response.data};
        this.setState({selected: selected}, () => {
          this.setState({loading: false});
        });
        callback();
      }
    }, error => {
      dispatch(spinActions.hideSpin());
    })
  };

  getInnitData = () => {
    const { homeTypeId, managerId } = this.state.selected;
    getHomeCatalogDetails(homeTypeId, response => {
      this.setState({homeCatalogs: response.data});
    });
    getUserDetails(managerId, response => {
      this.setState({homeManager: response.data});
    });
  };

  goBackPage = () => {
    const { history } = this.props;
    history.goBack();
  };

  editHome = (id) => {
    const { history } = this.props;
    if (!id) {
      return;
    }
    history.push('/Home/' + id + '/Edit');
  };

  getMediaList = () => {
    const { images, videos} = this.state.selected.media;
    let img = [...images];
    if (img.length < 3) {
      const countPush = 3 - img.length;
      for (let i = 0; i < countPush; i++) {
        img.push(no_image);
      }
    }
    const vd = videos && videos.length > 0 ? [videos] : [no_video];
    return [...img, ...vd]
  };

  render() {
    const {selected, homeCatalogs, homeManager, loading} = this.state;
    const {id, homeName, homeDescription, homeTypeId, address, location, media, numFloor, numRoom, hotline, managerId, isActive, startDate, orientation,
      outcomeUtilities, incomeUtilities, extraFees, outFurniture, create_at, create_by, update_at, update_by} = selected;
    const { images, videos} = media;
    const { address_text } = address;
    const [...status] = CONSTANTS.STATUS.map(item => ({ ...item, value: Number(item.value)}));
    const ORIENTATIONS = CONSTANTS.ORIENTATIONS;
    const homeOrientation = ORIENTATIONS.find(item => item.value === orientation);
    const slickSettings = {
      slidesToShow: 4,
      slidesToScroll: 4,
      initialSlide: 0,
      responsive: [
        {
          breakpoint: 1366,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3
          }
        }]
    };

    const buttonList = [
      { title: "Quay lại", onClick: this.goBackPage},
      { title: "Chỉnh sửa", type: "primary",  icon: "edit", onClick: () => this.editHome(id)}
    ];
    return (
      <div className="page-wrapper add-home-page-wrapper">
        <div className="page-headding">
          {homeName}
        </div>
        <div className="steps-wrapper">
          <div className='images-wrapper'>
            <div className='home-image'>
              <img src={ images && images.length > 0 ? images[0] : no_image} alt="Ảnh tòa nhà"/>
            </div>
            <div className='home-details'>
              <div className='home-description'>{address_text}</div>
              { !loading && <GoogleMapSearchBox onChangeLocation={this.onChangeLocation} location={location} disabled={true}/>}
            </div>
          </div>
          <div className='image-slick-wrapper'>
            <ReactSlick list={this.getMediaList()} settings={slickSettings}/>
          </div>
          <div style={{margin: "30px 0 50px"}}>
            <Row>
              <Col span={8}>
                <OutputText title="Loại hình" value={homeCatalogs.catalogName} horizontal={true} />
                <OutputText title="Hướng" value={homeOrientation ? homeOrientation.name : ''} horizontal={true} />
                <OutputText title="Ngày bắt đầu hoạt động" value={startDate} horizontal={true} />
                <OutputText title="Số tầng" value={numFloor.toString()} horizontal={true} />
                <OutputText title="Hotline" value={hotline} horizontal={true} />
              </Col>
              <Col span={8}>
                <OutputText title="Người quản lý" value={homeManager.userName} horizontal={true} />
                <OutputText title="Điện thoại" value={homeManager.phoneNumber} horizontal={true} />
                <OutputText title="Email" value={homeManager.email} horizontal={true} />
                <OutputText title="Ngày tạo" value={convertDatetimeToString(create_at, 'DD/MM/YYYY HH:mm')} horizontal={true} />
                <OutputText title="Người tạo" value={create_by} horizontal={true} />
              </Col>
              <Col span={8}>
                <OutputText title="Ngày chỉnh sửa" value={convertDatetimeToString(update_at, 'DD/MM/YYYY HH:mm')} horizontal={true} />
                <OutputText title="Người chỉnh sửa" value={update_by} horizontal={true} />
              </Col>
            </Row>
          </div>
          <div className="group-box">
            <div className="group-header">
              <div className="group-title">Giới thiệu</div>
            </div>
            <div className="group-content">
              {homeDescription || '-'}
            </div>
          </div>
          <div className="group-box">
            <div className="group-header">
              <div className="group-title">Tiện ích xung quanh</div>
            </div>
            <div className="group-content">
              <ViewUtilities list={outcomeUtilities} />
            </div>
          </div>
          <div className="group-box">
            <div className="group-header">
              <div className="group-title">Dịch vụ tiện ích trong tòa nhà</div>
            </div>
            <div className="group-content">
              <ViewUtilities list={incomeUtilities} />
            </div>
          </div>
          <div className="group-box">
            <div className="group-header">
              <div className="group-title">Trang thiết bị trong tòa nhà</div>
            </div>
            <div className="group-content">
              <ViewUtilities list={outFurniture} />
            </div>
          </div>
          <div className="group-box">
            <div className="group-header">
              <div className="group-title">Loại phí và giá (vnđ)</div>
            </div>
            <div className="group-content">
              <ViewUtilities list={extraFees} />
            </div>
          </div>
          <div className="group-box">
            <div className="group-header">
              <div className="group-title">Quy định đặt phòng và nội quy</div>
            </div>
            <div className="group-content">
              {homeDescription || '-'}
            </div>
          </div>
          <div className='button-list-wrapper'>
            <ButtonList list={buttonList}/>
          </div>
        </div>
      </div>
    );
  }
}

HomeDetails.propTypes = {
  onOk: PropTypes.func,
  onCancel: PropTypes.func
};

const mapStateToProps = function (state) {
  return {
    user: state.authentication.user
  };
};

export default injectIntl(withRouter(connect(mapStateToProps)(HomeDetails)));
