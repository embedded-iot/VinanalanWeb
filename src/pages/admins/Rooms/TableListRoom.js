import React, {Component} from "react";
import user_ic from "../../../public/images/icons/user_ic.png";
import iconLookUp from '../../../public/images/icons/group-5@2x.png';
import iconLook from '../../../public/images/icons/group-6@2x.png';
import iconSetup from '../../../public/images/icons/group-5-copy@2x.png';
import iconMouse from '../../../public/images/icons/16-px-shape-arrow@2x.png';


const RoomItem = props => {
    return (
        <div data-toggle="dropdown" className='room-item'>
            <img src={user_ic}/>
            <div><span>{props.roomName}</span></div>
        </div>
    );
}

const Row = props => {
    return (
        props.list.length.map(item => {
            return (
                <span>{props.list.roomName}</span>
            );
        })
    )
}
const Tooltip = () => {
        return (
            <div className="my-tooltip">
                <img className='lookup' src={iconLookUp}/>
                <img className='mouse' src={iconMouse}/>
                <img className='setup' src={iconSetup}/>
            </div>
        )
    }
;

class TableListRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listRoom: []
        }
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.listRooms) {
            let listRooms = [];
            let listData = [];
            nextProps.listRooms.map((item, index) => {
                listData.push(item);
                if (((index + 1) % nextProps.row === 0 && index > 1) || index === nextProps.listRooms.length - 1) {
                    listRooms.push(listData)
                    listData = [];
                }
            })

            const number = listRooms[listRooms.length - 1].length % nextProps.row;
            if(number>0 && nextProps.listRooms.length > nextProps.row)
            for (let i = 0; i < nextProps.row - number; i++) {
                listRooms[listRooms.length - 1].push({roomName: 'Null'});
            }
            this.setState({listRoom: listRooms});
        }
    }

    render() {
        const {listRoom} = this.state;
        return (
            <div>
                {listRoom.length ? <table className='table-room-list'>
                    <tbody>
                    {listRoom.map((item, key) => {
                        return (
                            <tr key={key}>
                                {item.map((ColumnsItem, index) => {
                                    return (
                                        <td key={index}
                                            className={index === 0 ? 'no_padding-left' : index === item.length - 1 ? 'no_padding-right' : ''}>
                                            <div className="dropdown">
                                                <RoomItem roomName={ColumnsItem.roomName}/>
                                                <div className="hover-setting"
                                                     aria-labelledby="dropdownMenuButton">
                                                    <Tooltip/>
                                                </div>
                                            </div>

                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                    </tbody>
                </table> : 'is Load Data !'}
            </div>
        );
    }
}

export default TableListRoom;
