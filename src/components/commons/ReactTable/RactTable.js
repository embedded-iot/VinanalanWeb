import ReactTable from "react-table";
import './ReactTable.scss';
import React from "react";
import { FormattedMessage } from 'react-intl';

const STRINGS = {
    PAGE: <FormattedMessage id="PAGE" />,
    PREVIOUS: <FormattedMessage id="PREVIOUS" />,
    NEXT: <FormattedMessage id="NEXT" />,
}

const Table = (props) => {
    const defaultProps = {
        className: '-striped -highlight',
        nextText: STRINGS.NEXT,
        previousText: STRINGS.PREVIOUS,
        minRows: 10,
        manual: true,
        ofText: '/',
        rowsText: 'Rows',
        pageText: STRINGS.PAGE,
        showPageSizeOptions: false,
        defaultPageSize: 10
    }
    return (
        <ReactTable

            {...props}
            {...defaultProps}
        />
    )
}

export default Table;