import { Modal, Button } from 'react-bootstrap';
import React from "react";
import { connect } from 'react-redux';
import { clear } from "../../actions/index";
import { FormattedMessage } from 'react-intl';

const STRINGS = {
    NOTIFICATION: <FormattedMessage id="NOTIFICATION" />,
    CLOSE: <FormattedMessage id="CLOSE" />,
}
export class AlertModal extends React.Component {
    constructor(props) {
        super(props);
    }

    close = () => {
        this.props.clear();
    };

    render() {
        const { alert } = this.props;
        return (
            <Modal show={alert.message ? true : false} style={{ zIndex: 1051 }} onHide={this.close}>
                <Modal.Header>
                    <div>{STRINGS.NOTIFICATION}</div>
                </Modal.Header>
                <Modal.Body>
                    <div> {alert.message}</div>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="btn btn-primary" onClick={this.close}>{STRINGS.CLOSE}</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

function mapStateToProps(state) {
    const { alert } = state;
    return { alert };
}

const mapDispatchToProps = dispatch => {
    return {
        clear: () => {
            dispatch(clear());
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(AlertModal);