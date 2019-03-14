import React, { Component } from 'react'
import * as Services from './OutFurnituresServices';
import { injectIntl, FormattedMessage } from 'react-intl';
import TableCustom from "../../../components/commons/TableCustom/TableCustom";
import {Modal, notification, Tooltip} from 'antd';
import {spinActions} from "../../../actions/spinAction";
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import AddIncomeUtility from "./AddOutFurniture";
import ButtonList from "../../../components/commons/ButtonList/ButtonList";
import ViewOutFurniture from "./ViewOutFurniture";
import * as CONSTANTS from '../../Constants';


const confirmModal = Modal.confirm;

const STRINGS = {
  OUT_FURNITURES: <FormattedMessage id="OUT_FURNITURES" />,
  ACTION_ACTIVE: <FormattedMessage id="ACTION_ACTIVE" />,
  ACTION_DEACTIVE: <FormattedMessage id="ACTION_DEACTIVE" />,
  TYPES_OFF_FURNITURE: <FormattedMessage id="TYPES_OFF_FURNITURE" />,
  ACTION: <FormattedMessage id="ACTION" />,
  STATUS: <FormattedMessage id="STATUS" />,
  YES: <FormattedMessage id="YES" />,
  NO: <FormattedMessage id="NO" />,
  VIEW: <FormattedMessage id="VIEW" />,
  EDIT: <FormattedMessage id="EDIT" />,
  ACTION_DELETE: <FormattedMessage id="ACTION_DELETE" />,
  DELETE_FURNITURE_QUESTION: <FormattedMessage id="DELETE_FURNITURE_QUESTION" />,
}

class OutFurnitures extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      tableSettings: {
        pagination: {},
        filters: {},
        sorter: {},
        searchText: ""
      },
      isShowAddOrEdit: false,
      isShowViewDetails: false,
      selected: {}
    }
  }

  componentWillMount() {
    this.onChange();
  }

  columns = [
    {
      title: STRINGS.TYPES_OFF_FURNITURE,
      dataIndex: 'name'
    }, {
      title: 'Icon',
      dataIndex: 'icon_link',
      render: icon_link => icon_link && <img src={icon_link} style={{width: '32px', height: '32px'}}></img>,
      width: '10%',
      align: 'center'
    }, {
      title: STRINGS.STATUS,
      dataIndex: 'isActive',
      render: isActive => isActive ? STRINGS.ACTION_ACTIVE : STRINGS.ACTION_DEACTIVE,
      filters: CONSTANTS.STATUS,
      width: '10%',
    }, {
      title: STRINGS.ACTION,
      dataIndex: 'id',
      render: id => {
        return (
          <div className="actions-column">
            <Tooltip title={STRINGS.VIEW}>
              <span className="icon icon-view" onClick={() =>this.viewIncomeUtility(id)}></span>
            </Tooltip>
            <Tooltip title={STRINGS.EDIT}>
              <span className="icon icon-edit" onClick={() =>this.editOutFurniture(id)}></span>
            </Tooltip>
            <Tooltip title={STRINGS.ACTION_DELETE}>
              <span className="icon icon-delete" onClick={() =>this.deleteOutFurniture(id)}></span>
            </Tooltip>
          </div>
        )
      },
      width: '20%',
      align: 'center'
    }
  ];

  openNotification = (type, message, description) => {
    notification[type]({
      message: message,
      description: description,
    });
  };

  editOutFurniture = (id) => {
    const selectedUtility = this.state.dataSource.find(utility => utility.id === id);
    if (!selectedUtility) {
      return;
    }
    this.setState({ selected: selectedUtility, isShowAddOrEdit: !this.state.isShowAddOrEdit})
  }

  viewIncomeUtility = (id) => {
    const selectedUtility = this.state.dataSource.find(utility => utility.id === id);
    if (!selectedUtility) {
      return;
    }
    this.setState({ selected: selectedUtility, isShowViewDetails: !this.state.isShowViewDetails})
  }

  deleteOutFurniture = (id) => {
    const { intl, dispatch } = this.props;

    const selectedUtility = this.state.dataSource.find(utility => utility.id === id);
    if (!selectedUtility) {
      return;
    }
    confirmModal({
      title: intl.formatMessage({ id: 'DELETE_FURNITURE_QUESTION' }),
      content: <b>{selectedUtility.name}</b>,
      okText: intl.formatMessage({ id: 'YES' }),
      centered: true,
      cancelText: intl.formatMessage({ id: 'NO' }),
      okType: 'danger',
      onOk: () => {
        dispatch(spinActions.showSpin());
        Services.deleteOutFurniture(id, response => {
          dispatch(spinActions.hideSpin());
          this.openNotification('success', intl.formatMessage({ id: 'DELETE_FURNITURE_SUCCESS' }));
          this.onReload()
        }, error => {
          dispatch(spinActions.hideSpin());
          this.openNotification('error', intl.formatMessage({ id: 'DELETE_FURNITURE_FAIL' }))
        })
      },
      onCancel() {

      },
    });
  };

  onChange = (pagination = {}, filters = {}, sorter  = {}, extra, searchText) => {
    const tableSettings = {
      ...this.state.tableSettings,
      pagination,
      filters,
      searchText,
      sorter
    };
    const { dispatch } = this.props;

    let isActive =  filters.isActive;
    let params = {
      limit: pagination.pageSize || 10,
      skip: (pagination.current - 1) * pagination.pageSize || 0,
      sortField: sorter.field,
      sortOrder: sorter.order,
      searchText,
      isActive
    };


    this.setState({
      tableSettings: tableSettings,
      loading: true });
    dispatch(spinActions.showSpin());
    Services.getOutFurnitures({...params,}, (response) => {
      dispatch(spinActions.hideSpin());
      const tableSettings = {
        ...this.state.tableSettings,
        pagination: { ...this.state.tableSettings.pagination, total: response.count }
      };

      this.setState({
        loading: false,
        dataSource: response.data,
        tableSettings,
      });
    }, (error) => {
      dispatch(spinActions.hideSpin());
      console.log("error:", error)
    })
  }

  onReload = () => {
    let { pagination, filters, sorter, searchText } = {...this.state.tableSettings};
    this.onChange(pagination, filters, sorter, {}, searchText);
  }

  onChangeVisible = (success) => {
    this.setState({ selected: {}, isShowAddOrEdit: !this.state.isShowAddOrEdit})
    if (success) {
      this.onReload()
    }
  }

  onChangeVisibleViewDetails = () => {
    this.setState({ selected: {}, isShowViewDetails: !this.state.isShowViewDetails})
  }

  render() {
    const { tableSettings, dataSource, isShowAddOrEdit, isShowViewDetails, selected} = this.state;
    const TableConfig = {
      columns: this.columns,
      dataSource: dataSource,
      pagination: tableSettings.pagination,
      onChange: this.onChange,
      tableSettings: tableSettings
    };
    const buttonList = [
      { title: "Thêm", type: "primary",  icon: "plus", onClick: () => this.onChangeVisible()}
    ];
    return (
      <div className="page-wrapper">
        <div className="page-headding">
          {STRINGS.OUT_FURNITURES}
          <ButtonList list={buttonList}/>
        </div>
        <TableCustom {...TableConfig} />
        {
          isShowAddOrEdit && <AddIncomeUtility selected={selected} onChangeVisible={this.onChangeVisible}/>
        }
        {
          isShowViewDetails && <ViewOutFurniture selected={selected} onChangeVisible={this.onChangeVisibleViewDetails}/>
        }
      </div>
    );
  }
}

export default injectIntl(withRouter(connect()(OutFurnitures)));