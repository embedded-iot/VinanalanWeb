import ReactTable from "react-table";
import './ReactTable.scss';
import React from "react";

const Table = (props) =>{
    const defaultProps = {
        className: '-striped -highlight',
        defaultPageSize: 10,
        nextText: 'Next',
        previoustext: 'Previous',
        // minRows: 5,
        // manual: true,
        ofText: '/',
        rowsText: 'Rows',
        // showPageSizeOptions: true,
    }
    return (
        <ReactTable
            {...props}
            {...defaultProps}
        />
    )
}

export default Table;