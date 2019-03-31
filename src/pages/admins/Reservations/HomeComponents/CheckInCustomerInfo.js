import React, {Component} from "react";
import InputText from "../../../../components/commons/InputText/InputText";
import {getUsers} from "../../../config/Users/UsersServices";
import {injectIntl} from "react-intl";
import InputEmail from "../../../../components/commons/InputEmail/InputEmail";
import InputNumber from "../../../../components/commons/InputNumber/InputNumber";
import DropdownInputSearch from "../../../../components/commons/DropdownInputSearch/DropdownInputSearch";

class CheckInCustomerInfo extends Component{

  constructor(props) {
    super(props);
    this.state = {
      customer: {
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        sellerId: '',
        bookerId: '',
        bookingSource: '',
        payMethod: ''
      },
      users: []
    }
  }

  componentWillMount() {
    this.getInitData();
  }

  getInitData = () => {
    let param = {skip: 0, limit: 100};
    getUsers(param, response => {
      if (response.data && response.data.length) {
        const users = response.data.map(item => ({
          email: item.email,
          phoneNumber: item.phoneNumber,
          text: item.userName,
          value: item.id
        }));
        this.setState({users: users});
      }
    });
  };

  onChange = (name, value) => {
    const { onChange } = this.props;
    const { customer } = this.state;
    customer[name] = value;
    this.setState({customer}, () => {
      const { customer } = this.state;
      onChange(customer);
    })
  };


  render() {
    const { intl } = this.props;
    const { customer, users } = this.state;
    const { customerName, customerPhone, customerEmail, sellerId, bookerId, bookingSource, payMethod } = customer;
    return (
      <div className="group-box">
        <div className="group-sub-heading">{ intl.formatMessage({id: "ENTER_CHECKIN_CUSTOMER_INFORMATION"})}</div>
        <div className="group-content">
          <InputText name="customerName"
                     title={intl.formatMessage({id: "USER_FULL_NAME"})}
                     value={customerName}
                     isRequired="true"
                     onChange={this.onChange}
          />
          <InputEmail name="customerEmail"
                      title={intl.formatMessage({id: "EMAIL"})}
                      titleInfo={intl.formatMessage({id: "NOTICE_AUTO_SEND_TO_THIS_EMAIL"})}
                      value={customerEmail}
                      isRequired="true"
                      onChange={this.onChange}
          />
          <InputNumber type="phone"
                       name="customerPhone"
                       title={intl.formatMessage({id: "PHONE"})}
                       value={customerPhone}
                       isRequired="true"
                       onChange={this.onChange}
          />
          <InputText name="bookingSource"
                     title={intl.formatMessage({id: "BOOKING_SOURCE"})}
                     value={bookingSource}
                     onChange={this.onChange}
          />
          <InputText name="payMethod"
                     title={intl.formatMessage({id: "PAY_METHOD"})}
                     value={payMethod}
                     onChange={this.onChange}
          />
          <DropdownInputSearch name="sellerId"
                               title={intl.formatMessage({id: "SELLER_NAME"})}
                               isRequired="true"
                               list={users}
                               value={sellerId}
                               onChange={this.onChange}
          />
          <DropdownInputSearch name="bookerId"
                               title={intl.formatMessage({id: "BOOKER_NAME"})}
                               isRequired="true"
                               list={users}
                               value={bookerId}
                               onChange={this.onChange}
          />
        </div>
      </div>
    )
  }
}

CheckInCustomerInfo.defaultProps = {
  onChange: f => f
};

export default injectIntl(CheckInCustomerInfo);