import React, { Component } from 'react';
import PropTypes from 'prop-types';
import "./SearchBox.scss";
import go_btn from "../../../public/images/icons/go-btn.png";
import { connect } from 'react-redux';


class SearchBox extends Component {
	constructor(props) {
		super(props);

	}

	_handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			this.props.onSearch();
		}
	}

	render() {
		const search_box = this.props.locale === "en" ? "Seacrch" : "Tìm kiếm";
		return (
			<div className="search-box">
				<input placeholder={search_box} type="text" className="form-control" value={this.props.value}
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

const mapStateToProps = (state) => ({
	locale: state.translation.locale
});

export default connect(mapStateToProps, null)(SearchBox);