import React, { Component } from 'react';
import PropTypes from 'prop-types';
import "./SearchBox.scss";
import go_btn from "../../../public/images/icons/go-btn.png";

export default class SearchBox extends Component {
	constructor(props) {
		super(props);

	}

	_handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			this.props.onSearch();
		}
	}

	render() {
		return (
			<div className="search-box">
				<input placeholder={this.props.placeholder} type="text" className="form-control" value={this.props.value}
					onChange={(e) => this.props.onChangeSearch(e.target.value)} onKeyPress={this._handleKeyPress} />
				<img src={go_btn} onClick={this.props.onSearch} />
			</div>
		);
	}
}
SearchBox.propTypes = {
	placeholder: PropTypes.string,
	value: PropTypes.string,
	onChangeSearch: PropTypes.func,
	onSearch: PropTypes.func
}