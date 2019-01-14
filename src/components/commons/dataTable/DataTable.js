import React, { Component } from "react";
import PropTypes from 'prop-types';
import "./DataTable.scss";
import Checkbox from "../checkbox/Checkbox";
import ic_checkin from "../../../public/images/icons/ic_checkin.png";
import ic_checkout from "../../../public/images/icons/ic_checkin.png";
import ic_delete from "../../../public/images/icons/ic_delete.png";
import ic_edit from "../../../public/images/icons/ic_edit.png";
import ic_view from "../../../public/images/icons/ic_view.png";

export default class DataTable extends Component {

  handleCheckbox = (value, checked) => {
    this.props.onSelect(value, checked);
  }

  handleDeleteOne = (value, item) => {
    this.props.onSelect(value, true);
    this.props.onDelete(item);
  }

  onClickCheckbox = (id) => {
    if ($(id)) {
      $(id).click();
    }
  }

  render() {
    const data = this.props.data;
    let columns = [];
    if (data.length > 0) {
      for (var i in data[0]) {
        columns.push(i);
      }
    }

    let countSelected = 0;
    for (let i = 0; i < this.props.selected.length; i++) {
      for (let j = 0; j < this.props.data.length; j++) {
        if (this.props.selected[i].Id == this.props.data[j].Id) {
          countSelected++;
        }
      }
    }

    return (
      <div className="data-table">
        {
          data.length > 0 && <table className="cus-table">
            <tbody>
              <tr>
                <th>
                  <Checkbox id={this.props.id} title="" value="ALL" checked={countSelected == data.length && data.length > 0} onChange={this.handleCheckbox} />
                </th>
                {
                  columns.length > 0 && columns.map((item, index) => {
                    if (item != "Id") {
                      return <th key={index}>{item.toUpperCase()}</th>
                    }
                  })
                }
                {this.props.action && <th>Action</th>}
              </tr>
              {
                data.length > 0 && data.map((item, index) => {
                  let checked = false;
                  for (let i = 0; i < this.props.selected.length; i++) {
                    if (this.props.selected[i].Id == item.Id) {
                      checked = true;
                    }
                  }
                  return <tr key={index}>
                    <td>
                      <Checkbox id={this.props.id} value={index} checked={checked} onChange={this.handleCheckbox} />
                    </td>
                    {
                      columns.length > 0 && columns.map((head, index) => {
                        if (head == "Id") {
                          return null;
                        }
                        if (head == "Image") {
                          return <td key={index}>
                            {
                              item.Image.map((img, index) => {
                                if (index < 3) {
                                  return <img key={index} src={img} />
                                }
                              })
                            }
                          </td>
                        } else {
                          return <td key={index}>
                            {item[head]}
                          </td>
                        }
                      })
                    }

                    {
                      this.props.action && <td>
                        <div className="action">
                          <div className="cus-tooltip">
                            <img src={ic_view} onClick={() => this.props.onHandleView(item)} />
                            <span className="tooltiptext">View rooms</span>
                          </div>
                          <div className="cus-tooltip">
                            {
                              item.status ? <img src={ic_checkin} onClick={() => this.props.onHandleCheckout(item)} /> : <img src={ic_checkout} onClick={() => this.props.onHandleCheckin(item)} />
                            }
                            <span className="tooltiptext">Active/Deactive</span>
                          </div>
                          <div className="cus-tooltip">
                            <img src={ic_edit} onClick={() => this.props.onHandleEdit(item)} />
                            <span className="tooltiptext">Update</span>
                          </div>

                          <div className="cus-tooltip">
                            <img src={ic_delete} onClick={() => this.props.onHandleDelete(item)} />
                            <span className="tooltiptext">Delete</span>
                          </div>

                        </div>
                      </td>
                    }
                  </tr>
                })
              }

            </tbody>
          </table>
        }
        {
          data.length == 0 && <div className="box-nocontent">
            Select <a>Add New</a> to add new
          </div>
        }
        {
          this.props.selected.length > 0 && this.props.onHandleDelete && <button type="button" className="btn btn-delete-all" onClick={() => this.props.onHandleDelete(null)}>Delete</button>
        }
      </div>
    );
  }
}
DataTable.propTypes = {
  id: PropTypes.string,
  data: PropTypes.array,
  selected: PropTypes.array,
  onSelect: PropTypes.func,
  onHandleCheckin: PropTypes.func,
  onHandleCheckout: PropTypes.func,
  onHandleDelete: PropTypes.func,
  onHandleEdit: PropTypes.func,
  onHandleView: PropTypes.func,
  action: PropTypes.bool
};